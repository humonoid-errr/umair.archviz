
/**
 * Resolves a raw asset URL, converting GitHub UI links to direct raw CDN links.
 */
export const getRawAssetUrl = (url: string, version?: string): string => {
  if (!url) return '';
  
  let targetUrl = url.trim();

  if (targetUrl.includes('github.com') && targetUrl.includes('/blob/')) {
    targetUrl = targetUrl
      .replace('github.com', 'cdn.jsdelivr.net/gh')
      .replace('/blob/', '@');
  }

  if (targetUrl.includes('raw.githubusercontent.com')) {
    targetUrl = targetUrl
      .replace('raw.githubusercontent.com', 'cdn.jsdelivr.net/gh')
      .replace('/master/', '@master/')
      .replace('/main/', '@main/');
  }

  if (version) {
    const separator = targetUrl.includes('?') ? '&' : '?';
    targetUrl = `${targetUrl}${separator}v=${version}`;
  }

  return targetUrl;
};

export const isImageUrl360 = (url: string): boolean => {
  const lower = url.toLowerCase();
  return lower.includes('panorama') || lower.includes('360') || lower.includes('equirectangular');
};

/**
 * Provides an optimized image URL with higher sharpness and quality for architecture.
 */
export const getOptimizedImage = (
  url: string, 
  width: number = 1600, 
  quality: number = 85,
  isHighDensity: boolean = true,
  force360: boolean = false,
  version: string = '1.0.2'
): string => {
  if (!url) return '';
  
  const rawUrl = getRawAssetUrl(url, version);
  let decodedUrl = rawUrl;
  try {
    decodedUrl = decodeURIComponent(rawUrl);
  } catch (e) {}

  const isActually360 = force360 || isImageUrl360(decodedUrl);

  const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
  const targetWidth = isHighDensity ? Math.round(width * Math.min(dpr, 2)) : width;

  if (isActually360) {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;
    if (isMobile) {
      return `https://wsrv.nl/?url=${encodeURIComponent(rawUrl)}&w=4096&q=95&output=webp&sharp=1.2`;
    }
    return rawUrl;
  }

  // Increased sharpness to 0.8 for architectural detail preservation
  return `https://wsrv.nl/?url=${encodeURIComponent(rawUrl)}&w=${targetWidth}&q=${quality}&output=webp&sharp=0.8`;
};
