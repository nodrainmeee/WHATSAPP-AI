import { ipcMain } from 'electron';
import { generateLeaResponse } from './gemini';
import { saveSecureApiKey, getSecureApiKeyStatus, getSecureApiKey } from './security';
import { isWhatsAppRunning } from './whatsapp';
import { GoogleGenAI } from '@google/genai';
import { getDb } from './db';

export function setupIpcHandlers() {
  ipcMain.handle('save-api-key', async (_, apiKey: string) => {
    try {
      await saveSecureApiKey(apiKey);
      return { success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  });

  ipcMain.handle('get-api-key-status', async () => {
    return await getSecureApiKeyStatus();
  });

  ipcMain.handle('generate-response', async (_, { contactId, context, message }) => {
    try {
      const response = await generateLeaResponse(contactId, context, message);
      return { success: true, text: response };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  });

  ipcMain.handle('get-memory', (_, contactId: string) => {
    try {
      const stmt = getDb().prepare('SELECT fact FROM contact_memories WHERE contact_id = ? ORDER BY id ASC');
      const memories = stmt.all(contactId);
      return { success: true, data: memories.map((m: any) => m.fact) };
    } catch (error) {
      return { success: false, error: 'Erreur SQLite' };
    }
  });

  ipcMain.handle('update-memory', (_, contactId: string, facts: string[]) => {
    try {
      const deleteStmt = getDb().prepare('DELETE FROM contact_memories WHERE contact_id = ?');
      const insertStmt = getDb().prepare('INSERT INTO contact_memories (contact_id, fact) VALUES (?, ?)');
      
      const ensureContact = getDb().prepare('INSERT OR IGNORE INTO contacts (id, name) VALUES (?, ?)');

      const transaction = getDb().transaction(() => {
        ensureContact.run(contactId, contactId);
        deleteStmt.run(contactId);
        for (const fact of facts) {
          insertStmt.run(contactId, fact);
        }
      });
      
      transaction();
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Erreur écriture SQLite' };
    }
  });

  ipcMain.handle('verify-gemini-connection', async () => {
    try {
      const apiKey = await getSecureApiKey();
      if (!apiKey) return { success: false, error: 'Clé API non configurée.' };

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: 'Réponds uniquement par "OK".',
      });
      
      if (response.text && response.text.includes('OK')) {
        return { success: true };
      }
      return { success: false, error: 'Réponse inattendue de l\'API.' };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  });

  ipcMain.handle('check-whatsapp-status', async () => {
    return await isWhatsAppRunning();
  });
}
