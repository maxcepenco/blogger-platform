import {Router} from "express";
import {loginValidation} from "../../users/validation/middleware/login.validation";
import {passwordValidation} from "../../users/validation/middleware/password.validation";
import {handlerValidationErrors} from "../../core/midleware/handlerValidationErrors";
import {authAccess} from "./handler/auth-handler";

export const authRouter = Router();


authRouter
    .post('',passwordValidation, loginValidation, handlerValidationErrors, authAccess  )
