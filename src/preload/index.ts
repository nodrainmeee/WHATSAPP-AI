import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  saveApiKey: (key: string) => ipcRenderer.invoke('save-api-key', key),
  getApiKeyStatus: () => ipcRenderer.invoke('get-api-key-status'),
  generateResponse: (contactId: string, context: string, message: string) => ipcRenderer.invoke('generate-response', { contactId, context, message }),
  getContactMemory: (contactId: string) => ipcRenderer.invoke('get-memory', contactId),
  updateContactMemory: (contactId: string, facts: string[]) => ipcRenderer.invoke('update-memory', contactId, facts),
  verifyGeminiConnection: () => ipcRenderer.invoke('verify-gemini-connection'),
  checkWhatsappStatus: () => ipcRenderer.invoke('check-whatsapp-status')
});
