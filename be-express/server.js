require("dotenv").config();
const express = require("express");
const cors = require("cors");

const questionsRouter = require("./routes/questions");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/questions", questionsRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
