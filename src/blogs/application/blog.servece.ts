import {BlogInputModel} from "../input/blog-input-model";
import {Blog} from "../domain/Blog";
import {blogRepository} from "../repository/blog.repository";
import {WithId} from "mongodb";
import {ResultStatus} from "../../core/result/result-code";
import {Result} from "../../core/result/result-type";

export const blogService = {
    async create(blogDto: BlogInputModel):Promise<Result<string>> {
    const newBlog:Blog = {
        name: blogDto.name,
        description: blogDto.description,
        websiteUrl: blogDto.websiteUrl,
        createdAt: new Date().toISOString(),
        isMembership: false
    }
    const resultCreate = await blogRepository.createBlog(newBlog);
    return {
        status:ResultStatus.Success,
        data: resultCreate,
    }

},




    async updateBlog(id: string, blog: BlogInputModel): Promise<Result<boolean>> {
        const resultUpdate =  await blogRepository.updateBlog(id, blog)
        return{
            status:ResultStatus.Success,
            data: resultUpdate,
        }

    },


    async deleteBlog(id: string): Promise<Result<boolean>> {

      const resultDelete = await  blogRepository.deleteBlog(id)
        return{
          status:ResultStatus.Success,
            data: resultDelete,
        }
    },




}
