import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request }) => {
  // Use standard env variables for Vercel, with your reliable fallback
  const GITHUB_PAGES_BASE = import.meta.env.BASE_URL_FILE;
  const GITHUB_PAGES_FEED = `${GITHUB_PAGES_BASE}/feed.xml`;

  try {
    const response = await fetch(GITHUB_PAGES_FEED, {
      headers: { 'User-Agent': 'AVARHQ-Feed-Proxy' }
    });

    if (!response.ok) {
      return new Response('Feed temporarily unavailable', { status: 502 });
    }

    let xmlData = await response.text();

    // Dynamically grab the current host origin (e.g., https://avarhq.vercel.app)
    const currentOrigin = new URL(request.url).origin;

    // Search and replace the hardcoded GitHub URLs with your Vercel URL
    // Adjust the exact string below if your Python script outputs something slightly different
    xmlData = xmlData.replaceAll('https://jayantur13.github.io/avardata', currentOrigin);
    
    return new Response(xmlData, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600'
      }
    });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
};