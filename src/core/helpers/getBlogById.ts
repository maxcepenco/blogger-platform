import {Express} from "express";
import {Blog} from "../../blogs/Dto/Blog";
import request from "supertest";
import {HttpStatuses} from "../httpSatuses";


export async function getBlogById(app:Express, blogId: string): Promise<Blog>
{
    const blogResponse = await request(app)
        .get(`/blogs/${blogId}`)
        .expect(HttpStatuses.Ok_200)

    return blogResponse.body;
}