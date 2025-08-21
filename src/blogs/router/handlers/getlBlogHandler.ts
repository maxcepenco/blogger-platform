import {Request, Response} from 'express';
import {blogRepository} from "../../repository/blogRepository";
import {HttpStatuses} from "../../../core/httpSatuses";


export const  findBlogBiId = (req:Request, res:Response) => {
    const id = req.params.id
    const blog = blogRepository.getById(id);

    if(!blog) {
        res.status(HttpStatuses.NotFound_404).send()
        return
    }

    res.status(HttpStatuses.Ok_200).send(blog);

}