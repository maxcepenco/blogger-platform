import {Router} from "express";
import {passwordValidation} from "../../users/validation/middleware/password.validation";
import {handlerValidationErrors} from "../../core/midleware/handlerValidationErrors";
import {authAccess} from "./auth-login.handler";
import {loginOrEmailValidation} from "../../users/validation/middleware/login-or-email.validation";
import {accessTokenGuard} from "./guard/access.token.guard.ts";
import {authMeHandler} from "./auth-me.handler";
import {authRegistration} from "./auth-registration";
import {emailValidation} from "../../users/validation/middleware/email-validation";
import {loginValidation} from "../../users/validation/middleware/login.validation";
import {confirmEmail} from "./auth-registration-confirmation";
import {codeValidation} from "../../users/validation/middleware/code-validation";
import {registrationEmailResending} from "./auth-registration-email-resending";

export const authRouter = Router();


authRouter
    .post('/login',passwordValidation, loginOrEmailValidation, handlerValidationErrors, authAccess  )
    .get('/me',accessTokenGuard, loginOrEmailValidation, authMeHandler )
    .post('/registration',passwordValidation,emailValidation,loginValidation,handlerValidationErrors,authRegistration)
    .post('/registration-confirmation',codeValidation,handlerValidationErrors, confirmEmail)
    .post('/registration-email-resending',emailValidation,handlerValidationErrors,registrationEmailResending)
