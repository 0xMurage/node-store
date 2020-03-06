import {sendHTTPJSONResponse} from '../../helpers/utils';
import {createRole, deleteRole, fetchAllRoles, fetchRole, updateRole} from '../../services/admin/role.service';
import {ParamsDictionary, Response, Request} from 'express-serve-static-core';

export class RoleController {

    static index(req: Request<ParamsDictionary, any, any>, res: Response<any>) {
        sendHTTPJSONResponse(res, fetchAllRoles())
    }

    static show(req: Request<ParamsDictionary, any, any>, res: Response<any>) {
        sendHTTPJSONResponse(res, fetchRole(req))
    }

    static store(req: Request<ParamsDictionary, any, any>, res: Response<any>) {
        sendHTTPJSONResponse(res, createRole(req))
    }

    static update(req: Request<ParamsDictionary, any, any>, res: Response<any>) {
        sendHTTPJSONResponse(res, updateRole(req))

    }

    static destroy(req: Request<ParamsDictionary, any, any>, res: Response<any>) {
        sendHTTPJSONResponse(res, deleteRole(req))
    }
}
