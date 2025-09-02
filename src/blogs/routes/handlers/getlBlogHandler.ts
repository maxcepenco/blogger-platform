import {Request, Response} from 'express';
import {blogRepository} from "../../repository/blogRepository";
import {HttpStatuses} from "../../../core/types/httpSatuses";
import {mapToBlogViewModel} from "../mappers/mapToBlogViewModel";


export const  findBlogBiId =async (req:Request, res:Response) => {

        const id = req.params.id
        const foundBlog = await blogRepository.findById(id);

        if(!foundBlog) {
            res.status(HttpStatuses.NotFound_404).send()
            return
        }

        const blogVewModel = mapToBlogViewModel(foundBlog)
        res.status(HttpStatuses.Ok_200).send(blogVewModel)

}