import {sendHTTPJSONResponse} from '../../helpers/utils';
import {ParamsDictionary, Response, Request} from 'express-serve-static-core';
import {
    createOrder,
    fetchAllOrders,
    fetchOrder,
} from '../../services/store-front/orders.service';


export class OrderController {

    static index(req: Request<ParamsDictionary, any, any>, res: Response<any>) {
        sendHTTPJSONResponse(res, fetchAllOrders(req))
    }

    static show(req: Request<ParamsDictionary, any, any>, res: Response<any>) {
        sendHTTPJSONResponse(res, fetchOrder(req))
    }

    static store(req: Request<ParamsDictionary, any, any>, res: Response<any>) {
        sendHTTPJSONResponse(res, createOrder(req))
    }

}
