import { DB } from "../config/db";
import { IUser } from "../types/IUser";
import { HashUtil } from "../utils/hash";

export class UserService {

    async create(user: IUser) {
        user.password = await HashUtil.hash(user.password);
        const result = await DB.query(
            `INSERT INTO users(name,email,password,role)
       VALUES($1,$2,$3,$4) RETURNING *`,
            [user.name, user.email, user.password, user.role || "user"]
        );
        return result.rows[0];
    }

    async update(id: number, data: Partial<Pick<IUser, "name" | "email" | "password" | "role">>) {

        const allowedFields: (keyof Partial<Pick<IUser, "name" | "email" | "password" | "role">>)[] = ["name", "email", "password", "role"];

        const updates: string[] = [];
        const values: any[] = [];
        let index = 1;

        for (const key of allowedFields) {
            if (data[key] === undefined) continue;

            let value = data[key];

            if (key === "password") {
                value = await HashUtil.hash(value as string);
            }

            updates.push(`${key} = $${index}`);
            values.push(value);
            index++;
        }

        // ❌ No valid fields provided
        if (updates.length === 0) {
            throw new Error("No valid fields to update");
        }

        values.push(id);

        const result = await DB.query(
            `UPDATE users
            SET ${updates.join(", ")}
            WHERE id = $${index}
            RETURNING id, name, email, role `,
            values);

        const user = result.rows[0];

    }


    async delete(id: number) {
        const result = await DB.query(
            `DELETE FROM users WHERE id = $1 RETURNING id, name, email, role`,
            [id]
        );

        if (result.rows.length === 0) {
            throw new Error("User not found");
        }

        return result.rows[0];
    }

    async findByEmail(email: string) {
        const result = await DB.query(
            `SELECT * FROM users WHERE email=$1`,
            [email]
        );
        return result.rows[0];
    }

    async findByID(id: number) {
        const result = await DB.query(
            `SELECT * FROM users WHERE id=$1`,
            [id]
        );
        const user = result.rows[0];

        if (!user) {
            throw new Error("User not found");
        }

        delete user.password;
        return user;
    }

    async getAll() {
        const result = await DB.query(`SELECT id,name,email,role FROM users`);
        return result.rows;
    }
}