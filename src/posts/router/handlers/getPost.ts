import {RequestWithParams} from "../../../core/types/RequestInputType";
import {UriParamsInputDto} from "../../../blogs/Dto/InputIUriParamsModel";
import {postRepository} from "../../repository/postRepository";
import {HttpStatuses} from "../../../core/types/httpSatuses";
import {Response} from "express";
import {mapPostToViewModel} from "../mappers/mapPostToViewModel";


export const  findPostBiId =  async (req:RequestWithParams<UriParamsInputDto>,res:Response) => {
    const index = req.params.id;
    const foundPostById = await postRepository.findPostById(index);
    if(!foundPostById) {
        return res.sendStatus(HttpStatuses.NotFound_404)
    }

    const postViewModel = mapPostToViewModel(foundPostById);
     res.status(HttpStatuses.Ok_200).send(postViewModel);


}

