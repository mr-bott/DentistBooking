const express = require("express");
const Patient = require("../models/Patient");
const Dentist = require("../models/Dentist");
const Checkup = require("../models/Checkup");
const router = express.Router();

router.get("/api/dentists", async (req, res) => {
  try {
    const dentists = await Dentist.find({}, { password: 0 });
    res.json(dentists);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/api/checkups", async (req, res) => {
  try {
    const { patientId, dentistId, scheduledTime } = req.body;

    // Check if the dentist exists
    const dentist = await Dentist.findById(dentistId);
    if (!dentist) {
      console.log(dentistId);
      return res.status(404).json({ message: "Dentist not found" });
    }

    // Check if the patient exists
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const checkup = new Checkup({
      patientId,
      dentistId,
      scheduledTime,
      images: [], // No images at booking time
      status: "pending", // Set status as pending
    });

    await checkup.save();

    res
      .status(201)
      .json({ message: "Appointment booked successfully", checkup });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get("/api/dentists", async (req, res) => {
  try {
    const dentists = await Dentist.find();
    res.json(dentists);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/api/checkups/patient/:id", async (req, res) => {
  try {
    const checkups = await Checkup.find({ patientId: req.params.id })
      .populate("dentistId", "name email description")
      .sort({ createdAt: -1 });
    res.json(checkups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
