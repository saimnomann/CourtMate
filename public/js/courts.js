const courtsContainer = document.getElementById("courtsContainer");
const courtForm = document.getElementById("courtForm");

async function loadCourts() {
  try {
    const response = await fetch("/api/courts", {
      credentials: "include"
    });

    const data = await response.json();

    courtsContainer.innerHTML = "";

    if (!data.success) {
      courtsContainer.innerHTML = `
        <div class="col-12">
          <div class="alert alert-danger">
            ${data.message || "Failed to load courts"}
          </div>
        </div>
      `;
      return;
    }

    if (data.courts.length === 0) {
      courtsContainer.innerHTML = `
        <div class="col-12">
          <div class="alert alert-info">
            No courts found.
          </div>
        </div>
      `;
      return;
    }

    data.courts.forEach((court) => {
      let statusClass = "status-available";

      if (court.status === "Maintenance") {
        statusClass = "status-maintenance";
      } else if (court.status === "Inactive") {
        statusClass = "status-inactive";
      }

      courtsContainer.innerHTML += `
        <div class="col-lg-6 col-md-12">
          <div class="card court-card h-100">
            <div class="card-body">

              <div class="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h5 class="court-title">${court.court_name}</h5>
                  <p class="court-subtitle mb-0">${court.court_type} Court</p>
                </div>

                <span class="status-badge ${statusClass}">
                  ${court.status}
                </span>
              </div>

              <div class="court-details">
                <p class="court-info">
                  <strong>Type:</strong>
                  <span>${court.court_type}</span>
                </p>

                <p class="court-info">
                  <strong>Location:</strong>
                  <span>${court.location}</span>
                </p>

                <p class="court-info">
                  <strong>Rate:</strong>
                  <span>Rs. ${court.hourly_rate}</span>
                </p>
              </div>

              <div class="update-label">Update Court Status</div>

              <select id="status-${court.id}" class="form-select status-select">
                <option value="Available" ${court.status === "Available" ? "selected" : ""}>Available</option>
                <option value="Maintenance" ${court.status === "Maintenance" ? "selected" : ""}>Maintenance</option>
                <option value="Inactive" ${court.status === "Inactive" ? "selected" : ""}>Inactive</option>
              </select>

              <div class="court-actions">
                <button
                  class="btn btn-update"
                  onclick="updateCourtStatus(${court.id})"
                >
                  Update Status
                </button>

                <button
                  class="btn btn-delete"
                  onclick="deleteCourt(${court.id})"
                >
                  Delete
                </button>
              </div>

            </div>
          </div>
        </div>
      `;
    });

  } catch (error) {
    console.log("Load Courts Error:", error);
    alert("Something went wrong while loading courts");
  }
}

courtForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const courtName = document.getElementById("courtName").value;
  const courtType = document.getElementById("courtType").value;
  const location = document.getElementById("location").value;
  const hourlyRate = document.getElementById("hourlyRate").value;
  const status = document.getElementById("status").value;

  if (Number(hourlyRate) <= 0) {
    alert("Hourly rate must be greater than 0");
    return;
  }

  try {
    const response = await fetch("/api/courts", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        courtName,
        courtType,
        location,
        hourlyRate,
        status
      })
    });

    const data = await response.json();

    if (!data.success) {
      alert(data.message);
      return;
    }

    alert("Court added successfully");

    courtForm.reset();
    loadCourts();

  } catch (error) {
    console.log("Create Court Error:", error);
    alert("Something went wrong while adding court");
  }
});

async function deleteCourt(id) {
  const confirmDelete = confirm("Are you sure you want to delete this court?");

  if (!confirmDelete) {
    return;
  }

  try {
    const response = await fetch(`/api/courts/${id}`, {
      method: "DELETE",
      credentials: "include"
    });

    const data = await response.json();

    if (!data.success) {
      alert(data.message || "Failed to delete court");
      return;
    }

    alert("Court deleted successfully");
    loadCourts();

  } catch (error) {
    console.log("Delete Court Error:", error);
    alert("Something went wrong while deleting court");
  }
}

async function updateCourtStatus(id) {
  const newStatus = document.getElementById(`status-${id}`).value;

  try {
    const getResponse = await fetch(`/api/courts/${id}`, {
      credentials: "include"
    });

    const getData = await getResponse.json();

    if (!getData.success) {
      alert(getData.message || "Court not found");
      return;
    }

    const court = getData.court;

    // Prevent updating if status is already the same
    if (court.status === newStatus) {
      alert(`This court is already ${newStatus}`);
      return;
    }

    const response = await fetch(`/api/courts/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        courtName: court.court_name,
        courtType: court.court_type,
        location: court.location,
        hourlyRate: court.hourly_rate,
        status: newStatus
      })
    });

    const data = await response.json();

    if (!data.success) {
      alert(data.message || "Failed to update court status");
      return;
    }

    alert(`Court status updated from ${court.status} to ${newStatus}`);
    loadCourts();

  } catch (error) {
    console.log("Update Court Status Error:", error);
    alert("Something went wrong while updating court status");
  }
}
loadCourts();