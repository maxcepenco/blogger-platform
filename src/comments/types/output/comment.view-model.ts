import {CommentatorInfo} from "../comment-db-type";


export type CommentViewModel = {
    id: string
    content: string
    commentatorInfo: CommentatorInfo
    createdAt: string
    likeInfo: {
        likeCount: number,
        dislikeCount: number,
        myStatus: string
    }
}