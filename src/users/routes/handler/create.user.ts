import {RequestWithBody} from "../../../core/types/RequestInputType";
import {UserInputModel} from "../../input-model/input-model.user";
import {userService} from "../../application/user-service";
import {userQueryRepository} from "../../repository/userQueryRepository";
import {HttpStatuses} from "../../../core/types/httpSatuses";
import {Response} from "express";

export const createNewUser = async (req:RequestWithBody<UserInputModel>, res: Response ) => {

    const newUserId = await userService.createUser(req.body)
    const newUser = await userQueryRepository.findById(newUserId)
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