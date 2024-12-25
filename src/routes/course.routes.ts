import { Router } from "express";
import { createCourse, createQuizForACourse, deletespecificCourse, retrieveAllCourses, retrieveAllQuizForACourse, retrievespecificCourse, updatespecificCourse } from "../controllers/course.controller.js";

const router = Router();

router.route("/courses")
.get(retrieveAllCourses)
.post(createCourse);

router.route("/courses/:courseId")
.get(retrievespecificCourse)
.patch(updatespecificCourse)
.delete(deletespecificCourse)


router.route("/courses/:courseId/quizzes")
.get(retrieveAllQuizForACourse)
.post(createQuizForACourse)


export default router;