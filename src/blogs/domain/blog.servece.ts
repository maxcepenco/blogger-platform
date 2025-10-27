import {BlogInputModel} from "../types/input/blog-input-model";
import {ResultStatus} from "../../core/result/result-code";
import {Result} from "../../core/result/result-type";
import {BlogRepository} from "../repository/blog.repository";
import {inject, injectable} from "inversify";
import {BlogModel} from "../repository/blog.model";


@injectable()
export class BlogService {

    constructor(@inject(BlogRepository) protected blogRepository: BlogRepository) {
    }

    async create(blogDto: BlogInputModel): Promise<Result<string>> {


        const createdBlog = new BlogModel(blogDto)

        createdBlog.name = blogDto.name
        createdBlog.description = blogDto.description
        createdBlog.websiteUrl = blogDto.websiteUrl
        createdBlog.createdAt = new Date();
        createdBlog.isMembership = false

        const resultCreate = await this.blogRepository.saveCreatedBlog(createdBlog)

        return {
            status: ResultStatus.Success,
            data: resultCreate,
        }

    }


    async updateBlog(id: string, blogDto: BlogInputModel): Promise<Result<boolean>> {

        const blog = await this.blogRepository.findById(id)

        if(!blog)
            return {
            status: ResultStatus.NotFound,
                data: false,
                errorMessage:"Not Found"
            }

        blog.name = blogDto.name
        blog.description = blogDto.description
        blog.websiteUrl = blogDto.websiteUrl

        const resultUpdate = await this.blogRepository.saveUpdatedBlog(blog)

        return {
            status: ResultStatus.Success,
            data: resultUpdate,
        }

    }


    async deleteBlog(id: string): Promise<Result<boolean>> {

        const blogInstance = await this.blogRepository.findById(id);

        if (!blogInstance) return {
            status: ResultStatus.NotFound,
            data: false,
            errorMessage:"Not Found"
        }

        const res = await blogInstance.deleteOne();

        return {
            status: ResultStatus.Success,
            data: true
        }
    }


}

