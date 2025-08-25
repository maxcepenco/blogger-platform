import {Express} from "express";
import request from 'supertest'
import {HttpStatuses} from "../httpSatuses";

export async function clearDbTest(app:Express) {
    await request(app)
        .delete('/testing/all-data')
        .expect(HttpStatuses.NoContent_204)
    return
}
