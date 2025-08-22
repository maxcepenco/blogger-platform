import {RequestWithBody} from "../../../core/RequestInputType";
import {PostInputModel} from "../../Dto/PostInputModel";
import {Response} from "express";
import {postRepository} from "../../repository/postRepository";
import {HttpStatuses} from "../../../core/httpSatuses";


export const createPost = (req:RequestWithBody<PostInputModel>,res:Response) => {

    const newPost = postRepository.createPost(req.body);

    res.status(HttpStatuses.Created_201).send(newPost);

}