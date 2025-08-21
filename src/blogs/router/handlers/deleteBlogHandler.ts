import {RequestWithParams} from "../../../core/RequestInputType";
import {UriParamsInputDto} from "../../Dto/InputIUriParamsModel";
import {blogRepository} from "../../repository/blogRepository";
import {HttpStatuses} from "../../../core/httpSatuses";
import {Response} from "express";

export const deleteBlog = (req: RequestWithParams<UriParamsInputDto>, res: Response) => {
    const index = req.params.id
    const isDeleted = blogRepository.deleteBlog(index)

    if (isDeleted) {
        return res.sendStatus(HttpStatuses.NoContent_204)
    }

    res.sendStatus(HttpStatuses.NotFound_404)
}
