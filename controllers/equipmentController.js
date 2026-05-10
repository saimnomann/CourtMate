const Equipment = require("../models/equipmentModel");
const Payment = require("../models/paymentModel");
exports.createEquipment = async (req, res) => {
  try {
    const { equipmentName, category, totalQuantity, rentalPrice } = req.body;

    if (!equipmentName || !category || !totalQuantity || !rentalPrice) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    if (Number(totalQuantity) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Total quantity must be greater than 0"
      });
    }

    if (Number(rentalPrice) < 0) {
      return res.status(400).json({
        success: false,
        message: "Rental price cannot be negative"
      });
    }

   const rentalResult = await Equipment.rentEquipment(
  athleteId,
  equipmentId,
  quantity,
  rentalDate,
  totalAmount
);

await Payment.createPayment(
  athleteId,
  "Equipment Rental",
  rentalResult.insertId,
  totalAmount
);

    return res.status(201).json({
      success: true,
      message: "Equipment added successfully"
    });

  } catch (error) {
    console.error("Create Equipment Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

exports.getAllEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.getAllEquipment();

    return res.status(200).json({
      success: true,
      equipment
    });

  } catch (error) {
    console.error("Get Equipment Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

exports.deleteEquipment = async (req, res) => {
  try {
    const { id } = req.params;

    const equipment = await Equipment.getEquipmentById(id);

    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: "Equipment not found"
      });
    }

    await Equipment.deleteEquipment(id);

    return res.status(200).json({
      success: true,
      message: "Equipment deleted successfully"
    });

  } catch (error) {
    console.error("Delete Equipment Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

exports.rentEquipment = async (req, res) => {
  try {
    const athleteId = req.user.id;
    const { equipmentId, quantity, rentalDate } = req.body;

    if (!equipmentId || !quantity || !rentalDate) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    if (Number(quantity) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be greater than 0"
      });
    }

    const today = new Date().toISOString().split("T")[0];

    if (rentalDate < today) {
      return res.status(400).json({
        success: false,
        message: "Rental date cannot be in the past"
      });
    }

    const equipment = await Equipment.getEquipmentById(equipmentId);

    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: "Equipment not found"
      });
    }

    if (equipment.status !== "Available") {
      return res.status(400).json({
        success: false,
        message: "Equipment is not available"
      });
    }

    if (Number(quantity) > Number(equipment.available_quantity)) {
      return res.status(400).json({
        success: false,
        message: "Requested quantity is not available"
      });
    }

    const totalAmount = Number(equipment.rental_price) * Number(quantity);

    await Equipment.rentEquipment(
      athleteId,
      equipmentId,
      quantity,
      rentalDate,
      totalAmount
    );

    await Equipment.decreaseAvailableQuantity(equipmentId, quantity);

    return res.status(201).json({
      success: true,
      message: "Equipment rented successfully"
    });

  } catch (error) {
    console.error("Rent Equipment Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

exports.getMyRentals = async (req, res) => {
  try {
    const athleteId = req.user.id;

    const rentals = await Equipment.getMyRentals(athleteId);

    return res.status(200).json({
      success: true,
      rentals
    });

  } catch (error) {
    console.error("Get My Rentals Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

exports.returnEquipment = async (req, res) => {
  try {
    const athleteId = req.user.id;
    const { rentalId } = req.params;

    const rental = await Equipment.getRentalById(rentalId);

    if (!rental) {
      return res.status(404).json({
        success: false,
        message: "Rental record not found"
      });
    }

    if (Number(rental.athlete_id) !== Number(athleteId)) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to return this rental"
      });
    }

    if (rental.status === "Returned") {
      return res.status(400).json({
        success: false,
        message: "Equipment is already returned"
      });
    }

    await Equipment.returnEquipment(rentalId);

    await Equipment.increaseAvailableQuantity(
      rental.equipment_id,
      rental.quantity
    );

    return res.status(200).json({
      success: true,
      message: "Equipment returned successfully"
    });

  } catch (error) {
    console.error("Return Equipment Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
exports.getAllRentals = async (req, res) => {
  try {
    const rentals = await Equipment.getAllRentals();

    return res.status(200).json({
      success: true,
      rentals
    });
  } catch (error) {
    console.error("Get All Rentals Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};