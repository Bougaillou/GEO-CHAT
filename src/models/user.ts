import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        _id: { type: String, require: true },
        firstName: { type: String, require: true },
        lastName: { type: String, require: true },
        email: { type: String, require: true },
        image: { type: String, require: false },
    },
    { timestamps: true }
)

const User = mongoose.models.User || mongoose.model("User", UserSchema)

export default User