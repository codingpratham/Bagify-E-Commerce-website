import express from "express";
import { authMiddleware} from "../middleware/protectedRoute";
import { addToCart, clearCart, getCart, removeFromCart } from "../controller/cart.controller";
const router = express.Router()

router.get("/",authMiddleware,getCart)
router.post("/add",authMiddleware,addToCart)
router.delete("/remove/:cartItemId",authMiddleware,removeFromCart)
router.delete('/clear', authMiddleware,clearCart);

export default router;