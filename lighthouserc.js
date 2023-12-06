const { COLLECT_BASE_URL } = process.env;

const localUrl = 'http://localhost:3000';
const routesToAnalyze = ['/', '/memoria'];

const collectUrls = COLLECT_BASE_URL
  ? routesToAnalyze.map((route) => `${COLLECT_BASE_URL}${route}`)
  : routesToAnalyze.map((route) => `${localUrl}${route}`);

module.exports = {
  ci: {
    upload: {
      target: 'temporary-public-storage',
    },
    collect: {
      ...(COLLECT_BASE_URL
        ? undefined
        : { startServerCommand: 'npm run start', startServerReadyPattern: 'ready on' }),
      url: collectUrls,
      numberOfRuns: 3,
    },
  },
};
