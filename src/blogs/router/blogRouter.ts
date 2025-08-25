import {Router} from "express";
import { getAllBlogs} from "./handlers/getAllBlogsHandler";
import {createBlogHandler} from "./handlers/createBlogHandler";
import {findBlogBiId} from "./handlers/getlBlogHandler";
import {updateBlog} from "./handlers/updateBlogHandler";
import {deleteBlog} from "./handlers/deleteBlogHandler";
import {idValidation} from "../../midleware/validationInputIdMiddleware";
import {blogInputDtoValidation} from "../../midleware/blogInputDateMidlleware";
import {authValidationMiddleware} from "../../midleware/authValidationMiddleware";
import {handlerValidationErrors} from "../../midleware/handlerValidationErrors";


export const blogRouter = Router({});

blogRouter
    .get('', getAllBlogs)
    .get('/:id',idValidation ,findBlogBiId)
    .post('',authValidationMiddleware, blogInputDtoValidation,handlerValidationErrors, createBlogHandler)
    .put('/:id',authValidationMiddleware,idValidation,blogInputDtoValidation,handlerValidationErrors, updateBlog)
    .delete('/:id',authValidationMiddleware,idValidation, deleteBlog);
