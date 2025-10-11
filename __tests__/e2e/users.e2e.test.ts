import {setupApp} from "../../src/setup-app";
import express from "express";
import {MongoMemoryServer} from 'mongodb-memory-server'
import {
    blogCollection,
    commentCollection,
    postCollection,
    refreshTokenCollection, requestLogsCollection,
    runDB,
    stopDb,
    userCollection
} from "../../src/db/mongoDB";
import request from "supertest";
import {testingDtoCreator} from "./utils/testingDtosCreator";
import {ADMIN_PASSWORD, ADMIN_USERNAME} from "../../src/auth/routes/middleware/auth-validation-middleware";
import {createUser} from "./utils/createUsers";
import {USER_PATHS} from "../../src/core/paths/paths";


describe('USERS_TEST', () => {
    const app = setupApp(express())

    beforeAll(async () => {
        const mongoServer = await MongoMemoryServer.create();
        await runDB(mongoServer.getUri());
    })
    beforeEach(async () => {
        console.log('🔄 Starting beforeEach - cleaning database...');

        try {
            const results = await Promise.all([
                blogCollection.deleteMany({}),
                postCollection.deleteMany({}),
                userCollection.deleteMany({}),
                commentCollection.deleteMany({}),
                refreshTokenCollection.deleteMany({}),
                requestLogsCollection.deleteMany({}),
            ]);

            console.log('✅ Database cleaned:', {
                blogs: results[0].deletedCount,
                posts: results[1].deletedCount,
                users: results[2].deletedCount,
                comments: results[3].deletedCount,
                refreshTokens: results[4].deletedCount,
                requestLogs: results[5].deletedCount,
            });

            // Проверим, что действительно пусто
            const userCount = await userCollection.countDocuments({});
            console.log('📊 Users in DB after cleanup:', userCount);

        } catch (error) {
            console.error('❌ Error cleaning database:', error);
            throw error;
        }
    })

    afterAll(async () => {
        await stopDb()
    })



    let userDto: any

    // -----------------------Test create user endpoint-------------------------------------------
    it('shouldn`t create user without authorization: STATUS 401', async () => {
        await request(app)
            .post(USER_PATHS)
            .send({
                login: ''
            })
            .expect(401)
    })

    it('should create user with correct data by sa and return it:STATUS 201', async () => {
        userDto = testingDtoCreator.createUserDto({})

        const newUser = await request(app)
            .post(USER_PATHS)
            .auth(ADMIN_USERNAME, ADMIN_PASSWORD)
            .send({
                login: userDto.login,
                email: userDto.email,
                password: userDto.password,
            })
            .expect(201)

        expect(newUser.body).toEqual({
            id: expect.any(String),
            login: userDto.login,
            email: userDto.email,
            createdAt: expect.any(String),

        })
    })

    it('shouldn`t create user twice with correct data by sa: STATUS 400', async () => {
        userDto = testingDtoCreator.createUserDto({})

        console.log('Creating first user with:', userDto);
        const user = await createUser(app, userDto)
        console.log('First user created:', user);

        await request(app)
            .post(USER_PATHS)
            .auth(ADMIN_USERNAME, ADMIN_PASSWORD)
            .send(userDto)
            .expect(400)
    })

    it('shouldn`t create user with incorrect login: STATUS 400', async () => {
        userDto = testingDtoCreator.createUserDto({login: ''})
        await request(app)
            .post(USER_PATHS)
            .auth(ADMIN_USERNAME, ADMIN_PASSWORD)
            .send({
                    login: userDto.login,
                    email: userDto.email,
                    password: userDto.password
                }
            )
            .expect(400)
    })

    it('shouldn`t create user with incorrect email: STATUS 400', async () => {
        userDto = testingDtoCreator.createUserDto({email: 'hhh'})
        await request(app)
            .post(USER_PATHS)
            .auth(ADMIN_USERNAME, ADMIN_PASSWORD)
            .send({
                    login: userDto.login,
                    email: userDto.email,
                    password: userDto.password
                }
            )
            .expect(400)
    })

    it('shouldn`t create user with incorrect password: STATUS 400', async () => {
        userDto = testingDtoCreator.createUserDto({password: 'hh'})
        await request(app)
            .post(USER_PATHS)
            .auth(ADMIN_USERNAME, ADMIN_PASSWORD)
            .send({
                    login: userDto.login,
                    email: userDto.email,
                    password: userDto.password
                }
            )
            .expect(400)
    })

    //------------------------ Test delete user endpoint----------------------------------------
    it('shouldn`t delete user by id without authorization: STATUS 401', async () => {

        const user = await createUser(app)

        await request(app)
            .delete(`${USER_PATHS + '/' + user.id}`)
            .expect(401)
    })

    it('should delete user by id : STATUS 204', async () => {

        const user = await createUser(app)

        await request(app)
            .delete(`${USER_PATHS + '/' + user.id}`)
            .auth(ADMIN_USERNAME, ADMIN_PASSWORD)
            .expect(204)
    })

    it('shouldn`t delete user bt id if specified user is not exists: STATUS 404', async () => {
        await request(app)
            .delete(`${USER_PATHS + '/507f1f77bcf86cd799439011'}`)
            .auth(ADMIN_USERNAME, ADMIN_PASSWORD)
            .expect(404)
    })

    //-------------------------Test get-list user endpoint---------------------------------------
    it('should return empty list when no users exists: STATUS 200', async () => {
        const response = await request(app)
            .get(USER_PATHS)
            .auth(ADMIN_USERNAME, ADMIN_PASSWORD)
            .expect(200)

        expect(response.body).toEqual({
            pagesCount: 0,
            page: 1,
            pageSize: 10,
            totalCount: 0,
            items: []
        })
    })

    it('should return users list with correct pagination structure: STATUS 200', async () => {
        const user1Dto = testingDtoCreator.createUserDto({login: 'user1', email: 'user1@email.com'})
        const user1 = await createUser(app, user1Dto)

        const user2Dto = testingDtoCreator.createUserDto({login: 'user2', email: 'user2@email.com'})
        const user2 = await createUser(app, user2Dto)

        const response = await request(app)
            .get(USER_PATHS)
            .auth(ADMIN_USERNAME, ADMIN_PASSWORD)
            .expect(200)

        expect(response.body).toEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 2,
            items: expect.arrayContaining([
                {
                    id: expect.any(String),
                    login: user1.login,
                    email: user1.email,
                    createdAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/)
                },
                {
                    id: expect.any(String),
                    login: user2.login,
                    email: user2.email,
                    createdAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/)
                },
            ])
        })

        expect(response.body.items).toHaveLength(2)
        expect(response.body.totalCount).toBe(2)

        expect(response.body.items[0]).toHaveProperty('id')
        expect(response.body.items[0]).toHaveProperty('login')
        expect(response.body.items[0]).toHaveProperty('email')
        expect(response.body.items[0]).toHaveProperty('createdAt')

    })


    it('should return correct pagination for multiple users: STATUS 200', async () => {
    })

})