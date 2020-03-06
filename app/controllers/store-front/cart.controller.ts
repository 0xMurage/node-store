import {sendHTTPJSONResponse} from '../../helpers/utils';
import {ParamsDictionary, Request, Response} from 'express-serve-static-core';
import {
    createCart,
    deleteCart,
    fetchAllCarts,
    fetchCart,
    updateCart
} from '../../services/store-front/cart.service';

export class CartController {

    static index(req: Request<ParamsDictionary, any, any>, res: Response<any>) {
        sendHTTPJSONResponse(res, fetchAllCarts(req))
    }

    static show(req: Request<ParamsDictionary, any, any>, res: Response<any>) {
        sendHTTPJSONResponse(res, fetchCart(req))
    }

    static store(req: Request<ParamsDictionary, any, any>, res: Response<any>) {
        sendHTTPJSONResponse(res, createCart(req))
    }

    static update(req: Request<ParamsDictionary, any, any>, res: Response<any>) {
        sendHTTPJSONResponse(res, updateCart(req))

    }

    static destroy(req: Request<ParamsDictionary, any, any>, res: Response<any>) {
        sendHTTPJSONResponse(res, deleteCart(req))
    }
}
