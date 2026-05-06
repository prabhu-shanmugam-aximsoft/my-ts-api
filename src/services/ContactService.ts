import { DB } from "../config/db";
import { IContactSubmission } from "../types/IContactSubmission";

export class ContactService {

  async create(contact: IContactSubmission) {
    const result = await DB.query(
      `SELECT * FROM create_contact($1, $2, $3)`,
      [contact.full_name, contact.email, contact.message]
    );
    return result.rows[0];
  }

  async getAll(limit = 50, offset = 0) {
    const result = await DB.query(
      `SELECT * FROM get_all_contacts($1, $2)`,
      [limit, offset]
    );
    return result.rows;
  }

  async findById(id: number) {
    const result = await DB.query(
      `SELECT * FROM find_contact_by_id($1)`,
      [id]
    );

    if (result.rows.length === 0) {
      throw new Error("contact not found");
    }

    return result.rows[0];
  }

  async delete(id: number) {
    const result = await DB.query(
      `SELECT * FROM delete_contact($1)`,
      [id]
    );

    if (result.rows.length === 0) {
      throw new Error("contact not found");
    }

    return result.rows[0];
  }
}