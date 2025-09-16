import {Response} from 'express';
import {HttpStatuses} from "../../../core/types/httpSatuses";
import {RequestWithParams} from "../../../core/types/RequestInputType";
import {idType} from "../../../core/types/InputIUriParamsModel";
import {blogQueryRepository} from "../../repository/blog.query-repository";


export const  findBlogBiId =async (req:RequestWithParams<idType>, res:Response) => {

        const id = req.params.id
        const foundBlog = await blogQueryRepository.findById(id);

        if(!foundBlog) {
          return   res.sendStatus(HttpStatuses.NotFound_404)

        }

        const blogVewModel = blogQueryRepository.mapToBlogViewModel(foundBlog);

        res.status(HttpStatuses.Ok_200).send(blogVewModel)

}