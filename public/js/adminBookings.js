const adminBookingsContainer = document.getElementById("adminBookingsContainer");

async function loadAllBookings() {
  try {
    const response = await fetch("/api/bookings", {
      credentials: "include"
    });

    const data = await response.json();

    if (!data.success) {
      adminBookingsContainer.innerHTML = `
        <div class="alert alert-danger">${data.message}</div>
      `;
      return;
    }

    const activeBookings = data.bookings.filter(
      (booking) => booking.status !== "Cancelled"
    );

    if (activeBookings.length === 0) {
      adminBookingsContainer.innerHTML = `
        <div class="alert alert-info mb-0">No active bookings found.</div>
      `;
      return;
    }

    adminBookingsContainer.innerHTML = "";

    activeBookings.forEach((booking) => {
      const bookingDate = new Date(booking.booking_date).toLocaleDateString();
      const startTime = booking.start_time.substring(0, 5);

      adminBookingsContainer.innerHTML += `
        <div class="card mb-3 border-0 shadow-sm booking-admin-card">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start flex-wrap gap-3">
              <div>
                <h5 class="fw-bold mb-2">${booking.court_name}</h5>

                <p class="mb-1">
                  <strong>Athlete:</strong> ${booking.full_name}
                </p>

                <p class="mb-1">
                  <strong>Email:</strong> ${booking.email}
                </p>

                <p class="mb-1">
                  <strong>Type:</strong> ${booking.court_type}
                </p>

                <p class="mb-1">
                  <strong>Location:</strong> ${booking.location}
                </p>

                <p class="mb-1">
                  <strong>Date:</strong> ${bookingDate}
                </p>

                <p class="mb-1">
                  <strong>Start:</strong> ${startTime}
                </p>

                <p class="mb-1">
                  <strong>Duration:</strong> ${booking.duration_hours} hour(s)
                </p>

                <p class="mb-0">
                  <strong>Total:</strong> Rs. ${booking.total_amount}
                </p>
              </div>

              <div class="text-end">
                <span class="badge status-confirmed mb-3">
                  ${booking.status}
                </span>

                <br />

                <button
                  class="btn btn-outline-danger btn-sm"
                  onclick="adminCancelBooking(${booking.id})"
                >
                  Cancel Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    });

  } catch (error) {
    console.error("Load Admin Bookings Error:", error);

    adminBookingsContainer.innerHTML = `
      <div class="alert alert-danger">Failed to load bookings.</div>
    `;
  }
}

async function adminCancelBooking(id) {
  const confirmCancel = confirm("Are you sure you want to cancel this booking?");

  if (!confirmCancel) return;

  try {
    const response = await fetch(`/api/bookings/${id}/cancel`, {
      method: "PATCH",
      credentials: "include"
    });

    const data = await response.json();

    if (!data.success) {
      alert(data.message);
      return;
    }

    loadAllBookings();

  } catch (error) {
    console.error("Admin Cancel Booking Error:", error);
    alert("Failed to cancel booking.");
  }
}

loadAllBookings();