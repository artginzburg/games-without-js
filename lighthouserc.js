module.exports = {
  ci: {
    upload: {
      target: 'temporary-public-storage',
    },
    collect: {
      startServerCommand: 'npm run start',
      startServerReadyPattern: 'ready on',
      url: ['http://localhost:3000/', 'http://localhost:3000/memoria'],
      numberOfRuns: 3,
    },
  },
};
