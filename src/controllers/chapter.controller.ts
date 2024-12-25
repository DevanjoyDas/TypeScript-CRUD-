import { Request, Response } from "express";
import { Types } from "mongoose";
import { Chapter } from "../models/courseModels/chapter.model.js";
import { IdParamType, NewChapterRequestBodyType, UpdateChapterRequestBodyType } from "../types/types.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { checkDocumentExistence } from "../utils/CheckExistence.js";
import { validateRequestBody } from "../utils/ValidateRequestBody.js";

const getAllChapters = asyncHandler(async(req:Request,res:Response)=>{

    const allChapters = await Chapter.find();

    if(!allChapters || allChapters.length === 0){
        throw new ApiError(404,"No Chapter Found");
    }

    return res.status(200).json(
        new ApiResponse(200,allChapters,"All Chapters Fetched Successfully")
    );

})


const createChapter = asyncHandler(async(req:Request<{},{},NewChapterRequestBodyType>,res:Response)=>{
    validateRequestBody(req.body);

    const newChapter = await Chapter.create(req.body)

    if(!newChapter){
        throw new ApiError(500,"Error in creating Chapter, Please try again")
    }

    return res.status(201).json(
        new ApiResponse(201,newChapter,"Chapter Created Successfully")
    );
})

const retrievespecificChapter = asyncHandler(async(req:Request<IdParamType>,res:Response)=>{


const {chapterId} = req.params;

    if(!chapterId){
        throw new ApiError(400,"Please provide valid Chapter Id");
    }
    if(!Types.ObjectId.isValid(chapterId)){
        throw new ApiError(400,"Please provide valid ObjectId of Chapter")
    };

    const chapter = await Chapter.findById(chapterId);

    if(!chapter){
        throw new ApiError(404,"No such Chapter exists");
    }

    return res.status(200).json(
        new ApiResponse(200,chapter,"Chapter Fetched successfully")
    );
})

const updatespecificChapter = asyncHandler(async(req:Request<IdParamType,{},UpdateChapterRequestBodyType>,res:Response)=>{

    validateRequestBody(req.body);

    const { chapterId } = req.params;
    if(!chapterId){
        throw new ApiError(400,"Please provide Chapter ID");
    }
    if(!Types.ObjectId.isValid(chapterId)){
        throw new ApiError(400,"Please provide valid ObjectId of Chapter")
    };
    const chapter = await checkDocumentExistence(chapterId,'Chapters');
    if (!chapter) {
            throw new ApiError(404, 'Chapter not found');
    }
    const updateData = { ...req.body };
    
   

    const updatedChapter = await Chapter.findByIdAndUpdate(
        chapterId,
        { $set: updateData },  
        { new: true, runValidators: true }  
    );

    if (!updatedChapter) {
        throw new ApiError(500, 'Unable to update the chapter, please try again');
    }

    return res.status(200).json(
        new ApiResponse(201,updatedChapter,"Chapter updated successfully")
    );

})

const deletespecificChapter = asyncHandler(async(req:Request<IdParamType>,res:Response)=>{

    const {chapterId} = req.params;
    if(!chapterId){
        throw new ApiError(400,"Please provide valid Chapter ID");
    }
    if(!Types.ObjectId.isValid(chapterId)){
        throw new ApiError(400,"Please provide valid ObjectId of Chapter")
    };
    const chapterExists = await checkDocumentExistence(chapterId,'Chapters');

    if(!chapterExists){
        throw new ApiError(404,"No such Chapter Exists");
    }

    const deletedChapter = await Chapter.findByIdAndDelete(chapterId);

    if(!deletedChapter){
        throw new ApiError(500,"Error in deleting chapter, Please try again");
    }

    return res.status(200).json(
        new ApiResponse(200,deletedChapter,"Chapter deleted Successfully")
    );

})

export {
    createChapter, deletespecificChapter, getAllChapters, retrievespecificChapter,
    updatespecificChapter
};
