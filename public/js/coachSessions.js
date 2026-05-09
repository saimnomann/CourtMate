const sessionForm = document.getElementById("sessionForm");
const sessionsContainer = document.getElementById("sessionsContainer");
const sessionMessage = document.getElementById("sessionMessage");
const courtSelect = document.getElementById("courtId");

function showMessage(type, message) {
  sessionMessage.innerHTML = `
    <div class="alert alert-${type}">
      ${message}
    </div>
  `;
}

async function loadCourts() {
  try {
    const response = await fetch("/api/courts", {
      credentials: "include"
    });

    const data = await response.json();

    courtSelect.innerHTML = `
      <option value="">Select Court</option>
    `;

    data.courts
      .filter((court) => court.status === "Available")
      .forEach((court) => {
        courtSelect.innerHTML += `
          <option value="${court.id}">
            ${court.court_name} - ${court.court_type}
          </option>
        `;
      });

  } catch (error) {
    console.log(error);
  }
}

async function loadCoachSessions() {
  try {
    const response = await fetch("/api/sessions/coach/my-sessions", {
      credentials: "include"
    });

    const data = await response.json();

    if (!data.success) {
      sessionsContainer.innerHTML = `
        <div class="alert alert-danger">
          ${data.message}
        </div>
      `;
      return;
    }

    if (data.sessions.length === 0) {
      sessionsContainer.innerHTML = `
        <div class="alert alert-info">
          No sessions created yet.
        </div>
      `;
      return;
    }

    sessionsContainer.innerHTML = "";

    data.sessions.forEach((session) => {

      const sessionDate = new Date(
        session.session_date
      ).toLocaleDateString();

      const startTime = session.start_time.substring(0, 5);

      sessionsContainer.innerHTML += `
        <div class="card mb-3 border-0 shadow-sm booking-admin-card">
          <div class="card-body">

            <div class="d-flex justify-content-between align-items-start flex-wrap gap-3">

              <div>

                <h5 class="fw-bold mb-2">
                  ${session.title}
                </h5>

                <p class="mb-1">
                  <strong>Court:</strong>
                  ${session.court_name}
                </p>

                <p class="mb-1">
                  <strong>Type:</strong>
                  ${session.court_type}
                </p>

                <p class="mb-1">
                  <strong>Location:</strong>
                  ${session.location}
                </p>

                <p class="mb-1">
                  <strong>Date:</strong>
                  ${sessionDate}
                </p>

                <p class="mb-1">
                  <strong>Time:</strong>
                  ${startTime}
                </p>

                <p class="mb-1">
                  <strong>Duration:</strong>
                  ${session.duration_hours} hour(s)
                </p>

                <p class="mb-1">
                  <strong>Enrolled:</strong>
                  ${session.enrolled_count}/${session.max_athletes}
                </p>

                <p class="mb-0">
                  <strong>Status:</strong>
                  ${session.status}
                </p>

              </div>

              <div>

                <button
                  class="btn btn-outline-danger btn-sm"
                  onclick="cancelSession(${session.id})"
                >
                  Cancel
                </button>

              </div>

            </div>

          </div>
        </div>
      `;
    });

  } catch (error) {
    console.log(error);
  }
}

sessionForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const courtId = document.getElementById("courtId").value;
  const sessionDate = document.getElementById("sessionDate").value;
  const startTime = document.getElementById("startTime").value;
  const durationHours = document.getElementById("durationHours").value;
  const maxAthletes = document.getElementById("maxAthletes").value;

  try {

    const response = await fetch("/api/sessions", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        courtId,
        title,
        description,
        sessionDate,
        startTime,
        durationHours,
        maxAthletes
      })
    });

    const data = await response.json();

    if (!data.success) {
      showMessage("danger", data.message);
      return;
    }

    showMessage("success", data.message);

    sessionForm.reset();

    loadCoachSessions();

  } catch (error) {
    console.log(error);
  }
});

async function cancelSession(sessionId) {

  const confirmCancel = confirm(
    "Are you sure you want to cancel this session?"
  );

  if (!confirmCancel) return;

  try {

    const response = await fetch(
      `/api/sessions/${sessionId}/cancel`,
      {
        method: "PATCH",
        credentials: "include"
      }
    );

    const data = await response.json();

    if (!data.success) {
      alert(data.message);
      return;
    }

    loadCoachSessions();

  } catch (error) {
    console.log(error);
  }
}

loadCourts();
loadCoachSessions();