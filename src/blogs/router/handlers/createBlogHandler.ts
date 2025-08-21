import {blogRepository} from "../../repository/blogRepository";
import {HttpStatuses} from "../../../core/httpSatuses";
import {Request,Response}   from "express";
import {RequestWithBody} from "../../../core/RequestInputType";
import {BlogInputModel} from "../../Dto/BlogInputModel";



export const createBlogHandler = (req:RequestWithBody<BlogInputModel>, res: Response) => {
    const newBlog = blogRepository.createBlog(req.body)

    res.status(HttpStatuses.Created_201).send(newBlog);
}
