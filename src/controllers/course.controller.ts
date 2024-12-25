import { Request, Response } from "express";
import { Types } from "mongoose";
import { Chapter } from "../models/courseModels/chapter.model.js";
import { Course } from "../models/courseModels/course.model.js";
import Question from "../models/quizModels/question.model.js";
import { Quiz } from "../models/quizModels/quiz.model.js";
import { IdParamType, NewCourseRequestBodyType, NewOrUpdateQuizRequestBodyType, PaginationQueryType, UpdatespecificCourseRequestBodyType } from "../types/types.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { checkDocumentExistence } from "../utils/CheckExistence.js";
import { validateRequestBody } from "../utils/ValidateRequestBody.js";

const createCourse = asyncHandler(async (req:Request<{},{},NewCourseRequestBodyType>,res:Response)=>{

    validateRequestBody(req.body)

    const {
        name,
        category,
        chapters,
        description,
        duration,
        instructorName,
        language,
        level,
        price,
        status,
        visibility
    } = req.body;
    if(!Types.ObjectId.isValid(category)){
        throw new ApiError(400,"Please provide valid ObjectId of category")
    };
    if(!Array.isArray(chapters) || chapters.length === 0){
        throw new ApiError(400,"Please provide an Array for Chapter IDs")
    }
    const categoryExists = await checkDocumentExistence(category,'Category');

    if (!categoryExists) {
            throw new ApiError(404, 'Invalid category ID,No Such Category Exists');
        }

    const chapterObjectIds = chapters.map((chapterId: string) => {
        if (!Types.ObjectId.isValid(chapterId)) {
            throw new ApiError(400,`Invalid chapter ID: ${chapterId}, No Such chapter exists`);
        }
            return Types.ObjectId.createFromHexString(chapterId);
        });

    const chapterIds = await Chapter.find({ '_id': { $in: chapterObjectIds } });

    if (chapterIds.length !== chapterObjectIds.length) {
            throw new ApiError(404, 'One or more chapter IDs are invalid');
        }
    
    const course = await Course.create({
        name,
        category : Types.ObjectId.createFromHexString(category),
        chapters : chapterObjectIds,
        description,
        duration,
        instructorName,
        language,
        level,
        price,
        status,
        visibility

    });
    
    if(!course){
        throw new ApiError(500,"Unable to create the course at the Moment, Please try again");
    }

    return res.status(201).json(
        new ApiResponse(200,course,"Course Created Successfully")
    );




})

const retrieveAllCourses = asyncHandler(async (req:Request<{},{},{},PaginationQueryType>,res:Response)=>{

    const { page = 1, limit = 10 } = req.query;

    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);

    const skip = (pageNumber - 1) * limitNumber;

    const courses = await Course.find()
                            .skip(skip)
                            .limit(limitNumber)
                            .populate('category')           
                            .populate('chapters')     

    if(!courses || courses.length === 0){
                throw new ApiError(404,"No Courses Exists");
    }

    const totalCourses = await Course.countDocuments();

    if(!totalCourses){
        throw new ApiError(500,"Error in Counting Number of Courses");
    }

    const totalPages = Math.ceil(totalCourses / limitNumber);



    return res.status(200).json(
        new ApiResponse(200, {
            totalCourses,
            totalPages,
            currentPage: pageNumber,
            courses,
        },"Courses Retrieved Successfully")
    )

})

const retrievespecificCourse = asyncHandler(async (req:Request<IdParamType>,res:Response)=>{

    const { courseId } = req.params;
    if(!courseId){
        throw new ApiError(400,"Please provide Course ID")
    }

    if(!Types.ObjectId.isValid(courseId)){
        throw new ApiError(400,"Please provide valid ObjectId of Course")
    };
    const course = await Course.findById(courseId)
            .populate('category')             
            .populate('chapters')             
            .populate('instructorName');      

        if (!course) {
            throw new ApiError(404,"No Course Found");
        }

        return res.status(200).json(
            new ApiResponse(200,course,"Course Retrieved Successfully")
        )


})

