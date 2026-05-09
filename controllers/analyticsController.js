const Analytics = require("../models/analyticsModel");

exports.getAdminAnalytics = async (req, res) => {
  try {
    const summary = await Analytics.getSummaryStats();
    const popularCourts = await Analytics.getPopularCourts();
    const recentBookings = await Analytics.getRecentBookings();

    return res.status(200).json({
      success: true,
      summary,
      popularCourts,
      recentBookings
    });
  } catch (error) {
    console.error("Analytics Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};