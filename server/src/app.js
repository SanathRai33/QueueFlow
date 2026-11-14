const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const healthRoutes = require("./routes/health.routes");
const authRoutes = require("./routes/auth.routes");
const queueRoutes = require("./routes/queue.routes");
const tokenRoutes = require("./routes/token.routes");
const analyticsRoutes = require("./routes/analytics.routes");

const app = express();
app.set('trust proxy', 1);

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());
app.use((req, res, next) => {
  req.body = req.body || {};
  next();
});

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/queues", queueRoutes);
app.use("/api/tokens", tokenRoutes);
app.use("/api/analytics", analyticsRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Request body is not valid JSON" });
  }
  if (err.status) {
    return res.status(err.status).json({ message: err.message });
  }
  console.error(err);
  res.status(500).json({ message: "Something went wrong" });
});

module.exports = app;
