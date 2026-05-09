const db = require("../config/db");

const Booking = {
  async getCourtById(courtId) {
    const sql = `
      SELECT *
      FROM courts
      WHERE id = ?
    `;

    const [rows] = await db.execute(sql, [courtId]);
    return rows[0];
  },

 async getAvailableCourts() {
  const sql = `
    SELECT *
    FROM courts
    WHERE status = 'Available'
    ORDER BY court_name ASC
  `;

  const [rows] = await db.execute(sql);
  return rows;
},

async getBookingsByCourtAndDate(courtId, bookingDate) {
  const sql = `
    SELECT *
    FROM bookings
    WHERE court_id = ?
    AND booking_date = ?
    AND status != 'Cancelled'
  `;

  const [rows] = await db.execute(sql, [courtId, bookingDate]);
  return rows;
},

  async checkBookingConflict(courtId, bookingDate, startTime, durationHours) {
    const sql = `
      SELECT *
      FROM bookings
      WHERE court_id = ?
      AND booking_date = ?
      AND status != 'Cancelled'
      AND (
        TIME(?) < ADDTIME(start_time, SEC_TO_TIME(duration_hours * 3600))
        AND ADDTIME(TIME(?), SEC_TO_TIME(? * 3600)) > start_time
      )
    `;

    const [rows] = await db.execute(sql, [
      courtId,
      bookingDate,
      startTime,
      startTime,
      Number(durationHours)
    ]);

    return rows;
  },

  async createBooking(userId, courtId, bookingDate, startTime, durationHours, totalAmount) {
    const sql = `
      INSERT INTO bookings
      (user_id, court_id, booking_date, start_time, duration_hours, total_amount, status)
      VALUES (?, ?, ?, ?, ?, ?, 'Confirmed')
    `;

    const [result] = await db.execute(sql, [
      userId,
      courtId,
      bookingDate,
      startTime,
      Number(durationHours),
      totalAmount
    ]);

    return result;
  },

async getMyBookings(userId) {
  const sql = `
    SELECT 
      bookings.id,
      bookings.booking_date,
      bookings.start_time,
      bookings.duration_hours,
      bookings.total_amount,
      bookings.status,
      courts.court_name,
      courts.court_type,
      courts.location
    FROM bookings
    JOIN courts ON bookings.court_id = courts.id
    WHERE bookings.user_id = ?
    AND bookings.status != 'Cancelled'
    ORDER BY bookings.booking_date DESC, bookings.start_time DESC
  `;

  const [rows] = await db.execute(sql, [userId]);
  return rows;
},

  async getAllBookings() {
    const sql = `
      SELECT 
        bookings.id,
        bookings.booking_date,
        bookings.start_time,
        bookings.duration_hours,
        bookings.total_amount,
        bookings.status,
        users.full_name,
        users.email,
        courts.court_name,
        courts.court_type,
        courts.location
      FROM bookings
      JOIN users ON bookings.user_id = users.id
      JOIN courts ON bookings.court_id = courts.id
      ORDER BY bookings.booking_date DESC, bookings.start_time DESC
    `;

    const [rows] = await db.execute(sql);
    return rows;
  },

  async cancelBooking(id) {
    const sql = `
      UPDATE bookings
      SET status = 'Cancelled'
      WHERE id = ?
    `;

    const [result] = await db.execute(sql, [id]);
    return result;
  }
};

module.exports = Booking;