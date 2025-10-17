import {Router} from "express";
import {passwordValidation} from "../validation/middleware/password.validation";
import {loginValidation} from "../validation/middleware/login.validation";
import {handlerValidationErrors} from "../../core/midleware/handlerValidationErrors";
import {userPaginateValidation} from "../validation/middleware/user-middleware";
import {authValidationMiddleware} from "../../auth/routes/middleware/auth-validation-middleware";
import {emailValidation} from "../validation/middleware/email-validation";
import {userController} from "./user-controller";

export const userRouter = Router();


userRouter
    .post('', authValidationMiddleware,
        passwordValidation,
        emailValidation,
        loginValidation,
        handlerValidationErrors,
        userController.createNewUser.bind(userController))
    .get('',
        authValidationMiddleware,
        userPaginateValidation,
        userController.getListUser.bind(userController))
    .delete('/:id',
        authValidationMiddleware,
        userController.deleteUser.bind(userController))