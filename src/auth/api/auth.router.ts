import {Router} from "express";
import {loginValidation} from "../../users/validation/middleware/login.validation";
import {passwordValidation} from "../../users/validation/middleware/password.validation";
import {handlerValidationErrors} from "../../core/midleware/handlerValidationErrors";
import {authAccess} from "./handler/auth-handler";
import {loginOrEmailValidation} from "../../users/validation/middleware/login-or-email.validation";

export const authRouter = Router();


authRouter
    .post('/login',passwordValidation, loginOrEmailValidation, handlerValidationErrors, authAccess  )
