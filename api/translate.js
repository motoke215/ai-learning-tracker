// Translation API proxy using MyMemory (free, no key required)
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const text = searchParams.get('text');
  const from = searchParams.get('from') || 'en';
  const to = searchParams.get('to') || 'zh';

  if (!text) {
    return Response.json({ error: 'Missing text' }, { status: 400 });
  }

  try {
    // MyMemory API - free, 1000 words/day without key
    const langpair = `${from}|${to}`;
    const encodedText = encodeURIComponent(text.substring(0, 500)); // limit to 500 chars
    const url = `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=${langpair}`;

    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });

    if (!response.ok) {
      throw new Error('Translation service error');
    }

    const data = await response.json();

    if (data.responseStatus === 200 && data.responseData) {
      return Response.json({
        translatedText: data.responseData.translatedText,
        match: data.responseData.match || 0,
      });
    }

    return Response.json({ translatedText: text, error: 'No translation available' }, { status: 200 });
  } catch (error) {
    return Response.json({ error: 'Translation failed' }, { status: 500 });
  }
}

// Support POST for longer texts
export async function POST(request) {
  try {
    const { text, from = 'en', to = 'zh' } = await request.json();

    if (!text) {
      return Response.json({ error: 'Missing text' }, { status: 400 });
    }

    const langpair = `${from}|${to}`;
    const encodedText = encodeURIComponent(text.substring(0, 2000));
    const url = `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=${langpair}`;

    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });

    if (!response.ok) {
      throw new Error('Translation service error');
    }

    const data = await response.json();

    if (data.responseStatus === 200 && data.responseData) {
      return Response.json({
        translatedText: data.responseData.translatedText,
        match: data.responseData.match || 0,
      });
    }

    return Response.json({ translatedText: text }, { status: 200 });
  } catch (error) {
    return Response.json({ error: 'Translation failed' }, { status: 500 });
  }
}