const updatespecificCourse = asyncHandler(async(req:Request<IdParamType,{},UpdatespecificCourseRequestBodyType>, res:Response)=>{

    validateRequestBody(req.body);

    const { courseId } = req.params;
    if(!courseId){
        throw new ApiError(400,"Please provide Course ID");
    }
    if(!Types.ObjectId.isValid(courseId)){
        throw new ApiError(400,"Please provide valid ObjectId of Course")
    };
    const course = await checkDocumentExistence(courseId,'Course');
    if (!course) {
            throw new ApiError(404, 'Course not found');
    }
    const updateData = { ...req.body };
    
    if(updateData.category){
        if(!Types.ObjectId.isValid(updateData.category)){
            throw new ApiError(400,"Please provide valid ObjectId of category")
        };
        const categoryExists = await checkDocumentExistence(updateData.category as string,'Category');
        if (!categoryExists) {
            throw new ApiError(400, 'Invalid category ID, No such Category Exists');
        }
        updateData.category = Types.ObjectId.createFromHexString(updateData.category as string);
    }

    

    if(updateData.chapters && Array.isArray(updateData.chapters)){

        if(!Array.isArray(updateData.chapters) || updateData.chapters.length === 0){
            throw new ApiError(400,"Please provide an Array for Chapter IDs")
        }

        const chapterObjectIds = updateData.chapters.map((chapterId: string | Types.ObjectId) => {
            if (!Types.ObjectId.isValid(chapterId)) {
                throw new ApiError(400,`Invalid chapter ID: ${chapterId}`);
            }
            return Types.ObjectId.createFromHexString(chapterId as string);
        });

        const chapterIds = await Chapter.find({ '_id': { $in: chapterObjectIds } });

        if (chapterIds.length !== chapterObjectIds.length) {
                throw new ApiError(400, 'One or more chapter IDs are invalid');
        }

        updateData.chapters = chapterObjectIds;

    }

    const updatedCourse = await Course.findByIdAndUpdate(
        courseId,
        { $set: updateData },  
        { new: true, runValidators: true }  
    );

    if (!updatedCourse) {
        throw new ApiError(500, 'Unable to update the course, please try again');
    }

    return res.status(201).json(
        new ApiResponse(201,updatedCourse,"Course updated successfully")
    );

})

const deletespecificCourse = asyncHandler(async(req:Request<IdParamType>,res:Response)=>{
    const { courseId } = req.params;

    if(!courseId){
        throw new ApiError(400,"Please provide valid course ID in param")
    }

    if (!Types.ObjectId.isValid(courseId as string)) {
        throw new ApiError(400,`Invalid Course ID: ${courseId}`);
    }

    const deletedCourse = await Course.findByIdAndDelete(courseId);


    if (!deletedCourse) {
            throw new ApiError(404, 'Course not found');
        }

    return res.status(200).json(
        new ApiResponse(200,deletedCourse,"Course Deleted Successfully")
    );



})


const retrieveAllQuizForACourse = asyncHandler(async(req: Request<IdParamType, {}, {},PaginationQueryType>, res: Response) => {
    const { courseId } = req.params;
    const { page = 1, limit = 10 } = req.query;  

    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);

    if (!courseId) {
        throw new ApiError(400, "Please provide a valid Course ID");
    }

    if (!Types.ObjectId.isValid(courseId)) {
        throw new ApiError(400, "Invalid Course ID");
    }

    const courseExists = await Course.findById(courseId);
    if (!courseExists) {
        throw new ApiError(404, "No such Course Exists");
    }

    const skip = (pageNumber - 1) * limitNumber;

    const quizes = await Quiz.find({ courseId })
        .populate("questions")
        .skip(skip)
        .limit(limitNumber);

    if (!quizes || quizes.length === 0) {
        throw new ApiError(404, "No quizzes found for the given course");
    }

    const totalQuizzes = await Quiz.countDocuments({ courseId : Types.ObjectId.createFromHexString(courseId) });

    return res.status(200).json(
        new ApiResponse(200, {
            quizes,
            currentPage: pageNumber,
            totalPages: Math.ceil(totalQuizzes / limitNumber),
            totalQuizzes
        }, "Quizzes fetched successfully")
    );
});

const createQuizForACourse = asyncHandler(async(req:Request<IdParamType,{},NewOrUpdateQuizRequestBodyType>,res:Response)=>{

    validateRequestBody(req.body);
    const {courseId} = req.params;
    if(!courseId){
        throw new ApiError(400,"Please provide valid course ID in the Params");
    }
    if(!Types.ObjectId.isValid(courseId)){
        throw new ApiError(400,"Please provide valid Course Object ID")
    }
    const courseExists = await checkDocumentExistence(courseId,'Course');
    if(!courseExists){
        throw new ApiError(404,"No such course Exists");
    }


 const questionsObjectIds = req.body.questions.map((questionId: string | Types.ObjectId) => {
        if (!Types.ObjectId.isValid(questionId)) {
            throw new ApiError(400,`Invalid Question ID: ${questionId}`);
        }
            return Types.ObjectId.createFromHexString(questionId as string);
        });

    const chapterIds = await Question.find({ '_id': { $in: questionsObjectIds } });

    if (chapterIds.length !== questionsObjectIds.length) {
            throw new ApiError(400, 'One or more Question IDs are invalid');
        }

    const newQuiz = await Quiz.create({
        courseId : Types.ObjectId.createFromHexString(courseId),
        questions : questionsObjectIds
    })

    if(!newQuiz){
        throw new ApiError(500,"Error during quiz creation, Please try again");
    }

    return res.status(201).json(
        new ApiResponse(201,newQuiz,"Quiz Created Successfully")
    );


})



export {
    createCourse, createQuizForACourse, deletespecificCourse, retrieveAllCourses, retrieveAllQuizForACourse, retrievespecificCourse, updatespecificCourse
};
