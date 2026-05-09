const activeSessionsContainer = document.getElementById("activeSessionsContainer");
const mySessionsContainer = document.getElementById("mySessionsContainer");

async function loadActiveSessions() {
  try {
    const response = await fetch("/api/sessions/active", {
      credentials: "include"
    });

    const data = await response.json();

    if (!data.success) {
      activeSessionsContainer.innerHTML = `
        <div class="alert alert-danger">${data.message}</div>
      `;
      return;
    }

    if (data.sessions.length === 0) {
      activeSessionsContainer.innerHTML = `
        <div class="alert alert-info">No active training sessions available.</div>
      `;
      return;
    }

    activeSessionsContainer.innerHTML = "";

    data.sessions.forEach((session) => {
      const sessionDate = new Date(session.session_date).toLocaleDateString();
      const startTime = session.start_time.substring(0, 5);

      activeSessionsContainer.innerHTML += `
        <div class="card mb-3 border-0 shadow-sm booking-admin-card">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start flex-wrap gap-3">
              <div>
                <h5 class="fw-bold mb-2">${session.title}</h5>

                <p class="mb-1"><strong>Coach:</strong> ${session.coach_name}</p>
                <p class="mb-1"><strong>Court:</strong> ${session.court_name}</p>
                <p class="mb-1"><strong>Type:</strong> ${session.court_type}</p>
                <p class="mb-1"><strong>Location:</strong> ${session.location}</p>
                <p class="mb-1"><strong>Date:</strong> ${sessionDate}</p>
                <p class="mb-1"><strong>Time:</strong> ${startTime}</p>
                <p class="mb-1"><strong>Duration:</strong> ${session.duration_hours} hour(s)</p>
                <p class="mb-0"><strong>Seats:</strong> ${session.enrolled_count}/${session.max_athletes}</p>
              </div>

              <button
                class="btn btn-primary btn-sm"
                onclick="enrollSession(${session.id})"
              >
                Enroll
              </button>
            </div>
          </div>
        </div>
      `;
    });

  } catch (error) {
    console.log("Load Active Sessions Error:", error);
  }
}

async function loadMySessions() {
  try {
    const response = await fetch("/api/sessions/athlete/my-sessions", {
      credentials: "include"
    });

    const data = await response.json();

    if (!data.success) {
      mySessionsContainer.innerHTML = `
        <div class="alert alert-danger">${data.message}</div>
      `;
      return;
    }

    if (data.sessions.length === 0) {
      mySessionsContainer.innerHTML = `
        <div class="alert alert-info">You have not enrolled in any sessions.</div>
      `;
      return;
    }

    mySessionsContainer.innerHTML = "";

    data.sessions.forEach((session) => {
      const sessionDate = new Date(session.session_date).toLocaleDateString();
      const startTime = session.start_time.substring(0, 5);

      mySessionsContainer.innerHTML += `
        <div class="card mb-3 border-0 shadow-sm">
          <div class="card-body">
            <h6 class="fw-bold">${session.title}</h6>
            <p class="mb-1"><strong>Coach:</strong> ${session.coach_name}</p>
            <p class="mb-1"><strong>Court:</strong> ${session.court_name}</p>
            <p class="mb-1"><strong>Date:</strong> ${sessionDate}</p>
            <p class="mb-0"><strong>Time:</strong> ${startTime}</p>
          </div>
        </div>
      `;
    });

  } catch (error) {
    console.log("Load My Sessions Error:", error);
  }
}

async function enrollSession(sessionId) {
  try {
    const response = await fetch(`/api/sessions/${sessionId}/enroll`, {
      method: "POST",
      credentials: "include"
    });

    const data = await response.json();

    if (!data.success) {
      alert(data.message);
      return;
    }

    alert(data.message);

    loadActiveSessions();
    loadMySessions();

  } catch (error) {
    console.log("Enroll Session Error:", error);
  }
}

loadActiveSessions();
loadMySessions();