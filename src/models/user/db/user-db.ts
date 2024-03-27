export type UserDb = {
    login: string
    email: string
    password: string
    createdAt: string
}

export type UserDbWithId = {
    _id: string
    login: string
    email: string
    password: string
    createdAt: string
}

export type UserAccountDb = {
    accountData: AccountData
    emailConfirmation: EmailConfirmation
}

export type AccountData = {
    userName: string
    email: string
    password: string
    createdAt: string
}
export type EmailConfirmation = {
    isConfirmed: boolean
    confirmationCode: string
    expirationDate: Date
}