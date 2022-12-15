import query from '../db/db-connection';
import { multipleColumnSet } from '../utils/common.utils';
import * as Role from '../utils/userRoles.utils';

class userModel {
    tableName = 'user';

    public find = async (params = {}) => {
        let sql = `SELECT * FROM ${this.tableName}`;

        if (!Object.keys(params).length) {
            return await query(sql);
        }

        const { columnSet, values } = multipleColumnSet(params)
        sql += ` WHERE ${columnSet}`;

        return await query(sql, [...values]);
    }

    public findOne = async (params: any) => {
        const { columnSet, values } = multipleColumnSet(params)

        const sql = `SELECT * FROM ${this.tableName}
        WHERE ${columnSet}`;

        const result: any = await query(sql, [...values]);

        // return back the first row (user)
        return result[0];
    }

    public create = async ( username: string, password: string, first_name: string, last_name: string, email: string, role: string = Role.SuperUser, age = 0 ) => {
        const sql = `INSERT INTO ${this.tableName}
        (username, password, first_name, last_name, email, role, age) VALUES (?,?,?,?,?,?,?)`;

        const result: any = await query(sql, [username, password, first_name, last_name, email, role, age]);
        const affectedRows = result ? result.affectedRows : 0;

        return affectedRows;
    }

    public update = async (params: any, id: number) => {
        const { columnSet, values } = multipleColumnSet(params)

        const sql = `UPDATE user SET ${columnSet} WHERE id = ?`;

        const result = await query(sql, [...values, id]);

        return result;
    }

    public delete = async (id: number) => {
        const sql = `DELETE FROM ${this.tableName}
        WHERE id = ?`;
        const result: any = await query(sql, [id]);
        const affectedRows = result ? result.affectedRows : 0;

        return affectedRows;
    }
}

export default new userModel;