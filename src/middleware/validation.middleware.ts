// @ts-ignore
import { plainToClass } from 'class-transformer';
// @ts-ignore
import { validate, ValidationError } from 'class-validator';
import {NextFunction, Request, RequestHandler, Response} from 'express';
import HttpException from '../exceptions/HttpException';

function validationMiddleware<T>(type: any, skipMissingProperties = false): RequestHandler {
    return (req: Request, res: Response, next: NextFunction) => {
        validate(plainToClass(type, req.body), { skipMissingProperties })
            .then((errors: ValidationError[]) => {
                if (errors.length > 0) {
                    const message = errors.map((error: any) => Object.values(error.constraints)).join(', ');
                    next(new HttpException(400, message));
                } else {
                    next();
                }
            });
    };
}

export default validationMiddleware;