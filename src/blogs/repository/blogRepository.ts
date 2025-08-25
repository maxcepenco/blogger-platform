import {Blog} from "../Dto/Blog";
import {db} from "../../db/db";
import {BlogInputModel} from "../Dto/BlogInputModel";
import {BlogViewModel} from "../Dto/BlogViweModel";


export const blogRepository = {
    getAllBlog(): Blog[] {
        return db.blogs.map(d => ({...d}))
    },

    createBlog(blog: BlogInputModel): BlogViewModel {
        const newBlog = {
            id: (Date.now()).toString(),
            name: blog.name,
            description: blog.description,
            websiteUri: blog.websiteUri,
        }
        db.blogs.push(newBlog)
        return newBlog;
    },
    getById(id:string ): BlogViewModel | null {
       return  db.blogs.find(b => b.id === id) ?? null
    },

    updateBlog(id: string, blog: BlogInputModel ) {
    const indexBlog = db.blogs.find(b => b.id === id)
        if(indexBlog) {
            indexBlog.name = blog.name
            indexBlog.description = blog.description
            indexBlog.websiteUri = blog.websiteUri
            return true
            }
        return false
    },

    deleteBlog(id: string) {
        for ( let i = 0; i < db.blogs.length; i++ ) {
            if (db.blogs[i].id === id) {
                db.blogs.splice(i, 1);
                return true;
            }
        }
        return false;
    }



}