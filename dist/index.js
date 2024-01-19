"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const settings_1 = require("./settings");
const port = 3001;
settings_1.app.listen(port, () => {
    console.log(`App listen on port: ${port}`);
});
//??? менять имя блога в посте в методе PUT ???
// удалить console.logs
