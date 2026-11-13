const prisma = require("../config/db");
const {
  addTokenToQueue,
  moveTokenInQueue,
  serveNextToken,
  completeCurrentToken,
  cancelTokenInQueue,
} = require("../services/token.service");

const findOwnedQueue = (queueId, managerId) => {
  return prisma.queue.findFirst({ where: { id: queueId, managerId } });
};

const findOwnedToken = (tokenId, managerId) => {
  return prisma.token.findFirst({
    where: { id: tokenId, queue: { managerId } },
  });
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

const moveToken = async (req, res, next) => {
  try {
    const { direction } = req.body;

    if (direction !== "up" && direction !== "down") {
      return res.status(400).json({ message: "Direction must be up or down" });
    }

    const token = await findOwnedToken(req.params.id, req.managerId);
    if (!token) {
      return res.status(404).json({ message: "Token not found" });
    }

    const tokens = await moveTokenInQueue(token.id, token.queueId, direction);

    res.json({ tokens });
  } catch (err) {
    next(err);
  }
};

const cancelToken = async (req, res, next) => {
  try {
    const token = await findOwnedToken(req.params.id, req.managerId);
    if (!token) {
      return res.status(404).json({ message: "Token not found" });
    }

    const tokens = await cancelTokenInQueue(token.id, token.queueId);

    res.json({ tokens });
  } catch (err) {
    next(err);
  }
};

const serveNext = async (req, res, next) => {
  try {
    const queue = await findOwnedQueue(req.params.id, req.managerId);
    if (!queue) {
      return res.status(404).json({ message: "Queue not found" });
    }

    const token = await serveNextToken(queue.id);

    res.json({ token });
  } catch (err) {
    next(err);
  }
};

const completeCurrent = async (req, res, next) => {
  try {
    const queue = await findOwnedQueue(req.params.id, req.managerId);
    if (!queue) {
      return res.status(404).json({ message: "Queue not found" });
    }

    const token = await completeCurrentToken(queue.id);

    res.json({ token });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  addToken,
  getWaitingTokens,
  moveToken,
  cancelToken,
  serveNext,
  completeCurrent,
};
