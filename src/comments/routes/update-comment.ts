import {ReqParamsBodyUserId} from "../../core/types/RequestInputType";
import {IdType} from "../../core/types/id-type.user";
import {CommentInputModel} from "../input/comment.input-model";
import {commentService} from "../domain/commnetService";
import {HttpStatuses} from "../../core/types/httpSatuses";
import {Response} from "express";
import {ResultStatus} from "../../core/result/result-code";
import {resultCodeToHttpException} from "../../core/result/resultCodeToHttpException";
import {IdComment} from "../input/id-type.comment";
import {commentQueryRepository} from "../repository/comment-query-repository";

export const updateComment = async (req:ReqParamsBodyUserId<IdComment, CommentInputModel,IdType>,res:Response) => {

    const userId = req.user?.id as string;
    if(!userId) {
        res.sendStatus(HttpStatuses.Unauthorized_401)
        return
    }
    const commentId = req.params.id
    const existingComment = await commentQueryRepository.findById(commentId)
    if(!existingComment) {
        res.sendStatus(HttpStatuses.NotFound_404)
        return
    }
    const comment =  req.body.content;


    const updatedComment = await commentService.updateComment(commentId,comment, userId);
    if(updatedComment.status !== ResultStatus.Success) {
        return res.sendStatus(resultCodeToHttpException(updatedComment.status))
    }

    return res.sendStatus(HttpStatuses.NoContent_204)

}