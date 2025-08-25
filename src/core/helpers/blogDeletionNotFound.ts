// tests/helpers/blogs/expect-blog-deletion-not-found.ts
import request from 'supertest';
import { Express } from 'express';
import {HttpStatuses} from "../httpSatuses";

export async function expectBlogDeletionNotFound(
    app: Express,
    blogId: string
): Promise<void> {
    await request(app)
        .delete(`/blogs/${blogId}`)
        .expect(HttpStatuses.NotFound_404);
}
