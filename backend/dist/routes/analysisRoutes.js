import { Router } from "express";
import { getSummary, getDrivers, getRiskFactors, getRecommendations } from "../services/index.js";
import { asyncHandler } from "../middleware/errorHandler.js";
const router = Router();
router.get("/summary", asyncHandler(async (_req, res) => {
    res.json(getSummary());
}));
router.get("/drivers", asyncHandler(async (_req, res) => {
    res.json(getDrivers());
}));
router.get("/risk-factors", asyncHandler(async (_req, res) => {
    res.json(getRiskFactors());
}));
router.get("/recommendations", asyncHandler(async (_req, res) => {
    res.json(getRecommendations());
}));
export const analysisRoutes = router;
