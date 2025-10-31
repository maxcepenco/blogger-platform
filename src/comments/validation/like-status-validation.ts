import {body} from "express-validator";
import {LikeStatus} from "../types/comment-db-type";


export const likeStatusValidation = body('likeStatus')
    .trim()
    .isIn(Object.values(LikeStatus))
    .withMessage('likeStatus must be one of: None, Like, Dislike')


