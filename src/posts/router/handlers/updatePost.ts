import {RequestWithParamsAndBody} from "../../../core/types/RequestInputType";
import {UriParamsInputDto} from "../../../blogs/Dto/InputIUriParamsModel";
import {PostInputModel} from "../../Dto/PostInputModel";
import {postRepository} from "../../repository/postRepository";
import {HttpStatuses} from "../../../core/types/httpSatuses";
import {Response} from "express";


export const updatePost = async (req:RequestWithParamsAndBody<UriParamsInputDto, PostInputModel>,res:Response) => {

    const updateThisPost = await postRepository.updatePost(req.params.id, req.body)
    if(!updateThisPost) {
        res.sendStatus(HttpStatuses.NotFound_404)
        return
    }
    res.sendStatus(HttpStatuses.NoContent_204)
}
