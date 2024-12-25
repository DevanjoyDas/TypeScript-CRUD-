import { Router } from "express";
import { createChapter, deletespecificChapter, getAllChapters, retrievespecificChapter, updatespecificChapter } from "../controllers/chapter.controller.js";

const router = Router();

router.route("/chapters")
.get(getAllChapters)
.post(createChapter)

router.route("/chapters/:chapterId")
.get(retrievespecificChapter)
.patch(updatespecificChapter)
.delete(deletespecificChapter)

export default router;