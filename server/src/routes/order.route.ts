import e from "express";
import { authMiddleware } from "../middleware/protectedRoute";
import { getOrders } from "../controller/order.controller";
const router =  e.Router()

router.get("/get",authMiddleware,getOrders)

export default router;