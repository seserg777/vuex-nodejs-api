import {ErrorRequestHandler, NextFunction, Request, Response} from 'express';

function errorMiddleware(error: ErrorRequestHandler, request: Request, response: Response, next: NextFunction) {
    const status: number = response.statusCode === 200 ? 500 : response.statusCode;
    const message: string = response.statusMessage || 'Something went wrong';
    response
        .status(status)
        .send({
            message,
            status,
        });
}

export default errorMiddleware;