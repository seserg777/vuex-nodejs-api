"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const userRoles_utils_1 = __importDefault(require("../../utils/userRoles.utils"));
exports.createUserSchema = [
    (0, express_validator_1.body)('username')
        .exists()
        .withMessage('username is required')
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long'),
    (0, express_validator_1.body)('first_name')
        .exists()
        .withMessage('Your first name is required')
        .isAlpha()
        .withMessage('Must be only alphabetical chars')
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long'),
    (0, express_validator_1.body)('last_name')
        .exists()
        .withMessage('Your last name is required')
        .isAlpha()
        .withMessage('Must be only alphabetical chars')
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long'),
    (0, express_validator_1.body)('email')
        .exists()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Must be a valid email')
        .normalizeEmail(),
    (0, express_validator_1.body)('role')
        .optional()
        .isIn([userRoles_utils_1.default.Admin, userRoles_utils_1.default.SuperUser])
        .withMessage('Invalid Role type'),
    (0, express_validator_1.body)('password')
        .exists()
        .withMessage('Password is required')
        .notEmpty()
        .isLength({ min: 6 })
        .withMessage('Password must contain at least 6 characters')
        .isLength({ max: 10 })
        .withMessage('Password can contain max 10 characters'),
    (0, express_validator_1.body)('confirm_password')
        .exists()
        .custom((value, { req }) => value === req.body.password)
        .withMessage('confirm_password field must have the same value as the password field'),
    (0, express_validator_1.body)('age')
        .optional()
        .isNumeric()
        .withMessage('Must be a number')
];
exports.updateUserSchema = [
    (0, express_validator_1.body)('username')
        .optional()
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long'),
    (0, express_validator_1.body)('first_name')
        .optional()
        .isAlpha()
        .withMessage('Must be only alphabetical chars')
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long'),
    (0, express_validator_1.body)('last_name')
        .optional()
        .isAlpha()
        .withMessage('Must be only alphabetical chars')
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long'),
    (0, express_validator_1.body)('email')
        .optional()
        .isEmail()
        .withMessage('Must be a valid email')
        .normalizeEmail(),
    (0, express_validator_1.body)('role')
        .optional()
        .isIn([userRoles_utils_1.default.Admin, userRoles_utils_1.default.SuperUser])
        .withMessage('Invalid Role type'),
    (0, express_validator_1.body)('password')
        .optional()
        .notEmpty()
        .isLength({ min: 6 })
        .withMessage('Password must contain at least 6 characters')
        .isLength({ max: 10 })
        .withMessage('Password can contain max 10 characters')
        .custom((value, { req }) => !!req.body.confirm_password)
        .withMessage('Please confirm your password'),
    (0, express_validator_1.body)('confirm_password')
        .optional()
        .custom((value, { req }) => value === req.body.password)
        .withMessage('confirm_password field must have the same value as the password field'),
    (0, express_validator_1.body)('age')
        .optional()
        .isNumeric()
        .withMessage('Must be a number'),
    (0, express_validator_1.body)()
        .custom(value => {
        return !!Object.keys(value).length;
    })
        .withMessage('Please provide required field to update')
        .custom(value => {
        const updates = Object.keys(value);
        const allowUpdates = ['username', 'password', 'confirm_password', 'email', 'role', 'first_name', 'last_name', 'age'];
        return updates.every(update => allowUpdates.includes(update));
    })
        .withMessage('Invalid updates!')
];
exports.validateLogin = [
    (0, express_validator_1.body)('email')
        .exists()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Must be a valid email')
        .normalizeEmail(),
    (0, express_validator_1.body)('password')
        .exists()
        .withMessage('Password is required')
        .notEmpty()
        .withMessage('Password must be filled')
];
//# sourceMappingURL=userValidator.middleware.js.map