import {HydratedDocument} from "mongoose";

export type Post = {
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    createdAt: Date;
};

export type PostDocument = HydratedDocument<Post>