const withLinaria = require('next-with-linaria');

/** @type {import('next-with-linaria').LinariaConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
  linaria: {
    features: {
      useBabelConfigs: false,
    },
  },
};

module.exports = withLinaria(nextConfig);
