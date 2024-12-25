import mongoose, { Schema, Document, Types } from 'mongoose';

interface IQUESTION extends Document {
    _id: Types.ObjectId;
    question: string;
    options: string[];
    answer: string;
}

const questionSchema = new Schema<IQUESTION>({
    question: {
        type: String,
        required: true,
    },
    options: {
        type: [String],
        required: true,
        validate: {
            validator: (options: string[]) => options.length >= 2,
            message: 'At least two options are required.',
        },
    },
    answer: {
        type: String,
        required: true,
    },
});

questionSchema.pre('save', function (next) {
    if (!this.options.includes(this.answer)) {
        const err = new Error('Answer must be from one of the provided options.');
        return next(err);
    }
    next();
});

const Question = mongoose.model<IQUESTION>('Question', questionSchema);
export default Question;
