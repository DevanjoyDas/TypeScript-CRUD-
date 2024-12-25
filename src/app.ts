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
app.get('/', (req, res) => {
    res.send(`
        <html>
            <head>
                <title>Links Page</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        flex-direction: column;
                    }
                    a {
                        display: block;
                        margin: 10px;
                        font-size: 20px;
                        text-decoration: none;
                        color: #007BFF;
                    }
                    a:hover {
                        text-decoration: underline;
                    }
                </style>
            </head>
            <body>
                <h1>Welcome! Here are your links:</h1>
                <a href="https://drive.google.com/file/d/16FNnJcwMhglfSgvMg8_iZ3naizcf9e6Z/view?usp=sharing" target="_blank"><h2>Setup Instructions</h2></a>
                <a href="https://documenter.getpostman.com/view/30813346/2sAYJ4jM4Q" target="_blank"><h2>API Documentation</h2></a>
                <a href="https://github.com/DevanjoyDas/TypeScript-CRUD-" target="_blank"><h2>Github Repository of this Project</h2></a>
            </body>
        </html>
    `);
});

app.use("/api/v1",CourseRouter);
app.use("/api/v1",QuizRouter)
app.use("/api/v1",CategoryRouter)
app.use("/api/v1",ChapterRouter)
app.use("/api/v1",QuestionRouter)
app.use(errorMiddleware);





export {app};