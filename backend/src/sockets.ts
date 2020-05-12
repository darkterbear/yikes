import { Server } from 'http';
import socketio from 'socket.io';

export default (server: Server, sessionMiddleware: any) => {
  const sio = socketio(server, {
    origins: '*:*',
  });

  sio.use((socket, next) => {
    sessionMiddleware(socket.request, socket.request.res || {}, next);
  });

  sio.sockets.on('connection', (socket) => {
    console.log(socket.request.sessionID);
  });
};
