const express = require("express");

const {
  createBooking,
  getMyBookings,
  getAllBookings,
  cancelBooking,
  getAvailableSlots
} = require("../controllers/bookingController");

const { authenticateUser } = require("../middlewares/authMiddleware");
const { authorizeRoles } = require("../middlewares/roleMiddleware");

const router = express.Router();

router.get(
  "/available-slots",
  authenticateUser,
  authorizeRoles("Athlete"),
  getAvailableSlots
);

router.post("/", authenticateUser, authorizeRoles("Athlete"), createBooking);

router.get("/my-bookings", authenticateUser, getMyBookings);

router.get("/", authenticateUser, authorizeRoles("Admin"), getAllBookings);

router.patch("/:id/cancel", authenticateUser, cancelBooking);

module.exports = router;