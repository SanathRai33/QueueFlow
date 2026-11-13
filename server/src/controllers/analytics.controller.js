const prisma = require("../config/db");
const { getQueueAnalytics } = require("../services/analytics.service");

const isValidTimezone = (tz) => {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: tz });
    return true;
  } catch (err) {
    return false;
  }
};

const getAnalytics = async (req, res, next) => {
  try {
    const queue = await prisma.queue.findFirst({
      where: { id: req.params.id, managerId: req.managerId },
    });

    if (!queue) {
      return res.status(404).json({ message: "Queue not found" });
    }

    const days = Number(req.query.days) || 7;
    if (![1, 7, 30].includes(days)) {
      return res.status(400).json({ message: "Days must be 1, 7 or 30" });
    }

    const tz = req.query.tz || "UTC";
    if (!isValidTimezone(tz)) {
      return res.status(400).json({ message: "Invalid timezone" });
    }

    const analytics = await getQueueAnalytics(queue.id, days, tz);

    res.json({ queue: { id: queue.id, name: queue.name }, days, ...analytics });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAnalytics };
