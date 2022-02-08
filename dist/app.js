"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
require("reflect-metadata");
const pugMiddleware_1 = require("./middleware/pugMiddleware");
const express_1 = __importDefault(require("express"));
const http_errors_1 = __importDefault(require("http-errors"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const express_session_1 = __importDefault(require("express-session"));
const dotenv = __importStar(require("dotenv"));
const auth_1 = require("./routes/auth");
const dashboard_1 = require("./routes/dashboard");
const routes_1 = require("./routes");
const user_1 = __importDefault(require("./routes/user"));
const ItemsRouter_1 = __importDefault(require("./routes/ItemsRouter"));
class App {
    constructor() {
        this._app = express_1.default();
        this._authRouter = new auth_1.AuthRouter();
        this._dashboardRouter = new dashboard_1.DashboardRouter();
        this._indexRouter = new routes_1.IndexRouter();
        this._userRouter = new user_1.default();
        this._itemsRouter = new ItemsRouter_1.default();
    }
    Start(port) {
        this.SetupApp();
        this.SetupRoutes();
        this.SetupErrors();
        this.SetupListen(port);
    }
    SetupApp() {
        dotenv.config();
        this._app.set('views', path_1.default.join(process.cwd(), 'views'));
        this._app.set('view engine', 'pug');
        this._app.use(morgan_1.default('dev'));
        this._app.use(express_1.default.json());
        this._app.use(express_1.default.urlencoded({ extended: false }));
        this._app.use(cookie_parser_1.default());
        this._app.use(express_1.default.static(path_1.default.join(process.cwd(), 'public')));
        this._app.use(express_session_1.default({
            resave: false,
            saveUninitialized: false,
            secret: process.env.EXPRESS_SESSION_SECRET,
        }));
        // Session-persisted message middleware
        this._app.use(function (req, res, next) {
            var err = req.session.error;
            var msg = req.session.success;
            delete req.session.error;
            delete req.session.success;
            if (err)
                res.locals.error = err;
            if (msg)
                res.locals.message = msg;
            next();
        });
        this._app.use(pugMiddleware_1.PugMiddleware.GetBaseString);
    }
    SetupRoutes() {
        this._app.use('/', this._indexRouter.Route());
        this._app.use('/auth', this._authRouter.Route());
        this._app.use('/dashboard', this._dashboardRouter.Route());
        this._app.use('/user', this._userRouter.Route());
        this._app.use('/items', this._itemsRouter.Route());
    }
    SetupErrors() {
        // 404
        this._app.use(function (req, res, next) {
            next(http_errors_1.default(404));
        });
        // Error Handler
        this._app.use(function (err, req, res) {
            // Set locals, only providing error in development
            res.locals.message = err.message;
            res.locals.error = req.app.get('env') === 'development' ? err : {};
            // Render the error page
            res.status(err.status || 500);
            res.render('error');
        });
    }
    SetupListen(port) {
        this._app.listen(port, () => {
            console.log(`Droplet listening at http://localhost:${port}`);
        });
    }
}
exports.App = App;
//# sourceMappingURL=app.js.map