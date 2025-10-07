import {RequestWithUserId} from "../../core/types/RequestInputType";
import {IdType} from "../../core/types/id-type.user";
import {HttpStatuses} from "../../core/types/httpSatuses";
import {userQueryRepository} from "../../users/repository/user.query-repository";
import {Response} from "express";


export const authMeHandler = async (req:RequestWithUserId<IdType>, res: Response) =>{
    const userId = req.user?.id as string;
    if(!userId) return res.sendStatus(HttpStatuses.Unauthorized_401)
    const me = await userQueryRepository.findByIdForMe(userId);
    console.log(`AuthMeViewModel: ${me}`);
    return res.status(HttpStatuses.Ok_200).send(me)
}