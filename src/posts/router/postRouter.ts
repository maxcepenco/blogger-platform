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
import {accessTokenGuard} from "../../auth/routes/guard/access.token.guard.ts";


export const postRouter = Router({});


postRouter
    .get('',getPostList )
    .get('/:postId',idValidation,findPostBiId)
    .post('',authValidationMiddleware,postInputDtoMiddleware,handlerValidationErrors, createPost)
    .post('/:postId/comment',accessTokenGuard,createCommentForPost)
    .put('/:postId',authValidationMiddleware,idValidation,postInputDtoMiddleware,handlerValidationErrors, updatePost)
    .delete('/:postId',authValidationMiddleware,idValidation,deletePost)