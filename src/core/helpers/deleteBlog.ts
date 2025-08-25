// tests/helpers/blogs/delete-blog.ts
import request from 'supertest';
import { Express } from 'express';
import {HttpStatuses} from "../httpSatuses";

export async function deleteBlog(
    app: Express,
    blogId: string
): Promise<void> {
    await request(app)
        .delete(`/blogs/${blogId}`)
        .expect(HttpStatuses.NoContent_204);
}
