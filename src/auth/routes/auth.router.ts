import {Router} from "express";
import {passwordValidation} from "../../users/validation/middleware/password.validation";
import {handlerValidationErrors} from "../../core/midleware/handlerValidationErrors";
import {authLoginAccess} from "./auth-login.handler";
import {loginOrEmailValidation} from "../../users/validation/middleware/login-or-email.validation";
import {accessTokenGuard} from "./guard/access.token.guard";
import {authMeHandler} from "./auth-me.handler";
import {authRegistration} from "./auth-registration";
import {emailValidation} from "../../users/validation/middleware/email-validation";
import {loginValidation} from "../../users/validation/middleware/login.validation";
import {confirmEmail} from "./auth-registration-confirmation";
import {codeValidation} from "../../users/validation/middleware/code-validation";
import {registrationEmailResending} from "./auth-registration-email-resending";
import {refreshTokenGuard} from "./guard/refresh.token.guard";
import {authRefreshToken} from "./auth-refresh-token";
import {logout} from "./logout";
import {userRequestRateLimiter} from "../../core/midleware/rateLimit";

export const authRouter = Router();


authRouter
    .post('/login',passwordValidation, loginOrEmailValidation, handlerValidationErrors,userRequestRateLimiter, authLoginAccess  )
    .get('/me',accessTokenGuard, loginOrEmailValidation,userRequestRateLimiter, authMeHandler )
    .post('/registration',passwordValidation,emailValidation,loginValidation,handlerValidationErrors,userRequestRateLimiter,authRegistration)
    .post('/registration-confirmation',codeValidation,handlerValidationErrors,userRequestRateLimiter, confirmEmail)
    .post('/registration-email-resending',emailValidation,handlerValidationErrors,userRequestRateLimiter,registrationEmailResending)
    .post('/refresh-token',refreshTokenGuard,userRequestRateLimiter,authRefreshToken)
    .post('/logout',refreshTokenGuard, logout)
