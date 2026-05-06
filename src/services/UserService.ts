import { DB } from "../config/db";
import { IUser } from "../types/IUser";
import { HashUtil } from "../utils/hash";


export class UserService {

  async create(user: IUser) {
    user.password = await HashUtil.hash(user.password);

    const result = await DB.query(
      `SELECT * FROM create_user($1,$2,$3,$4)`,
      [user.name, user.email, user.password, user.role || "user"]
    );

    return result.rows[0];
  }

  async update(id: number, data: Partial<IUser>) {
    let password = data.password;

    if (password) {
      password = await HashUtil.hash(password);
    }

    const result = await DB.query(
      `SELECT * FROM update_user($1,$2,$3,$4,$5)`,
      [
        id,
        data.name ?? null,
        data.email ?? null,
        password ?? null,
        data.role ?? null
      ]
    );

    if (result.rows.length === 0) {
      throw new Error("User not found");
    }

    return result.rows[0];
  }

  async delete(id: number) {
    const result = await DB.query(
      `SELECT * FROM delete_user($1)`,
      [id]
    );

    if (result.rows.length === 0) {
      throw new Error("User not found");
    }

    return result.rows[0];
  }

  async findByEmail(email: string) {
    const result = await DB.query(
      `SELECT * FROM find_user_by_email($1)`,
      [email]
    );

    return result.rows[0] || null;
  }

  async findByID(id: number) {
    const result = await DB.query(
      `SELECT * FROM find_user_by_id($1)`,
      [id]
    );

    if (!result.rows[0]) {
      throw new Error("User not found");
    }

    return result.rows[0];
  }

  async getAll() {
    const result = await DB.query(`SELECT * FROM get_all_users()`);
    return result.rows;
  }
}