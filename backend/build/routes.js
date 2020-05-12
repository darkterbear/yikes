"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (app) => {
    app.get('/ping', (_, res) => res.send('pong').end());
};
//# sourceMappingURL=routes.js.map