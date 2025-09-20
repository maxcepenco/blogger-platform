

export type UserAccountDBType = {
    accountDate: AccountData,
    emailConfirmed?: EmailConfirmation,
    isConfirmed: boolean
}



export type AccountData = {
    login: string
    email: string
    passwordHash: string
    createdAt: Date
}

export type EmailConfirmation = {
    confirmationCode: string,
    expirationDate: Date,
}

//в видео уроке и репо createdAt: Date