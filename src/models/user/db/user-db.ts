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