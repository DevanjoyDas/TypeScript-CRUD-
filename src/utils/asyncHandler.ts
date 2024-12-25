import { NextFunction, Request, Response } from "express"
import { ControllerType } from "../types/types.js"

const asyncHandler = (requestHandler : ControllerType)=>{
    return (req:Request,res:Response,next:NextFunction)=>{
        Promise.resolve(requestHandler(req,res,next)).catch((err)=> next(err))
    }
}

export {asyncHandler};