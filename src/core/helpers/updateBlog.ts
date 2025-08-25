import {Express} from "express";
import {BlogInputModel} from "../../blogs/Dto/BlogInputModel";
import {getBlogDto} from "./getBlogDto";
import {generateBasicAuthToken} from "./generateBasicAuthToken";
import request from "supertest";
import {HttpStatuses} from "../httpSatuses";


export async function updateBlog(
    app: Express,
    blogId: string,
    blogDto?:BlogInputModel
): Promise<void>
{
    const defaultBlogData: BlogInputModel = getBlogDto()
    const testBlogData = { ...defaultBlogData , ...blogDto }
     await request(app)
        .put(`/blogs/${blogId}`)
        .set('Authorization', generateBasicAuthToken())
        .send(testBlogData)
        .expect(HttpStatuses.NoContent_204)
}