import mongoose from "mongoose";
import {Blog, BlogDocument} from "../dto/Blog";


export const BlogSchema = new mongoose.Schema<Blog>({
    name: {type: String, required: true},
    description: { type: String, required: true },
    websiteUrl: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    isMembership: { type: Boolean, default: false }
})


export const BlogModel = mongoose.model<Blog>('blog', BlogSchema)