
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
 * For 360 panoramas, we now allow proxying at high resolutions (e.g., 4096px) 
 * to ensure compatibility with mobile WebGL texture limits while maintaining high quality.
 */
export const getOptimizedImage = (url: string, width: number = 1200, quality: number = 80): string => {
  if (!url) return '';
  
  // Get raw URL first
  const rawUrl = getRawAssetUrl(url);
  
  let decodedUrl = rawUrl;
  try {
    decodedUrl = decodeURIComponent(rawUrl);
  } catch (e) {
    // If decoding fails, fallback to rawUrl
  }

  // Handle 360 images specifically
  if (isImageUrl360(decodedUrl)) {
    // If a non-default width is requested (e.g., 4096 for mobile or 400 for thumb), use the proxy.
    // This solves the 'WebGL not supported' error on mobile caused by 8K texture limits.
    if (width !== 1200 || width < 1000) {
      return `https://wsrv.nl/?url=${encodeURIComponent(decodedUrl)}&w=${width}&q=${quality}&output=webp`;
    }
    // Default to raw for 360 if no specific constraints
    return rawUrl;
  }

  // If it's already a proxied URL, return as is
  if (decodedUrl.includes('wsrv.nl')) return rawUrl;

  // Use wsrv.nl for standard image optimization
  return `https://wsrv.nl/?url=${encodeURIComponent(decodedUrl)}&w=${width}&q=${quality}&output=webp`;
};
