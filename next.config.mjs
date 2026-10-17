/**
 * Aplicación Next.js en Netlify: las páginas públicas se pre-generan (SSG) y el CRM, la API y los portales
 * se ejecutan en servidor. Netlify aplica su adaptador de Next.js automáticamente.
 */
const nextConfig = {
  trailingSlash: true,
  poweredByHeader: false,
  reactStrictMode: true,
  images: { unoptimized: true },
};
export default nextConfig;
