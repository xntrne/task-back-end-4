import { Router } from "express";
import { requireAuth } from "../middlewares/authMiddleware.js";

export const homeRouter = Router();

homeRouter.get("/home", requireAuth, (req, res) => {
  res.json({ message: `Welcome to the home page, ${req.user.email}!` });
});
