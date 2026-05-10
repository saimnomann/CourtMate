const equipmentForm = document.getElementById("equipmentForm");
const equipmentContainer = document.getElementById("equipmentContainer");
const equipmentMessage = document.getElementById("equipmentMessage");

function showEquipmentMessage(type, message) {
  equipmentMessage.innerHTML = `
    <div class="alert alert-${type}">
      ${message}
    </div>
  `;
}

async function loadEquipment() {
  try {
    const response = await fetch("/api/equipment", {
      credentials: "include"
    });

    const data = await response.json();

    if (!data.success) {
      equipmentContainer.innerHTML = `
        <div class="alert alert-danger">${data.message}</div>
      `;
      return;
    }

    if (data.equipment.length === 0) {
      equipmentContainer.innerHTML = `
        <div class="alert alert-info">No equipment added yet.</div>
      `;
      return;
    }

    equipmentContainer.innerHTML = "";

    data.equipment.forEach((item) => {
      equipmentContainer.innerHTML += `
        <div class="card mb-3 border-0 shadow-sm booking-admin-card">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start flex-wrap gap-3">
              <div>
                <h5 class="fw-bold mb-2">${item.equipment_name}</h5>
                <p class="mb-1"><strong>Category:</strong> ${item.category}</p>
                <p class="mb-1"><strong>Total:</strong> ${item.total_quantity}</p>
                <p class="mb-1"><strong>Available:</strong> ${item.available_quantity}</p>
                <p class="mb-1"><strong>Price:</strong> Rs. ${item.rental_price}</p>
                <p class="mb-0"><strong>Status:</strong> ${item.status}</p>
              </div>

              <button
                class="btn btn-outline-danger btn-sm"
                onclick="deleteEquipment(${item.id})"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      `;
    });

  } catch (error) {
    console.log("Load Equipment Error:", error);
  }
}

equipmentForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const equipmentName = document.getElementById("equipmentName").value;
  const category = document.getElementById("category").value;
  const totalQuantity = document.getElementById("totalQuantity").value;
  const rentalPrice = document.getElementById("rentalPrice").value;

  if (Number(totalQuantity) <= 0) {
    showEquipmentMessage("danger", "Total quantity must be greater than 0");
    return;
  }

  if (Number(rentalPrice) < 0) {
    showEquipmentMessage("danger", "Rental price cannot be negative");
    return;
  }

  try {
    const response = await fetch("/api/equipment", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        equipmentName,
        category,
        totalQuantity,
        rentalPrice
      })
    });

    const data = await response.json();

    if (!data.success) {
      showEquipmentMessage("danger", data.message);
      return;
    }

    showEquipmentMessage("success", data.message);
    equipmentForm.reset();
    loadEquipment();

  } catch (error) {
    console.log("Create Equipment Error:", error);
  }
});

async function deleteEquipment(id) {
  const confirmDelete = confirm("Are you sure you want to delete this equipment?");

  if (!confirmDelete) return;

  try {
    const response = await fetch(`/api/equipment/${id}`, {
      method: "DELETE",
      credentials: "include"
    });

    const data = await response.json();

    if (!data.success) {
      alert(data.message);
      return;
    }

    loadEquipment();

  } catch (error) {
    console.log("Delete Equipment Error:", error);
  }
}

loadEquipment();