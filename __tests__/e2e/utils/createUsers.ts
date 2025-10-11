import {USER_PATHS} from "../../../src/core/paths/paths";
import {testingDtoCreator, UserDto} from "./testingDtosCreator";
import request from "supertest";
import {ADMIN_PASSWORD, ADMIN_USERNAME} from "../../../src/auth/routes/middleware/auth-validation-middleware";

export const createUser = async (app: any, userDto?: UserDto) => {
    const dto = userDto ?? testingDtoCreator.createUserDto({})

    const resp = await request(app)
        .post(USER_PATHS)
        .auth(ADMIN_USERNAME, ADMIN_PASSWORD)
        .send({
            login: dto.login,
            email: dto.email,
            password: dto.password,
        });

    if (resp.status !== 201) {
        console.log('❌ CREATE USER ERROR:', resp.status, resp.body);
    }

    expect(resp.status).toBe(201);

    return resp.body;
};
