import cookieParser from 'cookie-parser';
import sharedsession from 'express-socket.io-session';
import { Server } from 'http';
import socketio from 'socket.io';
import Player from './models/Player';

export default (server: Server, sessionMiddleware: any) => {
  const sio = socketio(server, {
    origins: '*:*',
  });

  // sio.use((socket, next) => {
  //   sessionMiddleware(socket.request, socket.request.res || {}, next);
  // });

  sio.use(sharedsession(sessionMiddleware, cookieParser()));

  sio.sockets.on('connection', (socket) => {
    const player = Player.getPlayer(socket.handshake.sessionID);

    if (!player) {
      // Player does not yet exist; must call /username before connecting to socket
      return socket.disconnect(true);
    }

    player.socket = socket;

    socket.on('disconnect', () => {
      player.socket = null;
    });
  });

  return sio;
};
