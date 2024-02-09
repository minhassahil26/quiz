document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signup-form");
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const age = document.getElementById("age").value;
    const gender = document.getElementById("gender").value;
    const rollNo = document.getElementById("rollNo").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // Basic form validation
    if (!name || !age || !gender || !rollNo || !password || !confirmPassword) {
      alert("All fields are required");
      return;
    }
    if (isNaN(age) || age < 0) {
      alert("Age must be a valid number");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // Send data to backend endpoint
    try {
      const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          age: age,
          gender: gender,
          rollNo: rollNo,
          password: password,
        }),
      });
      const data = await response.json();
      alert(data.message);
      // Redirect to login page or any other page
      window.location.href = "login.html";
    } catch (error) {
      console.error("Error signing up:", error);
      alert("An error occurred while signing up");
    }
  });
});
