import {Router} from "express";
import {getComment} from "./get-comment";
import {accessTokenGuard} from "../../auth/routes/guard/access.token.guard.ts";
import {commentInputMiddleware} from "../validation/comment.input-middleware";
import {handlerValidationErrors} from "../../core/midleware/handlerValidationErrors";
import {updateComment} from "./update-comment";
import {deleteComment} from "./delete-comment";


export const commentRouter = Router()

commentRouter
.get('/:id',getComment)
.put('/:id', accessTokenGuard,commentInputMiddleware,handlerValidationErrors,updateComment)
.delete('/:id',accessTokenGuard,deleteComment)