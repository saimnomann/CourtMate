const express = require("express");
const path = require("path");
const { authenticateUser } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", authenticateUser, (req, res) => {
  res.redirect("/dashboard");
});
router.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/login.html"));
});

router.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/register.html"));
});

router.get("/dashboard", authenticateUser, (req, res) => {
  res.sendFile(path.join(__dirname, "../views/dashboard.html"));
});
router.get("/courts", authenticateUser, (req, res) => {
  res.sendFile(path.join(__dirname, "../views/courts.html"));
});
router.get("/bookings", authenticateUser, (req, res) => {
  res.sendFile(path.join(__dirname, "../views/bookings.html"));
});
router.get("/admin-bookings", authenticateUser, (req, res) => {
  res.sendFile(path.join(__dirname, "../views/admin-bookings.html"));
});
router.get("/coach-sessions", authenticateUser, (req, res) => {
  res.sendFile(path.join(__dirname, "../views/coach-sessions.html"));
});
router.get("/athlete-sessions", authenticateUser, (req, res) => {
  res.sendFile(path.join(__dirname, "../views/athlete-sessions.html"));
});
router.get("/admin-sessions", authenticateUser, (req, res) => {
  res.sendFile(path.join(__dirname, "../views/admin-sessions.html"));
});
router.get("/admin-analytics", authenticateUser, (req, res) => {
  res.sendFile(path.join(__dirname, "../views/admin-analytics.html"));
});
module.exports = router;