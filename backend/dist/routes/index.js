import { Router } from "express";
import { analysisRoutes } from "./analysisRoutes.js";
const router = Router();
router.use("/", analysisRoutes);
export const routes = router;
