const adminPaymentsContainer = document.getElementById("adminPaymentsContainer");

async function loadAdminPayments() {
  const response = await fetch("/api/payments", {
    credentials: "include"
  });

  const data = await response.json();

  if (!data.success) {
    adminPaymentsContainer.innerHTML = `
      <div class="alert alert-danger">${data.message}</div>
    `;
    return;
  }

  if (data.payments.length === 0) {
    adminPaymentsContainer.innerHTML = `
      <div class="alert alert-info">No payments found.</div>
    `;
    return;
  }

  adminPaymentsContainer.innerHTML = "";

  data.payments.forEach((payment) => {
    const date = new Date(payment.payment_date).toLocaleString();

    adminPaymentsContainer.innerHTML += `
      <div class="card mb-3 border-0 shadow-sm booking-admin-card">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-start flex-wrap gap-3">
            <div>
              <h5 class="fw-bold">${payment.payment_type}</h5>
              <p class="mb-1"><strong>Athlete:</strong> ${payment.full_name}</p>
              <p class="mb-1"><strong>Email:</strong> ${payment.email}</p>
              <p class="mb-1"><strong>Reference ID:</strong> ${payment.reference_id}</p>
              <p class="mb-1"><strong>Amount:</strong> Rs. ${payment.amount}</p>
              <p class="mb-0"><strong>Date:</strong> ${date}</p>
            </div>

            <div class="text-end">
              <span class="rental-status-badge ${
                payment.status === "Paid" ? "status-confirmed" : "status-cancelled"
              }">
                ${payment.status}
              </span>

              <br />

              ${
                payment.status === "Pending"
                  ? `<button class="btn btn-outline-success btn-sm mt-3" onclick="markAsPaid(${payment.id})">
                      Mark as Paid
                    </button>`
                  : ""
              }
            </div>
          </div>
        </div>
      </div>
    `;
  });
}

async function markAsPaid(paymentId) {
  const confirmPaid = confirm("Mark this payment as paid?");

  if (!confirmPaid) return;

  const response = await fetch(`/api/payments/${paymentId}/paid`, {
    method: "PATCH",
    credentials: "include"
  });

  const data = await response.json();

  if (!data.success) {
    alert(data.message);
    return;
  }

  loadAdminPayments();
}

loadAdminPayments();