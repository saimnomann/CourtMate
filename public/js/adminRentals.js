const adminRentalsContainer = document.getElementById("adminRentalsContainer");

async function loadAdminRentals() {
  const response = await fetch("/api/equipment/rentals/all", {
    credentials: "include"
  });

  const data = await response.json();

  if (!data.success) {
    adminRentalsContainer.innerHTML = `<div class="alert alert-danger">${data.message}</div>`;
    return;
  }

  if (data.rentals.length === 0) {
    adminRentalsContainer.innerHTML = `<div class="alert alert-info">No rentals found.</div>`;
    return;
  }

  adminRentalsContainer.innerHTML = "";

  data.rentals.forEach((rental) => {
    const rentalDate = new Date(rental.rental_date).toLocaleDateString();

    adminRentalsContainer.innerHTML += `
      <div class="card mb-3 border-0 shadow-sm booking-admin-card">
        <div class="card-body">
          <div class="d-flex justify-content-between flex-wrap gap-3">
            <div>
              <h5 class="fw-bold">${rental.equipment_name}</h5>
              <p class="mb-1"><strong>Athlete:</strong> ${rental.full_name}</p>
              <p class="mb-1"><strong>Email:</strong> ${rental.email}</p>
              <p class="mb-1"><strong>Category:</strong> ${rental.category}</p>
              <p class="mb-1"><strong>Quantity:</strong> ${rental.quantity}</p>
              <p class="mb-1"><strong>Rental Date:</strong> ${rentalDate}</p>
              <p class="mb-0"><strong>Total:</strong> Rs. ${rental.total_amount}</p>
            </div>

            <span class="rental-status-badge ${
            rental.status === "Rented" ? "status-confirmed" : "status-cancelled"
            }">
           ${rental.status}
          </span>
          </div>
        </div>
      </div>
    `;
  });
}

loadAdminRentals();