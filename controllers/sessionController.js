const Session = require("../models/sessionModel");

exports.createSession = async (req, res) => {
  try {
    const coachId = req.user.id;

    const {
      courtId,
      title,
      description,
      sessionDate,
      startTime,
      durationHours,
      maxAthletes
    } = req.body;

    if (!courtId || !title || !sessionDate || !startTime || !durationHours || !maxAthletes) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing"
      });
    }

    if (Number(durationHours) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Duration must be greater than 0"
      });
    }

    if (Number(maxAthletes) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Max athletes must be greater than 0"
      });
    }

    const today = new Date().toISOString().split("T")[0];

    if (sessionDate < today) {
      return res.status(400).json({
        success: false,
        message: "Past dates are not allowed"
      });
    }

    await Session.createSession(
      coachId,
      courtId,
      title,
      description,
      sessionDate,
      startTime,
      durationHours,
      maxAthletes
    );

    return res.status(201).json({
      success: true,
      message: "Training session created successfully"
    });

  } catch (error) {
    console.error("Create Session Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

exports.getAllActiveSessions = async (req, res) => {
  try {
    const sessions = await Session.getAllActiveSessions();

    return res.status(200).json({
      success: true,
      sessions
    });

  } catch (error) {
    console.error("Get Active Sessions Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

exports.getCoachSessions = async (req, res) => {
  try {
    const coachId = req.user.id;

    const sessions = await Session.getCoachSessions(coachId);

    return res.status(200).json({
      success: true,
      sessions
    });

  } catch (error) {
    console.error("Get Coach Sessions Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

exports.enrollInSession = async (req, res) => {
  try {
    const athleteId = req.user.id;
    const { sessionId } = req.params;

    const session = await Session.getSessionById(sessionId);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found"
      });
    }

    if (session.status !== "Active") {
      return res.status(400).json({
        success: false,
        message: "This session is not active"
      });
    }

    const enrolledCount = await Session.getEnrollmentCount(sessionId);

    if (Number(enrolledCount) >= Number(session.max_athletes)) {
      return res.status(400).json({
        success: false,
        message: "Session is already full"
      });
    }

    await Session.enrollAthlete(sessionId, athleteId);

    return res.status(201).json({
      success: true,
      message: "You have enrolled in the session successfully"
    });

  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "You are already enrolled in this session"
      });
    }

    console.error("Enroll Session Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

exports.getMyEnrolledSessions = async (req, res) => {
  try {
    const athleteId = req.user.id;

    const sessions = await Session.getMyEnrolledSessions(athleteId);

    return res.status(200).json({
      success: true,
      sessions
    });

  } catch (error) {
    console.error("Get My Enrolled Sessions Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

exports.cancelSession = async (req, res) => {
  try {
    const coachId = req.user.id;
    const { sessionId } = req.params;

    const result = await Session.cancelSession(sessionId, coachId);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Session not found or you are not allowed to cancel it"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Session cancelled successfully"
    });

  } catch (error) {
    console.error("Cancel Session Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
exports.getAllSessionsForAdmin = async (req, res) => {
  try {
    const sessions = await Session.getAllSessionsForAdmin();

    return res.status(200).json({
      success: true,
      sessions
    });

  } catch (error) {
    console.error("Admin Get Sessions Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

exports.adminCancelSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const result = await Session.adminCancelSession(sessionId);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Session not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Session cancelled successfully"
    });

  } catch (error) {
    console.error("Admin Cancel Session Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};