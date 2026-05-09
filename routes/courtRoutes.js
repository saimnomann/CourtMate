const express = require("express");

const {
  createCourt,
  getAllCourts,
  getCourtById,
  updateCourt,
  deleteCourt
} = require("../controllers/courtController");

const { authenticateUser } = require("../middlewares/authMiddleware");
const { authorizeRoles } = require("../middlewares/roleMiddleware");

const router = express.Router();

router.post("/", authenticateUser, authorizeRoles("Admin"), createCourt);

router.get("/", authenticateUser, getAllCourts);

router.get("/:id", authenticateUser, getCourtById);

router.put("/:id", authenticateUser, authorizeRoles("Admin"), updateCourt);

router.delete("/:id", authenticateUser, authorizeRoles("Admin"), deleteCourt);

module.exports = router;