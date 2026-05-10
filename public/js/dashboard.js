const dashboardCards = document.getElementById("dashboardCards");
const dashboardSubtitle = document.getElementById("dashboardSubtitle");

async function loadDashboard() {
  try {
    const response = await fetch("/api/auth/me", {
      credentials: "include"
    });

    const data = await response.json();

    if (!data.success) {
      window.location.href = "/login";
      return;
    }

    const user = data.user;
    const role = user.role.toLowerCase();

    dashboardSubtitle.innerText = `Logged in as ${user.full_name} (${user.role})`;

    let cards = "";

 if (role === "admin") {

  cards += `
    <div class="col-md-4 mb-3">
      <div class="dashboard-feature-card admin-card">
        <div class="feature-icon">🏟️</div>

        <h5>Court Management</h5>

        <p>
          Add, update, and manage sports courts.
        </p>

        <a href="/courts" class="btn btn-dark btn-sm">
          Open Courts
        </a>
      </div>
    </div>

    <div class="col-md-4 mb-3">
      <div class="dashboard-feature-card admin-card">
        <div class="feature-icon">📋</div>

        <h5>All Bookings</h5>

        <p>
          View and manage all athlete court bookings.
        </p>

        <a href="/admin-bookings" class="btn btn-dark btn-sm">
          Open Bookings
        </a>
      </div>
    </div>
  `;

  cards += `
    <div class="col-md-4 mb-3">
      <div class="dashboard-feature-card admin-card">
        <div class="feature-icon">🏆</div>

        <h5>Training Sessions</h5>

        <p>
          View and manage all coach training sessions.
        </p>

        <a href="/admin-sessions" class="btn btn-dark btn-sm">
          Open Sessions
        </a>
      </div>
    </div>
  `;

  cards += `
    <div class="col-md-4 mb-3">
      <div class="dashboard-feature-card admin-card">
        <div class="feature-icon">📊</div>

        <h5>Analytics</h5>

        <p>
          View bookings, revenue, and court performance.
        </p>

        <a href="/admin-analytics" class="btn btn-dark btn-sm">
          Open Analytics
        </a>
      </div>
    </div>
  `;
cards += `
  <div class="col-md-4 mb-3">
    <div class="dashboard-feature-card admin-card">
      <div class="feature-icon">🎒</div>

      <h5>Equipment</h5>

      <p>
        Manage sports equipment inventory and availability.
      </p>

      <a href="/equipment" class="btn btn-dark btn-sm">
        Open Equipment
      </a>
    </div>
  </div>
`;
cards += `
  <div class="col-md-4 mb-3">
    <div class="dashboard-feature-card admin-card">
      <div class="feature-icon">📦</div>

      <h5>Equipment Rentals</h5>

      <p>
        View athlete rentals and returned equipment.
      </p>

      <a href="/admin-rentals" class="btn btn-dark btn-sm">
        Open Rentals
      </a>
    </div>
  </div>
`;
cards += `
  <div class="col-md-4 mb-3">
    <div class="dashboard-feature-card admin-card">
      <div class="feature-icon">💳</div>

      <h5>Payments</h5>

      <p>
        Track athlete payments and mark pending dues as paid.
      </p>

      <a href="/admin-payments" class="btn btn-dark btn-sm">
        Open Payments
      </a>
    </div>
  </div>
`;
}

   if (role === "coach") {
  cards += `
    <div class="col-md-4 mb-3">
      <div class="dashboard-feature-card coach-card">
        <div class="feature-icon">🏆</div>

        <h5>Training Sessions</h5>

        <p>
          Create, manage, and monitor athlete training sessions.
        </p>

        <a href="/coach-sessions" class="btn btn-dark btn-sm">
          Open Sessions
        </a>
      </div>
    </div>
  `;
}

    if (role === "athlete") {
      cards += `
        <div class="col-md-4 mb-3">
          <div class="dashboard-feature-card athlete-card">
            <div class="feature-icon">🏟️</div>

            <h5>Book a Court</h5>

            <p>
              View available courts and reserve time slots.
            </p>

            <a href="/bookings" class="btn btn-dark btn-sm">
              Open Booking
            </a>
          </div>
        </div>

        <div class="col-md-4 mb-3">
          <div class="dashboard-feature-card athlete-card">
            <div class="feature-icon">🏆</div>

            <h5>Training Sessions</h5>

            <p>
              Join coaching sessions and track your enrollments.
            </p>

            <a href="/athlete-sessions" class="btn btn-dark btn-sm">
              Open Sessions
            </a>
          </div>
        </div>
      `;
      cards += `
  <div class="col-md-4 mb-3">
    <div class="dashboard-feature-card athlete-card">
      <div class="feature-icon">🎒</div>

      <h5>Equipment Rental</h5>

      <p>
        Rent available equipment and manage your rentals.
      </p>

      <a href="/athlete-equipment" class="btn btn-dark btn-sm">
        Open Equipment
      </a>
    </div>
  </div>
`;
    }

    dashboardCards.innerHTML = cards;

  } catch (error) {
    console.log("Dashboard Error:", error);
  }
}

loadDashboard();