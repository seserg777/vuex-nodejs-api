"use strict";
/*import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import type { Request, Response, NextFunction } from 'express';
import userRouter from './routes/user.route.js';

// Init express
const app = express();
// Init environment
dotenv.config();
// parse requests of content-type: application/json
// parses incoming requests with JSON payloads
app.use(express.json());
// enabling cors for all requests by using cors middleware
app.use(cors());
// Enable pre-flight
app.options("*", cors());

const port = Number(process.env.PORT || 3331);

app.use(`/api/v1/users`, userRouter);

// 404 error
app.all('*', (req: Request, res: Response, next: NextFunction) => {
    console.log(req, res, next);
    //const err = new HttpException(404, 'Endpoint Not Found');
    //next(err);
});

// Error middleware
//app.use(errorMiddleware);

// starting the server
app.listen(port, () =>
    console.log(`🚀 Server running on port ${port}!`));


export default app;*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = __importDefault(require("./app"));
const user_controller_1 = __importDefault(require("./controllers/user.controller"));
const validateEnv_1 = __importDefault(require("./utils/validateEnv"));
(0, validateEnv_1.default)();
const app = new app_1.default([
    new user_controller_1.default(),
]);
app.listen();
//# sourceMappingURL=server.js.map