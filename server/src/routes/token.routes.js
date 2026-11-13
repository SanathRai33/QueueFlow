const express = require("express");
const { moveToken, cancelToken } = require("../controllers/token.controller");
const requireAuth = require("../middleware/auth.middleware");

const router = express.Router();

router.use(requireAuth);

router.patch("/:id/move", moveToken);
router.patch("/:id/cancel", cancelToken);

module.exports = router;
