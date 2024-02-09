document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const rollNo = document.getElementById("rollNo").value;
    const password = document.getElementById("password").value;

    // Basic form validation
    if (!rollNo || !password) {
      alert("Roll No and password are required");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rollNo, password }),
      });

      const data = await response.json();
      if (response.ok) {
        // Login successful, store token in local storage
        localStorage.setItem("token", data.token);

        // Redirect to dashboard
        window.location.href = "dashboard.html";
      } else {
        // Login failed, display error message
        alert(data.error || "Login failed");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert("An error occurred while logging in: " + error.message);
    }
  });
});
