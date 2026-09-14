import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createDB } from "../db.js";
import { loginSchema, registerSchema } from "../schemas/auth.schemas.js";
import { formatZodErrors } from "../utils/formatZodErrors.js";
import {
  JWT_SECRET,
  JWT_EXPIRES_IN,
  TOKEN_COOKIE_NAME,
  TOKEN_COOKIE_MAX_AGE_MS,
} from "../config/env.js";

export const authRouter = Router();

const db = createDB();
const SALT_ROUNDS = 10;

authRouter.post("/login", async (req, res, next) => {
  try {
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
      res.status(422).json({ errors: formatZodErrors(result.error) });
      return;
    }

    const { email, password } = result.data;
    const authUsers = await db.getAll("auth_users");
    const user = authUsers.find((u) => u.email === email);

    if (!user) {
      res.status(422).json({
        errors: { email: { errors: ["Invalid email or password"] } },
      });
      return;
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatches) {
      res.status(422).json({
        errors: { password: { errors: ["Invalid email or password"] } },
      });
      return;
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.cookie(TOKEN_COOKIE_NAME, token, {
      httpOnly: true,
      maxAge: TOKEN_COOKIE_MAX_AGE_MS,
      sameSite: "lax",
    });

    res.json({ message: "logged in successfully" });
  } catch (error) {
    next(error);
  }
});

authRouter.post("/register", async (req, res, next) => {
  try {
    const result = registerSchema.safeParse(req.body);

    if (!result.success) {
      res.status(422).json({ errors: formatZodErrors(result.error) });
      return;
    }

    const { username, email, password } = result.data;
    const authUsers = await db.getAll("auth_users");
    const emailTaken = authUsers.some((u) => u.email === email);

    if (emailTaken) {
      res.status(422).json({
        errors: { email: { errors: ["Email is already registered"] } },
      });
      return;
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    await db.create("auth_users", {
      email,
      username,
      passwordHash,
      is_verified: false,
    });

    res.status(201).json({ message: "registered successfully" });
  } catch (error) {
    next(error);
  }
});

authRouter.post("/logout", (req, res) => {
  res.clearCookie(TOKEN_COOKIE_NAME);
  res.json({ message: "logged out successfully" });
});
