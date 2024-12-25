import { NextFunction, Request, Response } from "express";
import { Language, Level, Status, Visibility } from "../constants.js";
import { Types } from "mongoose";


export type ControllerType = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void | Response<any, Record<string, any>>>;


export type NewCourseRequestBodyType = {
  name : string,
  category : string,
  chapters : string[],
  description : string,
  duration : number,
  instructorName : string,
  language : Language,
  level : Level,
  price : number,
  status : Status,
  visibility : Visibility
}

export type PaginationQueryType = {
  page? : string,
  limit? : string
}

export type IdParamType = {
  courseId? : string,
  categoryId? : string,
  chapterId? : string,
  quizId? : string,
  questionId? : string
}

export type UpdatespecificCourseRequestBodyType = {
    name? : string,
    category? : string | Types.ObjectId,
    chapters? : string[] | Types.ObjectId[],
    description? : string,
    duration? : number,
    instructorName? : string,
    language? : Language,
    level? : Level,
    price? : number,
    status? : Status,
    visibility? : Visibility
}

export type CreateCategoryRequestBodyType = {

  name : string,
  description : string,
  parentCategory? : string 

}

export type UpdatespecificQuizRequestBodyType = {

  courseId : string | Types.ObjectId,
  questions : string[] | Types.ObjectId[]

}

export type NewOrUpdateQuizRequestBodyType = {
  questions : string[] | Types.ObjectId[]
}

export type NewChapterRequestBodyType = {
  title : string,
  content : string,
  description : string,
  duration : number,
  videoLink : string
}

export type UpdateChapterRequestBodyType = {
  title? : string,
  content? : string,
  description? : string,
  duration? : number,
  videoLink?: string
}

export type CreateUpdateQuestionRequestBodyType = {
  question : string,
  options : string[],
  answer : string
}

