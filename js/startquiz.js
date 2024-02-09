document.addEventListener("DOMContentLoaded", async () => {
  let questionsData = []; // Array to store quiz questions
  let currentQuestionIndex = 0; // Index to keep track of the current question
  let userScore = 0; // Variable to store user's score

  // Fetch quiz questions from the server
  try {
    const response = await fetch("http://localhost:5000/startquiz");
    questionsData = await response.json();
  } catch (error) {
    console.error("Error fetching questions:", error);
    alert(
      "An error occurred while fetching questions. Please try again later."
    );
    return;
  }

  // Display initial question
  displayQuestion(questionsData[currentQuestionIndex]);

  // Event listener for submitting answer
  document.getElementById("submit-button").addEventListener("click", () => {
    const selectedOptionIndex = document.querySelector(
      'input[name="option"]:checked'
    )?.value;
    if (selectedOptionIndex !== undefined) {
      const isCorrect =
        selectedOptionIndex ==
        questionsData[currentQuestionIndex].correctOptionIndex;
      if (isCorrect) {
        userScore++;
      }
      alert(isCorrect ? "Correct answer!" : "Incorrect answer!");
      currentQuestionIndex++;
      if (currentQuestionIndex < questionsData.length) {
        displayQuestion(questionsData[currentQuestionIndex]);
      } else {
        document.getElementById("question-container").innerHTML =
          "<h3>No more questions</h3>";
        document.getElementById("button-container").style.display = "none";
        displayScore(userScore);
        document.getElementById("score-container").style.display = "block";
      }
    } else {
      alert("Please select an option before submitting.");
    }
  });

  // Function to display question and options
  function displayQuestion(questionData) {
    const questionContainer = document.getElementById("question-container");
    questionContainer.innerHTML = `
          <h2>${questionData.question}</h2>
          <ul>
              ${questionData.options
                .map(
                  (option, index) => `
                  <li>
                      <input type="radio" id="option-${index}" name="option" value="${index}">
                      <label for="option-${index}">${option}</label>
                  </li>
              `
                )
                .join("")}
          </ul>
      `;
  }

  // Function to display final score
  function displayScore(score) {
    const scoreContainer = document.getElementById("score-container");
    scoreContainer.innerHTML = `
          <h3>Your final score: ${score}/${questionsData.length}</h3>
      `;
  }
});
