import {Blog} from "../../Dto/Blog";
import {WithId} from "mongodb";
import {BlogViewModel} from "../../Dto/BlogViweModel";

export const  mapToBlogViewModel = (blog: WithId<Blog>): BlogViewModel => {
    return {
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: new Date().toISOString(),
        isMembership: false,
    }
}