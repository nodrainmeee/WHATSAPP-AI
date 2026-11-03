import { safeStorage } from 'electron';
import { getDb } from './db';

const API_KEY_ID = 'gemini_api_key';

export async function saveSecureApiKey(apiKey: string): Promise<void> {
  if (!safeStorage.isEncryptionAvailable()) {
    throw new Error("Le chiffrement natif n'est pas disponible sur ce système.");
  }

  const encryptedBuffer = safeStorage.encryptString(apiKey);
  const encryptedBase64 = encryptedBuffer.toString('base64');

  const stmt = getDb().prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
  stmt.run(API_KEY_ID, encryptedBase64);
}

export async function getSecureApiKeyStatus(): Promise<boolean> {
  const stmt = getDb().prepare('SELECT value FROM settings WHERE key = ?');
  const result = stmt.get(API_KEY_ID) as { value: string } | undefined;
  return !!result && !!result.value;
}

export async function getSecureApiKey(): Promise<string | null> {
  const stmt = getDb().prepare('SELECT value FROM settings WHERE key = ?');
  const result = stmt.get(API_KEY_ID) as { value: string } | undefined;

  if (!result || !result.value) return null;

  try {
    const encryptedBuffer = Buffer.from(result.value, 'base64');
    return safeStorage.decryptString(encryptedBuffer);
  } catch (error) {
    console.error("Erreur de déchiffrement de la clé API:", error);
    return null;
  }
}
