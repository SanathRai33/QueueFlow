const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const MINUTE = 60 * 1000;
const DAY = 24 * 60 * MINUTE;

const demoEmail = "demo@queueflow.com";
const demoPassword = "demo1234";
const queueNames = ["Billing Counter", "Customer Support"];

const names = [
  "Ravi",
  "Anita",
  "John",
  "Meena",
  "Karthik",
  "Divya",
  "Arjun",
  "Sneha",
  "Imran",
  "Lakshmi",
  "Rahul",
  "Pooja",
  "Vikram",
  "Nisha",
  "Suresh",
  "Priya",
  "Manoj",
  "Kavya",
  "Ajay",
  "Farah",
];

const randomBetween = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const pickName = () => names[randomBetween(0, names.length - 1)];

const finishedToken = (time) => {
  const createdAt = new Date(time);

  if (Math.random() < 0.12) {
    return {
      personName: pickName(),
      createdAt,
      status: "CANCELLED",
      position: 0,
      servedAt: null,
      completedAt: null,
      cancelledAt: new Date(time + randomBetween(2, 20) * MINUTE),
    };
  }

  const servedAt = new Date(time + randomBetween(4, 45) * MINUTE);
  const completedAt = new Date(
    servedAt.getTime() + randomBetween(4, 15) * MINUTE,
  );

  return {
    personName: pickName(),
    createdAt,
    status: "SERVED",
    position: 0,
    servedAt,
    completedAt,
    cancelledAt: null,
  };
};

const buildTokens = () => {
  const now = Date.now();
  const tokens = [];

  for (let daysAgo = 13; daysAgo >= 1; daysAgo--) {
    const dayStart = new Date(now - daysAgo * DAY);
    dayStart.setUTCHours(3, 30, 0, 0);

    const count = randomBetween(6, 14);
    for (let i = 0; i < count; i++) {
      tokens.push(
        finishedToken(dayStart.getTime() + randomBetween(0, 480) * MINUTE),
      );
    }
  }

  tokens.push(finishedToken(now - 120 * MINUTE));
  tokens.push(finishedToken(now - 100 * MINUTE));

  tokens.push({
    personName: pickName(),
    createdAt: new Date(now - 35 * MINUTE),
    status: "SERVING",
    position: 0,
    servedAt: new Date(now - 8 * MINUTE),
    completedAt: null,
    cancelledAt: null,
  });

  [25, 18, 12, 6].forEach((minutesAgo) => {
    tokens.push({
      personName: pickName(),
      createdAt: new Date(now - minutesAgo * MINUTE),
      status: "WAITING",
      position: 0,
      servedAt: null,
      completedAt: null,
      cancelledAt: null,
    });
  });

  tokens.sort((a, b) => a.createdAt - b.createdAt);

  let nextPosition = 1;
  tokens.forEach((token, index) => {
    token.tokenNumber = index + 1;
    if (token.status === "WAITING") {
      token.position = nextPosition;
      nextPosition += 1;
    }
  });

  return tokens;
};

const buildSnapshots = (queueId, tokens) => {
  const events = [];

  tokens.forEach((token) => {
    events.push({ time: token.createdAt.getTime(), change: 1 });
    const leftAt = token.servedAt || token.cancelledAt;
    if (leftAt) {
      events.push({ time: leftAt.getTime(), change: -1 });
    }
  });

  events.sort((a, b) => a.time - b.time);

  let length = 0;
  return events.map((event) => {
    length += event.change;
    return { queueId, length, recordedAt: new Date(event.time) };
  });
};

const main = async () => {
  await prisma.manager.deleteMany({ where: { email: demoEmail } });

  const manager = await prisma.manager.create({
    data: {
      name: "Demo Manager",
      email: demoEmail,
      passwordHash: await bcrypt.hash(demoPassword, 10),
    },
  });

  for (const name of queueNames) {
    const tokens = buildTokens();

    const queue = await prisma.queue.create({
      data: { name, managerId: manager.id, tokenCounter: tokens.length },
    });

    await prisma.token.createMany({
      data: tokens.map((token) => ({ ...token, queueId: queue.id })),
    });

    await prisma.queueSnapshot.createMany({
      data: buildSnapshots(queue.id, tokens),
    });
  }

  console.log(`Seeded demo data. Login: ${demoEmail} / ${demoPassword}`);
};

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
