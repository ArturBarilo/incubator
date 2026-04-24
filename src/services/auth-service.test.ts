// import {AuthService} from "./auth-service";
//
// const {MongoClient} = require('mongodb');
//
// const authService = new AuthService()
//
// describe('insert', () => {
//
//
//     let connection;
//     let db;
//     // let mongoServer: MongoMemoryServer;
//
//
//     beforeAll(async () => {
//         connection = await MongoClient.connect(process.env.MONGO_URL, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//         });
//         db = await connection.db('aaaa');
//     });
//
//     afterAll(async () => {
//         await connection.close();
//     });
//
//     it('should insert a doc into collection', async () => {
//         const users = db.collection('users');
//
//         const mockUser = {_id: 'some-user-id', name: 'John'};
//         await users.insertOne(mockUser);
//
//         const insertedUser = await users.findOne({_id: 'some-user-id'});
//         console.log('insertedUser', insertedUser)
//         expect(insertedUser).toEqual(mockUser);
//     });
//
//     it('sfdg', async () => {
//
//         const newUser = {
//             login: "login",
//             email: 'email',
//             password: 'paass'
//         }
//         const result = await authService.createUser(newUser)
//         console.log('result', result)
//         expect(result.accountData.email).toEqual(newUser.email);
//     })
// });