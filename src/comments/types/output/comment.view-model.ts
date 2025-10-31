import {CommentatorInfo} from "../comment-db-type";


export type CommentViewModel = {
    id: string
    content: string
    commentatorInfo: CommentatorInfo
    createdAt: string
    likesInfo: {
        likesCount: number,
        dislikesCount: number,
        myStatus: string
    }
}