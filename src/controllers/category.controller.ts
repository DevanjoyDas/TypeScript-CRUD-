import { Request, Response } from "express";
import { Types } from "mongoose";
import { Category } from "../models/courseModels/category.model.js";
import { CreateCategoryRequestBodyType, IdParamType } from "../types/types.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { checkDocumentExistence } from "../utils/CheckExistence.js";
import { validateRequestBody } from "../utils/ValidateRequestBody.js";


const retrieveAllCategory = asyncHandler(async (req:Request, res:Response)=>{

    const allCategories = await Category.find().populate('parentCategory');

    if(!allCategories || allCategories.length === 0){
        throw new ApiError(404,"No Category Found");
    }

    return res.status(200).json(
        new ApiResponse(200,allCategories,"Categories Fetched Successfully")
    );


})

const createCategory = asyncHandler(async(req:Request<{},{},CreateCategoryRequestBodyType>,res:Response)=>{

    validateRequestBody(req.body);

    const data = {...req.body};

    const categoryExists = await Category.find({name:data.name});

    if(categoryExists && categoryExists.length !== 0){
        throw new ApiError(409,"Category with the same name already exists")
    };


    if(data.parentCategory){
        if(!Types.ObjectId.isValid(data.parentCategory)){
            throw new ApiError(400,"Please provide valid ObjectId of Parent Category")
        };
        const parent = await Category.findById(data.parentCategory)
        if(!parent){
            throw new ApiError(400,"No such Parent Category found")
        }
    }

    const newCategory = await Category.create({
        name : data.name,
        description : data.description || null,
        parentCategory : data.parentCategory || null 
    })

    if(!newCategory){
        throw new ApiError(500,"Error in creating Category, Please try again")
    }

    return res.status(201).json(
        new ApiResponse(201,newCategory,"Category Created Successfully")
    );
})

const retrievespecificCategory = asyncHandler(async(req:Request<IdParamType>,res:Response)=>{

    const {categoryId} = req.params;

    if(!categoryId){
        throw new ApiError(400,"Please provide valid category Id");
    }
    if(!Types.ObjectId.isValid(categoryId)){
        throw new ApiError(400,"Please provide valid ObjectId of Category")
    };

    const category = await Category.findById(categoryId)
                                    .populate('parentCategory');

    if(!category){
        throw new ApiError(404,"No such category exists");
    }

    return res.status(200).json(
        new ApiResponse(200,category,"Category Fetched successfully")
    );

})

const deletespecificCategory = asyncHandler(async(req:Request<IdParamType>,res:Response)=>{

    const {categoryId} = req.params;
    if(!categoryId){
        throw new ApiError(400,"Please provide valid Category ID");
    }
    if(!Types.ObjectId.isValid(categoryId)){
        throw new ApiError(400,"Please provide valid ObjectId of Category")
    };

    const categoryExists = await checkDocumentExistence(categoryId,'Category');

    if(!categoryExists){
        throw new ApiError(404,"No such category exists");
    }

    const deletedCategory = await Category.findByIdAndDelete(categoryId);

    if(!deletedCategory){
        throw new ApiError(500,"Error in deleting category, Please try again");
    }

    return res.status(200).json(
        new ApiResponse(200,deletedCategory,"Category deleted Successfully")
    );

})


export {
    createCategory, deletespecificCategory, retrieveAllCategory, retrievespecificCategory
};
