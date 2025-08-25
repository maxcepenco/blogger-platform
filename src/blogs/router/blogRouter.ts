import {Router} from "express";
import { getAllBlogs} from "./handlers/getAllBlogsHandler";
import {createBlogHandler} from "./handlers/createBlogHandler";
import {findBlogBiId} from "./handlers/getlBlogHandler";
import {updateBlog} from "./handlers/updateBlogHandler";
import {deleteBlog} from "./handlers/deleteBlogHandler";
import {idValidation} from "../../midleware/validationInputIdMiddleware";
import {blogInputDtoValidation} from "../../midleware/blogInputDateMidlleware";


export const blogRouter = Router({});

blogRouter
    .get('', getAllBlogs)
    .post('', blogInputDtoValidation, createBlogHandler)
    .get('/:id',idValidation ,findBlogBiId)
    .put('/:id',idValidation,blogInputDtoValidation, updateBlog)
    .delete('/:id',idValidation, deleteBlog);


