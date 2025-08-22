import {Router} from "express";
import {getAllPosts} from "./handlers/GetAllPosts";
import {findPostBiId} from "./handlers/getPost";
import {createPost} from "./handlers/createPost";


export const postRouter = Router({});


postRouter
    .get('/:id', getAllPosts)
    .get('', findPostBiId)
    .post('', createPost)