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

import 'dotenv/config';
import App from './app';
import UserController from './controllers/user.controller';
import validateEnv from './utils/validateEnv';

validateEnv();

const app = new App(
    [
        new UserController(),
    ],
);

app.listen();