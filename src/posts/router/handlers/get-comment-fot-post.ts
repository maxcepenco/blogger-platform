import {RequestWithParamsAndQuery} from "../../../core/types/RequestInputType";
import {IdType} from "../../../core/types/id-type.user";
import {Response} from "express";
import {HttpStatuses} from "../../../core/types/httpSatuses";
import {sortQueryFieldsUtil} from "../../../core/helpers/sort-query-fields-util";
import {SortQueryFieldsType} from "../../../core/types/sortQueryFields.type";
import {postQueryRepository} from "../../repository/post.query-repository";
import {commentQueryRepository} from "../../../comments/repository/comment-query-repository";


export const getCommentFotPost = async (req:RequestWithParamsAndQuery<IdType, SortQueryFieldsType>,res: Response) => {

    const postId = req.params.id
    console.log("➡️ createCommentForPost, postId:", postId);
    console.log("➡️ Request body:", req.body);

    const post = await postQueryRepository.findPostById(postId)
    if(!post) {
        console.log("❌ Post not found, sending 404");

        res.sendStatus(HttpStatuses.NotFound_404)
    }

        const inputQuery = sortQueryFieldsUtil(req.query);

    const foundCommentForPost = await commentQueryRepository.findCommentByPost(inputQuery, postId);

    res.status(HttpStatuses.Ok_200).json(foundCommentForPost);

}