// Nitter RSS proxy for X/Twitter posts
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const handle = searchParams.get('handle');

  if (!handle) {
    return Response.json({ error: 'Missing handle' }, { status: 400 });
  }

  // Try multiple Nitter instances
  const nitterInstances = [
    'nitter.net',
    'nitter.privacydev.net',
    'nitter.poast.org',
    'xcancel.com'
  ];

  for (const instance of nitterInstances) {
    try {
      const response = await fetch(`https://${instance}/${handle}/rss`, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });

      if (!response.ok) continue;

      const text = await response.text();
      // Parse RSS XML
      const items = parseRSS(text, handle);
      if (items.length > 0) {
        return Response.json({ posts: items, source: instance });
      }
    } catch {
      continue;
    }
  }

  return Response.json({ posts: [], error: 'All Nitter instances failed' }, { status: 500 });
}

function parseRSS(xml, handle) {
  const posts = [];
  // Simple regex-based RSS parser
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;
  let count = 0;

  while ((match = itemRegex.exec(xml)) !== null && count < 5) {
    const item = match[1];
    const title = extractTag(item, 'title');
    const link = extractTag(item, 'link');
    const pubDate = extractTag(item, 'pubDate');

    if (title) {
      // Strip @handle prefix from title
      const content = title.replace(new RegExp(`^@${handle}\\s*[-:]?\\s*`, 'i'), '');
      posts.push({
        title: content,
        link: link || `https://twitter.com/${handle}`,
        pubDate: pubDate ? new Date(pubDate).toLocaleDateString('zh-CN') : '',
      });
      count++;
    }
  }

  return posts;
}

function extractTag(xml, tag) {
  const regex = new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, 'i');
  const match = xml.match(regex);
  return match ? match[1].trim() : '';
}