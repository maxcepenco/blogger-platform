import {RequestWithParams} from "../../../core/types/RequestInputType";
import {UriParamsInputDto} from "../../../core/types/InputIUriParamsModel";
import {blogRepository} from "../../repository/blogRepository";
import {HttpStatuses} from "../../../core/types/httpSatuses";
import {Response} from "express";
import {blogService} from "../../application/blog.servece";

export const deleteBlog =async (req: RequestWithParams<UriParamsInputDto>, res: Response) => {
    const isDeleted = await blogService.deleteBlog(req.params.id)
    if (!isDeleted) {
        res.sendStatus(HttpStatuses.NotFound_404);
    }

    res.sendStatus(HttpStatuses.NoContent_204)

}
