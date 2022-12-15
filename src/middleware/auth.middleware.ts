import HttpException from '../utils/HttpException.utils';
import UserModel from '../models/user.model';
import jwt from'jsonwebtoken';
import dotenv from 'dotenv';
import { NextFunction, Response } from "express";
import RequestWithUser from "../interfaces/requestWithUser.interface";

dotenv.config();

async function authMiddleware(req: RequestWithUser, res: Response, next: NextFunction) {
    console.log('authMiddleware start');
    try {
        console.log('authMiddleware try');
        const authHeader = req.headers.authorization;
        const bearer = 'Bearer ';

        if (!authHeader || !authHeader.startsWith(bearer)) {
            throw new HttpException(401, 'Access denied. No credentials sent!');
        }

        const token = authHeader.replace(bearer, '');
        const secretKey = process.env.SECRET_JWT || "";

        // Verify Token
        const decoded: any = jwt.verify(token, secretKey);
        const user = await UserModel.findOne({ id: decoded.user_id });

        if (!user) {
            throw new HttpException(401, 'Authentication failed!');
        }

        // check if the current user is the owner user
        const ownerAuthorized = req.params.id == user.id;

        // if the current user is not the owner and
        // if the user role don't have the permission to do this action.
        // the user will get this error
        if (!ownerAuthorized && roles.length && !roles.includes(user.role)) {
            throw new HttpException(401, 'Unauthorized');
        }

        // if the user has permissions
        req.user = user;
        next();

    } catch (e: any) {
        e.status = 401;
        next(e);
    }
}

export default authMiddleware;