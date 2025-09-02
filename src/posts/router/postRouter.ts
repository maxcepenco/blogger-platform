import {Router} from "express";
import {getAllPosts} from "./handlers/GetAllPosts";
import {findPostBiId} from "./handlers/getPost";
import {createPost} from "./handlers/createPost";
import {updatePost} from "./handlers/updatePost";
import {deletePost} from "./handlers/deletePost";
import {idValidation} from "../../core/midleware/validationInputIdMiddleware";
import {postInputDtoMiddleware} from "../validatiion/postInputDateMiddleware";
import {handlerValidationErrors} from "../../core/midleware/handlerValidationErrors";
import {authValidationMiddleware} from "../../core/midleware/authValidationMiddleware";


export const postRouter = Router({});


postRouter
    .get('',getAllPosts )
    .get('/:id',idValidation,findPostBiId)
    .post('',authValidationMiddleware,postInputDtoMiddleware,handlerValidationErrors, createPost)
    .put('/:id',authValidationMiddleware,idValidation,postInputDtoMiddleware,handlerValidationErrors, updatePost)
    .delete('/:id',authValidationMiddleware,idValidation,deletePost)