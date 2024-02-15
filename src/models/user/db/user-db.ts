export type UserDb = {
    login: string
    email: string
    password: Promise<string>
    createdAt: string
}