import mongoose ,{Date, Document, Schema, Types} from "mongoose";
import { Language, Level, Status, Visibility } from "../../constants.js";


interface ICOURSE extends Document{
    _id: Types.ObjectId,
    name : string,
    category : Types.ObjectId,
    chapters : Types.ObjectId[],
    description : string,
    duration : number,
    instructorName : string,
    language : Language,
    level : Level,
    price : number,
    status : Status,
    visibility : Visibility,
    createdAt : Date,
    updatedAt : Date
}

const courseSchema = new Schema<ICOURSE>(
    {
        name : {
            type : String,
            required : true,
            trim : true
        },
        category : {
            type : Schema.Types.ObjectId,
            ref : 'Category',
            required : true,
        },
        chapters : {
            type : [Schema.Types.ObjectId],
            ref : 'Chapter',
            required : true,
        },
        description : {
            type : String,
            required : true,
        },
        duration : {
            type : Number,
            required : true,
        },
        instructorName : {
            type : String,
            required : true
        },
        language:{
            type : String,
            enum : Object.values(Language),
            required : true
        },
        level : {
            type : String,
            enum : Object.values(Level),
            required : true
        },
        price : {
            type : Number,
            required : true
        },
        status : {
            type : String,
            enum : Object.values(Status),
            required : true,
        },
        visibility : {
            type : String,
            enum:Object.values(Visibility),
            required : true
        }

    },
    {
        timestamps : true
    }
)

export const Course = mongoose.model<ICOURSE>('Course', courseSchema);
