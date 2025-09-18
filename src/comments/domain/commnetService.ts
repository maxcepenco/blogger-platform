import {userQueryRepository} from "../../users/repository/user.query-repository";
import {commentRepository} from "../repository/commnet-repository";
import {CommentDbType} from "../types/comment-db-type";
import {Result} from "../../core/result/result-type";
import {ResultStatus} from "../../core/result/result-code";


export const commentService = {

    async createComment(postId:string, userId: string, content:string):Promise<string | null>  {

        const user =await  userQueryRepository.findById(userId!);
        if(!user) {
            return null
        }
        const newComment = {
            postId:postId,
            content:content,
            commentatorInfo: {
                userId:userId,
                userLogin:user.login
            },
            createdAt:new Date().toISOString()
        }

        return await commentRepository.createCommentForPost(newComment)

    },

    async updateComment( commentId: string, comment: string, userId:string): Promise<Result<boolean | null> > {

        const foundComment = await commentRepository.findByIdDbType(commentId);
        if(!foundComment) {
            return{
                status:ResultStatus.NotFound,
                data: null,
                extensions: []
            }
        }
        if(userId !== foundComment.commentatorInfo.userId) {
            return {
                status:ResultStatus.Forbidden,
                data: null,
                extensions: []
            };
        }
        const updatedComment:CommentDbType = {
            postId:foundComment.postId,
            content: comment,
            commentatorInfo:foundComment.commentatorInfo,
            createdAt:foundComment.createdAt
        }

        const result = await commentRepository.update(commentId,updatedComment)
        return {
            status:ResultStatus.Success,
            data: result,
            extensions: []
        }

    },

    async deleteComment(commentId:string, userId:string): Promise<Result<boolean | null>> {

        const foundComment = await commentRepository.findByIdDbType(commentId);
        if(!foundComment) {
            return{
                status: ResultStatus.NotFound,
                data: null,
                extensions: []
            }
        }
        if(userId !== foundComment.commentatorInfo.userId) {
            return{
                status: ResultStatus.Forbidden,
                data: null,
                extensions: []
            }
        }

        const result = await commentRepository.delete(commentId)
        return {
            status:ResultStatus.Success,
            data: result,
            extensions: []
        }
    }




}