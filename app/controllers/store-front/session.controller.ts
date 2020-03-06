import {sendHTTPJSONResponse} from '../../helpers/utils';
import {authenticate} from '../../services/store-front/auth.service';
import {ParamsDictionary, Request, Response} from 'express-serve-static-core';

export class SessionController {

    static index(req: Request<ParamsDictionary, any, any>, res: Response<any>){
        sendHTTPJSONResponse(res,authenticate(req))
    }

}
