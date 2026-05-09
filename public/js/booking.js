const courtSelect = document.getElementById("courtId");
const startTimeSelect = document.getElementById("startTime");
const bookingDateInput = document.getElementById("bookingDate");
const durationHoursInput = document.getElementById("durationHours");
const checkSlotsBtn = document.getElementById("checkSlotsBtn");
const bookingForm = document.getElementById("bookingForm");
const bookingsContainer = document.getElementById("bookingsContainer");
const slotMessage = document.getElementById("slotMessage");

let availableCourtsData = [];

function showSlotMessage(type, message) {
  console.log(`Message (${type}):`, message);
  slotMessage.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  `;
}

checkSlotsBtn.addEventListener("click", async () => {
  const bookingDate = bookingDateInput.value;
  const durationHours = durationHoursInput.value;

  courtSelect.innerHTML = `<option value="">Loading...</option>`;
  startTimeSelect.innerHTML = `<option value="">Select court first</option>`;
  slotMessage.innerHTML = "";

  if (!bookingDate || !durationHours) {
    showSlotMessage("warning", "Please select date and duration first.");
    return;
  }

  if (Number(durationHours) <= 0) {
    showSlotMessage("danger", "Duration must be greater than 0.");
    return;
  }

  try {
    const response = await fetch(
      `/api/bookings/available-slots?bookingDate=${bookingDate}&durationHours=${durationHours}`,
      {
        credentials: "include"
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      showSlotMessage("danger", errorData.message || "Failed to check available slots. Please try again.");
      courtSelect.innerHTML = `<option value="">Error loading courts</option>`;
      startTimeSelect.innerHTML = `<option value="">Error loading slots</option>`;
      return;
    }

    const data = await response.json();

    if (!data.success) {
      showSlotMessage("danger", data.message || "Could not fetch available slots.");
      courtSelect.innerHTML = `<option value="">No courts available</option>`;
      startTimeSelect.innerHTML = `<option value="">No slots available</option>`;
      return;
    }

    availableCourtsData = data.availableCourts || [];

    if (availableCourtsData.length === 0) {
      showSlotMessage("info", "No courts available for the selected date and duration.");
      courtSelect.innerHTML = `<option value="">No courts available</option>`;
      startTimeSelect.innerHTML = `<option value="">No slots available</option>`;
      return;
    }

    courtSelect.innerHTML = `<option value="">Select court</option>`;

    availableCourtsData.forEach((court) => {
      courtSelect.innerHTML += `
        <option value="${court.id}">
          ${court.court_name} - ${court.court_type} - Rs. ${court.hourly_rate}/hr
        </option>
      `;
    });

    showSlotMessage("success", "Available courts found! Please select a court and time slot.");

  } catch (error) {
    console.error("Check Slots Error:", error);
    showSlotMessage("danger", "Something went wrong while checking slots. Please try again.");
  }
});

courtSelect.addEventListener("change", () => {
  const selectedCourtId = Number(courtSelect.value);

  startTimeSelect.innerHTML = `<option value="">Select time</option>`;

  if (!selectedCourtId || selectedCourtId === 0) {
    console.log("No court selected");
    return;
  }

  const selectedCourt = availableCourtsData.find(
    (court) => court.id === selectedCourtId
  );

  if (!selectedCourt) {
    console.log("Court not found in availableCourtsData");
    showSlotMessage("danger", "Selected court not found. Please try checking slots again.");
    return;
  }

  if (!selectedCourt.availableSlots || selectedCourt.availableSlots.length === 0) {
    showSlotMessage("warning", "No available time slots for this court on the selected date.");
    return;
  }

  selectedCourt.availableSlots.forEach((slot) => {
    // Format time from HH:00:00 to HH:00 for better display
    const timeDisplay = slot.substring(0, 5);
    startTimeSelect.innerHTML += `
      <option value="${slot}">
        ${timeDisplay}
      </option>
    `;
  });

  console.log(`Loaded ${selectedCourt.availableSlots.length} time slots for court ${selectedCourtId}`);
});

bookingForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const courtId = courtSelect.value;
  const bookingDate = bookingDateInput.value;
  const startTime = startTimeSelect.value;
  const durationHours = durationHoursInput.value;

  if (!courtId || !bookingDate || !startTime || !durationHours) {
    showSlotMessage("warning", "All fields are required. Please select all options.");
    return;
  }

  if (Number(durationHours) <= 0) {
    showSlotMessage("danger", "Duration must be greater than 0.");
    return;
  }

  console.log("Submitting booking:", { courtId, bookingDate, startTime, durationHours });

  try {
    const response = await fetch("/api/bookings", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        courtId: Number(courtId),
        bookingDate,
        startTime,
        durationHours: Number(durationHours)
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      showSlotMessage("danger", errorData.message || "Failed to create booking. Please try again.");
      console.error("Booking error response:", errorData);
      return;
    }

    const data = await response.json();

    if (!data.success) {
      showSlotMessage("danger", data.message || "Could not create booking.");
      console.error("Booking error:", data);
      return;
    }

    showSlotMessage("success", data.message || "Booking created successfully!");

    bookingForm.reset();
    courtSelect.innerHTML = `<option value="">Check slots first</option>`;
    startTimeSelect.innerHTML = `<option value="">Check slots first</option>`;

    await loadMyBookings();

  } catch (error) {
    console.error("Create Booking Error:", error);
    showSlotMessage("danger", "Something went wrong while creating booking. Please try again.");
  }
});

async function loadMyBookings() {
  try {
    const response = await fetch("/api/bookings/my-bookings", {
      credentials: "include"
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      bookingsContainer.innerHTML = `
        <div class="alert alert-danger">Failed to load bookings: ${errorData.message || 'Unknown error'}</div>
      `;
      console.error("Load bookings error:", errorData);
      return;
    }

    const data = await response.json();

    if (!data.success) {
      bookingsContainer.innerHTML = `
        <div class="alert alert-danger">${data.message || 'Failed to load bookings'}</div>
      `;
      console.error("Bookings error:", data);
      return;
    }

    if (!data.bookings || data.bookings.length === 0) {
      bookingsContainer.innerHTML = `
        <div class="alert alert-info">No bookings found. Start by checking available slots!</div>
      `;
      return;
    }

    bookingsContainer.innerHTML = "";

    data.bookings.forEach((booking) => {
      const timeDisplay = booking.start_time.substring(0, 5);
      bookingsContainer.innerHTML += `
        <div class="card mb-3 border-0 shadow-sm">
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <h5>${booking.court_name}</h5>
              <span class="badge ${
  booking.status === "Confirmed"
    ? "status-confirmed"
    : "status-cancelled"
}">
  ${booking.status}
