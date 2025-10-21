import {Router} from "express";
import {accessTokenGuard} from "../../auth/routes/guard/access.token.guard";
import {commentInputMiddleware} from "../validation/comment.input-middleware";
import {handlerValidationErrors} from "../../core/midleware/handlerValidationErrors";
import {idValidation} from "../../core/midleware/validationInputIdMiddleware";
import {validationObjectIdParams} from "../../core/midleware/validationObjectIdParams";
import {CommentController} from "../controller/comment-controller";
import {container} from "../../composition-root";

const commentController = container.get(CommentController)
export const commentRouter = Router()

commentRouter
    .get('/:id',
        validationObjectIdParams(),
        commentController.getComment.bind(commentController)
    )
    .put('/:id',
        accessTokenGuard,
        idValidation,
        commentInputMiddleware,
        handlerValidationErrors,
        commentController.updateComment.bind(commentController)
    )
    .delete('/:id',
        validationObjectIdParams(),
        accessTokenGuard,
        commentController.deleteComment.bind(commentController)
    )