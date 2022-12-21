import { Controller } from '../interfaces/controller.interface';
import { NextFunction, Request, Response, Router} from 'express';
import userModel from '../models/user.model';
import HttpException from'../utils/HttpException.utils';
import { validationResult } from'express-validator';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import dotenv from'dotenv';
import authMiddleware from '../middleware/auth.middleware';
import testMiddleware from '../middleware/test.middleware';
import validationMiddleware from '../middleware/validation.middleware';
// @ts-ignore
import { LogInDto } from "../dto/logIn.dto";
dotenv.config();

class UserController implements Controller {
    public path = '/auth';
    public router = Router();
    private user = userModel;

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        /*
            token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMSIsImlhdCI6MTY3MTYzMDk0NCwiZXhwIjoxNjcxNzE3MzQ0fQ.k5ip0CVl_QPiEU8PlwR-No92Zs-NQcH0UY1fkT61pqE
        */
        /*this.router.use('/', testMiddleware, (req: Request, res: Response, next: NextFunction) => {
            res.send({msg: 'Hello!'});
        });*/
        // @ts-ignore
        this.router.get('/users', authMiddleware, this.getAllUsers); // localhost:3000/users
        // @ts-ignore
        this.router.get('/users/id/:id', authMiddleware, this.getUserById);
        this.router.post('/login', validationMiddleware(LogInDto), this.userLogin); // localhost:3000/login
    }

    private getAllUsers = async (req: Request, res: Response) => {
        let userList: any = await userModel.find();
        if (!userList.length) {
            throw new HttpException(404, 'Users not found');
        }

        userList = userList.map((user: any) => {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });

        res.send(userList);
    };

    private getUserById = async (req: Request, res: Response) => {
        const user = await userModel.findOne({ id: req.params.id });
        if (!user) {
            throw new HttpException(404, 'User not found');
        }

        const { password, ...userWithoutPassword } = user;

        res.send(userWithoutPassword);
    };

    private getUserByuserName = async (req: Request, res: Response) => {
        const user = await userModel.findOne({ username: req.params.username });
        if (!user) {
            throw new HttpException(404, 'User not found');
        }

        const { password, ...userWithoutPassword } = user;

        res.send(userWithoutPassword);
    };

    private getCurrentUser = async (req: any, res: Response) => {
        const { password, ...userWithoutPassword } = req.currentUser;

        res.send(userWithoutPassword);
    };

    private createUser = async (req: Request, res: Response) => {
        this.checkValidation(req);

        await this.hashPassword(req);

        const { username, password, first_name, last_name, email, role, age } = req.body;

        const result = await userModel.create( username, password, first_name, last_name, email, role, age );

        if (!result) {
            throw new HttpException(500, 'Something went wrong');
        }

        res.status(201).send('User was created!');
    };

    private updateUser = async (req: Request, res: Response) => {
        this.checkValidation(req);

        await this.hashPassword(req);

        const { confirm_password, ...restOfUpdates } = req.body;

        const result: any = await userModel.update(restOfUpdates, Number(req.params.id));

        if (!result) {
            throw new HttpException(404, 'Something went wrong');
        }

        const { affectedRows, changedRows, info } = result;

        const message = !affectedRows ? 'User not found' :
            affectedRows && changedRows ? 'User updated successfully' : 'Updated faild';

        res.send({ message, info });
    };

    private deleteUser = async (req: Request, res: Response) => {
        const result = await userModel.delete(Number(req.params.id));
        if (!result) {
            throw new HttpException(404, 'User not found');
        }
        res.send('User has been deleted');
    };

    private userLogin = async (req: Request, res: Response) => {
        this.checkValidation(req);

        const { email, password: pass } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {
            throw new HttpException(401, 'Unable to login!');
        }

        const isMatch = await bcrypt.compare(pass, user.password);

        if (!isMatch) {
            throw new HttpException(401, 'Incorrect password!');
        }

        // user matched!
        const secretKey = process.env.SECRET_JWT || "";
        const token = jwt.sign({ user_id: user.id.toString() }, secretKey, {
            expiresIn: '24h'
        });

        const { password, ...userWithoutPassword } = user;

        res.send({ ...userWithoutPassword, token });
    };

    private checkValidation = (req: Request) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            throw new HttpException(400, 'Validation failed');
        }
    }

    // hash password if it exists
    private hashPassword = async (req: Request) => {
        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 8);
        }
    }
}

export default UserController;