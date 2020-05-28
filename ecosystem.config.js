/* PM2 CONFIGURATION FILE */
// Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
module.exports = {
  apps: [
    {
      name: 'API',
      script: 'build/server.js',
      cwd: 'backend/',
      node_args: '-r dotenv/config',
      instances: 1,
      autorestart: true,
      watch: false,
    },
    {
      name: 'Client',
      script: 'serve -s -p 5001',
      cwd: 'client/build/',
      instances: 1,
      autorestart: true,
      watch: false,
    },
  ],
};
