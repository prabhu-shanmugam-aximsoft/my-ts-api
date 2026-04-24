import { DB } from "../config/db";
import { IContactSubmission } from "../types/IContactSubmission";

export class ContactService {

  async create(contact: IContactSubmission) {
    const result = await DB.query(
      `INSERT INTO contact_submissions(full_name,email,message)
       VALUES($1,$2,$3) RETURNING *`,
      [contact.full_name, contact.email, contact.message]
    );
    return result.rows[0];
  }


  async getAll(limit = 50, offset = 0) {
    const result = await DB.query(
        `SELECT id, full_name, email, message
         FROM contact_submissions
         ORDER BY created_at DESC
         LIMIT $1 OFFSET $2`,
        [limit, offset]
    );
    return result.rows;
}
}