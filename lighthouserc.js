const { COLLECT_BASE_URL } = process.env;

console.log('env', process.env);
console.log('COLLECT_BASE_URL', COLLECT_BASE_URL);

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
