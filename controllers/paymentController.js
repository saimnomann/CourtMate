const Payment = require("../models/paymentModel");

exports.getMyPayments = async (req, res) => {
  try {
    const userId = req.user.id;

    const payments = await Payment.getMyPayments(userId);

    return res.status(200).json({
      success: true,
      payments
    });
  } catch (error) {
    console.error("Get My Payments Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.getAllPayments();

    return res.status(200).json({
      success: true,
      payments
    });
  } catch (error) {
    console.error("Get All Payments Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

exports.markAsPaid = async (req, res) => {
  try {
    const { paymentId } = req.params;

    await Payment.markAsPaid(paymentId);

    return res.status(200).json({
      success: true,
      message: "Payment marked as paid"
    });
  } catch (error) {
    console.error("Mark Payment Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};