import {RequestWithParamsAndBody} from "../../../core/RequestInputType";
import {UriParamsInputDto} from "../../Dto/InputIUriParamsModel";
import {BlogInputModel} from "../../Dto/BlogInputModel";
import {blogRepository} from "../../repository/blogRepository";
import {HttpStatuses} from "../../../core/httpSatuses";
import {Request, Response} from "express";


export const updateBlog = (req:RequestWithParamsAndBody<UriParamsInputDto, BlogInputModel>,res:Response)  => {
    const index = req.params.id

    const isUpdated = blogRepository.updateBlog(index, req.body)
    if (!isUpdated) {
        res.sendStatus(HttpStatuses.NotFound_404)
        return
    }
    res.sendStatus(HttpStatuses.NoContent_204)
}
