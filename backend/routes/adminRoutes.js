const express = require("express");
const Patient=require("../models/Patient")
const Dentist=require("../models/Dentist")
const Checkup=require("../models/Checkup")
const router = express.Router();


router.get("/dentist/checkups/:id", async (req, res) => {
  try {
    const dentistId = req.params.id;

    // Fetch all checkups related to the dentistId
    const checkups = await Checkup.find({ dentistId })
      .populate("patientId", "name email") 
      .sort({ createdAt: -1 }); 
    res.status(200).json({ checkups });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/checkup/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const checkup = await Checkup.findById(id)
      .populate("patientId") 
      .populate("dentistId"); 

    if (!checkup) {
      return res.status(404).json({ error: "Checkup not found" });
    }

    res.json({ checkup });
  } catch (err) {
    console.error("Error fetching checkup:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/checkup/:id", async (req, res) => {
  const { id } = req.params;
  const { status, scheduledTime, newImageNote } = req.body;

  try {
    const checkup = await Checkup.findById(id);
    if (!checkup) {
      return res.status(404).json({ message: "Checkup not found" });
    }

    // Update fields if provided
    if (status) {
      checkup.status = status;
    }

    if (scheduledTime) {
      checkup.scheduledTime = new Date(scheduledTime);
    }

    if (newImageNote && newImageNote.image && newImageNote.note) {
      checkup.images.push({
        image: newImageNote.image,
        note: newImageNote.note,
      });
    }

    await checkup.save();
    res.status(200).json({ message: "Checkup updated", checkup });
  } catch (err) {
    console.error("Error updating checkup:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.patch("/api/checkups/:id/status", async (req, res) => {
  const { status } = req.body; // Expect status to be 'accepted', 'rejected', or 'completed'

  if (!["accepted", "rejected", "completed"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  try {
    const checkup = await Checkup.findById(req.params.id);

    if (!checkup) {
      return res.status(404).json({ error: "Checkup not found" });
    }

    // Update the checkup status
    checkup.status = status;
    await checkup.save();

    res.json({ message: `Checkup status updated to ${status}`, checkup });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.patch("/api/checkups/:id/accept", async (req, res) => {
  try {
    const checkup = await Checkup.findById(req.params.id);
    if (!checkup) {
      return res.status(404).json({ message: "Checkup not found" });
    }

    // Check if the dentist is accepting the checkup
    const dentist = await Dentist.findById(checkup.dentistId);
    if (!dentist) {
      return res.status(404).json({ message: "Dentist not found" });
    }

    // Only allow the dentist to accept if they are the one assigned to the checkup
    if (req.body.dentistId !== checkup.dentistId.toString()) {
      return res.status(403).json({ message: "Unauthorized action" });
    }

    // Update checkup status to 'accepted'
    checkup.status = "accepted";
    await checkup.save();

    res.json({ message: "Appointment accepted", checkup });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/api/dentist/:id", async (req, res) => {
  try {
    const dentist = await Dentist.findById(req.params.id);
    if (!dentist) {
      return res.status(404).json({ message: "Dentist not found" });
    }
    res.json(dentist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;