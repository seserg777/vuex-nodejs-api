import { Request } from 'express';
import UserInterface from "./user";

interface RequestWithUser extends Request {
    user: UserInterface;
}

export default RequestWithUser;