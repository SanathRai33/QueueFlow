const prisma = require("../config/db");
const { addTokenToQueue } = require("../services/token.service");

const findOwnedQueue = (queueId, managerId) => {
  return prisma.queue.findFirst({ where: { id: queueId, managerId } });
};

const addToken = async (req, res, next) => {
  try {
    const queue = await findOwnedQueue(req.params.id, req.managerId);
    if (!queue) {
      return res.status(404).json({ message: "Queue not found" });
    }

    const personName = req.body.personName ? req.body.personName.trim() : "";

    if (!personName) {
      return res.status(400).json({ message: "Person name is required" });
    }

    if (personName.length > 60) {
      return res
        .status(400)
        .json({ message: "Name must be under 60 characters" });
    }

    const token = await addTokenToQueue(queue.id, personName);

    res.status(201).json({ token });
  } catch (err) {
    next(err);
  }
};

const getWaitingTokens = async (req, res, next) => {
  try {
    const queue = await findOwnedQueue(req.params.id, req.managerId);
    if (!queue) {
      return res.status(404).json({ message: "Queue not found" });
    }

    const tokens = await prisma.token.findMany({
      where: { queueId: queue.id, status: "WAITING" },
      orderBy: { position: "asc" },
    });

    res.json({ tokens });
  } catch (err) {
    next(err);
  }
};

module.exports = { addToken, getWaitingTokens };
