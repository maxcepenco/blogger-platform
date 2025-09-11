import {Router} from "express";
import {getPostList} from "./handlers/get-post-list";
import {findPostBiId} from "./handlers/get-post-by-id";
import {updatePost} from "./handlers/update-post";
import {deletePost} from "./handlers/delete-post";
import {idValidation} from "../../core/midleware/validationInputIdMiddleware";
import {postInputDtoMiddleware} from "../validatiion/postInputDateMiddleware";
import {handlerValidationErrors} from "../../core/midleware/handlerValidationErrors";
import {authValidationMiddleware} from "../../core/midleware/authValidationMiddleware";
import {createPost} from "./handlers/create-post";


export const postRouter = Router({});


postRouter
    .get('',getPostList )
    .get('/:id',idValidation,findPostBiId)
    .post('',authValidationMiddleware,postInputDtoMiddleware,handlerValidationErrors, createPost)
    .put('/:id',authValidationMiddleware,idValidation,postInputDtoMiddleware,handlerValidationErrors, updatePost)
    .delete('/:id',authValidationMiddleware,idValidation,deletePost)