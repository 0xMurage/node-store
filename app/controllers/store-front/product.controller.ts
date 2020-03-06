import {sendHTTPJSONResponse} from '../../helpers/utils';
import {
    fetchAllProducts, fetchProduct,
} from '../../services/store-front/products.service';
import {ParamsDictionary, Request, Response} from 'express-serve-static-core';

export class ProductController {

    static index(req: Request<ParamsDictionary, any, any>, res: Response<any>) {
        sendHTTPJSONResponse(res, fetchAllProducts())
    }

    static show(req: Request<ParamsDictionary, any, any>, res: Response<any>) {
        sendHTTPJSONResponse(res, fetchProduct(req))
    }

}
