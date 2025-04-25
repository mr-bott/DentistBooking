const express = require("express");
const Patient = require("../models/Patient");
const Dentist = require("../models/Dentist");
const Checkup = require("../models/Checkup");
const router = express.Router();


// Signup route user
router.post("/api/register/patient", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const patient = new Patient({ name, email, password: hash });
    await patient.save();
    res.status(201).json({ message: "Patient registered" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// SignUp  route dentist
router.post("/api/register/dentist", async (req, res) => {
  try {
    const { name, email, password, description } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const dentist = new Dentist({ name, email, password: hash, description });
    await dentist.save();
    res.status(201).json({ message: "Dentist registered" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Login route

router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await Dentist.findOne({ email });
    let role = "dentist";

    if (!user) {
      user = await Patient.findOne({ email });
      role = "patient";
    }

    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id, role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      message: "Login successful",
      token,
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
});


module.exports = router;