</span>
            </div>

            <p class="mb-1"><strong>Type:</strong> ${booking.court_type}</p>
            <p class="mb-1"><strong>Location:</strong> ${booking.location}</p>
            <p class="mb-1">
            <strong>Date:</strong>
            ${new Date(booking.booking_date).toLocaleDateString()}
            </p>
            <p class="mb-1"><strong>Start:</strong> ${timeDisplay}</p>
            <p class="mb-1"><strong>Duration:</strong> ${booking.duration_hours} hour(s)</p>
            <p class="mb-3"><strong>Total:</strong> Rs. ${booking.total_amount}</p>

            ${
              booking.status !== "Cancelled"
                ? `<button class="btn btn-outline-danger btn-sm" onclick="cancelBooking(${booking.id})">Cancel</button>`
                : ""
            }
          </div>
        </div>
      `;
    });

    console.log(`Loaded ${data.bookings.length} bookings`);

  } catch (error) {
    console.error("Load My Bookings Error:", error);
    bookingsContainer.innerHTML = `
      <div class="alert alert-danger">Error loading bookings. Please refresh the page.</div>
    `;
  }
}

async function cancelBooking(id) {
  const confirmCancel = confirm("Are you sure you want to cancel this booking?");

  if (!confirmCancel) return;

  try {
    const response = await fetch(`/api/bookings/${id}/cancel`, {
      method: "PATCH",
      credentials: "include"
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      alert(errorData.message || "Failed to cancel booking. Please try again.");
      console.error("Cancel error:", errorData);
      return;
    }

    const data = await response.json();

    if (!data.success) {
      alert(data.message || "Could not cancel booking.");
      console.error("Cancel error:", data);
      return;
    }

    alert(data.message || "Booking cancelled successfully!");
    await loadMyBookings();

  } catch (error) {
    console.error("Cancel Booking Error:", error);
    alert("Error cancelling booking. Please try again.");
  }
}

loadMyBookings();