import {Router} from "express";
import {passwordValidation} from "../../users/validation/middleware/password.validation";
import {handlerValidationErrors} from "../../core/midleware/handlerValidationErrors";
import {loginOrEmailValidation} from "../../users/validation/middleware/login-or-email.validation";
import {accessTokenGuard} from "./guard/access.token.guard";
import {emailValidation} from "../../users/validation/middleware/email-validation";
import {loginValidation} from "../../users/validation/middleware/login.validation";
import {codeValidation} from "../../users/validation/middleware/code-validation";
import {refreshTokenGuard} from "./guard/refresh.token.guard";
import {userRequestRateLimiter} from "../../core/midleware/rateLimit";
import {authController} from "./auth-controller";

export const authRouter = Router();


authRouter
    .post('/login',userRequestRateLimiter,passwordValidation, loginOrEmailValidation, handlerValidationErrors, authController.authLoginAccess  )
    .get('/me',accessTokenGuard, loginOrEmailValidation,userRequestRateLimiter, authController.authMeHandler )
    .post('/registration',userRequestRateLimiter,passwordValidation,emailValidation,loginValidation,handlerValidationErrors,authController.authRegistration)
    .post('/registration-confirmation',userRequestRateLimiter,codeValidation,handlerValidationErrors, authController.confirmEmail)
    .post('/registration-email-resending',userRequestRateLimiter,emailValidation,handlerValidationErrors,authController.registrationEmailResending)
    .post('/refresh-token',refreshTokenGuard,authController.authRefreshToken)
    .post('/logout',refreshTokenGuard, authController.logout)
