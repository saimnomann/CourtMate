const Booking = require("../models/bookingModel");
const Payment = require("../models/paymentModel");
exports.createBooking = async (req, res) => {
  try {
    const userId = req.user.id;
    const { courtId, bookingDate, startTime, durationHours } = req.body;

    if (!courtId || !bookingDate || !startTime || !durationHours) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const duration = Number(durationHours);

    if (duration <= 0) {
      return res.status(400).json({
        success: false,
        message: "Duration must be greater than 0"
      });
    }

    const today = new Date().toISOString().split("T")[0];

    if (bookingDate < today) {
      return res.status(400).json({
        success: false,
        message: "You cannot book a past date"
      });
    }

    const startHour = Number(startTime.split(":")[0]);

    if (startHour < 8 || startHour + duration > 22) {
      return res.status(400).json({
        success: false,
        message: "Booking must be between 08:00 AM and 10:00 PM"
      });
    }

    const court = await Booking.getCourtById(courtId);

    if (!court) {
      return res.status(404).json({
        success: false,
        message: "Court not found"
      });
    }

    if (court.status !== "Available") {
      return res.status(400).json({
        success: false,
        message: "Court is not available for booking"
      });
    }

    const conflicts = await Booking.checkBookingConflict(
      courtId,
      bookingDate,
      startTime,
      duration
    );

    if (conflicts.length > 0) {
      return res.status(409).json({
        success: false,
        message: "This court is already booked for the selected time"
      });
    }

    const totalAmount = Number(court.hourly_rate) * duration;

 const bookingResult = await Booking.createBooking(
  userId,
  courtId,
  bookingDate,
  startTime,
  durationHours,
  totalAmount
);

await Payment.createPayment(
  userId,
  "Court Booking",
  bookingResult.insertId,
  totalAmount
);

    return res.status(201).json({
      success: true,
      message: "Booking created successfully"
    });

  } catch (error) {
    console.error("Create Booking Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

exports.getAvailableSlots = async (req, res) => {
  try {
    const { bookingDate, durationHours } = req.query;

    if (!bookingDate || !durationHours) {
      return res.status(400).json({
        success: false,
        message: "Booking date and duration are required"
      });
    }

    if (Number(durationHours) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Duration must be greater than 0"
      });
    }

    const today = new Date().toISOString().split("T")[0];

    if (bookingDate < today) {
      return res.status(400).json({
        success: false,
        message: "Past dates are not allowed"
      });
    }

    const courts = await Booking.getAvailableCourts();

    const openingHour = 8;
    const closingHour = 22;

    const availableCourts = [];

    for (const court of courts) {
      const bookings = await Booking.getBookingsByCourtAndDate(
        court.id,
        bookingDate
      );

      const availableSlots = [];

      for (
        let hour = openingHour;
        hour + Number(durationHours) <= closingHour;
        hour++
      ) {
        const slotStart = `${String(hour).padStart(2, "0")}:00:00`;
        const slotEndHour = hour + Number(durationHours);
        const slotEnd = `${String(slotEndHour).padStart(2, "0")}:00:00`;

        let conflict = false;

        for (const booking of bookings) {
          const existingStart = booking.start_time;

          const existingStartHour = Number(existingStart.split(":")[0]);
          const existingEndHour =
            existingStartHour + Number(booking.duration_hours);

          const existingEnd = `${String(existingEndHour).padStart(2, "0")}:00:00`;

          if (slotStart < existingEnd && slotEnd > existingStart) {
            conflict = true;
            break;
          }
        }

        if (!conflict) {
          availableSlots.push(slotStart);
        }
      }

      if (availableSlots.length > 0) {
        availableCourts.push({
          id: court.id,
          court_name: court.court_name,
          court_type: court.court_type,
          location: court.location,
          hourly_rate: court.hourly_rate,
          availableSlots
        });
      }
    }

    return res.status(200).json({
      success: true,
      availableCourts
    });
  } catch (error) {
    console.error("Available Slots Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const userId = req.user.id;

    const bookings = await Booking.getMyBookings(userId);

    return res.status(200).json({
      success: true,
      bookings
    });

  } catch (error) {
    console.error("Get My Bookings Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.getAllBookings();

    return res.status(200).json({
      success: true,
      bookings
    });

  } catch (error) {
    console.error("Get All Bookings Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    await Booking.cancelBooking(id);

    return res.status(200).json({
      success: true,
      message: "Booking cancelled successfully"
    });

  } catch (error) {
    console.error("Cancel Booking Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};