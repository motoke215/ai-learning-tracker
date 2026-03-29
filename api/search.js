// Tavily search API proxy
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');
  const apiKey = process.env.TAVILY_API_KEY;

  if (!q) {
    return Response.json({ error: 'Missing query' }, { status: 400 });
  }

  if (!apiKey) {
    return Response.json({ error: 'Missing Tavily API key' }, { status: 400 });
  }

  try {
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: apiKey,
        query: q,
        search_depth: 'advanced',
        include_answer: false,
        max_results: 10
      }),
    });

    if (!response.ok) {
      throw new Error(`Tavily error: ${response.status}`);
    }

    const data = await response.json();
    const results = data.results.map(r => ({
      title: r.title,
      url: r.url,
      platform: getPlatform(r.url)
    }));

    return Response.json(results);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

function getPlatform(url) {
  if (!url) return 'website';
  const lower = url.toLowerCase();
  if (lower.includes('bilibili')) return 'bilibili';
  if (lower.includes('youtube') || lower.includes('youtu.be')) return 'youtube';
  if (lower.includes('github')) return 'github';
  if (lower.includes('zhihu')) return 'zhihu';
  if (lower.includes('twitter') || lower.includes('x.com')) return 'twitter';
  if (lower.includes('bilibili')) return 'bilibili';
  return 'website';
}