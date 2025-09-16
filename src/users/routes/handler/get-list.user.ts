import {RequestWithQuery} from "../../../core/types/RequestInputType";
import {UserQueryFieldType} from "../../input-model/user-query-field.type";
import {sortQueryFieldsUtil} from "../../../core/helpers/sort-query-fields-util";
import {userQueryRepository} from "../../repository/user.query-repository";
import { Response} from "express";
import {HttpStatuses} from "../../../core/types/httpSatuses";


export const getListUser = async (req: RequestWithQuery<UserQueryFieldType>, res: Response) => {

    const inputQuery = sortQueryFieldsUtil(req.query);
    const searchQueryField = req.query

    const foundListUser = await userQueryRepository.findMany(inputQuery, searchQueryField);

    res.status(HttpStatuses.Ok_200).json(foundListUser);
}