import {RequestWithParamsAndBody} from "../../../core/RequestInputType";
import {UriParamsInputDto} from "../../../blogs/Dto/InputIUriParamsModel";
import {PostInputModel} from "../../Dto/PostInputModel";
import {postRepository} from "../../repository/postRepository";
import {HttpStatuses} from "../../../core/httpSatuses";
import {Response} from "express";


export const updatePost = (req:RequestWithParamsAndBody<UriParamsInputDto, PostInputModel>,res:Response) => {
    const updateThisPost = postRepository.updatePost(req.body, req.params.id)
    if(!updateThisPost) {
        res.sendStatus(HttpStatuses.NotFound_404)
    }
    res.sendStatus(HttpStatuses.NoContent_204)
}