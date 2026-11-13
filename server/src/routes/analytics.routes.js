const express = require("express");
const { getAnalytics } = require("../controllers/analytics.controller");
const requireAuth = require("../middleware/auth.middleware");

const router = express.Router();

router.use(requireAuth);

router.get("/queues/:id", getAnalytics);

module.exports = router;
