import {body} from "express-validator";
import {container} from "../../../composition-root";
import {UserRepository} from "../../repository/user.repository";

const userRepository = container.get(UserRepository)
export const loginValidation = body('login')
    .isString()
    .withMessage('login must be a string')
    .trim()
    .isLength({min: 3, max: 10})
    .withMessage('login must be between 3 and 10 characters')
    .matches(/^[a-zA-Z0-9_-]*$/)
    .withMessage('login must match pattern ^[a-zA-Z0-9_-]*$')
    .custom(async (login: string) => {
        const user = await userRepository.findByLoginOrEmail(login);
        if (user) {
            throw new Error("login already exists");
        }
        return true;
    });