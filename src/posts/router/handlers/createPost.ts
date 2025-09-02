import {RequestWithBody} from "../../../core/types/RequestInputType";
import {PostInputModel} from "../../Dto/PostInputModel";
import {Response} from "express";
import {postRepository} from "../../repository/postRepository";
import {HttpStatuses} from "../../../core/types/httpSatuses";
import {Post} from "../../Dto/Post";
import {blogRepository} from "../../../blogs/repository/blogRepository";
import {mapPostToViewModel} from "../mappers/mapPostToViewModel";


export const createPost = async (req:RequestWithBody<PostInputModel>,res:Response) => {
    const blogId = req.body.blogId
    const blog = await blogRepository.findById(blogId)

    const newPost:Post = {
        title:req.body.title,
        shortDescription:req.body.shortDescription,
        content:req.body.content,
        blogId: req.body.blogId,
        blogName: blog!.name,
        createdAt: new Date().toString(),

    }
    const createdPost = await  postRepository.createPost(newPost)
    const postViewModel = mapPostToViewModel(createdPost)

    res.status(HttpStatuses.Created_201).send(postViewModel);

}