const express = require("express");

const {
  createEquipment,
  getAllEquipment,
  deleteEquipment,
  rentEquipment,
  getMyRentals,
  returnEquipment,
  getAllRentals
} = require("../controllers/equipmentController");

const { authenticateUser } = require("../middlewares/authMiddleware");
const { authorizeRoles } = require("../middlewares/roleMiddleware");

const router = express.Router();

router.post(
  "/",
  authenticateUser,
  authorizeRoles("Admin"),
  createEquipment
);

router.get(
  "/",
  authenticateUser,
  getAllEquipment
);

router.post(
  "/rent",
  authenticateUser,
  authorizeRoles("Athlete"),
  rentEquipment
);

router.get(
  "/my-rentals",
  authenticateUser,
  authorizeRoles("Athlete"),
  getMyRentals
);

router.get(
  "/rentals/all",
  authenticateUser,
  authorizeRoles("Admin"),
  getAllRentals
);

router.patch(
  "/rentals/:rentalId/return",
  authenticateUser,
  authorizeRoles("Athlete"),
  returnEquipment
);

router.delete(
  "/:id",
  authenticateUser,
  authorizeRoles("Admin"),
  deleteEquipment
);

module.exports = router;