const paymentsContainer = document.getElementById("paymentsContainer");

async function loadMyPayments() {
  const response = await fetch("/api/payments/my-payments", {
    credentials: "include"
  });

  const data = await response.json();

  if (!data.success) {
    paymentsContainer.innerHTML = `
      <div class="alert alert-danger">${data.message}</div>
    `;
    return;
  }

  if (data.payments.length === 0) {
    paymentsContainer.innerHTML = `
      <div class="alert alert-info">No payments found.</div>
    `;
    return;
  }

  paymentsContainer.innerHTML = "";

  data.payments.forEach((payment) => {
    const date = new Date(payment.payment_date).toLocaleString();

    paymentsContainer.innerHTML += `
      <div class="card mb-3 border-0 shadow-sm booking-admin-card">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-start flex-wrap gap-3">
            <div>
              <h5 class="fw-bold">${payment.payment_type}</h5>
              <p class="mb-1"><strong>Reference ID:</strong> ${payment.reference_id}</p>
              <p class="mb-1"><strong>Amount:</strong> Rs. ${payment.amount}</p>
              <p class="mb-0"><strong>Date:</strong> ${date}</p>
            </div>

            <span class="rental-status-badge ${
              payment.status === "Paid" ? "status-confirmed" : "status-cancelled"
            }">
              ${payment.status}
            </span>
          </div>
        </div>
      </div>
    `;
  });
}

loadMyPayments();