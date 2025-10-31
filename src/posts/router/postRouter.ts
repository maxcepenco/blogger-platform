import {Router} from "express";
import {idValidation} from "../../core/midleware/validationInputIdMiddleware";
import {postInputDtoMiddleware} from "../validatiion/postInputDateMiddleware";
import {handlerValidationErrors} from "../../core/midleware/handlerValidationErrors";
import {authValidationMiddleware} from "../../auth/routes/middleware/auth-validation-middleware";
import {accessTokenGuard} from "../../auth/routes/guard/access.token.guard";
import {commentInputMiddleware} from "../../comments/validation/comment.input-middleware";
import {container} from "../../composition-root";
import {PostController} from "../controller/postController";
import {authenticateUser} from "../../comments/middleware/authAccessTokenMiddleware";

const postController = container.get(PostController);

export const postRouter = Router({});


postRouter

    .post('',
        authValidationMiddleware,
        postInputDtoMiddleware,
        handlerValidationErrors,
        postController.createPost.bind(postController),
    )

    .post('/:id/comments',
        accessTokenGuard,
        commentInputMiddleware,
        handlerValidationErrors,
        postController.createCommentForPost.bind(postController),
    )

    .put('/:id',
        authValidationMiddleware,
        idValidation,
        postInputDtoMiddleware,
        handlerValidationErrors,
        postController.updatePost.bind(postController),
    )

    .get('/:id/comments',
        authenticateUser,
        postController.getCommentForPost.bind(postController),
    )

    .get('',
        postController.getPostList.bind(postController),
    )

    .get('/:id',
        idValidation,
        postController.findPostBiId.bind(postController),
    )


    .delete('/:id',
        authValidationMiddleware,
        idValidation,
        postController.deletePost.bind(postController),
    )