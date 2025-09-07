import {RequestWithParamsAndBody} from "../../../core/types/RequestInputType";
import {UriParamsInputDto} from "../../../core/types/InputIUriParamsModel";
import {BlogInputModel} from "../../input/blog-input-model";
import {blogRepository} from "../../repository/blogRepository";
import {HttpStatuses} from "../../../core/types/httpSatuses";
import {Response} from "express";
import {blogService} from "../../application/blog.servece";


export const updateBlog = async (req:RequestWithParamsAndBody<UriParamsInputDto, BlogInputModel>, res:Response)  => {
    const index = req.params.id


    const isUpdateBlog = await blogService.updateBlog(index, req.body)
    if (!isUpdateBlog) {
        res.sendStatus(HttpStatuses.NotFound_404)
        return
    }
    res.sendStatus(HttpStatuses.NoContent_204)

}
