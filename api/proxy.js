// Web proxy - fetches pages and rewrites links to go through proxy
export const runtime = 'edge';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return new Response('Missing url', { status: 400 });
  }

  // Only allow http/https
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return new Response('Invalid protocol', { status: 400 });
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      },
      redirect: 'follow',
    });

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/html')) {
      // For non-HTML, redirect directly
      return new Response(null, {
        status: 302,
        headers: { 'Location': url },
      });
    }

    const html = await response.text();

    // Rewrite links and resources to go through proxy
    const baseUrl = new URL(url);
    let proxied = html
      // Rewrite absolute links
      .replace(/href=["'](https?:\/\/[^"']+)["']/g, (match, href) => {
        try {
          const abs = new URL(href, url);
          return `href="/api/proxy?url=${encodeURIComponent(abs.href)}"`;
        } catch {
          return match;
        }
      })
      // Rewrite src and data-src for images/scripts
      .replace(/(src|data-src)=["'](https?:\/\/[^"']+)["']/g, (match, attr, src) => {
        try {
          const abs = new URL(src, url);
          return `${attr}="/api/proxy?url=${encodeURIComponent(abs.href)}"`;
        } catch {
          return match;
        }
      })
      // Add base tag for relative links
      .replace('<head>', `<head><base href="${url}">`);

    return new Response(proxied, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'X-Frame-Options': 'SAMEORIGIN',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    return new Response('Failed to fetch page', { status: 500 });
  }
}