import { createQuestion, deletespecificQuestion, retrieveAllQuestions, retrievespecificQuestion, updatespecificQuestion } from "../controllers/question.controller.js"
import { Router } from "express"

const router = Router();

router.route("/questions")
.get(retrieveAllQuestions)
.post(createQuestion)

router.route("/questions/:questionId")
.get(retrievespecificQuestion)
.patch(updatespecificQuestion)
.delete(deletespecificQuestion)

export default router;