
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use(require("./routes/authRoutes"));
app.use(require("./routes/adminRoutes"));
app.use(require("./routes/userRoutes"));
app.use(require("./routes/mailerRoutes"));
app.use(require("./routes/UploadRoutes")); 

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
