import {sendHTTPJSONResponse} from '../../helpers/utils';
import {ParamsDictionary, Response, Request} from 'express-serve-static-core';
import {createOrderStatus, fetchOrderStatuses} from '../../services/admin/order-status.service';

export class OrderStatusController {

    static index(req: Request<ParamsDictionary, any, any>, res: Response<any>) {
        sendHTTPJSONResponse(res, fetchOrderStatuses(req))
    }


    static store(req: Request<ParamsDictionary, any, any>, res: Response<any>) {
        sendHTTPJSONResponse(res, createOrderStatus(req))
    }


}
