const rentalForm = document.getElementById("rentalForm");
const equipmentSelect = document.getElementById("equipmentId");
const rentalsContainer = document.getElementById("rentalsContainer");
const rentalMessage = document.getElementById("rentalMessage");

function showRentalMessage(type, message) {
  rentalMessage.innerHTML = `
    <div class="alert alert-${type}">
      ${message}
    </div>
  `;
}

async function loadAvailableEquipment() {
  try {
    const response = await fetch("/api/equipment", {
      credentials: "include"
    });

    const data = await response.json();

    equipmentSelect.innerHTML = `<option value="">Select equipment</option>`;

    const availableEquipment = data.equipment.filter(
      (item) => item.status === "Available" && Number(item.available_quantity) > 0
    );

    if (availableEquipment.length === 0) {
      equipmentSelect.innerHTML = `<option value="">No equipment available</option>`;
      return;
    }

    availableEquipment.forEach((item) => {
      equipmentSelect.innerHTML += `
        <option value="${item.id}">
          ${item.equipment_name} - Available: ${item.available_quantity} - Rs. ${item.rental_price}
        </option>
      `;
    });

  } catch (error) {
    console.log("Load Available Equipment Error:", error);
  }
}

async function loadMyRentals() {
  try {
    const response = await fetch("/api/equipment/my-rentals", {
      credentials: "include"
    });

    const data = await response.json();

    if (!data.success) {
      rentalsContainer.innerHTML = `
        <div class="alert alert-danger">${data.message}</div>
      `;
      return;
    }

    const activeRentals = data.rentals.filter(
      (rental) => rental.status !== "Returned"
    );

    if (activeRentals.length === 0) {
      rentalsContainer.innerHTML = `
        <div class="alert alert-info">No active rentals found.</div>
      `;
      return;
    }

    rentalsContainer.innerHTML = "";

    activeRentals.forEach((rental) => {
      const rentalDate = new Date(rental.rental_date).toLocaleDateString();

      rentalsContainer.innerHTML += `
        <div class="card mb-3 border-0 shadow-sm booking-admin-card">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start flex-wrap gap-3">
              <div>
                <h5 class="fw-bold mb-2">${rental.equipment_name}</h5>
                <p class="mb-1"><strong>Category:</strong> ${rental.category}</p>
                <p class="mb-1"><strong>Quantity:</strong> ${rental.quantity}</p>
                <p class="mb-1"><strong>Rental Date:</strong> ${rentalDate}</p>
                <p class="mb-1"><strong>Total:</strong> Rs. ${rental.total_amount}</p>
                <p class="mb-0"><strong>Status:</strong> ${rental.status}</p>
              </div>

              <button
                class="btn btn-outline-success btn-sm"
                onclick="returnEquipment(${rental.id})"
              >
                Return
              </button>
            </div>
          </div>
        </div>
      `;
    });

  } catch (error) {
    console.log("Load My Rentals Error:", error);
  }
}

rentalForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const equipmentId = equipmentSelect.value;
  const quantity = document.getElementById("quantity").value;
  const rentalDate = document.getElementById("rentalDate").value;

  if (!equipmentId || !quantity || !rentalDate) {
    showRentalMessage("warning", "All fields are required");
    return;
  }

  if (Number(quantity) <= 0) {
    showRentalMessage("danger", "Quantity must be greater than 0");
    return;
  }

  try {
    const response = await fetch("/api/equipment/rent", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        equipmentId,
        quantity,
        rentalDate
      })
    });

    const data = await response.json();

    if (!data.success) {
      showRentalMessage("danger", data.message);
      return;
    }

    showRentalMessage("success", data.message);
    rentalForm.reset();

    loadAvailableEquipment();
    loadMyRentals();

  } catch (error) {
    console.log("Rent Equipment Error:", error);
  }
});

async function returnEquipment(rentalId) {
  const confirmReturn = confirm("Are you sure you want to return this equipment?");

  if (!confirmReturn) return;

  try {
    const response = await fetch(`/api/equipment/rentals/${rentalId}/return`, {
      method: "PATCH",
      credentials: "include"
    });

    const data = await response.json();

    if (!data.success) {
      alert(data.message);
      return;
    }

    loadAvailableEquipment();
    loadMyRentals();

  } catch (error) {
    console.log("Return Equipment Error:", error);
  }
}

loadAvailableEquipment();
loadMyRentals();