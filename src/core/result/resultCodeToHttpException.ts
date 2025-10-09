import {ResultStatus} from "./result-code";
import {HttpStatuses} from "../types/httpSatuses";


export const resultCodeToHttpException = (resultCode: ResultStatus): number => {
    switch(resultCode) {
        case ResultStatus.BadRequest:
            return HttpStatuses.BadRequest_400;
        case ResultStatus.NotFound:
            return HttpStatuses.NotFound_404;
        case ResultStatus.Forbidden:
            return HttpStatuses.Forbidden_403;
        case ResultStatus.Unauthorized:
            return HttpStatuses.Unauthorized_401;
        default:
            return HttpStatuses.BadRequest_400;
    }
}