import { IRouter } from 'express';

export default (app: IRouter) => {
  app.get('/ping', (_, res) => res.send('pong').end());
};
