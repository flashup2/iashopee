export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, max } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Prompt obrigatorio' });

  const contents = [
    {
      role: 'user',
      parts: [{ text: 'Você é especialista em vendas na Shopee, afiliados e marketing digital. SEMPRE responda em português brasileiro. Seja direto e prático.' }]
    },
    {
      role: 'model',
      parts: [{ text: 'Entendido! Responderei sempre em português brasileiro 🇧🇷' }]
    },
    {
      role: 'user',
      parts: [{ text: prompt }]
    }
  ];

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          generationConfig: { maxOutputTokens: max || 1000 }
        })
      }
    );

    const data = await response.json();
    if (data.error) return res.status(400).json({ error: data.error.message });

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return res.status(200).json({ text });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
