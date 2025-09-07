import {Blog} from "../../domain/Blog";
import {WithId} from "mongodb";
import {BlogViewModel} from "../../output/blog-view-model";

export const  mapToBlogViewModel = (blog: WithId<Blog>): BlogViewModel => {
    return {
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: false,
    }
}