import { NextFunction, Request, Response } from "express";
import UserInterface from "../interfaces/user";

type ReqDictionary = {}
type ReqBody = { user: UserInterface }
type ReqQuery = {}
type ResBody = {}
type CustomRequest = Request<ReqDictionary, ResBody, ReqBody, ReqQuery>

async function testMiddleware(req: CustomRequest, res: Response, next: NextFunction) {
    console.log('testMiddleware start', req.body);
    setTimeout(
        () => {
            console.log('testMiddleware timer');
            next()
        },
        5000
    );
}

export default testMiddleware;