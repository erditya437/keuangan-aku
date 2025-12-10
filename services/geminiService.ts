import { GoogleGenAI } from "@google/genai";
import { Transaction } from "../types";

// In a real production app with Node.js, you would proxy this request 
// through your backend to keep the API key hidden from the client browser network tab.
// Since this is a client-side demo, we use the env variable directly.
const apiKey = process.env.API_KEY;

let aiClient: GoogleGenAI | null = null;

if (apiKey) {
  aiClient = new GoogleGenAI({ apiKey });
}

export const getFinancialAdvice = async (transactions: Transaction[]): Promise<string> => {
  if (!aiClient) {
    return "API Key belum dikonfigurasi. Harap setup API Key untuk menggunakan fitur AI.";
  }

  // Filter last 30 transactions to avoid token limits and keep relevant
  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 30);

  const dataSummary = JSON.stringify(recentTransactions.map(t => ({
    type: t.type,
    amount: t.amount,
    category: t.category,
    date: t.date.split('T')[0],
    desc: t.description
  })));

  const prompt = `
    Bertindaklah sebagai penasihat keuangan pribadi yang ceria, ramah, dan memotivasi untuk pengguna Indonesia.
    Analisis data transaksi berikut (JSON):
    ${dataSummary}

    Berikan 3 poin saran singkat, praktis, dan actionable.
    Gunakan bahasa Indonesia yang santai tapi sopan ("Kamu", "Kakak").
    Jika pengeluaran lebih besar dari pemasukan, berikan peringatan lembut tapi tetap menyemangati.
    Jika hemat, berikan pujian!
    Jangan gunakan format markdown yang rumit, cukup paragraf atau bullet point sederhana.
  `;

  try {
    const response = await aiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text || "Maaf, AI sedang istirahat sejenak. Coba lagi nanti ya!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Waduh, ada masalah saat menghubungi asisten AI. Pastikan koneksi internet lancar ya!";
  }
};

export const autoCategorize = async (description: string): Promise<string | null> => {
    if (!aiClient || !description.trim()) return null;

    const prompt = `
      Kategorikan pengeluaran/pemasukan ini ke dalam salah satu ID kategori berikut:
      [food, transport, shopping, housing, utilities, health, entertainment, other, salary, bonus, investment].
      
      Deskripsi: "${description}"
      
      Hanya kembalikan satu kata yaitu ID kategorinya. Jika tidak yakin, kembalikan "other".
    `;

    try {
        const response = await aiClient.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        const text = response.text?.trim().toLowerCase();
        return text || null;
    } catch (e) {
        return null;
    }
}
