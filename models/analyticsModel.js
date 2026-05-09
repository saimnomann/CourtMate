const db = require("../config/db");

const Analytics = {
  async getSummaryStats() {
    const [[users]] = await db.execute(`
      SELECT COUNT(*) AS totalUsers FROM users
    `);

    const [[courts]] = await db.execute(`
      SELECT COUNT(*) AS totalCourts FROM courts
    `);

    const [[bookings]] = await db.execute(`
      SELECT COUNT(*) AS totalBookings
      FROM bookings
      WHERE status != 'Cancelled'
    `);

    const [[revenue]] = await db.execute(`
      SELECT COALESCE(SUM(total_amount), 0) AS totalRevenue
      FROM bookings
      WHERE status != 'Cancelled'
    `);

    const [[sessions]] = await db.execute(`
      SELECT COUNT(*) AS activeSessions
      FROM training_sessions
      WHERE status = 'Active'
    `);

    return {
      totalUsers: users.totalUsers,
      totalCourts: courts.totalCourts,
      totalBookings: bookings.totalBookings,
      totalRevenue: revenue.totalRevenue,
      activeSessions: sessions.activeSessions
    };
  },

  async getPopularCourts() {
    const sql = `
      SELECT 
        courts.court_name,
        COUNT(bookings.id) AS bookingCount
      FROM courts
      LEFT JOIN bookings 
        ON courts.id = bookings.court_id
        AND bookings.status != 'Cancelled'
      GROUP BY courts.id
      ORDER BY bookingCount DESC
      LIMIT 5
    `;

    const [rows] = await db.execute(sql);
    return rows;
  },

  async getRecentBookings() {
    const sql = `
      SELECT 
        bookings.id,
        bookings.booking_date,
        bookings.start_time,
        bookings.total_amount,
        users.full_name,
        courts.court_name
      FROM bookings
      JOIN users ON bookings.user_id = users.id
      JOIN courts ON bookings.court_id = courts.id
      WHERE bookings.status != 'Cancelled'
      ORDER BY bookings.created_at DESC
      LIMIT 5
    `;

    const [rows] = await db.execute(sql);
    return rows;
  }
};

module.exports = Analytics;