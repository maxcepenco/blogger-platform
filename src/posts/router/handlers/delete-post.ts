import {RequestWithParams} from "../../../core/types/RequestInputType";
import {UriParamsInputDto} from "../../../core/types/InputIUriParamsModel"
import {Response} from "express";
import {HttpStatuses} from "../../../core/types/httpSatuses";
import {postService} from "../../application/post.service";

export const deletePost = async ( req:RequestWithParams<UriParamsInputDto>,res:Response ) => {
    const deleteIndex = await postService.deletePost(req.params.id)
    if(!deleteIndex) {
        res.sendStatus(HttpStatuses.NotFound_404)
        return
    }
    res.sendStatus(HttpStatuses.NoContent_204)
}