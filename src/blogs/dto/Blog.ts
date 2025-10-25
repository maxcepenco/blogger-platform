import {HydratedDocument} from "mongoose";

export type Blog = {

        name: string
        description: string
        websiteUrl: string
        createdAt: Date
        isMembership: boolean
}

export type BlogDocument = HydratedDocument<Blog>