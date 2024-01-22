"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runDb = exports.postsCollection = exports.blogsCollection = exports.port = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const mongodb_1 = require("mongodb");
dotenv_1.default.config();
exports.port = 80;
const uri = process.env.MONGO_URL || 'mongodb://localhost:27017';
const client = new mongodb_1.MongoClient(uri);
console.log(`mongodb start on ${process.env.MONGO_URL}`);
const database = client.db('blogs-db');
exports.blogsCollection = database.collection('blogs');
exports.postsCollection = database.collection('posts');
const runDb = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield client.connect();
        console.log('client connect to DB');
        console.log(`App listen on port: ${exports.port}`);
    }
    catch (e) {
        console.log(e);
        yield client.close();
    }
});
exports.runDb = runDb;
