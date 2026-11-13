const prisma = require("../config/db");

const fail = (status, message) => {
  const err = new Error(message);
  err.status = status;
  return err;
};

const lockQueue = (tx, queueId) => {
  return tx.$queryRaw`SELECT id FROM "Queue" WHERE id = ${queueId} FOR UPDATE`;
};

const getWaitingList = (tx, queueId) => {
  return tx.token.findMany({
    where: { queueId, status: "WAITING" },
    orderBy: { position: "asc" },
  });
};

const addTokenToQueue = (queueId, personName) => {
  return prisma.$transaction(async (tx) => {
    const queue = await tx.queue.update({
      where: { id: queueId },
      data: { tokenCounter: { increment: 1 } },
    });

    const last = await tx.token.aggregate({
      where: { queueId, status: "WAITING" },
      _max: { position: true },
    });

    return tx.token.create({
      data: {
        queueId,
        personName,
        tokenNumber: queue.tokenCounter,
        position: (last._max.position || 0) + 1,
      },
    });
  });
};

const moveTokenInQueue = (tokenId, queueId, direction) => {
  return prisma.$transaction(async (tx) => {
    await lockQueue(tx, queueId);

    const token = await tx.token.findUnique({ where: { id: tokenId } });
    if (!token || token.status !== "WAITING") {
      throw fail(400, "Only waiting tokens can be moved");
    }

    const goingUp = direction === "up";

    const neighbour = await tx.token.findFirst({
      where: {
        queueId,
        status: "WAITING",
        position: goingUp ? { lt: token.position } : { gt: token.position },
      },
      orderBy: { position: goingUp ? "desc" : "asc" },
    });

    if (!neighbour) {
      throw fail(
        400,
        goingUp
          ? "Token is already at the top"
          : "Token is already at the bottom",
      );
    }

    await tx.token.update({
      where: { id: token.id },
      data: { position: neighbour.position },
    });
    await tx.token.update({
      where: { id: neighbour.id },
      data: { position: token.position },
    });

    return getWaitingList(tx, queueId);
  });
};

const serveNextToken = (queueId) => {
  return prisma.$transaction(async (tx) => {
    await lockQueue(tx, queueId);

    const top = await tx.token.findFirst({
      where: { queueId, status: "WAITING" },
      orderBy: { position: "asc" },
    });

    if (!top) {
      throw fail(400, "No one is waiting in this queue");
    }

    const now = new Date();

    await tx.token.updateMany({
      where: { queueId, status: "SERVING" },
      data: { status: "SERVED", completedAt: now },
    });

    return tx.token.update({
      where: { id: top.id },
      data: { status: "SERVING", servedAt: now },
    });
  });
};

const completeCurrentToken = (queueId) => {
  return prisma.$transaction(async (tx) => {
    await lockQueue(tx, queueId);

    const current = await tx.token.findFirst({
      where: { queueId, status: "SERVING" },
    });

    if (!current) {
      throw fail(400, "No token is being served right now");
    }

    return tx.token.update({
      where: { id: current.id },
      data: { status: "SERVED", completedAt: new Date() },
    });
  });
};

const cancelTokenInQueue = (tokenId, queueId) => {
  return prisma.$transaction(async (tx) => {
    await lockQueue(tx, queueId);

    const token = await tx.token.findUnique({ where: { id: tokenId } });
    if (!token || token.status !== "WAITING") {
      throw fail(400, "Only waiting tokens can be cancelled");
    }

    await tx.token.update({
      where: { id: token.id },
      data: { status: "CANCELLED", cancelledAt: new Date() },
    });

    return getWaitingList(tx, queueId);
  });
};

module.exports = {
  addTokenToQueue,
  moveTokenInQueue,
  serveNextToken,
  completeCurrentToken,
  cancelTokenInQueue,
};
