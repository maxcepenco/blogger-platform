import {Router} from "express";
import {getAllBlogHandler} from "./handlers/getAllBlogsHandler";
import {createBlogHandler} from "./handlers/createBlogHandler";
import {findBlogBiId} from "./handlers/getlBlogHandler";
import {updateBlog} from "./handlers/updateBlogHandler";
import {deleteBlog} from "./handlers/deleteBlogHandler";


export const blogRouter = Router({});

blogRouter
    .get('', getAllBlogHandler)
    .post('', createBlogHandler)
    .get('/:id', findBlogBiId)
    .put('/:id', updateBlog)
    .delete('/:id', deleteBlog);
