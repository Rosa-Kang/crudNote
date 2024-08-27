import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        ccreatedOn: { type: Date, default: new Date().getTime() }
    }
);


const User = mongoose.model("User", UserSchema);
export default User;