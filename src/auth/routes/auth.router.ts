import {Router} from "express";
import {passwordValidation} from "../../users/validation/middleware/password.validation";
import {handlerValidationErrors} from "../../core/midleware/handlerValidationErrors";
import {authAccess} from "./auth-login.handler";
import {loginOrEmailValidation} from "../../users/validation/middleware/login-or-email.validation";
import {accessTokenGuard} from "./guard/access.token.guard.ts";
import {authMeHandler} from "./auth-me.handler";

export const authRouter = Router();


authRouter
    .post('/login',passwordValidation, loginOrEmailValidation, handlerValidationErrors, authAccess  )
    .get('/me',accessTokenGuard, loginOrEmailValidation, authMeHandler );
