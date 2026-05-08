const db = require("../config/db");

const User = {
  async createUser(full_name, email, hashedPassword, role) {
    const sql = `
      INSERT INTO users (full_name, email, password, role)
      VALUES (?, ?, ?, ?)
    `;

    const [result] = await db.execute(sql, [
      full_name,
      email,
      hashedPassword,
      role
    ]);

    return result;
  },

  async findByEmail(email) {
    const sql = `SELECT * FROM users WHERE email = ?`;

    const [rows] = await db.execute(sql, [email]);

    return rows[0];
  },

  async findById(id) {
    const sql = `
      SELECT id, full_name, email, role, created_at
      FROM users
      WHERE id = ?
    `;

    const [rows] = await db.execute(sql, [id]);

    return rows[0];
  }
};

module.exports = User;