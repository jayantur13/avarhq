import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ locals }) => {
  // Cast to any to instantly bypass the TypeScript check
  const cloudflareEnv = (locals as any).runtime.env;
  const GITHUB_PAGES_FEED = `${cloudflareEnv.BASE_URL}/avardata`;

  try {
    const response = await fetch(GITHUB_PAGES_FEED, {
      headers: { 'User-Agent': 'AVARHQ-Feed-Proxy' }
    });

    if (!response.ok) {
      return new Response('Feed temporarily unavailable', { status: 502 });
    }

    const xmlData = await response.text();

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
