
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
 * Provides a high-quality, DPR-aware optimized image URL.
 * Uses wsrv.nl for fast, reliable WebP conversion and resizing.
 */
export const getOptimizedImage = (
  url: string, 
  width: number = 1600, 
  quality: number = 85,
  isHighDensity: boolean = true
): string => {
  if (!url) return '';
  
  const rawUrl = getRawAssetUrl(url);
  let decodedUrl = rawUrl;
  try {
    decodedUrl = decodeURIComponent(rawUrl);
  } catch (e) {}

  // Adjust width for high-density displays (Retina/Mobile)
  const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
  const targetWidth = isHighDensity ? Math.round(width * Math.min(dpr, 2)) : width;

  // 360 Panoramas specific logic
  if (isImageUrl360(decodedUrl)) {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;
    
    if (isMobile) {
      // 4096 is the safe WebGL texture limit for most mobile devices.
      // We use 'sharp' and higher quality to ensure the spherical projection stays crisp.
      return `https://wsrv.nl/?url=${encodeURIComponent(decodedUrl)}&w=4096&q=92&output=webp&sharp=1`;
    }
    // On desktop, we prefer the raw high-res asset for maximum quality
    return rawUrl;
  }

  // Standard image optimization
  // Using webp output and moderate sharpening for architectural details
  return `https://wsrv.nl/?url=${encodeURIComponent(decodedUrl)}&w=${targetWidth}&q=${quality}&output=webp&sharp=0.5`;
};
