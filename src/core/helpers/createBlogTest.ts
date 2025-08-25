import {BlogInputModel} from "../../blogs/Dto/BlogInputModel";
import {Express} from "express";
import {Blog} from "../../blogs/Dto/Blog";
import {getBlogDto} from "./getBlogDto";
import {generateBasicAuthToken} from "./generateBasicAuthToken";
import request from "supertest";
import {HttpStatuses} from "../httpSatuses";
import {BlogViewModel} from "../../blogs/Dto/BlogViweModel";


export async function createBlog(
    app:Express,
    blogDto?: BlogInputModel
): Promise<Blog> {
    const defaultBlogData:BlogInputModel = getBlogDto()
    const testBlogData = {...defaultBlogData, ...blogDto}

    const createBlogResponse = await request(app)
        .post('/blogs')
        .set('Authorization', generateBasicAuthToken())
        .send(testBlogData)
        .expect(HttpStatuses.Created_201)
    return createBlogResponse.body;
}