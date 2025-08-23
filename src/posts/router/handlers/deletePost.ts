import {RequestWithParams} from "../../../core/RequestInputType";
import {UriParamsInputDto} from "../../../blogs/Dto/InputIUriParamsModel"
import {Response} from "express";
import {postRepository} from "../../repository/postRepository";
import {HttpStatuses} from "../../../core/httpSatuses";

export const deletePost = ( req:RequestWithParams<UriParamsInputDto>,res:Response ) => {
    const deleteIndex = postRepository.deletePost(req.params.id)
    if(!deleteIndex) {
        res.sendStatus(HttpStatuses.NotFound_404)
        return
    }
    res.sendStatus(HttpStatuses.NoContent_204)
}