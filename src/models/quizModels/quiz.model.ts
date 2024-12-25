import mongoose ,{Date, Document, Schema, Types} from "mongoose";

interface IQUIZ extends Document{
    _id: Types.ObjectId,
    courseId : Types.ObjectId,
    questions : Types.ObjectId[],
    createdAt : Date,
    updatedAt : Date
}


const quizSchema = new Schema<IQUIZ>({

    courseId : {
        type : Schema.Types.ObjectId,
        ref : 'Course',
        required : true
    },
    questions : {
        type : [Schema.Types.ObjectId],
        ref : 'Question',
        required : true
    }

},{
    timestamps : true
})

export const Quiz = mongoose.model<IQUIZ>('Quiz',quizSchema);
