import mongoose from 'mongoose';

const messageSchema = mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String },
    chat: { type: mongoose.Types.ObjectId, ref: "Chat" },
},{ timestamps: true, versionKey: false });

export default mongoose.model("Message", messageSchema);