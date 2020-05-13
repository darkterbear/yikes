import { Server } from 'http';
import socketio from 'socket.io';
import Player from './models/Player';

export default (server: Server, sessionMiddleware: any) => {
  const sio = socketio(server, {
    origins: '*:*',
  });

  sio.use((socket, next) => {
    sessionMiddleware(socket.request, socket.request.res || {}, next);
  });

  sio.sockets.on('connection', (socket) => {
    console.log(socket.request.sessionID);
    const player = Player.getPlayer(socket.request.sessionID);

    if (!player) {
      // Player does not yet exist; must call /username before connecting to socket
      return socket.disconnect(true);
    }

    player.socket = socket;
  });

  return sio;
};
