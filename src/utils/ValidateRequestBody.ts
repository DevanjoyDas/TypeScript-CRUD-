
import { ApiError } from "./ApiError.js";

export function validateRequestBody(reqBody: Record<string,any>) {
    if(Object.keys(reqBody).length === 0){
        throw new ApiError(400,"Request Body should not be empty")
    }
    for (const key in reqBody) {
        const field = reqBody[key];

        if (typeof field === 'string' && field.trim() === "") {
            throw new ApiError(400, `${key} should not be empty`);
        }

        else if (typeof field === 'number' && (field === undefined || isNaN(field))) {
            throw new ApiError(400, `${key} should be a valid number`);
        }

        else if (Array.isArray(field)) {
            if(field.length === 0){
                throw new ApiError(400,`${key} should not be empty`)
            }
            for (const item of field) {
                
                if (typeof item === 'string' && item.trim() === "") {
                    throw new ApiError(400, `${key} should not be a valid array of non-empty strings`);
                }
                else if (typeof field === 'number' && (field === undefined || isNaN(field))) {
                    throw new ApiError(400, `${key} should be a valid array of numbers`);
                }
               
            }
        }
    }
}
