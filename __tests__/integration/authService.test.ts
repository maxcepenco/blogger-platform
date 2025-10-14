import {MongoMemoryServer} from "mongodb-memory-server";
import {drop, refreshTokenCollection, runDB, stopDb, userCollection} from "../../src/db/mongoDB";
import {nodemailerService} from "../../src/auth/adapters/nodemailer.service";
import {authService} from "../../src/auth/domain/auth.service";
import {UserDto} from "../e2e/utils/testingDtosCreator";
import {ResultStatus} from "../../src/core/result/result-code";
import {addMinutes} from "date-fns";
import {userRepository} from "../../src/users/repository/user.repository";


describe("integration tests for AuthService", () => {
    let mongoServer: MongoMemoryServer

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        await runDB(mongoServer.getUri());
    })
    afterAll(async () => {
        await drop();
        await stopDb();
    });

    describe("User Registration", () => {

        nodemailerService.sendEmail = jest
            .fn()
            .mockImplementation(
                (email: string, code: string, template: (code: string) => string) =>
                    Promise.resolve(true)
            );

        const registerUserUserCase = authService.registerUser

        it('should call email service when registering user', async () => {
            const userDto: UserDto = {
                login: 'macs',
                email: 'email@gmail.com',
                password: '123456'
            }

            await registerUserUserCase(userDto)

            expect(nodemailerService.sendEmail).toHaveBeenCalled()

        })

        it('should successfully register user and return user data', async () => {
            let userDto: UserDto = {
                login: 'macs1',
                email: 'email1@gmail.com',
                password: '123456'
            }
            const result = await registerUserUserCase(userDto)

            expect(result.data?.accountDate.email).toBe(userDto.email);
            expect(result.data?.accountDate.login).toBe(userDto.login);
            expect(result.data?.isConfirmed).toBe(false);


        })

        it('should return BadRequest on duplicate login registration', async () => {
            let userDto: UserDto = {
                login: 'macs1',
                email: 'email2@gmail.com',
                password: '123456'
            }
            const result = await registerUserUserCase(userDto)

            expect(result.status).toBe(ResultStatus.BadRequest)


        })

        it('should return BadRequest on duplicate email registration', async () => {
            let userDto: UserDto = {
                login: 'macs2',
                email: 'email1@gmail.com',
                password: '123456'
            }
            const result = await registerUserUserCase(userDto)

            expect(result.status).toBe(ResultStatus.BadRequest)


        })


    })

    describe('confirmEmail', () => {

        afterEach(async () => {
            // Очищаем БД после каждого теста
            await drop();
        });
        const confirmEmailUseCare = authService.confirmEmail;
        const createUser = (email: string, confirmationCode: string, expirationDate: Date, isConfirmed: boolean) => {
            return {
                accountDate: {
                    login: '',
                    email: email,
                    passwordHash: '',
                    createdAt: new Date(),
                },
                emailConfirmed: {
                    confirmationCode: confirmationCode,
                    expirationDate: expirationDate,
                },
                isConfirmed: isConfirmed,
            }
        }


        it('should return false for expired confirmation code', async () => {

            const user1 = createUser('email@mail.com', 'supercode', addMinutes(new Date(), -1), false)

            await userCollection.insertOne(user1)

            const result = await confirmEmailUseCare('supercode');

            expect(result.status).toBe(ResultStatus.BadRequest)
            expect(result.data).toBeNull()
            expect(result.errorMessage).toBe('Expiration code')
            expect(result.extensions?.errorsMessages).toEqual([{
                field: 'code',
                message: 'Confirmation code has expired'
            }])
            const user = await userRepository.findByCode('supercode');
            expect(user!.isConfirmed).toBeFalsy()
        })


        it('should return false for not existed confirmation code', async () => {

            const result = await confirmEmailUseCare('sesesdsdfdf');

            expect(result.status).toBe(ResultStatus.BadRequest)
            expect(result.data).toBeNull()
            expect(result.errorMessage).toBe('User not found')
            expect(result.extensions?.errorsMessages).toEqual([{
                field: 'code',
                message: 'Confirmation code not found'
            }])

        })

        it('should not confirm email with expired code', async () => {

            const email = 'email1@mail.com';
            const confirmationCode = 'supercode';
            const expirationDateCorrect = addMinutes(new Date(), 1);
            const userConfirm = createUser(email, confirmationCode, expirationDateCorrect, true)


            await userCollection.insertOne(userConfirm)

            const result = await confirmEmailUseCare('supercode');

            expect(result.status).toBe(ResultStatus.BadRequest)
            expect(result.data).toBeNull()
            expect(result.errorMessage).toBe('User confirmed')
            expect(result.extensions?.errorsMessages).toEqual([{
                field: 'code',
                message: 'Email is already confirmed'
            }])
            const user = await userRepository.findByCode('supercode');
            expect(user?.isConfirmed).toBe(true)
        });

        it('should return true for existed and not expired confirmation code', async () => {

            const email = 'email1@mail.com';
            const confirmationCode = 'supercode';
            const expirationDateCorrect = addMinutes(new Date(), 1);

            const goodUser = createUser(email, confirmationCode, expirationDateCorrect, false)


            await userCollection.insertOne(goodUser)

            const result = await confirmEmailUseCare('supercode');

            expect(result.status).toBe(ResultStatus.Success)
            expect(result.data).toBeTruthy()

            const user = await userRepository.findByCode('supercode');
            expect(user?.isConfirmed).toBeTruthy()
        })


    })

    describe('loginUser', () => {

        it('should successfully login with correct credentials and create session', async () => {
            const userDto = {
                login: 'macs',
                email: 'email@email.com',
                password: '123456'

            }

            const reg = await authService.registerUser(userDto)
            expect(reg.status).toBe(ResultStatus.Success)

            const deviceName = 'Chrome Browser'
            const ip = '192.168.0.1'

            const result = await authService.loginUser(
                userDto.login,
                userDto.password,
                deviceName,
                ip
            )


            expect(result.status).toBe(ResultStatus.Success);
            expect(result.data).toBeDefined();
            expect(result.data?.accessToken).toBeDefined();
            expect(result.data?.refreshToken).toBeDefined();
            expect(typeof result.data?.accessToken).toBe('string');
            expect(typeof result.data?.refreshToken).toBe('string');


            const sessions = await refreshTokenCollection.find().toArray()
            expect(Array.isArray(sessions)).toBe(true)
            expect(sessions.length).toBe(1)

            const session = sessions[0]
            expect(session).toHaveProperty('userId')
            expect(session).toHaveProperty('deviceId')
            expect(session).toHaveProperty('deviceName', deviceName)
            expect(session).toHaveProperty('ip', ip)
            expect(session.iat).toBeInstanceOf(Date)
            expect(session.exp).toBeInstanceOf(Date)
        })

    })
})
