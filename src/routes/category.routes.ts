import { Router } from "express";
import { createCategory, deletespecificCategory, retrieveAllCategory, retrievespecificCategory } from "../controllers/category.controller.js";

const router = Router();

router.route("/category")
.get(retrieveAllCategory)
.post(createCategory)

router.route("/category/:categoryId")
.get(retrievespecificCategory)
.delete(deletespecificCategory)

export default router;