import {testingDtoCreator} from "./testingDtosCreator";
import {createUser} from "./createUsers";
import {setupApp} from "../../../src/setup-app";
import express from "express";
const app = setupApp(express())

export const createTestUsers =async (count:number) => {
    for(let i = 1; i<= count; ++i) {
        await createUser(app, testingDtoCreator.createUserDto({
            login: `user${i}`,
            email: `user${i}$test.com`
        }))
    }
}