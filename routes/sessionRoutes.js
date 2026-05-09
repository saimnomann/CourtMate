const express = require("express");

const {
  createSession,
  getAllActiveSessions,
  getCoachSessions,
  enrollInSession,
  getMyEnrolledSessions,
  cancelSession,
  getAllSessionsForAdmin,
  adminCancelSession
} = require("../controllers/sessionController");

const { authenticateUser } = require("../middlewares/authMiddleware");
const { authorizeRoles } = require("../middlewares/roleMiddleware");

const router = express.Router();

router.post(
  "/",
  authenticateUser,
  authorizeRoles("Coach"),
  createSession
);

router.get(
  "/active",
  authenticateUser,
  authorizeRoles("Athlete"),
  getAllActiveSessions
);

router.get(
  "/coach/my-sessions",
  authenticateUser,
  authorizeRoles("Coach"),
  getCoachSessions
);

router.post(
  "/:sessionId/enroll",
  authenticateUser,
  authorizeRoles("Athlete"),
  enrollInSession
);

router.get(
  "/athlete/my-sessions",
  authenticateUser,
  authorizeRoles("Athlete"),
  getMyEnrolledSessions
);
router.get(
  "/admin/all",
  authenticateUser,
  authorizeRoles("Admin"),
  getAllSessionsForAdmin
);

router.patch(
  "/admin/:sessionId/cancel",
  authenticateUser,
  authorizeRoles("Admin"),
  adminCancelSession
);
router.patch(
  "/:sessionId/cancel",
  authenticateUser,
  authorizeRoles("Coach"),
  cancelSession
);


module.exports = router;