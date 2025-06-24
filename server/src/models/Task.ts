import mongoose, {Document, Schema} from 'mongoose';
import bcrypt from 'bcryptjs';

interface ITask extends Document {
    _id: string;
    title: string;
    description?: string;
    status: 'to-do' | 'in-progress' |'done';
    priority: 'low' | 'medium' | 'high';
    dueDate?:Date;
    userId:mongoose.Types.ObjectId;
    createdAt:Date;
    updatedAt:Date;
}

const taskSchema = new Schema(
    {
        title: {type: String, required: [true, 'Title is required'], trim: true, maxlength: [100, 'Title should not be more than 100 characters']},
        description: {type: String, required: [true, 'Description is required'], trim: true, maxlength: [300, 'Description should not be more than 300 characters']},
        status: { type: String, enum:['to-do', 'in-progress', 'done']},
        priority: {type: String, enum: ['high', 'mdeium', 'low']},
        userId:{type: mongoose.Types.ObjectId, ref:'User', required: true}

    },
{
    timestamps:true
})

taskSchema.index({userId:1, status:1});
taskSchema.index({userId:1, dueDate:1});


export default mongoose.model<ITask>('Task',taskSchema);




























// import mongoose, {Document, Schema} from 'mongoose';
// import bcrypt from 'bcryptjs';

// interface ITask extends Document {
//     _id: string;
//     title: string;
//     description?: string;
//     status: 'to-do' | 'in-progress' |'done';
//     priority: 'low' | 'medium' | 'high';
//     dueDate?: Date;
//     userId: mongoose.Types.ObjectId;
//     createdAt: Date;
//     updatedAt: Date;
// }

// const taskSchema = new Schema({
//     title:{type: String, required:[true, 'Title is required'], trim: true, maxlength:[100,'Maximum 100 characters allowed for title']},
//     description: {type:String, trim:true, maxlength:[500,'Maximum 500 characters allowed for description']},
//     status: {type:String, enum:['to-do', 'in-progress', 'done'], default: 'medium'},
//     priority:{type:String, enum:['low', 'medium', 'high']},
//     dueDate:{type: Date},
//     userId:{type:mongoose.Types.ObjectId, ref:'User', required:true},
// },
// {
//     timestamps:true
// });