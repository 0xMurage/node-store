import {sendHTTPJSONResponse} from '../../helpers/utils';
import {ParamsDictionary, Response, Request} from 'express-serve-static-core';
import {
    createCustomerAccount, deleteCustomerAccount,
    fetchAllCustomerAccounts,
    fetchCustomerAccount, updateCustomerAccount
} from '../../services/admin/customers.service';

export class CustomerController {

    static index(req: Request<ParamsDictionary, any, any>, res: Response<any>) {
        sendHTTPJSONResponse(res, fetchAllCustomerAccounts())
    }

    static show(req: Request<ParamsDictionary, any, any>, res: Response<any>) {
        sendHTTPJSONResponse(res, fetchCustomerAccount(req))
    }

    static store(req: Request<ParamsDictionary, any, any>, res: Response<any>) {
        sendHTTPJSONResponse(res, createCustomerAccount(req))
    }

    static update(req: Request<ParamsDictionary, any, any>, res: Response<any>) {
        sendHTTPJSONResponse(res, updateCustomerAccount(req))
    }

    static destroy(req: Request<ParamsDictionary, any, any>, res: Response<any>) {
        sendHTTPJSONResponse(res, deleteCustomerAccount(req))
    }
}
