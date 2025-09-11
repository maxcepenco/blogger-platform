import {HttpStatuses} from "../../../core/types/httpSatuses";
import {Response} from "express";
import {RequestWithBody} from "../../../core/types/RequestInputType";
import {BlogInputModel} from "../../input/blog-input-model";
import {blogService} from "../../application/blog.servece";
import {blogQueryRepository} from "../../repository/blog.query-repository";


export const createBlog = async (req:RequestWithBody<BlogInputModel>, res: Response) => {
    try{
        const createdBlog = await blogService.create(req.body);
        const foundBlog = await blogQueryRepository.findById(createdBlog)

        if(!foundBlog) {
            return res.status(HttpStatuses.BadRequest_400).json({
                errorsMessages: [{
                    message: "Failed to retrieve created post",
                    field: "server"
                }]
            });
        }
        const blogViewModel = blogQueryRepository.mapToBlogViewModel(foundBlog)

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

