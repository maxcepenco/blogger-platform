import {RequestWithBody} from "../../../core/types/RequestInputType";
import {PostInputModel} from "../../input/post-input-model";
import {HttpStatuses} from "../../../core/types/httpSatuses";
import {Response} from "express";
import {postService} from "../../application/post.service";
import {mapPostToViewModel} from "../mappers/mapPostToViewModel";


export const createPost = async (req: RequestWithBody<PostInputModel>,res:Response) => {
    try{
        const createdPost = await postService.createPost(req.body)
        const foundPost = await postService.findById(createdPost)

        const postOutput = mapPostToViewModel(foundPost)
        res.status(HttpStatuses.Created_201).send(postOutput)
    }catch (error) {
        res.status(HttpStatuses.BadRequest_400).send({
            errorsMessages: [{
                message: "Failed to create blog",
                field: "general"
            }]
        });    }

}