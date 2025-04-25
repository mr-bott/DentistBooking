const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcryptjs");
const app = express();
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;

const router = express.Router();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer setup for file uploads
const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// Upload image to Cloudinary
async function uploadToCloudinary(filepath) {
  const result = await cloudinary.uploader.upload(filepath, {
    folder: "images",
  });
  return result.secure_url;
}

// Route: POST /uploadprojectimage
router.post("/uploadprojectimage", upload.single("image"), async (req, res) => {
  try {
    const result = await uploadToCloudinary(req.file.path);
    res.json({ imageUrl: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to upload image" });
  }
});

module.exports = router;
