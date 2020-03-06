import {sendHTTPJSONResponse} from '../../helpers/utils';
import {ParamsDictionary, Response, Request} from 'express-serve-static-core';
import {fetchAllPaymentMethods, fetchPaymentMethod} from '../../services/store-front/payment-methods.service';

export class PaymentMethodController {

    static index(req: Request<ParamsDictionary, any, any>, res: Response<any>) {
        sendHTTPJSONResponse(res, fetchAllPaymentMethods())
    }

    static show(req: Request<ParamsDictionary, any, any>, res: Response<any>) {
        sendHTTPJSONResponse(res, fetchPaymentMethod(req))
    }


}
