import {RequestWithBody, RequestWithParams, RequestWithQuery} from "../../core/types/RequestInputType";
import {UserInputModel} from "../input-model/input-model.user";
import {UserService} from "../domain/user-service";
import {UserQueryRepository} from "../repository/user.query-repository";
import {HttpStatuses} from "../../core/types/httpSatuses";
import {Response} from "express";
import {sortQueryFieldsUtil} from "../../core/helpers/sort-query-fields-util";
import {UserQueryFieldType} from "../input-model/user-query-field.type";
import {idType} from "../../core/types/InputIUriParamsModel";

export class UserController {

    constructor(
        protected userService: UserService,
         protected userQueryRepository: UserQueryRepository,
    ){}

    async createNewUser(req: RequestWithBody<UserInputModel>, res: Response) {

        const createUserId = await this.userService.createUser(req.body)
        const newUser = await this.userQueryRepository.findById(createUserId)
        if (!newUser) {
            return res.status(HttpStatuses.BadRequest_400).json({
                errorsMessages: [{
                    message: "Failed to retrieve created post",
                    field: "server"
                }]
            });
        }

        res.status(HttpStatuses.Created_201).send(newUser)

    }

    async getListUser(req: RequestWithQuery<UserQueryFieldType>, res: Response) {

        const inputQuery = sortQueryFieldsUtil(req.query);
        const searchQueryField = req.query

        const foundListUser = await this.userQueryRepository.findMany(inputQuery, searchQueryField);

        res.status(HttpStatuses.Ok_200).json(foundListUser);
    }

    async deleteUser(req: RequestWithParams<idType>, res: Response) {
        const isDeleted = await this.userService.deleteUser(req.params.id);
        if (!isDeleted) {
            res.sendStatus(HttpStatuses.NotFound_404);
        }
        res.sendStatus(HttpStatuses.NoContent_204)
    }

}
