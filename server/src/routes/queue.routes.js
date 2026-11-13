const express = require("express");
const {
  createQueue,
  getQueues,
  getQueueById,
} = require("../controllers/queue.controller");
const requireAuth = require("../middleware/auth.middleware");

const router = express.Router();

router.use(requireAuth);

router.get("/", getQueues);
router.post("/", createQueue);
router.get("/:id", getQueueById);

module.exports = router;
