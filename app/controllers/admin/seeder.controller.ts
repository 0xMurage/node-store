import {sendHTTPJSONResponse} from '../../helpers/utils';
import {seedDatabase} from '../../services/admin/initial-seeder.service';
import {ParamsDictionary, Request, Response} from 'express-serve-static-core';

export class SeederController {

    static seed(req: Request<ParamsDictionary, any, any>, res: Response<any>){
        sendHTTPJSONResponse(res,seedDatabase())
    }

}
