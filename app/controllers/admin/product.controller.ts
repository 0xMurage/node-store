import {sendHTTPJSONResponse} from '../../helpers/utils';
import {
    createProduct,
    deleteProduct,
    fetchAllProducts,
    fetchProduct,
    updateProduct
} from '../../services/admin/products.service';
import {ParamsDictionary, Response, Request} from 'express-serve-static-core';

export class ProductController {

    static index(req: Request<ParamsDictionary, any, any>, res: Response<any>) {
        sendHTTPJSONResponse(res, fetchAllProducts())
    }

    static show(req: Request<ParamsDictionary, any, any>, res: Response<any>) {
        sendHTTPJSONResponse(res, fetchProduct(req))
    }

    static store(req: Request<ParamsDictionary, any, any>, res: Response<any>) {
        sendHTTPJSONResponse(res, createProduct(req))
    }

    static update(req: Request<ParamsDictionary, any, any>, res: Response<any>) {
        sendHTTPJSONResponse(res, updateProduct(req))

    }

    static destroy(req: Request<ParamsDictionary, any, any>, res: Response<any>) {
        sendHTTPJSONResponse(res, deleteProduct(req))
    }
}
