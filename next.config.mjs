/** Sitio estático (SSG): cada página aprobada se genera en el build; Netlify sirve HTML puro. */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  poweredByHeader: false,
  reactStrictMode: true,
};
export default nextConfig;
