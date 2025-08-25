// tests/helpers/blogs/expect-blog-not-found.ts
import request from 'supertest';
import { Express } from 'express';
import {HttpStatuses} from "../httpSatuses";

export async function expectBlogNotFound(
    app: Express,
    blogId: string
): Promise<void> {
    await request(app)
        .get(`/blogs/${blogId}`)
        .expect(HttpStatuses.NotFound_404);
}
