"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const HttpException_utils_1 = __importDefault(require("../utils/HttpException.utils"));
const user_model_1 = __importDefault(require("../models/user.model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
async function authMiddleware(req, res, next) {
    console.log('authMiddleware start');
    try {
        console.log('authMiddleware try');
        const authHeader = req.headers.authorization;
        const bearer = 'Bearer ';
        if (!authHeader || !authHeader.startsWith(bearer)) {
            throw new HttpException_utils_1.default(401, 'Access denied. No credentials sent!');
        }
        const token = authHeader.replace(bearer, '');
        const secretKey = process.env.SECRET_JWT || "";
        // Verify Token
        const decoded = jsonwebtoken_1.default.verify(token, secretKey);
        const user = await user_model_1.default.findOne({ id: decoded.user_id });
        if (!user) {
            throw new HttpException_utils_1.default(401, 'Authentication failed!');
        }
        // check if the current user is the owner user
        const ownerAuthorized = req.params.id == user.id;
        // if the current user is not the owner and
        // if the user role don't have the permission to do this action.
        // the user will get this error
        if (!ownerAuthorized && roles.length && !roles.includes(user.role)) {
            throw new HttpException_utils_1.default(401, 'Unauthorized');
        }
        // if the user has permissions
        req.user = user;
        next();
    }
    catch (e) {
        e.status = 401;
        next(e);
    }
}
exports.default = authMiddleware;
//# sourceMappingURL=auth.middleware.js.map