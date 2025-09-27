import {RequestWithBody} from "../../../core/types/RequestInputType";
import {PostInputModel} from "../../input/post-input-model";
import {HttpStatuses} from "../../../core/types/httpSatuses";
import {Response} from "express";
import {postService} from "../../application/post.service";
import {postQueryRepository} from "../../repository/post.query-repository";
import {ResultStatus} from "../../../core/result/result-code";
import {resultCodeToHttpException} from "../../../core/result/resultCodeToHttpException";


export const createPost = async (req: RequestWithBody<PostInputModel>,res:Response) => {
    try{
        const result = await postService.createPost(req.body)
        if(result.status !==ResultStatus.Success || result.data === null){
            return res.sendStatus(resultCodeToHttpException(result.status))
        }
        const createdPost = await postQueryRepository.findPostById(result.data)
        if (!createdPost) {

            return res.status(HttpStatuses.BadRequest_400).json({
                errorsMessages: [{
                    message: "Failed to retrieve created post",
                    field: "server"
                }]
            });
        }
        res.status(HttpStatuses.Created_201).send(createdPost)

    }catch (error) {
        res.status(HttpStatuses.BadRequest_400).send({
            errorsMessages: [{
                message: "Failed to create post",
                field: "general"
            }]
        });    }

}