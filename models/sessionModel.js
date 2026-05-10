const db = require("../config/db");

const Session = {
  async createSession(coachId, courtId, title, description, sessionDate, startTime, durationHours, maxAthletes) {
    const sql = `
      INSERT INTO training_sessions
      (coach_id, court_id, title, description, session_date, start_time, duration_hours, max_athletes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.execute(sql, [
      coachId,
      courtId,
      title,
      description,
      sessionDate,
      startTime,
      durationHours,
      maxAthletes
    ]);

    return result;
  },

  async getAllActiveSessions() {
    const sql = `
      SELECT 
        training_sessions.*,
        users.full_name AS coach_name,
        courts.court_name,
        courts.court_type,
        courts.location,
        COUNT(session_enrollments.id) AS enrolled_count
      FROM training_sessions
      JOIN users ON training_sessions.coach_id = users.id
      JOIN courts ON training_sessions.court_id = courts.id
      LEFT JOIN session_enrollments 
        ON training_sessions.id = session_enrollments.session_id
      WHERE training_sessions.status = 'Active'
      GROUP BY training_sessions.id
      ORDER BY training_sessions.session_date ASC, training_sessions.start_time ASC
    `;

    const [rows] = await db.execute(sql);
    return rows;
  },

async getCoachSessions(coachId) {
  const sql = `
    SELECT 
      training_sessions.*,
      courts.court_name,
      courts.court_type,
      courts.location,
      COUNT(session_enrollments.id) AS enrolled_count
    FROM training_sessions
    JOIN courts ON training_sessions.court_id = courts.id
    LEFT JOIN session_enrollments 
      ON training_sessions.id = session_enrollments.session_id
    WHERE training_sessions.coach_id = ?
    AND training_sessions.status != 'Cancelled'
    GROUP BY training_sessions.id
    ORDER BY training_sessions.session_date DESC, training_sessions.start_time DESC
  `;

  const [rows] = await db.execute(sql, [coachId]);
  return rows;
},

  async getSessionById(sessionId) {
    const sql = `
      SELECT *
      FROM training_sessions
      WHERE id = ?
    `;

    const [rows] = await db.execute(sql, [sessionId]);
    return rows[0];
  },

  async getEnrollmentCount(sessionId) {
    const sql = `
      SELECT COUNT(*) AS count
      FROM session_enrollments
      WHERE session_id = ?
    `;

    const [rows] = await db.execute(sql, [sessionId]);
    return rows[0].count;
  },

  async enrollAthlete(sessionId, athleteId) {
    const sql = `
      INSERT INTO session_enrollments
      (session_id, athlete_id)
      VALUES (?, ?)
    `;

    const [result] = await db.execute(sql, [sessionId, athleteId]);
    return result;
  },

  async getMyEnrolledSessions(athleteId) {
    const sql = `
      SELECT 
        training_sessions.*,
        users.full_name AS coach_name,
        courts.court_name,
        courts.court_type,
        courts.location
      FROM session_enrollments
      JOIN training_sessions 
        ON session_enrollments.session_id = training_sessions.id
      JOIN users 
        ON training_sessions.coach_id = users.id
      JOIN courts 
        ON training_sessions.court_id = courts.id
      WHERE session_enrollments.athlete_id = ?
      ORDER BY training_sessions.session_date DESC, training_sessions.start_time DESC
    `;

    const [rows] = await db.execute(sql, [athleteId]);
    return rows;
  },

  async cancelSession(sessionId, coachId) {
    const sql = `
      UPDATE training_sessions
      SET status = 'Cancelled'
      WHERE id = ?
      AND coach_id = ?
    `;

    const [result] = await db.execute(sql, [sessionId, coachId]);
    return result;
  },
  async getAllSessionsForAdmin() {
  const sql = `
    SELECT 
      training_sessions.*,
      users.full_name AS coach_name,
      users.email AS coach_email,
      courts.court_name,
      courts.court_type,
      courts.location,
      COUNT(session_enrollments.id) AS enrolled_count
    FROM training_sessions
    JOIN users ON training_sessions.coach_id = users.id
    JOIN courts ON training_sessions.court_id = courts.id
    LEFT JOIN session_enrollments 
      ON training_sessions.id = session_enrollments.session_id
    GROUP BY training_sessions.id
    ORDER BY training_sessions.session_date DESC, training_sessions.start_time DESC
  `;

  const [rows] = await db.execute(sql);
  return rows;
},

async adminCancelSession(sessionId) {
  const sql = `
    UPDATE training_sessions
    SET status = 'Cancelled'
    WHERE id = ?
  `;

  const [result] = await db.execute(sql, [sessionId]);
  return result;
},
};

module.exports = Session;