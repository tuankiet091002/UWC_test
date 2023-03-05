import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['janitor', 'collector', 'backofficer'],
        required: true
    },
    available: { type: Boolean, required: true, default: true },
    task: {
        type: [{
            type: Number,
            ref: 'Task',
            required: true,
        }],
        default: null
    },
}, { versionKey: false })

userSchema.pre('save', async function () {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods.createJWT = function () {
    return jwt.sign(
        { _id: this._id, username: this.username, role: this.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFETIME }
    )
}

userSchema.methods.comparePassword = async function (canditatePassword) {
    const isMatch = await bcrypt.compare(canditatePassword, this.password)
    return isMatch
}

export default mongoose.model("User", userSchema);