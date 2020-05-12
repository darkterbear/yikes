import { IRouter } from 'express';
import * as controller from './controllers';

export default (app: IRouter) => {
  app.post('/create', controller.create);
};
