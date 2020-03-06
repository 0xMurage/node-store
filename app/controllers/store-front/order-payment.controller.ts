import {sendHTTPJSONResponse} from '../../helpers/utils';

import {ParamsDictionary, Request, Response} from 'express-serve-static-core';
import {createPayment, fetchAllPayments, fetchPayment} from '../../services/store-front/payment.service';

export class OrderPaymentController {

    static index(req: Request<ParamsDictionary, any, any>, res: Response<any>) {
        sendHTTPJSONResponse(res, fetchAllPayments(req))
    }

    static show(req: Request<ParamsDictionary, any, any>, res: Response<any>) {
        sendHTTPJSONResponse(res, fetchPayment(req))
    }

    static store(req: Request<ParamsDictionary, any, any>, res: Response<any>) {
        sendHTTPJSONResponse(res, createPayment(req))
    }
}
