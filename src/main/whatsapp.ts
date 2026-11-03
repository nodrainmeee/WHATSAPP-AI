import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function isWhatsAppRunning(): Promise<boolean> {
  try {
    if (process.platform !== 'win32') return false;
    const { stdout } = await execAsync('tasklist /FI "IMAGENAME eq WhatsApp.exe"');
    return stdout.toLowerCase().includes('whatsapp.exe');
  } catch (error) {
    console.error("Erreur lors de la détection de WhatsApp :", error);
    return false;
  }
}
