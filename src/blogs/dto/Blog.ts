import {Document, Types} from "mongoose";
import {ObjectId} from "mongodb";

export class Blog {
    constructor(
        public name: string,
        public description: string,
        public websiteUrl: string,
        public createdAt: Date,
        public isMembership: boolean,
    ) {}
}

export interface BlogDocument extends Blog, Document {_id: Types.ObjectId}

export type BlogDbType = Blog & {_id: Types.ObjectId};