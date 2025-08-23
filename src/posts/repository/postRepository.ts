import {Post} from "../Dto/Post";
import {db} from "../../db/db";
import {PostViewModel} from "../Dto/PostViewModel";
import {PostInputModel} from "../Dto/PostInputModel";


export const postRepository = {
    findAllPosts(): Post[] {
        return db.posts.map(p =>({...p}))
    },
    findPostById(id: string):PostViewModel | null{
        return  db.posts.find(c => c.id === id) || null
    },
    createPost(post: PostInputModel): PostViewModel {

        const blog = db.blogs.find(b => b.id === post.blogId)!


        const newPost = {
            id: Date.now().toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName:blog.name
        }
        db.posts.push(newPost)
        return newPost;
    },

    updatePost( post: PostInputModel,id: string ) {
        const indexPost = db.posts.find(p => p.id === id)
        if(indexPost) {
            indexPost.title = post.title;
            indexPost.shortDescription = post.shortDescription
            indexPost.content = post.content
            indexPost.blogId = post.blogId
            return true
        }
        return false
    },

    deletePost( id: string ) {
        const indexPost = db.posts.findIndex(p => p.id === id)
        if(indexPost === -1) {
            return false
        }
        db.posts.splice(indexPost, 1)
    }
}