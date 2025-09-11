import {RequestWithParams} from "../../../core/types/RequestInputType";
import {UriParamsInputDto} from "../../../core/types/InputIUriParamsModel";
import {HttpStatuses} from "../../../core/types/httpSatuses";
import {Response} from "express";
import {postQueryRepository} from "../../repository/post.query-repository";


export const  findPostBiId =  async (req:RequestWithParams<UriParamsInputDto>,res:Response) => {
    const index = req.params.id;

    const foundPostById = await postQueryRepository.findPostById(index);

    if(!foundPostById) {
        return res.sendStatus(HttpStatuses.NotFound_404)
    }

     res.status(HttpStatuses.Ok_200).send(foundPostById);


}

