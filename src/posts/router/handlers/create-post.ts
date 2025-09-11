import {RequestWithBody} from "../../../core/types/RequestInputType";
import {PostInputModel} from "../../input/post-input-model";
import {HttpStatuses} from "../../../core/types/httpSatuses";
import {Response} from "express";
import {postService} from "../../application/post.service";
import {postQueryRepository} from "../../repository/post.query-repository";


export const createPost = async (req: RequestWithBody<PostInputModel>,res:Response) => {
    try{
        const createdPostID = await postService.createPost(req.body)
        const createdPost = await postQueryRepository.findPostById(createdPostID)
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
                message: "Failed to create blog",
                field: "general"
            }]
        });    }

}