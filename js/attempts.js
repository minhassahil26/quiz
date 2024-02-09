document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Fetch attempts data from the server
    const response = await fetch("http://localhost:5000/attempts", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch attempts: ${response.status}`);
    }

    const attempts = await response.json();
    const attemptsContainer = document.getElementById("attempts-container");
    // attemptsContainer.innerHTML = "";

    // Display attempts in HTML
    attempts.forEach((attempt) => {
      const attemptItem = document.createElement("div");
      attemptItem.classList.add("attempt-item");
      attemptItem.innerHTML = `
        <p>Date: <span>${new Date(attempt.datetime).toLocaleString()}</span></p>
        <p>Score: <span>${attempt.score}</span></p>
      `;
      attemptsContainer.appendChild(attemptItem);
    });
  } catch (error) {
    console.error("Error fetching attempts:", error);
    alert("An error occurred while fetching attempts");
  }
});
