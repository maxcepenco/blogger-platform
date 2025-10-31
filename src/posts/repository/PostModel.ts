import mongoose from "mongoose";
import {Post} from "../dto/Post";


export const PostSchema = new mongoose.Schema<Post>({
    title:{ type: String, required: true },
    shortDescription: { type: String, required: true },
    content: { type: String, required: true },
    blogId: { type: String  },
    blogName: { type: String },
    createdAt: { type: Date, default: Date.now}

})

export const PostModel = mongoose.model<Post>('posts', PostSchema)