import {Router} from "express";
import {idValidation} from "../../core/midleware/validationInputIdMiddleware";
import {postInputDtoMiddleware} from "../validatiion/postInputDateMiddleware";
import {handlerValidationErrors} from "../../core/midleware/handlerValidationErrors";
import {authValidationMiddleware} from "../../auth/routes/middleware/auth-validation-middleware";
import {accessTokenGuard} from "../../auth/routes/guard/access.token.guard";
import {commentInputMiddleware} from "../../comments/validation/comment.input-middleware";
import {postController} from "./postController";


export const postRouter = Router({});


postRouter
    .get('/:id/comments',
        postController.getCommentForPost
    )

    .get('',
        postController.getPostList
    )

    .get('/:id',
        idValidation,
        postController.findPostBiId
    )

    .post('',
        authValidationMiddleware,
        postInputDtoMiddleware,
        handlerValidationErrors,
        postController.createPost
    )

    .post('/:id/comments',
        accessTokenGuard,
        commentInputMiddleware,
        handlerValidationErrors,
        postController.createCommentForPost
    )

    .put('/:id',
        authValidationMiddleware,
        idValidation,
        postInputDtoMiddleware,
        handlerValidationErrors,
        postController.updatePost
    )

    .delete('/:id',
        authValidationMiddleware,
        idValidation,
        postController.deletePost
    )