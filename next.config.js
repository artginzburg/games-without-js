const withLinaria = require('next-with-linaria');

/** @type {import('next-with-linaria').LinariaConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
  images: {
    remotePatterns: [
      {
        /** @see https://googlefonts.github.io/noto-emoji-animation/ */
        hostname: 'fonts.gstatic.com',
      },
    ],
  },
};

module.exports = withLinaria(nextConfig);
