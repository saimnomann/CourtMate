const summaryCards = document.getElementById("summaryCards");
const popularCourtsContainer = document.getElementById("popularCourtsContainer");
const recentBookingsContainer = document.getElementById("recentBookingsContainer");

async function loadAnalytics() {
  try {
    const response = await fetch("/api/analytics/admin", {
      credentials: "include"
    });

    const data = await response.json();

    if (!data.success) {
      summaryCards.innerHTML = `
        <div class="alert alert-danger">${data.message}</div>
      `;
      return;
    }

    renderSummaryCards(data.summary);
    renderPopularCourts(data.popularCourts);
    renderRecentBookings(data.recentBookings);

  } catch (error) {
    console.error("Analytics Load Error:", error);
  }
}

function renderSummaryCards(summary) {
  const cards = [
    {
      title: "Total Users",
      value: summary.totalUsers,
      icon: "👥"
    },
    {
      title: "Total Courts",
      value: summary.totalCourts,
      icon: "🏟️"
    },
    {
      title: "Total Bookings",
      value: summary.totalBookings,
      icon: "📋"
    },
    {
      title: "Total Revenue",
      value: `Rs. ${summary.totalRevenue}`,
      icon: "💰"
    },
    {
      title: "Active Sessions",
      value: summary.activeSessions,
      icon: "🏆"
    }
  ];

  summaryCards.innerHTML = "";

  cards.forEach((card) => {
    summaryCards.innerHTML += `
      <div class="col-md-4 col-lg">
        <div class="analytics-card">
          <div class="feature-icon">${card.icon}</div>
          <p class="text-muted mb-1">${card.title}</p>
          <h4 class="fw-bold mb-0">${card.value}</h4>
        </div>
      </div>
    `;
  });
}

function renderPopularCourts(courts) {
  if (courts.length === 0) {
    popularCourtsContainer.innerHTML = `
      <div class="alert alert-info">No court booking data yet.</div>
    `;
    return;
  }

  popularCourtsContainer.innerHTML = "";

  courts.forEach((court, index) => {
    popularCourtsContainer.innerHTML += `
      <div class="analytics-list-item">
        <div>
          <strong>${index + 1}. ${court.court_name}</strong>
          <p class="text-muted mb-0">${court.bookingCount} booking(s)</p>
        </div>
      </div>
    `;
  });
}

function renderRecentBookings(bookings) {
  if (bookings.length === 0) {
    recentBookingsContainer.innerHTML = `
      <div class="alert alert-info">No recent bookings yet.</div>
    `;
    return;
  }

  recentBookingsContainer.innerHTML = "";

  bookings.forEach((booking) => {
    const bookingDate = new Date(booking.booking_date).toLocaleDateString();
    const startTime = booking.start_time.substring(0, 5);

    recentBookingsContainer.innerHTML += `
      <div class="analytics-list-item">
        <div>
          <strong>${booking.full_name}</strong>
          <p class="text-muted mb-0">
            ${booking.court_name} • ${bookingDate} • ${startTime}
          </p>
        </div>

        <span class="badge bg-success">
          Rs. ${booking.total_amount}
        </span>
      </div>
    `;
  });
}

loadAnalytics();