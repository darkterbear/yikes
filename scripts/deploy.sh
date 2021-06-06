git reset --hard
git pull -X theirs

cd client/
yarn run build

cd ../backend
yarn run build

pm2 startOrReload ecosystem.config.js
