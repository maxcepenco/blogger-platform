import {IdType} from "../../core/types/id-type.user";
import {ReqParamsUserId} from "../../core/types/RequestInputType";
import {Response} from "express";
import {IdComment} from "../input/id-type.comment";
import {HttpStatuses} from "../../core/types/httpSatuses";
import {commentService} from "../domain/commnetService";
import {ResultStatus} from "../../core/result/result-code";
import {resultCodeToHttpException} from "../../core/result/resultCodeToHttpException";


export const deleteComment = async (req:ReqParamsUserId<IdComment,IdType>,res: Response) => {
    const commentId = req.params.id;
    const userId = req.user?.id as string;
    if(!userId){
        return res.sendStatus(HttpStatuses.Unauthorized_401)
    }

    const deletedComment = await commentService.deleteComment(commentId,userId);
    if(deletedComment.status !== ResultStatus.Success){
        return res.sendStatus(resultCodeToHttpException(deletedComment.status))
    }

    return res.sendStatus(HttpStatuses.NoContent_204)
}