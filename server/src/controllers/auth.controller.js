const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../config/db");

const createToken = (managerId) => {
  return jwt.sign({ managerId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const cleanEmail = email.trim().toLowerCase();

    const existing = await prisma.manager.findUnique({
      where: { email: cleanEmail },
    });
    if (existing) {
      return res.status(409).json({ message: "Email is already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const manager = await prisma.manager.create({
      data: {
        name: name ? name.trim() : null,
        email: cleanEmail,
        passwordHash,
      },
    });

    res.status(201).json({
      token: createToken(manager.id),
      manager: { id: manager.id, name: manager.name, email: manager.email },
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const manager = await prisma.manager.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (!manager) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      manager.passwordHash,
    );
    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      token: createToken(manager.id),
      manager: { id: manager.id, name: manager.name, email: manager.email },
    });
  } catch (err) {
    next(err);
  }
};

const getMe = async (req, res, next) => {
  try {
    const manager = await prisma.manager.findUnique({
      where: { id: req.managerId },
      select: { id: true, name: true, email: true },
    });

    if (!manager) {
      return res.status(404).json({ message: "Manager not found" });
    }

    res.json({ manager });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, getMe };
