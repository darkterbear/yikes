import { IRouter } from 'express';
import * as controller from './controllers';
import * as middleware from './middleware';
import * as validators from './validators';

export default (app: IRouter) => {
  app.post('/username',
    validators.validateUsername,
    middleware.validateInput,
    controller.setUsername);

  app.post('/create', middleware.userExists, controller.create);

  app.post('/join',
    middleware.userExists,
    validators.validateJoin,
    middleware.validateInput,
    controller.joinRoom);
};
