"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mysql2_1 = __importDefault(require("mysql2"));
class DBConnection {
    constructor() {
        this.query = async (sql, values) => {
            return new Promise((resolve, reject) => {
                const callback = (error, result) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve(result);
                };
                // execute will internally call prepare and query
                this.db.execute(sql, values, callback);
            }).catch(err => {
                const mysqlErrorList = Object.keys(HttpStatusCodes);
                // convert mysql errors which in the mysqlErrorList list to http status code
                err.status = mysqlErrorList.includes(err.code) ? HttpStatusCodes[err.code] : err.status;
                throw err;
            });
        };
        this.db = mysql2_1.default.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_DATABASE
        });
        this.checkConnection();
    }
    checkConnection() {
        this.db.getConnection((err, connection) => {
            if (err) {
                if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                    console.error('Database connection was closed.');
                }
                if (err.code === 'ER_CON_COUNT_ERROR') {
                    console.error('Database has too many connections.');
                }
                if (err.code === 'ECONNREFUSED') {
                    console.error('Database connection was refused.');
                }
            }
            if (connection) {
                connection.release();
            }
            return;
        });
    }
}
// like ENUM
const HttpStatusCodes = Object.freeze({
    ER_TRUNCATED_WRONG_VALUE_FOR_FIELD: 422,
    ER_DUP_ENTRY: 409
});
exports.default = new DBConnection().query;
//# sourceMappingURL=db-connection.js.map