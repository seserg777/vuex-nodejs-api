"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_model_1 = __importDefault(require("../models/user.model"));
const HttpException_utils_1 = __importDefault(require("../utils/HttpException.utils"));
const express_validator_1 = require("express-validator");
const bcrypt = __importStar(require("bcrypt"));
const jwt = __importStar(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
dotenv_1.default.config();
class UserController {
    constructor() {
        this.path = '/auth';
        this.router = (0, express_1.Router)();
        this.user = user_model_1.default;
        this.getAllUsers = async (req, res) => {
            let userList = await user_model_1.default.find();
            if (!userList.length) {
                throw new HttpException_utils_1.default(404, 'Users not found');
            }
            userList = userList.map((user) => {
                const { password, ...userWithoutPassword } = user;
                return userWithoutPassword;
            });
            res.send(userList);
        };
        this.getUserById = async (req, res) => {
            const user = await user_model_1.default.findOne({ id: req.params.id });
            if (!user) {
                throw new HttpException_utils_1.default(404, 'User not found');
            }
            const { password, ...userWithoutPassword } = user;
            res.send(userWithoutPassword);
        };
        this.getUserByuserName = async (req, res) => {
            const user = await user_model_1.default.findOne({ username: req.params.username });
            if (!user) {
                throw new HttpException_utils_1.default(404, 'User not found');
            }
            const { password, ...userWithoutPassword } = user;
            res.send(userWithoutPassword);
        };
        this.getCurrentUser = async (req, res) => {
            const { password, ...userWithoutPassword } = req.currentUser;
            res.send(userWithoutPassword);
        };
        this.createUser = async (req, res) => {
            this.checkValidation(req);
            await this.hashPassword(req);
            const { username, password, first_name, last_name, email, role, age } = req.body;
            const result = await user_model_1.default.create(username, password, first_name, last_name, email, role, age);
            if (!result) {
                throw new HttpException_utils_1.default(500, 'Something went wrong');
            }
            res.status(201).send('User was created!');
        };
        this.updateUser = async (req, res) => {
            this.checkValidation(req);
            await this.hashPassword(req);
            const { confirm_password, ...restOfUpdates } = req.body;
            const result = await user_model_1.default.update(restOfUpdates, Number(req.params.id));
            if (!result) {
                throw new HttpException_utils_1.default(404, 'Something went wrong');
            }
            const { affectedRows, changedRows, info } = result;
            const message = !affectedRows ? 'User not found' :
                affectedRows && changedRows ? 'User updated successfully' : 'Updated faild';
            res.send({ message, info });
        };
        this.deleteUser = async (req, res) => {
            const result = await user_model_1.default.delete(Number(req.params.id));
            if (!result) {
                throw new HttpException_utils_1.default(404, 'User not found');
            }
            res.send('User has been deleted');
        };
        this.userLogin = async (req, res) => {
            this.checkValidation(req);
            const { email, password: pass } = req.body;
            const user = await user_model_1.default.findOne({ email });
            if (!user) {
                throw new HttpException_utils_1.default(401, 'Unable to login!');
            }
            const isMatch = await bcrypt.compare(pass, user.password);
            if (!isMatch) {
                throw new HttpException_utils_1.default(401, 'Incorrect password!');
            }
            // user matched!
            const secretKey = process.env.SECRET_JWT || "";
            const token = jwt.sign({ user_id: user.id.toString() }, secretKey, {
                expiresIn: '24h'
            });
            const { password, ...userWithoutPassword } = user;
            res.send({ ...userWithoutPassword, token });
        };
        this.checkValidation = (req) => {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                throw new HttpException_utils_1.default(400, 'Validation faild');
            }
        };
        // hash password if it exists
        this.hashPassword = async (req) => {
            if (req.body.password) {
                req.body.password = await bcrypt.hash(req.body.password, 8);
            }
        };
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get('/users', (0, auth_middleware_1.default)(req, res, next), this.getAllUsers); // localhost:3000/api/v1/users
        //this.router.get('/id/:id', authMiddleware, this.getUserById);
    }
}
exports.default = UserController;
//# sourceMappingURL=user.controller.js.map