
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

  // Ensure raw.githubusercontent links are also handled/normalized
  if (targetUrl.includes('raw.githubusercontent.com')) {
    targetUrl = targetUrl
      .replace('raw.githubusercontent.com', 'cdn.jsdelivr.net/gh')
      .replace('/master/', '@master/')
      .replace('/main/', '@main/');
  }

  return targetUrl;
};

/**
 * Checks if a URL likely points to a 360 panorama based on filename keywords.
 */
export const isImageUrl360 = (url: string): boolean => {
  const lower = url.toLowerCase();
  return lower.includes('panorama') || lower.includes('360') || lower.includes('equirectangular');
};

/**
 * Provides an optimized, proxied image URL for thumbnails and standard views.
 * We automatically detect if an image is a 360 panorama and return the raw URL 
 * instead of a proxy to preserve 8K texture quality.
 */
export const getOptimizedImage = (url: string, width: number = 1200, quality: number = 80): string => {
  if (!url) return '';
  
  const rawUrl = getRawAssetUrl(url);

  // If it's a 360 image, NEVER use the proxy as it will downscale the 8K texture
  if (isImageUrl360(rawUrl)) {
    return rawUrl;
  }

  // If it's already a proxied URL, return as is
  if (rawUrl.includes('wsrv.nl')) return rawUrl;

  // Use wsrv.nl for standard image optimization
  return `https://wsrv.nl/?url=${encodeURIComponent(rawUrl)}&w=${width}&q=${quality}&output=webp`;
};
