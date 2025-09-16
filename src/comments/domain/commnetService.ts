import {userQueryRepository} from "../../users/repository/user.query-repository";
import {commentRepository} from "../repository/commnet-repository";


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

    }
}