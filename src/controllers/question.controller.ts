import { Request, Response } from "express";
import { Types } from "mongoose";
import Question from "../models/quizModels/question.model.js";
import { CreateUpdateQuestionRequestBodyType, IdParamType } from "../types/types.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { checkDocumentExistence } from "../utils/CheckExistence.js";
import { validateRequestBody } from "../utils/ValidateRequestBody.js";



const retrieveAllQuestions = asyncHandler(async(req:Request,res:Response)=>{

    const questions = await Question.find();
    if(!questions || questions.length === 0){
        throw new ApiError(404,"No Questions Found")
    }

    return res.status(200).json(
        new ApiResponse(200,questions,"Questions Fetched Successfully")
    );

})

const createQuestion = asyncHandler(async(req:Request<{},{},CreateUpdateQuestionRequestBodyType>,res:Response)=>{

    validateRequestBody(req.body);

    const newQuestion = await Question.create(req.body);

    if(!newQuestion){
        throw new ApiError(500,"Error in creating Question, please try again")
    };

    return res.status(201).json(
        new ApiResponse(201,newQuestion,"Question created successfully")
    );

})

const retrievespecificQuestion = asyncHandler(async(req:Request<IdParamType>,res:Response)=>{


    const {questionId} = req.params;
    if(!questionId){
        throw new ApiError(400,"Please provide valid Question ID in param")
    };

    if(!Types.ObjectId.isValid(questionId)){
        throw new ApiError(400,"Invalid Question ID")
    }

    const question = await Question.findById(questionId);

    if(!question){
        throw new ApiError(404,"No Such Question Exists");
    }

    return res.status(200).json(
        new ApiResponse(200,question,"Question Fetched Successfully")
    );

})

const updatespecificQuestion = asyncHandler(async(req:Request<IdParamType,{},CreateUpdateQuestionRequestBodyType>,res:Response)=>{

    validateRequestBody(req.body)

    const {questionId} = req.params;
    if(!questionId){
        throw new ApiError(400,"Please provide valid question ID in the Param")
    };

    
    if(!Types.ObjectId.isValid(questionId)){
        throw new ApiError(400,"Invalid Question ID")
    }

    const questionExists = await checkDocumentExistence(questionId,'Question');

    if(!questionExists){
        throw new ApiError(404,"No Such question exists")
    };
    if (!req.body.options.includes(req.body.answer)) {
        throw new ApiError(400,"Answer must belong from the Given option array")
    }
    const updatedQuestion = await Question.findByIdAndUpdate(questionId,{
        $set : req.body,
    },
    {new:true,runValidators:true});

    if(!updatedQuestion){
        throw new ApiError(500,"Error in updating the question, Please try again")
    };

    return res.status(200).json(
        new ApiResponse(200,updatedQuestion,"Question updated successfully")
    )

})

const deletespecificQuestion = asyncHandler(async(req:Request<IdParamType>,res:Response)=>{

    const {questionId} = req.params;
    if(!questionId){
        throw new ApiError(400,"Please provide valid question ID in param")
    };
    if(!Types.ObjectId.isValid(questionId)){
        throw new ApiError(400,"Invalid Question ID")
    }

    const deletedQuestion = await Question.findByIdAndDelete(questionId);

    if(!deletedQuestion){
        throw new ApiError(404,"No Such Question Exists")
    };

    return res.status(200).json(
        new ApiResponse(200,deletedQuestion,"Question deleted successfully")
    );
})

export {
    createQuestion, deletespecificQuestion, retrieveAllQuestions, retrievespecificQuestion,
    updatespecificQuestion
};
