import { Router } from "express";
import { deletespecificQuiz, retrievespecificQuiz, updatespecificQuiz } from "../controllers/quiz.controller.js";


const router = Router();

router.route("/quizzes/:quizId")
.get(retrievespecificQuiz)
.patch(updatespecificQuiz)
.delete(deletespecificQuiz)





export default router;