import request from 'supertest';
import { Express } from 'express';


export async function clearDb(app: Express) {
    await request(app)
        .delete('/testing/all-data')
        .expect(204);
    return;
}