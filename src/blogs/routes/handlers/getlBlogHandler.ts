import {Request, Response} from 'express';
import {blogRepository} from "../../repository/blogRepository";
import {HttpStatuses} from "../../../core/types/httpSatuses";
import {mapToBlogViewModel} from "../mappers/mapToBlogViewModel";
import {blogService} from "../../application/blog.servece";


export const  findBlogBiId =async (req:Request, res:Response) => {

        const id = req.params.id
        const foundBlog = await blogService.findByIdForGet(id);

        if(!foundBlog) {
            res.status(HttpStatuses.NotFound_404).send()
            return
        }

        const blogVewModel = mapToBlogViewModel(foundBlog)
        res.status(HttpStatuses.Ok_200).send(blogVewModel)

}