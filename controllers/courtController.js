const Court = require("../models/courtModel");

exports.createCourt = async (req, res) => {
  try {
    const { courtName, courtType, location, hourlyRate, status } = req.body;

    if (!courtName || !courtType || !location || !hourlyRate || !status) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    await Court.createCourt(courtName, courtType, location, hourlyRate, status);

    return res.status(201).json({
      success: true,
      message: "Court created successfully"
    });
  } catch (error) {
    console.error("Create Court Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

exports.getAllCourts = async (req, res) => {
  try {
    const courts = await Court.getAllCourts();

    return res.status(200).json({
      success: true,
      courts
    });
  } catch (error) {
    console.error("Get Courts Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

exports.getCourtById = async (req, res) => {
  try {
    const { id } = req.params;

    const court = await Court.getCourtById(id);

    if (!court) {
      return res.status(404).json({
        success: false,
        message: "Court not found"
      });
    }

    return res.status(200).json({
      success: true,
      court
    });
  } catch (error) {
    console.error("Get Court Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

exports.updateCourt = async (req, res) => {
  try {
    const { id } = req.params;
    const { courtName, courtType, location, hourlyRate, status } = req.body;

    if (!courtName || !courtType || !location || !hourlyRate || !status) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const court = await Court.getCourtById(id);

    if (!court) {
      return res.status(404).json({
        success: false,
        message: "Court not found"
      });
    }

    await Court.updateCourt(id, courtName, courtType, location, hourlyRate, status);

    return res.status(200).json({
      success: true,
      message: "Court updated successfully"
    });
  } catch (error) {
    console.error("Update Court Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

exports.deleteCourt = async (req, res) => {
  try {
    const { id } = req.params;

    const court = await Court.getCourtById(id);

    if (!court) {
      return res.status(404).json({
        success: false,
        message: "Court not found"
      });
    }

    await Court.deleteCourt(id);

    return res.status(200).json({
      success: true,
      message: "Court deleted successfully"
    });
  } catch (error) {
    console.error("Delete Court Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};