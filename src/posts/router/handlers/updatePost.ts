import {RequestWithParamsAndBody} from "../../../core/types/RequestInputType";
import {UriParamsInputDto} from "../../../core/types/InputIUriParamsModel";
import {PostInputModel} from "../../input/post-input-model";
import {HttpStatuses} from "../../../core/types/httpSatuses";
import {Response} from "express";
import {postService} from "../../application/post.service";


export const updatePost = async (req:RequestWithParamsAndBody<UriParamsInputDto, PostInputModel>,res:Response) => {

    const updateThisPost = await postService.updatePost(req.params.id, req.body)
    if(!updateThisPost) {
        res.sendStatus(HttpStatuses.NotFound_404)
        return
    }
    res.sendStatus(HttpStatuses.NoContent_204)
}

