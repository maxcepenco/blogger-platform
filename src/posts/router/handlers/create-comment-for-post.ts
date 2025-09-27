import { ReqParamsBodyUserId} from "../../../core/types/RequestInputType";
import {CommentInputModel} from "../../../comments/input/comment.input-model";
import {Response} from "express";
import {idType} from "../../../core/types/InputIUriParamsModel";
import {postQueryRepository} from "../../repository/post.query-repository";
import {HttpStatuses} from "../../../core/types/httpSatuses";
import {IdType} from "../../../core/types/id-type.user";
import {commentService} from "../../../comments/domain/commnetService";
import {commentQueryRepository} from "../../../comments/repository/comment-query-repository";

export const createCommentForPost = async(req:ReqParamsBodyUserId<idType, CommentInputModel,IdType>, res:Response) => {
    const userId = req.user?.id as string;

    const postId = req.params.id
    const existingPost = await postQueryRepository.findPostById(postId)
    if(!existingPost) {
        res.sendStatus(HttpStatuses.NotFound_404)
        return
    }

    const createdIdComment = await commentService.createComment(postId, userId, req.body.content)
    if(!createdIdComment) {
        return res.sendStatus(HttpStatuses.BadRequest_400)
    }

    const createdComment = await commentQueryRepository.findById(createdIdComment)

    if(!createdComment) {return res.sendStatus(HttpStatuses.NotFound_404)}

    res.status(HttpStatuses.Created_201).send(createdComment)
}
    