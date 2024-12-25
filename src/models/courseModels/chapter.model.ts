import mongoose ,{Date, Document, Schema, Types} from "mongoose";

interface ICHAPTER extends Document{
    _id: Types.ObjectId,
    title : string,
    content : string,
    description : string,
    duration : number,
    videoLink : string,
    createdAt : Date,
    updatedAt : Date
}


const chapterSchema = new Schema<ICHAPTER>({

    title : {
        type : String,
        required : true
    },
    content:{
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    videoLink : {
        type : String,
        required : true
    },
    duration : {
        type : Number,
        required : true
    }


},{
    timestamps : true
})

export const Chapter = mongoose.model<ICHAPTER>('Chapter',chapterSchema);
