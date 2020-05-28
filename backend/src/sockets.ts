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

    console.log(`Player ${player.id} attempting to connect`);

    player.socket = socket;
    console.log(`Player ${player.id} connected`);

    socket.on('disconnect', () => {
      player.socket = null;
      console.log(`Player ${player ? player.id : 'anon'} disconnected`);

      const room = player.room;
      Player.disconnectPlayer(player.id);

      if (room) {
        if (room.players.length > 0) {
          if (room.leader.id === player.id) {
            sio.to(room.code).emit('player-left', {
              id: player.id,
              newLeader: room.leader.toShortPlayer(),
            });
          } else {
            sio.to(room.code).emit('player-left', {
              id: player.id,
            });
          }
        }
      }
    });
  });

  return sio;
};
