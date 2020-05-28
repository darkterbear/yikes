'use strict';

import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import Session, { SessionOptions } from 'express-session';
import http from 'http';
import Room from './models/Room';
import route from './routes';
import socket from './sockets';

enum Environment {
  Production = 'production',
  Development = 'development',
  Test = 'test',
}

const env = process.env.NODE_ENV;

export const app = express();

/* BODY PARSER */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/* CORS */
app.use(
  cors({
    origin: [
      'http://localhost:5000',
      'http://192.168.0.109:5000',
      'https://yikes.terranceli.com',
    ],
    credentials: true,
  }),
);

/* SESSION */
const sessionMiddleware = Session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  unset: 'destroy',
  cookie: { secure: env === Environment.Production },
});

if (env === Environment.Production) {
  app.set('trust proxy', 1);
}

app.use(sessionMiddleware);
app.use(cookieParser());

/* ROUTES */
route(app);

const server = http.createServer(app);

/* SOCKET.IO */
export const sio = socket(server, sessionMiddleware);

/* BIND SERVICE TO PORT */
if (process.env.NODE_ENV !== Environment.Test) {
  server.listen(process.env.PORT, () => {
    console.log(`Yikes API listening on port ${process.env.PORT}!`);
  });
}
