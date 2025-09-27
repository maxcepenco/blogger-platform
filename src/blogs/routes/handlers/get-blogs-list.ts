import {Response} from "express";
import {RequestWithQuery} from "../../../core/types/RequestInputType";
import {HttpStatuses} from "../../../core/types/httpSatuses";
import {blogQueryRepository} from "../../repository/blog.query-repository";
import {BlogQueryInput} from "../../input/blog-query.input";
import {sortQueryFieldsUtil} from "../../../core/helpers/sort-query-fields-util";


export const getAllBlogs = async (req: RequestWithQuery<BlogQueryInput>, res: Response) => {
    try {


        const queryInput = sortQueryFieldsUtil(req.query);
        const searchQueryFiled = req.query

        const result = await blogQueryRepository.findMany(queryInput, searchQueryFiled);

        res.status(HttpStatuses.Ok_200).json(result);



    } catch (error) {
        console.error('Error in getAllBlogs:', error);
        res.status(HttpStatuses.InternalServerError_500)
            .json({ error: error instanceof Error ? error.message : 'Internal server error' });
    }
};
