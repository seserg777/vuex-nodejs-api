import { ErrorRequestHandler, NextFunction, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import AuthenticationTokenMissingException from '../exceptions/AuthenticationTokenMissingException';
import WrongAuthenticationTokenException from '../exceptions/WrongAuthenticationTokenException';
import DataStoredInToken from '../interfaces/dataStoredInToken';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import userModel from '../models/user.model';

async function authMiddleware(error: ErrorRequestHandler, request: RequestWithUser, response: Response, next: NextFunction) {
    const cookies = request.cookies;
    if (cookies && cookies.Authorization) {
        const secret: string = process.env.JWT_SECRET ? process.env.JWT_SECRET : '';
        try {
            const verificationResponse = jwt.verify(cookies.Authorization, secret) as unknown as DataStoredInToken;
            const id = verificationResponse._id;
            const user = await userModel.findOne(id);
            if (user) {
                request.user = user;
                next();
            } else {
                next(new WrongAuthenticationTokenException());
            }
        } catch (error) {
            next(new WrongAuthenticationTokenException());
        }
    } else {
        next(new AuthenticationTokenMissingException());
    }
}

export default authMiddleware;