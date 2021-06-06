/* PM2 CONFIGURATION FILE */
// Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
module.exports = {
  apps: [
    {
      name: 'yikes-backend',
      script: 'build/server.js',
      cwd: 'backend/',
      env: {
        NODE_ENV: 'production',
        PORT: 3002
      },
      instances: 1,
      autorestart: true,
      watch: false,
    },
    {
      name: 'yikes-client',
      script: 'serve',
      cwd: 'client/',
      env: {
        PM2_SERVE_PATH: 'build/',
        PM2_SERVE_PORT: 5002,
        PM2_SERVE_SPA: 'true'
      },
      instances: 1,
      autorestart: true,
      watch: false,
    },
  ],
};
