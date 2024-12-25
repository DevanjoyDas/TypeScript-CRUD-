import { Category } from "../models/courseModels/category.model.js";
import { Chapter } from "../models/courseModels/chapter.model.js";
import { Course } from "../models/courseModels/course.model.js";
import Question from "../models/quizModels/question.model.js";
import { Quiz } from "../models/quizModels/quiz.model.js";

export const checkDocumentExistence = async (id:string,model:string)=>{
    let documentExists;

    if(model === 'Course'){
        documentExists = await Course.findById(id);
    }
    else if(model === 'Category'){
        documentExists = await Category.findById(id);
    }
    else if(model === 'Chapters'){
        documentExists = await Chapter.findById(id);
    }
    else if(model === 'Question'){
        documentExists = await Question.findById(id);
    }
    else if(model === 'Quiz'){
        documentExists = await Quiz.findById(id);
    }
    else if(model === 'Question'){
        documentExists = await Question.findById(id)
    }

    if(documentExists){
        return true;
    }

    return false;
}

