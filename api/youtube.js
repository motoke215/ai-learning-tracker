// YouTube API proxy - avoids CORS and hides API key
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const channelId = searchParams.get('channelId');
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!channelId || !apiKey) {
    return Response.json({ error: 'Missing channelId or API key' }, { status: 400 });
  }

  try {
    const url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=6&type=video`;
    const response = await fetch(url);
    const data = await response.json();

    const videos = (data.items || []).map(item => ({
      id: item.id.videoId || item.id,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url || '',
      publishedAt: new Date(item.snippet.publishedAt).toLocaleDateString('zh-CN'),
    }));

    return Response.json({ videos });
  } catch (error) {
    return Response.json({ error: 'Failed to fetch YouTube data' }, { status: 500 });
  }
}