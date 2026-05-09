const db = require("../config/db");

const Court = {
  async createCourt(courtName, courtType, location, hourlyRate, status) {
    const sql = `
      INSERT INTO courts 
      (court_name, court_type, location, hourly_rate, status)
      VALUES (?, ?, ?, ?, ?)
    `;

    const [result] = await db.execute(sql, [
      courtName,
      courtType,
      location,
      hourlyRate,
      status
    ]);

    return result;
  },

  async getAllCourts() {
    const sql = `
      SELECT * FROM courts
      ORDER BY created_at DESC
    `;

    const [rows] = await db.execute(sql);

    return rows;
  },

  async getCourtById(id) {
    const sql = `
      SELECT * FROM courts
      WHERE id = ?
    `;

    const [rows] = await db.execute(sql, [id]);

    return rows[0];
  },

  async updateCourt(id, courtName, courtType, location, hourlyRate, status) {
    const sql = `
      UPDATE courts
      SET court_name = ?, court_type = ?, location = ?, hourly_rate = ?, status = ?
      WHERE id = ?
    `;

    const [result] = await db.execute(sql, [
      courtName,
      courtType,
      location,
      hourlyRate,
      status,
      id
    ]);

    return result;
  },

  async deleteCourt(id) {
    const sql = `
      DELETE FROM courts
      WHERE id = ?
    `;

    const [result] = await db.execute(sql, [id]);

    return result;
  }
};

module.exports = Court;