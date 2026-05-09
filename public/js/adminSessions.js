const adminSessionsContainer = document.getElementById("adminSessionsContainer");

async function loadAdminSessions() {
  try {
    const response = await fetch("/api/sessions/admin/all", {
      credentials: "include"
    });

    const data = await response.json();

    if (!data.success) {
      adminSessionsContainer.innerHTML = `
        <div class="alert alert-danger">${data.message}</div>
      `;
      return;
    }

    const activeSessions = data.sessions.filter(
      (session) => session.status !== "Cancelled"
    );

    if (activeSessions.length === 0) {
      adminSessionsContainer.innerHTML = `
        <div class="alert alert-info mb-0">No active sessions found.</div>
      `;
      return;
    }

    adminSessionsContainer.innerHTML = "";

    activeSessions.forEach((session) => {
      const sessionDate = new Date(session.session_date).toLocaleDateString();
      const startTime = session.start_time.substring(0, 5);

      adminSessionsContainer.innerHTML += `
        <div class="card mb-3 border-0 shadow-sm booking-admin-card">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start flex-wrap gap-3">
              <div>
                <h5 class="fw-bold mb-2">${session.title}</h5>

                <p class="mb-1"><strong>Coach:</strong> ${session.coach_name}</p>
                <p class="mb-1"><strong>Email:</strong> ${session.coach_email}</p>
                <p class="mb-1"><strong>Court:</strong> ${session.court_name}</p>
                <p class="mb-1"><strong>Type:</strong> ${session.court_type}</p>
                <p class="mb-1"><strong>Location:</strong> ${session.location}</p>
                <p class="mb-1"><strong>Date:</strong> ${sessionDate}</p>
                <p class="mb-1"><strong>Time:</strong> ${startTime}</p>
                <p class="mb-1"><strong>Duration:</strong> ${session.duration_hours} hour(s)</p>
                <p class="mb-0"><strong>Enrolled:</strong> ${session.enrolled_count}/${session.max_athletes}</p>
              </div>

              <div class="text-end">
                <span class="badge status-confirmed mb-3">
                  ${session.status}
                </span>

                <br />

                <button
                  class="btn btn-outline-danger btn-sm"
                  onclick="adminCancelSession(${session.id})"
                >
                  Cancel Session
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    });

  } catch (error) {
    console.error("Load Admin Sessions Error:", error);

    adminSessionsContainer.innerHTML = `
      <div class="alert alert-danger">Failed to load sessions.</div>
    `;
  }
}

async function adminCancelSession(sessionId) {
  const confirmCancel = confirm("Are you sure you want to cancel this session?");

  if (!confirmCancel) return;

  try {
    const response = await fetch(`/api/sessions/admin/${sessionId}/cancel`, {
      method: "PATCH",
      credentials: "include"
    });

    const data = await response.json();

    if (!data.success) {
      alert(data.message);
      return;
    }

    loadAdminSessions();

  } catch (error) {
    console.error("Admin Cancel Session Error:", error);
    alert("Failed to cancel session.");
  }
}

loadAdminSessions();