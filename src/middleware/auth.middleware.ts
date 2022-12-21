import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import AuthenticationTokenMissingException from '../exceptions/AuthenticationTokenMissingException';
import WrongAuthenticationTokenException from '../exceptions/WrongAuthenticationTokenException';
import DataStoredInToken from '../interfaces/dataStoredInToken';
//import RequestWithUser from '../interfaces/requestWithUser.interface';
import userModel from '../models/user.model';
import User from "../interfaces/user";

type ReqDictionary = {}
type ReqBody = { user: User }
type ReqQuery = {}
type ResBody = {}
type RequestWithUser = Request<ReqDictionary, ResBody, ReqBody, ReqQuery>

async function authMiddleware(request: RequestWithUser, response: Response, next: NextFunction) {
    const cookies = request.cookies;
    if (!!cookies && !!cookies.Authorization) {
        const secret: string = process.env.SECRET_JWT ? process.env.SECRET_JWT : '';
        try {
            const verificationResponse = jwt.verify(cookies.Authorization, secret) as unknown as DataStoredInToken;
            const id = verificationResponse.user_id;
            const user = await userModel.findOne({ id });
            if (user) {
                request.body.user = user;
                next();
            } else {
                next(new WrongAuthenticationTokenException());
            }
        } catch (error) {
            next(new WrongAuthenticationTokenException());
        }
    } else {
        next(new AuthenticationTokenMissingException());
        //next(new HttpException(401, 'Access denied. No credentials sent!'));
    }
}

export default authMiddleware;