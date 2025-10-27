import mongoose from "mongoose";
import {CommentDbType, LikeDbType, LikeStatus} from "../types/comment-db-type";

const CommentatorInfo = new mongoose.Schema({
    userId: {type: String, required: true},
    userLogin: {type: String, required: true},
}, {_id: false})

const likesInfoSchema = new mongoose.Schema({
    likesCount: {type: Number, default: 0},
    dislikesCount: {type: Number, default: 0},

}, {_id: false})

const likeSchema = new mongoose.Schema<LikeDbType>({
    userId: {type: String, required: true},
    commentId: {type: String, required: true},
    myStatus: {type: String, enum: Object.values(LikeStatus),default:LikeStatus.None, required: true},
})

export const LikeModel = mongoose.model('likes', likeSchema)

const CommentSchema = new mongoose.Schema<CommentDbType>({
    postId: {type: String, required: true},
    content: {type: String, required: true},
    commentatorInfo: {type: CommentatorInfo, required: true},
    likesInfo: {type: likesInfoSchema,default: () => ({ likesCount: 0, dislikesCount: 0 })
    },
    createdAt: {type: Date, default: Date.now},
})

export const CommentModel = mongoose.model<CommentDbType>('comments', CommentSchema)

