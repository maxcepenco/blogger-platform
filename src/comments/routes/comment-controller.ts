import {ReqParamsBodyUserId, ReqParamsUserId, RequestWithParams} from "../../core/types/RequestInputType";
import {IdComment} from "../input/id-type.comment";
import {HttpStatuses} from "../../core/types/httpSatuses";
import {commentQueryRepository} from "../repository/comment-query-repository";
import {CommentInputModel} from "../input/comment.input-model";
import {IdType} from "../../core/types/id-type.user";
import {commentService} from "../domain/commnetService";
import {ResultStatus} from "../../core/result/result-code";
import {resultCodeToHttpException} from "../../core/result/resultCodeToHttpException";
import {Response} from "express";


class CommentController {

    async getComment(req: RequestWithParams<IdComment>, res: Response) {
        const commentId = req.params.id;
        if (!commentId) {
            res.sendStatus(HttpStatuses.NotFound_404)
            return
        }

        const comment = await commentQueryRepository.findById(commentId);
        if (!comment) {
            return res.sendStatus(HttpStatuses.NotFound_404)
        }

        res.status(HttpStatuses.Ok_200).send(comment);

    }

    async updateComment(req: ReqParamsBodyUserId<IdComment, CommentInputModel, IdType>, res: Response) {

        const userId = req.user;
        if (!userId) {
            res.sendStatus(HttpStatuses.Unauthorized_401)
            return
        }
        const commentId = req.params.id
        const existingComment = await commentQueryRepository.findById(commentId)
        if (!existingComment) {
            res.sendStatus(HttpStatuses.NotFound_404)
            return
        }
        const comment = req.body.content;


        const updatedComment = await commentService.updateComment(commentId, comment, userId);
        if (updatedComment.status !== ResultStatus.Success) {
            return res.sendStatus(resultCodeToHttpException(updatedComment.status))
        }

        return res.sendStatus(HttpStatuses.NoContent_204)

    }

    async deleteComment(req: ReqParamsUserId<IdComment, IdType>, res: Response) {
        const commentId = req.params.id;
        const foundComment = await commentQueryRepository.findById(commentId);
        if (!foundComment) {
            return res.sendStatus(HttpStatuses.NotFound_404)
        }
        const userId = req.user as string;


        const deletedComment = await commentService.deleteComment(commentId, userId);
        if (deletedComment.status !== ResultStatus.Success) {
            return res.sendStatus(resultCodeToHttpException(deletedComment.status))
        }

        return res.sendStatus(HttpStatuses.NoContent_204)
    }

}


export const commentController = new CommentController()