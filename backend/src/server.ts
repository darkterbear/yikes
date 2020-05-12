'use strict';

import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import Session, { SessionOptions } from 'express-session';
import route from './routes';

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
      'https://yikes.terrance.com',
    ],
    credentials: true,
  }),
);

/* SESSION */
const session = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  unset: 'destroy',
  cookie: { secure: false },
};

if (env === Environment.Production) {
  app.set('trust proxy', 1); // Trust first proxy
  session.cookie.secure = true; // Serve secure cookies
}

app.use(Session(session as SessionOptions));
app.use(cookieParser());

/* ROUTES */
route(app);

/* BIND SERVICE TO PORT */
if (process.env.NODE_ENV !== Environment.Test) {
  app.listen(process.env.PORT, () => {
    console.log(`Yikes API listening on port ${process.env.PORT}!`);
  });
}
