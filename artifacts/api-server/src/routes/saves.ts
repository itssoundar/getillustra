import { Router, type IRouter } from "express";
import { pool } from "../lib/db";
import { requireAuth, type AuthedRequest } from "../lib/auth";

const router: IRouter = Router();

router.get("/saves", requireAuth, async (req: AuthedRequest, res) => {
  const { rows } = await pool.query(
    `SELECT illustration_slug, created_at FROM saves WHERE user_id = $1 ORDER BY created_at DESC`,
    [req.userId],
  );
  res.json({ saves: rows });
});

router.post("/saves", requireAuth, async (req: AuthedRequest, res) => {
  const { slug } = req.body as { slug?: string };
  if (!slug) {
    res.status(400).json({ error: "slug required" });
    return;
  }
  await pool.query(
    `INSERT INTO saves (user_id, illustration_slug) VALUES ($1, $2)
     ON CONFLICT (user_id, illustration_slug) DO NOTHING`,
    [req.userId, slug],
  );
  res.json({ ok: true });
});

router.delete("/saves/:slug", requireAuth, async (req: AuthedRequest, res) => {
  await pool.query(`DELETE FROM saves WHERE user_id = $1 AND illustration_slug = $2`, [
    req.userId,
    req.params.slug,
  ]);
  res.json({ ok: true });
});

export default router;
