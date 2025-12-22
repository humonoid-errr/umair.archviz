
/**
 * Resolves a raw asset URL, converting GitHub UI links to direct raw CDN links.
 * This ensures Pannellum/WebGL can access the raw image data with CORS headers.
 */
export const getRawAssetUrl = (url: string): string => {
  if (!url) return '';
  
  let targetUrl = url.trim();

  // Convert GitHub browser links to jsdelivr raw CDN links
  if (targetUrl.includes('github.com') && targetUrl.includes('/blob/')) {
    targetUrl = targetUrl
      .replace('github.com', 'cdn.jsdelivr.net/gh')
      .replace('/blob/', '@');
  }

  // Ensure raw.githubusercontent links are also handled if provided
  if (targetUrl.includes('raw.githubusercontent.com')) {
    // These are already raw, but we could normalize them to jsdelivr if needed for better caching/CORS
    targetUrl = targetUrl.replace('raw.githubusercontent.com', 'cdn.jsdelivr.net/gh').replace('/master/', '@master/').replace('/main/', '@main/');
  }

  return targetUrl;
};

/**
 * Provides an optimized, proxied image URL for thumbnails and standard views.
 * For 360 views, we should NOT use this as it might downscale high-res panoramas.
 */
export const getOptimizedImage = (url: string, width: number = 1200, quality: number = 80): string => {
  if (!url) return '';
  
  const rawUrl = getRawAssetUrl(url);

  // If it's already a proxied URL, return as is
  if (rawUrl.includes('wsrv.nl')) return rawUrl;

  // Use wsrv.nl to serve a WebP version for general UI performance
  return `https://wsrv.nl/?url=${encodeURIComponent(rawUrl)}&w=${width}&q=${quality}&output=webp`;
};
