import mongoose, {Document, Schema} from 'mongoose';
import bcrypt from 'bcryptjs';


export interface IUser extends Document {
    _id: string;
    email: string;
    name: string;
    password: string;
    createdAt: Date;
    comparePassword(candidatePassword : string): Promise<boolean>;
}

const userSchema = new Schema({
    email:{type: String, required:[true,'Email is required'], trim:true, unique:true },
    name:{type: String, required:[true, 'Name is required'], trim:true},
    password:{type:String, required:[true,'Password is required'], minlength:[6, 'Minimum 6 characters are required']}
},{
    timestamps:true
})

//hash password
userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    }
    catch(error: any) {
        next(error);
    }
});

//comapre passwords
userSchema.methods.comparePassword= async function(candidatePassword: string) : Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
}

export default mongoose.model<IUser>('User', userSchema);