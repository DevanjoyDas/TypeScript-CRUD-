import { Document } from "mongoose";
class ApiResponse {
    constructor(public statusCode:number, public data:Document | null | {},public message:string, public success:boolean=true){
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400;
    }
}

export {ApiResponse}