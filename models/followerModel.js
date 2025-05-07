import mongoose, { Schema } from "mongoose";

const followersSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserSession', required: true },
    followers: { type: [String], required: true },
    unFollowed: {type: [String]}
}, {timestamps: true});

const Follower = mongoose.model('Follower', followersSchema);

export default Follower