import {Router} from "express";
import {getPostList} from "./handlers/get-post-list";
import {findPostBiId} from "./handlers/get-post-by-id";
import {updatePost} from "./handlers/update-post";
import {deletePost} from "./handlers/delete-post";
import {idValidation} from "../../core/midleware/validationInputIdMiddleware";
import {postInputDtoMiddleware} from "../validatiion/postInputDateMiddleware";
import {handlerValidationErrors} from "../../core/midleware/handlerValidationErrors";
import {authValidationMiddleware} from "../../auth/routes/middleware/auth-validation-middleware";
import {createPost} from "./handlers/create-post";
import {createCommentForPost} from "./handlers/create-comment-for-post";
import {accessTokenGuard} from "../../auth/routes/guard/access.token.guard";
import {commentInputMiddleware} from "../../comments/validation/comment.input-middleware";
import {getCommentForPost} from "./handlers/get-comment-fot-post";


export const postRouter = Router({});


postRouter
    .get('/:id/comments', getCommentForPost)
    .get('',getPostList )
    .get('/:id',idValidation,findPostBiId)
    .post('',authValidationMiddleware,postInputDtoMiddleware,handlerValidationErrors, createPost)
    .post('/:id/comments',accessTokenGuard,commentInputMiddleware,handlerValidationErrors,createCommentForPost)
    .put('/:id',authValidationMiddleware,idValidation,postInputDtoMiddleware,handlerValidationErrors, updatePost)
    .delete('/:id',authValidationMiddleware,idValidation,deletePost)