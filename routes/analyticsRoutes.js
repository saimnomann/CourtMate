const express = require("express");
const { getAdminAnalytics } = require("../controllers/analyticsController");
const { authenticateUser } = require("../middlewares/authMiddleware");
const { authorizeRoles } = require("../middlewares/roleMiddleware");

const router = express.Router();

router.get(
  "/admin",
  authenticateUser,
  authorizeRoles("Admin"),
  getAdminAnalytics
);

module.exports = router;