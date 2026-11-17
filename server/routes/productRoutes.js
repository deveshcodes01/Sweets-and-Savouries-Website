import { Router } from "express";
import {
  getProducts,
  getProduct,
  getCategory,
} from "../controllers/productController.js";
const router = Router();
router.get("/", getProducts);
router.get("/category/:category", getCategory);
router.get("/:id", getProduct);
export default router;
