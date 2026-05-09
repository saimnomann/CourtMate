const courtsContainer = document.getElementById("courtsContainer");
const courtForm = document.getElementById("courtForm");

async function loadCourts() {
  try {

    const response = await fetch("/api/courts", {
      credentials: "include"
    });

    const data = await response.json();

    courtsContainer.innerHTML = "";

    data.courts.forEach((court) => {

      courtsContainer.innerHTML += `
      
        <div class="col-md-6 mb-4">

          <div class="card border-0 shadow-sm h-100">

            <div class="card-body">

              <h5>${court.court_name}</h5>

              <p class="mb-1">
                <strong>Type:</strong> ${court.court_type}
              </p>

              <p class="mb-1">
                <strong>Location:</strong> ${court.location}
              </p>

              <p class="mb-1">
                <strong>Rate:</strong> Rs. ${court.hourly_rate}
              </p>

              <p class="mb-3">
                <strong>Status:</strong> ${court.status}
              </p>

              <button
                class="btn btn-danger btn-sm"
                onclick="deleteCourt(${court.id})"
              >
                Delete
              </button>

            </div>

          </div>

        </div>
      
      `;
    });

  } catch (error) {
    console.log(error);
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

    courtForm.reset();

    loadCourts();

  } catch (error) {
    console.log(error);
  }
});

loadCourts();