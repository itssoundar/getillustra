import { Router, type IRouter } from "express";
import { pool } from "../lib/db";

const router: IRouter = Router();

router.post("/newsletter", async (req, res) => {
  const { email } = req.body as { email?: string };
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res.status(400).json({ error: "valid email required" });
    return;
  }
  await pool.query(
    `INSERT INTO newsletter_signups (email) VALUES ($1) ON CONFLICT (email) DO NOTHING`,
    [email],
  );
  res.json({ ok: true });
});

export default router;
