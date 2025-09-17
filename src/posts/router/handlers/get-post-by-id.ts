import {RequestWithParams} from "../../../core/types/RequestInputType";
import {idType} from "../../../core/types/InputIUriParamsModel";
import {HttpStatuses} from "../../../core/types/httpSatuses";
import {Response} from "express";
import {postQueryRepository} from "../../repository/post.query-repository";


export const  findPostBiId =  async (req:RequestWithParams<idType>, res:Response) => {

    const index = req.params.id;
    console.log("➡️ createCommentForPost, postId:", index);
    console.log("➡️ Request body:", req.body);
    const foundPostById = await postQueryRepository.findPostById(index);
    console.log("➡️ Found post in DB:", foundPostById);

    if(!foundPostById) {
        console.log("❌ Post not found, sending 404");
        return res.sendStatus(HttpStatuses.NotFound_404)
    }

     res.status(HttpStatuses.Ok_200).send(foundPostById);

}

