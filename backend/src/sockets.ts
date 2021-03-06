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

    console.log(`Player ${player.id + ':' + player.username} attempting to connect`);

    player.socket = socket;
    console.log(`Player ${player.id + ':' + player.username} connected`);

    socket.on('disconnect', () => {
      player.socket = null;
      console.log(`Player ${player.id + ':' + player.username} disconnected`);

      const room = player.room;
      Player.disconnectPlayer(player.id);

      if (room) {
        if (room.players.length > 0) {
          sio.to(room.code).emit('player-left', {
            id: player.id,
            newLeader: room.leader.toShortPlayer(),
          });
        }
      }
    });
  });

  return sio;
};
