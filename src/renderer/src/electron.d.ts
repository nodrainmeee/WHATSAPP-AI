export {};

interface IpcResult<T = undefined> {
  success: boolean;
  error?: string;
  data?: T;
  text?: string;
}

interface ElectronAPI {
  saveApiKey: (key: string) => Promise<IpcResult>;
  getApiKeyStatus: () => Promise<boolean>;
  generateResponse: (contactId: string, context: string, message: string) => Promise<IpcResult>;
  getContactMemory: (contactId: string) => Promise<IpcResult<string[]>>;
  updateContactMemory: (contactId: string, facts: string[]) => Promise<IpcResult>;
  verifyGeminiConnection: () => Promise<IpcResult>;
  checkWhatsappStatus: () => Promise<boolean>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
