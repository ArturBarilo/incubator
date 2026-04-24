import { port, runDb } from './db/db'
import {setupApp} from "./settings";
// import {app} from "./settings";

import express, {Express} from "express";
import {blogRoute} from "./routes/blog-route";
import {postRoute} from "./routes/post-route";
import {userRoute} from "./routes/user-route";
import {authRoute} from "./routes/auth-route";
import {commentRoute} from "./routes/comment-route";
import {testing} from "./routes/testing-route";


// app.listen(port, async () => {
//
//     await runDb()
//
// })



//---------------------------------------------------------------------------------//




const app = express();
setupApp(app);

// порт приложения
const PORT = 3001;




app.listen(PORT, async () => {
    console.log('in listedoufhgdf22229000')
    console.log('in listedoufhgdf22229000')
    await runDb()
});
//---------------------------------------------------------------------------------//


