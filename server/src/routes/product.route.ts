import express from "express";
import { admin, authMiddleware } from "../middleware/protectedRoute";
import { addProducts, deleteProduct, getOnlyAdminProducts, getProdectDescription, getProducts, updateProduct } from "../controller/products.controller";
import { upload } from "../middleware/multer";
const router = express.Router();

router.get("/",getProducts)
router.post("/",authMiddleware,upload.single("image"),addProducts)
router.put("/:id", authMiddleware, upload.single("image"), updateProduct);
router.delete("/:id",authMiddleware,deleteProduct)
router.get("/description/:id", getProdectDescription);
router.get("/admin",authMiddleware,getOnlyAdminProducts)



export default router;