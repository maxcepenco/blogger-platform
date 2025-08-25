import express from "express";
import request from "supertest";
import {generateBasicAuthToken} from "../../src/core/helpers/generateBasicAuthToken";
import {setupApp} from "../../src/setup-app";
import {clearDbTest} from "../../src/core/helpers/clearDbTest";
import {HttpStatuses} from "../../src/core/httpSatuses";
import {BlogInputModel} from "../../src/blogs/Dto/BlogInputModel";
import {getBlogDto} from "../../src/core/helpers/getBlogDto";
import {createBlog} from "../../src/core/helpers/createBlogTest";
import {getBlogById} from "../../src/core/helpers/getBlogById";
import {updateBlog} from "../../src/core/helpers/updateBlog";


describe('Blogger-platform API',() => {
    const app = setupApp(express());


    const adminToken = generateBasicAuthToken()

    beforeAll(async () => {
        await clearDbTest(app)
    })

    it('should create blogs; POST/api/blogs', async() =>{
        const newBlog:BlogInputModel = {
            ...getBlogDto(),
            name: 'Example 4',
            description: 'Example 4 description',
        }

        await createBlog(app, newBlog)
    })

    it( 'should return blogs list; GET /api/blogs', async() =>{
        await createBlog(app)
        await createBlog(app)

        const response = await request (app)
            .get('/blogs')
            .expect(HttpStatuses.Ok_200)

        expect(response.body).toBeInstanceOf(Array)
        expect(response.body.length).toBeGreaterThanOrEqual(2)
    })

    it('should return blog by id; G/:id', async() =>{
        const createdBlog = await createBlog(app)

        const blog = await getBlogById(app, createdBlog.id)

        expect (blog).toEqual({
            ...blog,
            id: expect.any(String)
        })

    })

    it('should update blog by id', async() =>{
        const createdBlog = await createBlog(app)

        const blogUpdateData: BlogInputModel = {
            name: 'Update name',
            description: 'Update name description',
            webSiteUrl: 'https://example.com',
        }
        await updateBlog( app, createdBlog.id, blogUpdateData)
        const blogResponse = await getBlogById(app, createdBlog.id)

        expect(blogResponse).toEqual({
            id: createdBlog.id,
            ...blogUpdateData,
        })

    })

    it('delete  blog by id', async() =>{
        const createdBlog = await createBlog(app)

        await request(app)
            .delete(`/blogs/${createdBlog.id}`) // ✅ Правильно
            .expect(HttpStatuses.NoContent_204)  // ✅ Убираем лишние скобки

    })


})