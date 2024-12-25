import mongoose, { Schema, Document, Types } from 'mongoose';

interface ICOURSECATEGORY extends Document {
    _id : Types.ObjectId,
    name: string,
    description?: string,
    parentCategory?: mongoose.Types.ObjectId,  
    createdAt: Date,
    updatedAt : Date
}

const courseCategorySchema = new Schema<ICOURSECATEGORY>({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
    },
    parentCategory: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
    },
},
{
    timestamps : true
});

export const Category = mongoose.model<ICOURSECATEGORY>('Category', courseCategorySchema);

