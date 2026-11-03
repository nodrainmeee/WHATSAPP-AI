import { GoogleGenAI } from '@google/genai';
import { getSecureApiKey } from './security';
import { getDb } from './db';

export async function getMemoryString(contactId: string) {
  try {
    const stmt = getDb().prepare('SELECT fact FROM contact_memories WHERE contact_id = ? ORDER BY id ASC');
    const memories = stmt.all(contactId);
    return memories.map((m: any) => m.fact).join('\n');
  } catch (e) {
    return '';
  }
}

const LEA_SYSTEM_PROMPT = `Tu es Léa, une assistante IA personnelle intégrée à WhatsApp. Tu n'es PAS un robot formel, ni un service client. Tu es naturelle, conversationnelle, et tu t'adaptes au ton (amical, taquin, sérieux). Règle absolue : Tu tutoies TOUJOURS les interlocuteurs de l'utilisateur. N'utilise JAMAIS le vouvoiement. Tu as accès à la mémoire du contact pour contextualiser tes réponses. Distingue les faits des hypothèses.`;

export async function generateLeaResponse(contactId: string, recentContext: string, newMessage: string) {
  const apiKey = await getSecureApiKey();
  if (!apiKey) throw new Error("Clé API Gemini manquante.");

  const ai = new GoogleGenAI({ apiKey });
  const contactMemory = await getMemoryString(contactId);

  const fullPrompt = `Contexte relationnel et mémoire : ${contactMemory}\nHistorique récent : ${recentContext}\nNouveau message à traiter : ${newMessage}\n\nRédige la réponse de l'utilisateur à ce contact, en adoptant ta personnalité (Léa).`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
      config: {
        systemInstruction: LEA_SYSTEM_PROMPT,
        temperature: 0.7,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Erreur Gemini:", error);
    throw new Error("Léa est temporairement indisponible.");
  }
}
