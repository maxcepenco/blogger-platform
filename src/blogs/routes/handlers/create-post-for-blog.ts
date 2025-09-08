import {RequestWithParamsAndBody} from "../../../core/types/RequestInputType";
import {blogPostInput} from "../../input/blog-post-input-model";
import {postService} from "../../../posts/application/post.service";
import {mapPostToViewModel} from "../../../posts/router/mappers/mapPostToViewModel";
import {HttpStatuses} from "../../../core/types/httpSatuses";
import {Response} from "express";
import {blogRepository} from "../../repository/blogRepository";


export const createPostForBlog = async (req:RequestWithParamsAndBody<{ blogId:string }, blogPostInput>,res:Response) => {
    try{  const   blogId = req.params.blogId;
        const     postData = req.body;

        const blogExists = await blogRepository.findByIdForGet(blogId);
        if(!blogExists){
            res.sendStatus(HttpStatuses.NotFound_404);
        }

        const newPostId =  await postService.createPostForBlog(blogId, postData);

        const foundCreatedPost = await postService.findById(newPostId)
        const postOutput = mapPostToViewModel(foundCreatedPost)
        res.status(HttpStatuses.Created_201).send(postOutput)
    }catch (error) {
        return res.status(500).json({
            errorsMessages: [{ field: "server", message: "Internal server error" }]
        });    }
}