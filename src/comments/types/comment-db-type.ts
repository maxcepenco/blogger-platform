import {HydratedDocument} from "mongoose";

export type LikesInfo = {
    likesCount: number;
    dislikesCount: number

}

export type CommentatorInfo = {
    userId: string
    userLogin: string
}

export enum LikeStatus {
  None = "None",
  Like = "Like",
  Dislike = "Dislike"
}


export type CommentDbType = {
    postId: string
    content: string
    commentatorInfo: CommentatorInfo
    likesInfo: LikesInfo
    createdAt: Date
}

export type LikeDbType = {
    userId: string
    commentId: string
    myStatus: LikeStatus
}

export type LikeDocument = HydratedDocument<LikeDbType>


export type CommentDocument = HydratedDocument<CommentDbType>