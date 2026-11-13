const prisma = require("../config/db");

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

module.exports = { addTokenToQueue };
