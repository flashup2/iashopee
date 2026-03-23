export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL obrigatoria' });

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1)',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'pt-BR,pt;q=0.9'
      },
      redirect: 'follow'
    });

    const html = await response.text();

    // Extrai Open Graph tags
    const get = (prop) => {
      const m = html.match(new RegExp('<meta[^>]+property=["\']og:' + prop + '["\'][^>]+content=["\']([^"\']+)["\']', 'i'))
               || html.match(new RegExp('<meta[^>]+content=["\']([^"\']+)["\'][^>]+property=["\']og:' + prop + '["\']', 'i'));
      return m ? m[1] : '';
    };

    const getMeta = (name) => {
      const m = html.match(new RegExp('<meta[^>]+name=["\']' + name + '["\'][^>]+content=["\']([^"\']+)["\']', 'i'));
      return m ? m[1] : '';
    };

    const title   = get('title')       || getMeta('title')       || '';
    const image   = get('image')       || getMeta('image')       || '';
    const desc    = get('description') || getMeta('description') || '';

    // Tenta extrair preço
    const precoMatch = html.match(/R\$\s*([\d.,]+)/) || html.match(/"price":"?([\d.]+)"?/);
    const preco = precoMatch ? 'R$ ' + precoMatch[1] : '';

    // Tenta extrair preço original (de)
    const precoDeMatch = html.match(/class="[^"]*line-through[^"]*"[^>]*>R\$\s*([\d.,]+)/) 
                      || html.match(/"originalPrice":"?([\d.]+)"?/);
    const precoDe = precoDeMatch ? 'R$ ' + precoDeMatch[1] : '';

    return res.status(200).json({ title, image, desc, preco, precoDe });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
