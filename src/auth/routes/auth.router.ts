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
import {container} from "../../composition-root";
import {AuthController} from "../controller/auth-controller";

const authController = container.get(AuthController);

export const authRouter = Router();


authRouter
    .post('/login',
        userRequestRateLimiter,
        passwordValidation, loginOrEmailValidation,
        handlerValidationErrors,
        authController.authLoginAccess.bind(authController))

    .get('/me', accessTokenGuard,
        loginOrEmailValidation,
        userRequestRateLimiter,
        authController.authMeHandler.bind(authController))

    .post('/registration',
        userRequestRateLimiter,
        passwordValidation,
        emailValidation,
        loginValidation,
        handlerValidationErrors,
        authController.authRegistration.bind(authController))

    .post('/registration-confirmation',
        userRequestRateLimiter,
        codeValidation,
        handlerValidationErrors,
        authController.confirmEmail.bind(authController))

    .post('/registration-email-resending',
        userRequestRateLimiter,
        emailValidation,
        handlerValidationErrors,
        authController.registrationEmailResending.bind(authController))

    .post('/refresh-token',
        refreshTokenGuard,
        authController.authRefreshToken.bind(authController))

    .post('/logout', refreshTokenGuard,
        authController.logout.bind(authController))
