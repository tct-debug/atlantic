const PRODUCT_LOCAL_IMAGES: Record<string, string> = {
  'mais':        '/images/produit-mais-grade-2-yellowrock.jpg',
  'orge':        '/images/orge_brute.jpg',
  'soja':        '/images/_120708772_fba27772-4c3e-45a8-ba1d-c1bf8031017a.jpg',
  'coque-soja':  '/images/IMG_0656_TOURTEAU_SOJA2-compressor.webp',
  'ble-dur':     '/images/ble-header.jpg',
  'ble-tendre':  '/images/c9654544c4c99da924543a13990d461c-075bf063ec_grains_orge0.webp',
  'farine-soja': '/images/Farine-de-soja.jpg',
  'son-ble':     '/images/9568db678de132e5e53850847d38.webp',
}

export function getProductImageSrc(slug: string, imageUrl?: string | null): string {
  if (imageUrl) return imageUrl
  return PRODUCT_LOCAL_IMAGES[slug] ?? `https://picsum.photos/seed/${slug}/600/300`
}
