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
const db_connection_1 = __importDefault(require("../db/db-connection"));
const common_utils_1 = require("../utils/common.utils");
const Role = __importStar(require("../utils/userRoles.utils"));
class userModel {
    constructor() {
        this.tableName = 'user';
        this.find = async (params = {}) => {
            let sql = `SELECT * FROM ${this.tableName}`;
            if (!Object.keys(params).length) {
                return await (0, db_connection_1.default)(sql);
            }
            const { columnSet, values } = (0, common_utils_1.multipleColumnSet)(params);
            sql += ` WHERE ${columnSet}`;
            return await (0, db_connection_1.default)(sql, [...values]);
        };
        this.findOne = async (params) => {
            const { columnSet, values } = (0, common_utils_1.multipleColumnSet)(params);
            const sql = `SELECT * FROM ${this.tableName}
        WHERE ${columnSet}`;
            const result = await (0, db_connection_1.default)(sql, [...values]);
            // return back the first row (user)
            return result[0];
        };
        this.create = async (username, password, first_name, last_name, email, role = Role.SuperUser, age = 0) => {
            const sql = `INSERT INTO ${this.tableName}
        (username, password, first_name, last_name, email, role, age) VALUES (?,?,?,?,?,?,?)`;
            const result = await (0, db_connection_1.default)(sql, [username, password, first_name, last_name, email, role, age]);
            const affectedRows = result ? result.affectedRows : 0;
            return affectedRows;
        };
        this.update = async (params, id) => {
            const { columnSet, values } = (0, common_utils_1.multipleColumnSet)(params);
            const sql = `UPDATE user SET ${columnSet} WHERE id = ?`;
            const result = await (0, db_connection_1.default)(sql, [...values, id]);
            return result;
        };
        this.delete = async (id) => {
            const sql = `DELETE FROM ${this.tableName}
        WHERE id = ?`;
            const result = await (0, db_connection_1.default)(sql, [id]);
            const affectedRows = result ? result.affectedRows : 0;
            return affectedRows;
        };
    }
}
exports.default = new userModel;
//# sourceMappingURL=user.model.js.map