const express = require("express");

const {
  getMyPayments,
  getAllPayments,
  markAsPaid
} = require("../controllers/paymentController");

const { authenticateUser } = require("../middlewares/authMiddleware");
const { authorizeRoles } = require("../middlewares/roleMiddleware");

const router = express.Router();

router.get(
  "/my-payments",
  authenticateUser,
  authorizeRoles("Athlete"),
  getMyPayments
);

router.get(
  "/",
  authenticateUser,
  authorizeRoles("Admin"),
  getAllPayments
);

router.patch(
  "/:paymentId/paid",
  authenticateUser,
  authorizeRoles("Admin"),
  markAsPaid
);

module.exports = router;