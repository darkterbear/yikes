cd client/
npm run build

cd ../backend
npm run build

cd ..
pm2 startOrReload ecosystem.config.js
