const prisma = require("../config/db");

const DAY = 24 * 60 * 60 * 1000;

const getSummary = async (queueId, from, to) => {
  const rows = await prisma.$queryRaw`
    SELECT
      COUNT(*)::int AS total,
      COUNT(*) FILTER (WHERE "servedAt" IS NOT NULL)::int AS served,
      COUNT(*) FILTER (WHERE status = 'CANCELLED')::int AS cancelled,
      COALESCE(
        AVG(EXTRACT(EPOCH FROM ("servedAt" - "createdAt")) / 60)
          FILTER (WHERE "servedAt" IS NOT NULL),
        0
      )::float AS "avgWait"
    FROM "Token"
    WHERE "queueId" = ${queueId}
      AND "createdAt" >= ${from}
      AND "createdAt" < ${to}
  `;
  return rows[0];
};

const getWaitByHour = (queueId, from, tz) => {
  return prisma.$queryRaw`
    SELECT
      EXTRACT(HOUR FROM ("createdAt" AT TIME ZONE 'UTC' AT TIME ZONE ${tz}::text))::int AS hour,
      AVG(EXTRACT(EPOCH FROM ("servedAt" - "createdAt")) / 60)::float AS "avgWait",
      COUNT(*)::int AS count
    FROM "Token"
    WHERE "queueId" = ${queueId}
      AND "servedAt" IS NOT NULL
      AND "createdAt" >= ${from}
    GROUP BY hour
    ORDER BY hour
  `;
};

const getLengthTrend = (queueId, from, unit, format, tz) => {
  return prisma.$queryRaw`
    SELECT
      to_char(
        date_trunc(${unit}::text, "recordedAt" AT TIME ZONE 'UTC' AT TIME ZONE ${tz}::text),
        ${format}::text
      ) AS label,
      MAX(length)::int AS "peakLength"
    FROM "QueueSnapshot"
    WHERE "queueId" = ${queueId}
      AND "recordedAt" >= ${from}
    GROUP BY label
    ORDER BY MIN("recordedAt")
  `;
};

const toMinutes = (from, to) => {
  return Math.round(((to - from) / 60000) * 10) / 10;
};

const getQueueAnalytics = async (queueId, days, tz) => {
  const to = new Date();
  const from = new Date(to.getTime() - days * DAY);
  const previousFrom = new Date(from.getTime() - days * DAY);

  const unit = days === 1 ? "hour" : "day";
  const format = days === 1 ? "DD Mon HH24:00" : "DD Mon";

  const [current, previous, waitByHour, lengthTrend, currentlyWaiting, recent] =
    await Promise.all([
      getSummary(queueId, from, to),
      getSummary(queueId, previousFrom, from),
      getWaitByHour(queueId, from, tz),
      getLengthTrend(queueId, from, unit, format, tz),
      prisma.token.count({ where: { queueId, status: "WAITING" } }),
      prisma.token.findMany({
        where: { queueId },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
    ]);

  const cancellationRate =
    current.total > 0
      ? Math.round((current.cancelled / current.total) * 1000) / 10
      : 0;

  return {
    summary: {
      avgWaitMinutes: Math.round(current.avgWait * 10) / 10,
      servedCount: current.served,
      cancelledCount: current.cancelled,
      cancellationRate,
      currentlyWaiting,
    },
    previous: {
      avgWaitMinutes: Math.round(previous.avgWait * 10) / 10,
      servedCount: previous.served,
    },
    waitByHour: waitByHour.map((row) => ({
      hour: row.hour,
      avgWaitMinutes: Math.round(row.avgWait * 10) / 10,
      count: row.count,
    })),
    lengthTrend,
    recentTokens: recent.map((token) => ({
      id: token.id,
      tokenNumber: token.tokenNumber,
      personName: token.personName,
      status: token.status,
      createdAt: token.createdAt,
      waitMinutes: token.servedAt
        ? toMinutes(token.createdAt, token.servedAt)
        : null,
    })),
  };
};

module.exports = { getQueueAnalytics };
