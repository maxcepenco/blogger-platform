import {blogRepository} from "../../repository/blogRepository";
import {HttpStatuses} from "../../../core/types/httpSatuses";
import {Response} from "express";
import {RequestWithBody} from "../../../core/types/RequestInputType";
import {BlogInputModel} from "../../input/blog-input-model";
import {Blog} from "../../domain/Blog";
import {mapToBlogViewModel} from "../mappers/mapToBlogViewModel";
import {blogService} from "../../application/blog.servece";


export const createBlogHandler = async (req:RequestWithBody<BlogInputModel>, res: Response) => {
    try{
        const createdBlog = await blogService.create(req.body);
        const foundBlog = await blogService.findById(createdBlog)
        const blogViewModel = mapToBlogViewModel(foundBlog)

        res
            .status(HttpStatuses.Created_201)
            .send(blogViewModel)
    }catch (error){
        res.status(HttpStatuses.BadRequest_400).send({
            errorsMessages: [{
                message: "Failed to create blog",
                field: "general"
            }]
        });
    }

}

