import {Router} from "express";
import {passwordValidation} from "../validation/middleware/password.validation";
import {loginValidation} from "../validation/middleware/login.validation";
import {handlerValidationErrors} from "../../core/midleware/handlerValidationErrors";
import {createNewUser} from "./handler/create.user";
import {getListUser} from "./handler/get-list.user";
import {deleteUser} from "./handler/delete.user";
import {userPaginateValidation} from "../validation/middleware/user-middleware";

export const userRouter = Router();


userRouter
    .post('',passwordValidation, loginValidation, handlerValidationErrors, createNewUser )
    .get('',userPaginateValidation, getListUser)
    .delete('/:id', deleteUser)