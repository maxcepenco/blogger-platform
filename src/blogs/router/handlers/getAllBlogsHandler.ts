import {Request, Response} from "express";
import {blogRepository} from "../../repository/blogRepository";
import {HttpStatuses} from "../../../core/httpSatuses";

export const getAllBlogHandler =( req:Request, res:Response ) => {
    const getAllBlogs = blogRepository.getAllBlog()
    res.status(HttpStatuses.Ok_200).send(getAllBlogs);
}