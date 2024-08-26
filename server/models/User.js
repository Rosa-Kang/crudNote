import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
    {
        fullName: { type: String },
        email: { type: String },
        password: { type: String },
        screateOn: { type: Date, default: new Date().getTime() }
    }
);


const User = mongoose.model("User", UserSchema);
export default User;