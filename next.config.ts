import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'lh3.googleusercontent.com',
      'avatars.githubusercontent.com',
      'github.com',
      'www.gravatar.com',
      'images.unsplash.com',
      'cdn.discordapp.com',
      'cdn.pixabay.com',
    ],
  },
};

export default nextConfig;
