const db = require("../config/db");

const Payment = {
  async createPayment(userId, paymentType, referenceId, amount) {
    const sql = `
      INSERT INTO payments
      (user_id, payment_type, reference_id, amount)
      VALUES (?, ?, ?, ?)
    `;

    const [result] = await db.execute(sql, [
      userId,
      paymentType,
      referenceId,
      amount
    ]);

    return result;
  },

  async getMyPayments(userId) {
    const sql = `
      SELECT 
        payments.*,
        bookings.status AS booking_status
      FROM payments
      LEFT JOIN bookings ON payments.reference_id = bookings.id
      WHERE payments.user_id = ?
        AND (
          bookings.id IS NULL 
          OR LOWER(bookings.status) != 'cancelled'
        )
      ORDER BY payments.payment_date DESC
    `;

    const [rows] = await db.execute(sql, [userId]);
    return rows;
  },

  async getAllPayments() {
    const sql = `
      SELECT 
        payments.*,
        users.full_name,
        users.email,
        bookings.status AS booking_status
      FROM payments
      JOIN users ON payments.user_id = users.id
      LEFT JOIN bookings ON payments.reference_id = bookings.id
      WHERE bookings.id IS NULL 
         OR LOWER(bookings.status) != 'cancelled'
      ORDER BY payments.payment_date DESC
    `;

    const [rows] = await db.execute(sql);
    return rows;
  },

  async markAsPaid(paymentId) {
    const sql = `
      UPDATE payments
      SET status = 'Paid'
      WHERE id = ?
    `;

    const [result] = await db.execute(sql, [paymentId]);
    return result;
  }
};

module.exports = Payment;