import { Request, Response } from "express";
import { Types } from "mongoose";
import Question from "../models/quizModels/question.model.js";
import { Quiz } from "../models/quizModels/quiz.model.js";
import { IdParamType, UpdatespecificQuizRequestBodyType } from "../types/types.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { checkDocumentExistence } from "../utils/CheckExistence.js";
import { validateRequestBody } from "../utils/ValidateRequestBody.js";

const retrievespecificQuiz = asyncHandler(async(req:Request<IdParamType>,res:Response)=>{

    const {quizId} = req.params;

    if(!quizId){
        throw new ApiError(400,"Please provide valid Quiz Id");
    }
    if(!Types.ObjectId.isValid(quizId)){
        throw new ApiError(400,"Invalid Quiz ID")
    }

    const quiz = await Quiz.findById(quizId);

    if(!quiz){
        throw new ApiError(404,"No such Quiz exists");
    }

    return res.status(200).json(
        new ApiResponse(200,quiz,"Quiz Fetched successfully")
    );


})

const updatespecificQuiz = asyncHandler(async(req:Request<IdParamType,{},UpdatespecificQuizRequestBodyType>, res:Response)=>{

    validateRequestBody(req.body);

    const { quizId } = req.params;
    if(!quizId){
        throw new ApiError(400,"Please provide Quiz ID");
    }
    if(!Types.ObjectId.isValid(quizId)){
        throw new ApiError(400,"Invalid Quiz ID")
    }

    const quiz = await checkDocumentExistence(quizId,'Quiz');
    if (!quiz) {
            throw new ApiError(404, 'Quiz not found');
    }
    const updateData = { ...req.body };
    
    if(updateData.courseId){
        const courseExists = await checkDocumentExistence(updateData.courseId as string,'Course');
        if (!courseExists) {
            throw new ApiError(404, 'Invalid Course ID, No such Course Exists');
        }
        updateData.courseId = Types.ObjectId.createFromHexString(updateData.courseId as string);
    }

    

    if(updateData.questions){
        if(!Array.isArray(updateData.questions)){
            throw new ApiError(400,"Questions should be an array of Question IDs")
        }

        const questionsObjectIds = updateData.questions.map((questionId: string | Types.ObjectId) => {
            if (!Types.ObjectId.isValid(questionId)) {
                throw new ApiError(400,`Invalid Question ID: ${questionId}`);
            }
            return Types.ObjectId.createFromHexString(questionId as string);
        });

        const questionIds = await Question.find({ '_id': { $in: questionsObjectIds } });

        if (questionIds.length !== questionsObjectIds.length) {
                throw new ApiError(400, 'One or more Question IDs are invalid');
        }

        updateData.questions = questionsObjectIds;

    }

    const updatedQuiz = await Quiz.findByIdAndUpdate(
        quizId, 
        { $set: updateData },  
        { new: true, runValidators: true }  
    );

    if (!updatedQuiz) {
        throw new ApiError(500, 'Unable to update the Quiz, please try again');
    }

    return res.status(200).json(
        new ApiResponse(200,updatedQuiz,"Quiz updated successfully")
    );

})

const deletespecificQuiz = asyncHandler(async(req:Request<IdParamType>,res:Response)=>{

    const {quizId} = req.params;
    if(!quizId){
        throw new ApiError(400,"Please provide valid Quiz ID");
    }
    if(!Types.ObjectId.isValid(quizId)){
        throw new ApiError(400,"Invalid Quiz ID")
    }
    const quizExists = await checkDocumentExistence(quizId,'Quiz');

    if(!quizExists){
        throw new ApiError(404,'No Quiz Found');
    }

    const deletedQuiz = await Quiz.findByIdAndDelete(quizId);

    if(!deletedQuiz){
        throw new ApiError(500,"Unable to delete the Quiz, Please try again");
    }

    return res.status(200).json(
        new ApiResponse(200,deletedQuiz,"Quiz Deleted Successfully")
    )


})


export {
    deletespecificQuiz, retrievespecificQuiz,
    updatespecificQuiz
};
