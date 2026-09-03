/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["192.168.43.103"],
  /* config options here */
  compiler: {
    styledComponents: true,
  },
  reactCompiler: true,
};

export default nextConfig;
