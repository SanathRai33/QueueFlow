const prisma = require("../config/db");

const createQueue = async (req, res, next) => {
  try {
    const name = req.body.name ? req.body.name.trim() : "";

    if (!name) {
      return res.status(400).json({ message: "Queue name is required" });
    }

    if (name.length > 50) {
      return res
        .status(400)
        .json({ message: "Queue name must be under 50 characters" });
    }

    const queue = await prisma.queue.create({
      data: { name, managerId: req.managerId },
    });

    res.status(201).json({ queue });
  } catch (err) {
    if (err.code === "P2002") {
      return res
        .status(409)
        .json({ message: "You already have a queue with this name" });
    }
    next(err);
  }
};

const getQueues = async (req, res, next) => {
  try {
    const queues = await prisma.queue.findMany({
      where: { managerId: req.managerId },
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { tokens: { where: { status: "WAITING" } } } },
        tokens: {
          where: { status: "SERVING" },
          take: 1,
          select: { tokenNumber: true, personName: true },
        },
      },
    });

    const result = queues.map((queue) => ({
      id: queue.id,
      name: queue.name,
      createdAt: queue.createdAt,
      waitingCount: queue._count.tokens,
      nowServing: queue.tokens[0] || null,
    }));

    res.json({ queues: result });
  } catch (err) {
    next(err);
  }
};

const getQueueById = async (req, res, next) => {
  try {
    const queue = await prisma.queue.findFirst({
      where: { id: req.params.id, managerId: req.managerId },
    });

    if (!queue) {
      return res.status(404).json({ message: "Queue not found" });
    }

    const waiting = await prisma.token.findMany({
      where: { queueId: queue.id, status: "WAITING" },
      orderBy: { position: "asc" },
    });

    const nowServing = await prisma.token.findFirst({
      where: { queueId: queue.id, status: "SERVING" },
    });

    const recentlyServed = await prisma.token.findMany({
      where: { queueId: queue.id, status: "SERVED" },
      orderBy: { completedAt: "desc" },
      take: 5,
    });

    res.json({
      queue: { id: queue.id, name: queue.name, createdAt: queue.createdAt },
      waiting,
      nowServing,
      recentlyServed,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { createQueue, getQueues, getQueueById };
