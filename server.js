const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
// Connect to MongoDB Atlas  
mongoose
  .connect(
    "mongodb+srv://2111981064-Sahil:qwertyuiop@cluster0.ywtibvk.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to MongoDB Atlas");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB Atlas:", err);
  });



// Define schemas
const questionSchema = new mongoose.Schema({
  question: String,
  options: [String],
  answerIndex: Number,
});
const Question = mongoose.model("Question", questionSchema);

const userSchema = new mongoose.Schema({
  name: String,
  age: Number,
  gender: String,
  rollNo: { type: String, unique: true },
  password: String,
});
const User = mongoose.model("User", userSchema);

const attemptSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  datetime: { type: Date, default: Date.now },
  score: Number,
});
const Attempt = mongoose.model("Attempt", attemptSchema);

// Middleware
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});
app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname,"signup.html"));
});
// Signup endpoint
app.post("/signup", async (req, res) => {
  const { name, age, gender, rollNo, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ rollNo: rollNo });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with the same Roll No already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      name: name,
      age: age,
      gender: gender,
      rollNo: rollNo,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(201).json({ message: "Signup successful" });
  } catch (error) {
    console.error("Error signing up user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Login endpoint
app.post("/login", async (req, res) => {
  const { rollNo, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ rollNo: rollNo });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, "secret_key", {
      expiresIn: "1h",
    });

    // Send the token in the response
    res.status(200).json({ token: token });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Dashboard endpoint (protected)
app.get("/dashboard", authenticateToken, async (req, res) => {
  try {
    // Fetch user's attempts or other necessary data for the dashboard
    // Return the data as JSON
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Logout endpoint

app.post("/logout", (req, res) => {
  try {
   
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error logging out:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    return res.sendStatus(401);
  }

  jwt.verify(token, "secret_key", (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
}

// Attempts endpoint
app.get("/attempts", authenticateToken, async (req, res) => {
  try {
    // Fetch attempts for the authenticated user
    const attempts = await Attempt.find({ userId: req.user.userId });

    // Send the attempts data as JSON
    res.status(200).json(attempts);
  } catch (error) {
    console.error("Error fetching attempts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start quiz endpoint
app.get("/startquiz", async (req, res) => {
  try {
    // Fetch random questions from the Questions collection
    const questions = await Question.aggregate([{ $sample: { size: 5 } }]);

    // Send the questions data as JSON
    res.status(200).json(questions);
  } catch (error) {
    console.error("Error fetching questions for quiz:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
