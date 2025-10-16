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
        blogController.getAllBlogs.bind(blogController),
    )

    .post('',
        authValidationMiddleware,
        blogInputDtoValidation,
        handlerValidationErrors,
        blogController.createBlog.bind(blogController),
    )

    .get('/:blogId/posts',
        sanitizeQueryParams,
        validateBlogId,
        blogController.getBlogPostList.bind(blogController)
    )

    .post('/:blogId/posts',
        authValidationMiddleware,
        validateBlogId,
        BlogPostInputDtoMiddleware,
        handlerValidationErrors,
        blogController.createPostForBlog.bind(blogController),
    )

    .get('/:id',
        blogController.findBlogBiId.bind(blogController),
    )

    .put('/:id',
        authValidationMiddleware,
        idValidation,
        blogInputDtoValidation,
        handlerValidationErrors,
        blogController.updateBlog.bind(blogController),
    )

    .delete('/:id',
        authValidationMiddleware,
        idValidation,
        blogController.deleteBlog.bind(blogController),
    )

