import {RequestWithBody} from "../../../core/types/RequestInputType";
import {UserInputModel} from "../../input-model/input-model.user";
import {userService} from "../../domain/user-service";
import {userQueryRepository} from "../../repository/user.query-repository";
import {HttpStatuses} from "../../../core/types/httpSatuses";
import {Response} from "express";

export const createNewUser = async (req:RequestWithBody<UserInputModel>, res: Response ) => {

    const UserId = await userService.createUser(req.body)
    const newUser = await userQueryRepository.findById(UserId)
    if(!newUser) {
        return res.status(HttpStatuses.BadRequest_400).json({
            errorsMessages: [{
                message: "Failed to retrieve created post",
                field: "server"
            }]
        });
    }

    res.status(HttpStatuses.Created_201).send(newUser)

}