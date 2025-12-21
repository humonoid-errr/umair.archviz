
export const getOptimizedImage = (url: string, width: number = 1200, quality: number = 80): string => {
  if (!url) return '';
    
  let targetUrl = url;

  /**
   * Auto-correct GitHub "blob" URLs. 
   * Users often copy the URL from the browser address bar which points to the GitHub UI.
   * We convert: https://github.com/user/repo/blob/main/path/img.jpg
   * To: https://cdn.jsdelivr.net/gh/user/repo@main/path/img.jpg
   */
  if (targetUrl.includes('github.com') && targetUrl.includes('/blob/')) {
    targetUrl = targetUrl
      .replace('github.com', 'cdn.jsdelivr.net/gh')
      .replace('/blob/', '@');
  }

  // Check if it's already a proxied URL to avoid double-encoding
  if (targetUrl.includes('wsrv.nl')) return targetUrl;

  // Use wsrv.nl as a free, high-performance image proxy/optimizer
  return `https://wsrv.nl/?url=${encodeURIComponent(targetUrl)}&w=${width}&q=${quality}&output=webp`;
};
