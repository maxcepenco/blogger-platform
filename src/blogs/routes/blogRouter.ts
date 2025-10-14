import {Router} from "express";
import {idValidation} from "../../core/midleware/validationInputIdMiddleware";
import {blogInputDtoValidation} from "../validation/blogInputDateMidlleware";
import {authValidationMiddleware} from "../../auth/routes/middleware/auth-validation-middleware";
import {handlerValidationErrors} from "../../core/midleware/handlerValidationErrors";
import {BlogPostInputDtoMiddleware} from "../validation/blogPostInputDataMiddleware";
import {sanitizeQueryParams} from "../../core/midleware/validation/sanitize-qery-param";
import {validateBlogId} from "../../core/midleware/validationInputBlogIdMiddleware";
import {blogController} from "./blog-controller";


export const blogRouter = Router({});

blogRouter
    .get('',
        sanitizeQueryParams,
        blogController.getAllBlogs
    )

    .post('',
        authValidationMiddleware,
        blogInputDtoValidation,
        handlerValidationErrors,
        blogController.createBlog
    )

    .get('/:blogId/posts',
        sanitizeQueryParams,
        validateBlogId,
        blogController.getBlogPostList
    )

    .post('/:blogId/posts',
        authValidationMiddleware,
        validateBlogId,
        BlogPostInputDtoMiddleware,
        handlerValidationErrors,
        blogController.createPostForBlog)

    .get('/:id',
        blogController.findBlogBiId
    )

    .put('/:id',
        authValidationMiddleware,
        idValidation,
        blogInputDtoValidation,
        handlerValidationErrors,
        blogController.updateBlog
    )

    .delete('/:id',
        authValidationMiddleware,
        idValidation,
        blogController.deleteBlog)

