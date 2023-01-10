import { Controller } from '../interfaces/controller.interface';
import { Request, Response, Router} from 'express';
import userModel from '../models/user.model';
import HttpException from'../utils/HttpException.utils';
import { validationResult } from'express-validator';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import dotenv from'dotenv';
import authMiddleware from '../middleware/auth.middleware';
import validationMiddleware from '../middleware/validation.middleware';
// @ts-ignore
import { LogInDto } from "../dto/logIn.dto";
import userWithoutPasswordInterface from '../interfaces/userWithoutPassword.interface';
import user from '../interfaces/user.interface';
import keyvalueInterface from "../interfaces/keyvalue.interface";

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
        this.router.patch('/users/id/:id', authMiddleware, this.updateUser);
    }

    private getAllUsers = async (req: Request, res: Response) => {
        const page: number = !!req.query.page ? Number(req.query.page) : 0;
        const limit: number = !!req.query.limit ? Number(req.query.limit) : 10;
        const userList: any = await userModel.find({}, page, limit);
        const assocList: Array<userWithoutPasswordInterface> = [];
        if (!userList.length) {
            //throw new HttpException(404, 'Users not found');
            res.send(assocList);
        } else {
            userList.map((user: user) => {
                const { password, ...userWithoutPassword } = user;
                assocList.push(userWithoutPassword as userWithoutPasswordInterface);
            });

            res.send(assocList);
        }
    };

    private getUserById = async (req: Request, res: Response) => {
        const user: user = await userModel.findOne({ id: req.params.id });
        if (!user) {
            throw new HttpException(404, 'User not found');
        }

        const { password, ...userWithoutPassword }: keyvalueInterface<any> = user;

        res.send(userWithoutPassword);
    };

    private getUserByuserName = async (req: Request, res: Response) => {
        const user: user = await userModel.findOne({ username: req.params.username });
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

        //const { confirm_password, ...restOfUpdates } = req.body;
        const { user: u, ...restOfUpdates } = req.body;

        const result: any = await userModel.update(restOfUpdates, Number(req.params.id));

        if (!result) {
            throw new HttpException(404, 'Something went wrong');
        }

        /*const { affectedRows, changedRows, info } = result;

        const message = !affectedRows ? 'User not found' :
            affectedRows && changedRows ? 'User updated successfully' : 'Updated faild';

        res.send({ message, info });*/

        const user: user = await userModel.findOne({ id: req.params.id });
        if (!user) {
            throw new HttpException(404, 'User not found');
        }

        const { password, ...userWithoutPassword } = user;

        res.send(userWithoutPassword);
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

        const user: user = await userModel.findOne({ email });

        if (!user) {
            //throw new HttpException(401, 'Wrong user data');
            res.status(401).send({message:'Wrong user data'});
        } else {
            const isMatch = await bcrypt.compare(pass, user.password);

            if (!isMatch) {
                throw new HttpException(401, 'Incorrect password!');
            }

            // user matched!
            const secretKey = process.env.SECRET_JWT || "";
            const token: string = jwt.sign({ user_id: user.id }, secretKey, {
                expiresIn: '24h'
            });

            const { password, ...userWithoutPassword } = user;

            res.send({ ...userWithoutPassword, token });
        }
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