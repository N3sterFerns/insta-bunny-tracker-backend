import mongoose, { Schema } from "mongoose";

const sessionSchema = new Schema({
    username: { type: String, required: true },
    sessionId: { type: String, required: true },
    followers: { type: [String], default: [] },
    lastChecked: { type: Date, default: Date.now },
}, {timestamps: true});

const UserSession = mongoose.model('UserSession', sessionSchema);

export default UserSession