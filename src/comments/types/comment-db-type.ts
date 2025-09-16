import {CommentatorInfo} from "./commentator-info";


export type CommentDbType = {
    postId: string
    content: string
    commentatorInfo: CommentatorInfo
    createdAt: string
}