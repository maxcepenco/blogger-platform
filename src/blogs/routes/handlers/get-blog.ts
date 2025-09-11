import {Response} from 'express';
import {HttpStatuses} from "../../../core/types/httpSatuses";
import {RequestWithParams} from "../../../core/types/RequestInputType";
import {UriParamsInputDto} from "../../../core/types/InputIUriParamsModel";
import {blogQueryRepository} from "../../repository/blog.query-repository";


export const  findBlogBiId =async (req:RequestWithParams<UriParamsInputDto>, res:Response) => {

        const id = req.params.id
        const foundBlog = await blogQueryRepository.findById(id);

        if(!foundBlog) {
            res.status(HttpStatuses.NotFound_404).send()
            return
        }

        const blogVewModel = blogQueryRepository.mapToBlogViewModel(foundBlog);

        res.status(HttpStatuses.Ok_200).send(blogVewModel)

}