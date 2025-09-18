import {Router} from "express";
import {getComment} from "./get-comment";
import {accessTokenGuard} from "../../auth/routes/guard/access.token.guard.ts";
import {commentInputMiddleware} from "../validation/comment.input-middleware";
import {handlerValidationErrors} from "../../core/midleware/handlerValidationErrors";
import {updateComment} from "./update-comment";
import {deleteComment} from "./delete-comment";
import {idValidation} from "../../core/midleware/validationInputIdMiddleware";
import {validationObjectIdParams} from "../../core/midleware/validationObjectIdParams";


export const commentRouter = Router()

commentRouter
.get('/:id',validationObjectIdParams(),getComment)
.put('/:id', accessTokenGuard,idValidation,commentInputMiddleware,handlerValidationErrors,updateComment)
.delete('/:id',accessTokenGuard,validationObjectIdParams(),deleteComment)