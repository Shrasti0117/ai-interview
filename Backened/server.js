require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./Config/db");

const app = express();
connectDB();

app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

app.use("/api/auth", require("./routes/authroutes"));
app.use("/api/interview", require("./routes/interviewroutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


