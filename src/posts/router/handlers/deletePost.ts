import {RequestWithParams} from "../../../core/types/RequestInputType";
import {UriParamsInputDto} from "../../../blogs/Dto/InputIUriParamsModel"
import {Response} from "express";
import {postRepository} from "../../repository/postRepository";
import {HttpStatuses} from "../../../core/types/httpSatuses";

export const deletePost = async ( req:RequestWithParams<UriParamsInputDto>,res:Response ) => {
    const deleteIndex = await postRepository.deletePost(req.params.id)
    if(!deleteIndex) {
        res.sendStatus(HttpStatuses.NotFound_404)
        return
    }
    res.sendStatus(HttpStatuses.NoContent_204)
}