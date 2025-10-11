export type UserDto = {
    login: string;
    email: string;
    password: string;
}

export const testingDtoCreator = {
    createUserDto({login, email, password}: {
        login?:string, email?: string, password?: string
    }):UserDto {
        return {
            login: login ?? 'test',
            email: email ?? 'test@gmail.com',
            password: password ?? '123456789'
        }
    }
}