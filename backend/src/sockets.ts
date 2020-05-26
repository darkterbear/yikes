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
    console.log(`Player ${player.id} attempting to connect`);

    if (!player) {
      // Player does not yet exist; must call /username before connecting to socket
      return socket.disconnect(true);
    }

    player.socket = socket;
    console.log(`Player ${player.id} connected`);

    socket.on('disconnect', () => {
      player.socket = null;
      console.log(`Player ${player.id} disconnected`);
    });
  });

  return sio;
};
