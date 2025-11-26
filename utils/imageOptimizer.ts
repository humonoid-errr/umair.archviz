
export const getOptimizedImage = (url: string, width: number = 1200, quality: number = 80): string => {
  if (!url) return '';
  // Check if it's already a proxied URL to avoid double-encoding
  if (url.includes('wsrv.nl')) return url;

  // Use wsrv.nl as a free, high-performance image proxy/optimizer
  // It supports WebP conversion (smaller size), resizing (w), and compression (q)
  // We use &output=webp to ensure modern browsers get the smallest file format
  return `https://wsrv.nl/?url=${encodeURIComponent(url)}&w=${width}&q=${quality}&output=webp`;
};
