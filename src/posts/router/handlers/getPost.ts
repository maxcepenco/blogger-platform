import {RequestWithParams} from "../../../core/RequestInputType";
import {UriParamsInputDto} from "../../../blogs/Dto/InputIUriParamsModel";
import {postRepository} from "../../repository/postRepository";
import {HttpStatuses} from "../../../core/httpSatuses";
import {Response} from "express";


export const  findPostBiId = (req:RequestWithParams<UriParamsInputDto>,res:Response) => {
    const index = req.params.id;
    const findBiId = postRepository.findPostById(index);
    if(!findBiId) {
        return res.sendStatus(HttpStatuses.NotFound_404)
    }
    return res.status(HttpStatuses.Ok_200).send(findBiId);
}

