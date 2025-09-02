import {blogRepository} from "../../repository/blogRepository";
import {HttpStatuses} from "../../../core/types/httpSatuses";
import {Request,Response}   from "express";
import {RequestWithBody} from "../../../core/types/RequestInputType";
import {BlogInputModel} from "../../Dto/BlogInputModel";
import {Blog} from "../../Dto/Blog";
import {mapToBlogViewModel} from "../mappers/mapToBlogViewModel";



export const createBlogHandler = async (req:RequestWithBody<BlogInputModel>, res: Response) => {
    try{
    const newBlog: Blog = {
        name: req.body.name,
        description: req.body.description,
        websiteUrl: req.body.websiteUrl,
        createdAt: new Date().toString(),
        isMembership: false
    }
    const createdBlog =  await blogRepository.createBlog(newBlog)
    const blogViewModel = mapToBlogViewModel(createdBlog)

    res
        .status(HttpStatuses.Created_201)
        .send(blogViewModel)

    }catch(e:unknown){
        res.sendStatus(HttpStatuses.InternalServerError_500)
    }
}
