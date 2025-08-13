import express from "express";
import AuthRouter from './auth.routes'
import ProductRouter from './product.route'
import CartRouter from './cart.route'
import CheckoutRouter from './checkout'
import orderRouter from './order.route'
const router = express.Router();

router.use("/auth", AuthRouter);
router.use('/products',ProductRouter)
router.use('/cart',CartRouter)
router.use('/checkout',CheckoutRouter)
router.use('/order',orderRouter)

export default router;
