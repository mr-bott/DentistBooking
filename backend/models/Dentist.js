const mongoose = require("mongoose");

const dentistSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    description: String,
  },
  { timestamps: true }
);


module.exports = mongoose.model("Dentist", dentistSchema);
