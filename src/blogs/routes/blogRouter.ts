import {Router} from "express";
import {getAllBlogs} from "./handlers/getAllBlogsHandler";
import {createBlogHandler} from "./handlers/createBlogHandler";
import {findBlogBiId} from "./handlers/getlBlogHandler";
import {updateBlog} from "./handlers/updateBlogHandler";
import {deleteBlog} from "./handlers/deleteBlogHandler";
import {idValidation} from "../../core/midleware/validationInputIdMiddleware";
import {blogInputDtoValidation} from "../validation/blogInputDateMidlleware";
import {authValidationMiddleware} from "../../core/midleware/authValidationMiddleware";
import {handlerValidationErrors} from "../../core/midleware/handlerValidationErrors";
import {
    paginationAndSortingValidation
} from "../../core/midleware/validation/query-pagination-sorting.validation-middleware";
import {BlogSortField} from "../input/blog-sort-field";
import {getBlogPostList} from "./handlers/get-blog-post-list";
import {PostSortField} from "../../posts/input/post-sort-field";
import {createPostForBlog} from "./handlers/create-post-for-blog";
import {BlogPostInputDtoMiddleware} from "../validation/blogPostInputDataMiddleware";
import {blogIdValidation} from "../../core/midleware/validationInputBlogIdMiddleware";


export const blogRouter = Router({});

blogRouter
    .get('',paginationAndSortingValidation(BlogSortField), getAllBlogs)
    .post('',authValidationMiddleware, blogInputDtoValidation,handlerValidationErrors, createBlogHandler)
    .get('/:id',findBlogBiId)
    .put('/:id',authValidationMiddleware,idValidation,blogInputDtoValidation,handlerValidationErrors, updateBlog)
    .delete('/:id',authValidationMiddleware,idValidation, deleteBlog)
    .get(
        '/:blogId/posts',
        paginationAndSortingValidation(PostSortField),
        getBlogPostList,
    )
    .post('/:blogId/posts',authValidationMiddleware,blogIdValidation,BlogPostInputDtoMiddleware,handlerValidationErrors, createPostForBlog)


