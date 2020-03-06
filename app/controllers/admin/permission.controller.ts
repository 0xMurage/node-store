import {sendHTTPJSONResponse} from '../../helpers/utils';
import {fetchAllPermissions, fetchPermission} from '../../services/admin/permissions.service';
import {ParamsDictionary, Response, Request} from 'express-serve-static-core';

export class PermissionController {

    static index(req: Request<ParamsDictionary, any, any>, res: Response<any>) {
        sendHTTPJSONResponse(res, fetchAllPermissions())
    }

    static show(req: Request<ParamsDictionary, any, any>, res: Response<any>) {
        sendHTTPJSONResponse(res, fetchPermission(req))

    }
}
