import request from 'supertest';
import express from 'express';

import {runDb, stopDb} from "../db/db";
import {setupApp} from "../settings";
import {clearDb} from "./utils/clear-db"

describe('AUTH', () => {
    const app = express();
    setupApp(app);

    beforeAll(async() => {
        await runDb()
        await clearDb(app)
    })

    const testUser = {
        "login": "O-pWth111",
        "password": "qwerty",
        "email": "sanitarfresh@gmail.com"
    }

     let createdUser = {}

    let jwtToken = {
        accessToken: 'some token'
    }

    afterAll(async () => {
        await stopDb();
    });
    it("should return 'Hello world!'", async () => {
        const res = await request(app).get("/");
        expect(res.status).toBe(200);
        expect(res.text).toBe("Hello QWERTYUIOP!");
    });

    it('should not create user with invalid login', async () => {
        const newInvalidUser = {
            ...testUser,
            login: 'tooooo loooong'
        }

        const resResponse = await request(app)
            .post('/users')
            .send(newInvalidUser)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(400)

        expect(Object.keys(resResponse.body)[0]).toEqual('errorsMessages')
    })

    it('should not create user with invalid password', async () => {
        const newInvalidUser = {
            ...testUser,
            password: 42
        }

        const resResponse = await request(app)
            .post('/users')
            .send(newInvalidUser)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(400)

        expect(Object.keys(resResponse.body)[0]).toEqual('errorsMessages')
    })

    it('should create user', async () => {
        const newUser = {
            ...testUser,
            login: 'admin'
        }

        const createResponse = await request(app)
            .post('/users')
            .send(newUser)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')

            .expect(201)

        createdUser = createResponse.body

        expect(createResponse.body.login).toEqual(newUser.login)
    })

    it('should not create user with not unique login', async () => {
        const newInvalidUser = {
            ...testUser,
            login: 'admin'
        }

        const resResponse = await request(app)
            .post('/users')
            .send(newInvalidUser)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(400)

        expect(Object.keys(resResponse.body)[0]).toEqual('errorsMessages')
    })

    it('should not create user with not unique email', async () => {
        const resResponse = await request(app)
            .post('/users')
            .send(testUser)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(400)

        expect(Object.keys(resResponse.body)[0]).toEqual('errorsMessages')
    })

    it('should login', async () => {
        const loginAndPass = {
            loginOrEmail: 'admin',
            password: 'qwerty'
        }
        const resResponse = await request(app)
            .post('/auth/login')
            .send(loginAndPass)
            .expect(200)

        jwtToken = resResponse.body

        expect(Object.keys(resResponse.body)[0]).toEqual('accessToken')
    })

    it('should return me', async () => {
        const resResponse = await request(app)
            .get('/auth/me')
            .set('Authorization', `Bearer ${jwtToken.accessToken}`)
            .expect(200)
    })

    it('should return all users', async () => {
        const resResponse = await request(app)
            .get('/users')
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(200)
    })

})
















// import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
// import { MongoMemoryServer } from 'mongodb-memory-server';
// import { disconnect } from 'mongoose';
//
// let mongo: MongoMemoryServer;
//
// export const rootMongooseTestModule = (options: MongooseModuleOptions = {}) =>
//     MongooseModule.forRootAsync({
//         useFactory: async () => {
//             mongo = await MongoMemoryServer.create();
//             const mongoUri = mongo.getUri();
//             return {
//                 uri: mongoUri,
//                 useCreateIndex: true,
//                 ...options,
//             };
//         },
//     });
//
// export const closeMongoConnection = async () => {
//     await disconnect();
//     if (mongo) await mongo.stop();
// };