const { loadDotEnv } = require('./scripts/load-env');

loadDotEnv(__dirname);

module.exports = ({ config }) => ({
  ...config,
  extra: {
    ...config.extra,
    backendApiUrl: process.env.BACKEND_API_URL ?? null,
    port: process.env.PORT ?? '8081',
  },
});
