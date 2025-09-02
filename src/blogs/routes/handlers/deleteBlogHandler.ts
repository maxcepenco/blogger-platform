import {RequestWithParams} from "../../../core/types/RequestInputType";
import {UriParamsInputDto} from "../../Dto/InputIUriParamsModel";
import {blogRepository} from "../../repository/blogRepository";
import {HttpStatuses} from "../../../core/types/httpSatuses";
import {Response} from "express";

export const deleteBlog =async (req: RequestWithParams<UriParamsInputDto>, res: Response) => {
    const isDeleted = await blogRepository.deleteBlog(req.params.id)
    if (!isDeleted) {
        res.sendStatus(HttpStatuses.NotFound_404);
    }

    res.sendStatus(HttpStatuses.NoContent_204)

}
