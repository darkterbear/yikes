'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const routes_1 = __importDefault(require("./routes"));
var Environment;
(function (Environment) {
    Environment["Production"] = "production";
    Environment["Development"] = "development";
    Environment["Test"] = "test";
})(Environment || (Environment = {}));
const env = process.env.NODE_ENV;
exports.app = express_1.default();
/* BODY PARSER */
exports.app.use(body_parser_1.default.urlencoded({ extended: true }));
exports.app.use(body_parser_1.default.json());
/* CORS */
exports.app.use(cors_1.default({
    origin: [
        'http://localhost:5000',
        'https://yikes.terrance.com',
    ],
    credentials: true,
}));
/* SESSION */
const session = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    unset: 'destroy',
    cookie: { secure: false },
};
if (env === Environment.Production) {
    exports.app.set('trust proxy', 1); // Trust first proxy
    session.cookie.secure = true; // Serve secure cookies
}
exports.app.use(express_session_1.default(session));
exports.app.use(cookie_parser_1.default());
/* ROUTES */
routes_1.default(exports.app);
/* BIND SERVICE TO PORT */
if (process.env.NODE_ENV !== Environment.Test) {
    exports.app.listen(process.env.PORT, () => {
        console.log(`Cal Hacks API listening on port ${process.env.PORT}!`);
    });
}
//# sourceMappingURL=server.js.map