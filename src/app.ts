import express from "express"
import cors from "cors"

const app = express();

app.use(cors({
    origin: "*"
}))

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(express.static("public"));

   

// Importing Routes 

import CourseRouter from "./routes/course.routes.js"
import QuizRouter from "./routes/quiz.routes.js"
import CategoryRouter from "./routes/category.routes.js"
import ChapterRouter from "./routes/chapter.routes.js"
import QuestionRouter from "./routes/question.routes.js"
import { errorMiddleware } from "./middlewares/error.middleware.js";


// Routes Declaration

app.use("/api/v1",CourseRouter);
app.use("/api/v1",QuizRouter)
app.use("/api/v1",CategoryRouter)
app.use("/api/v1",ChapterRouter)
app.use("/api/v1",QuestionRouter)
app.use(errorMiddleware);





export {app};