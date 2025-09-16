import {Router} from "express";
import {passwordValidation} from "../validation/middleware/password.validation";
import {loginValidation} from "../validation/middleware/login.validation";
import {handlerValidationErrors} from "../../core/midleware/handlerValidationErrors";
import {createNewUser} from "./handler/create.user";
import {getListUser} from "./handler/get-list.user";
import {deleteUser} from "./handler/delete.user";
import {userPaginateValidation} from "../validation/middleware/user-middleware";
import {authValidationMiddleware} from "../../auth/routes/middleware/auth-validation-middleware";
import {emailValidation} from "../validation/middleware/email-validation";

export const userRouter = Router();


userRouter
    .post('',authValidationMiddleware,passwordValidation,emailValidation, loginValidation, handlerValidationErrors, createNewUser )
    .get('',authValidationMiddleware,userPaginateValidation, getListUser)
    .delete('/:id',authValidationMiddleware, deleteUser)