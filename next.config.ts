import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Fotos em `/uploads/*` usam `unoptimized`; isto reduz cache agressivo no resto.
    minimumCacheTTL: 0,
  },
  async rewrites() {
    // Links antigos no DB (`/uploads/...`) ainda funcionam quando o pedido chega ao Next.
    return [{ source: "/uploads/:file", destination: "/api/photo/:file" }];
  },
};

export default nextConfig;
