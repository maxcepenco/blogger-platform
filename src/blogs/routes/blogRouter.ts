import {Router} from "express";
import {getAllBlogs} from "./handlers/get-blogs-list";
import {createBlog} from "./handlers/create-blog";
import {findBlogBiId} from "./handlers/get-blog";
import {updateBlog} from "./handlers/update-blog";
import {deleteBlog} from "./handlers/delete-blog";
import {idValidation} from "../../core/midleware/validationInputIdMiddleware";
import {blogInputDtoValidation} from "../validation/blogInputDateMidlleware";
import {authValidationMiddleware} from "../../auth/api/guard/authValidationMiddleware";
import {handlerValidationErrors} from "../../core/midleware/handlerValidationErrors";
import {getBlogPostList} from "./handlers/get-blog-post-list";
import {createPostForBlog} from "./handlers/create-post-for-blog";
import {BlogPostInputDtoMiddleware} from "../validation/blogPostInputDataMiddleware";
import {sanitizeQueryParams} from "../../core/midleware/validation/sanitize-qery-param";


export const blogRouter = Router({});

blogRouter
    .get('', sanitizeQueryParams, getAllBlogs)
    .post('', authValidationMiddleware, blogInputDtoValidation, handlerValidationErrors, createBlog)
    .get('/:blogId/posts',sanitizeQueryParams, getBlogPostList)
    .post('/:blogId/posts', authValidationMiddleware, BlogPostInputDtoMiddleware, handlerValidationErrors, createPostForBlog)

    .get('/:id',sanitizeQueryParams, findBlogBiId)
    .put('/:id', authValidationMiddleware, idValidation, blogInputDtoValidation, handlerValidationErrors, updateBlog)
    .delete('/:id', authValidationMiddleware, idValidation, deleteBlog)

