const messageBox = document.getElementById("message");

function showMessage(type, message) {
  if (!messageBox) return;

  messageBox.innerHTML = `
    <div class="alert alert-${type}">
      ${message}
    </div>
  `;
}

const registerForm = document.getElementById("registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const full_name = document.getElementById("fullName").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          full_name,
          email,
          password,
          role
        })
      });

      const data = await response.json();

      if (!data.success) {
        showMessage("danger", data.message);
        return;
      }

      showMessage("success", data.message);

      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
    } catch (error) {
      showMessage("danger", "Something went wrong");
    }
  });
}

const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const rememberMe = document.getElementById("rememberMe").checked;

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password,
          rememberMe
        })
      });

      const data = await response.json();

      if (!data.success) {
        showMessage("danger", data.message);
        return;
      }

      window.location.href = "/dashboard";
    } catch (error) {
      showMessage("danger", "Something went wrong");
    }
  });
}

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include"
    });

    window.location.href = "/login";
  });
}