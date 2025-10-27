





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

export type PasswordRecovery = {
    recoveryCode:string | null
    expirationDate: Date

}

export type UserAccountDBType = {
    accountDate: AccountData,
    emailConfirmed: EmailConfirmation | null,
    passwordRecovery?: PasswordRecovery | null;
    isConfirmed: boolean
}
