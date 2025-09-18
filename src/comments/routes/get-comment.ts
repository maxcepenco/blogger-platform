import {RequestWithParams} from "../../core/types/RequestInputType";
import {HttpStatuses} from "../../core/types/httpSatuses";
import {Response} from "express";
import {commentQueryRepository} from "../repository/comment-query-repository";
import {IdComment} from "../input/id-type.comment";


export const getComment = async (req: RequestWithParams<IdComment>, res: Response) => {
    const commentId = req.params.id;
    if(!commentId) {
     res.sendStatus(HttpStatuses.NotFound_404)
     return
    }

    const comment = await commentQueryRepository.findById(commentId);
    if(!comment) {
        return res.sendStatus(HttpStatuses.NotFound_404)
    }

    res.status(HttpStatuses.Ok_200).send(comment);

}