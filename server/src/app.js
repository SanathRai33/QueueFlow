const express = require("express");
const cors = require("cors");
const healthRoutes = require("./routes/health.routes");
const authRoutes = require('./routes/auth.routes');

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

app.use("/api/health", healthRoutes);
app.use('/api/auth', authRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Something went wrong" });
});

module.exports = app;
