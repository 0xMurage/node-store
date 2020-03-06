import {sendHTTPJSONResponse} from '../../helpers/utils';
import {ParamsDictionary, Response, Request} from 'express-serve-static-core';
import {
    createCustomerAccount,
    fetchCustomerAccount, updateCustomerAccount

} from '../../services/store-front/customer.service';

export class CustomerController {

    static show(req: Request<ParamsDictionary, any, any>, res: Response<any>) {
        sendHTTPJSONResponse(res, fetchCustomerAccount(req))
    }

    static store(req: Request<ParamsDictionary, any, any>, res: Response<any>) {
        sendHTTPJSONResponse(res, createCustomerAccount(req))
    }

    static update(req: Request<ParamsDictionary, any, any>, res: Response<any>) {
        sendHTTPJSONResponse(res, updateCustomerAccount(req))
    }

}
