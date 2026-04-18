import { Router, type IRouter } from "express";
import healthRouter from "./health";
import savesRouter from "./saves";
import newsletterRouter from "./newsletter";

const router: IRouter = Router();

router.use(healthRouter);
router.use(savesRouter);
router.use(newsletterRouter);

export default router;
