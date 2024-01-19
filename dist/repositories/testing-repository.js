"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestingRepository = void 0;
const db_1 = require("../db/db");
class TestingRepository {
    static deleteAll() {
        db_1.db.blogs = [];
        db_1.db.posts = [];
        return;
    }
}
exports.TestingRepository = TestingRepository;
