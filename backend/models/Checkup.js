const mongoose = require("mongoose");

const imageNoteSchema = new mongoose.Schema({
  image: { type: String, required: true },
  note: { type: String, required: true },
});

// Checkup schema with status and scheduledTime
const checkupSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    dentistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dentist",
      required: true,
    },
    images: [imageNoteSchema],
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed"],
      default: "pending",
    },
    scheduledTime: {
      type: Date,
      required: true, 
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Checkup", checkupSchema);
