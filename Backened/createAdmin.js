require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/user");

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const email = "admin@interview.com";
    const password = "InterviewAce@2026!Admin"; // Stronger password to avoid breach warnings

    let user = await User.findOne({ email });

    if (user) {
      user.role = "admin";
      user.password = password; // Update to the new strong password
      await user.save();
      console.log("Existing user promoted to admin and password updated");
    } else {
      user = await User.create({
        name: "Platform Admin",
        email,
        password,
        role: "admin"
      });
      console.log("New admin user created");
    }

    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error.message);
    process.exit(1);
  }
};

createAdmin();
