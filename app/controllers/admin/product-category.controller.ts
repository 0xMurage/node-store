import {sendHTTPJSONResponse} from '../../helpers/utils';

import {ParamsDictionary, Response, Request} from 'express-serve-static-core';
import {
    createProductCategory,
    deleteProductCategory,
    fetchAllProductCategories,
    fetchProductCategory,
    updateProductCategory
} from '../../services/admin/product-categories';

export class ProductCategoryController {

    static index(req: Request<ParamsDictionary, any, any>, res: Response<any>) {
        sendHTTPJSONResponse(res, fetchAllProductCategories())
    }

    static show(req: Request<ParamsDictionary, any, any>, res: Response<any>) {
        sendHTTPJSONResponse(res, fetchProductCategory(req))
    }

    static store(req: Request<ParamsDictionary, any, any>, res: Response<any>) {
        sendHTTPJSONResponse(res, createProductCategory(req))
    }

    static update(req: Request<ParamsDictionary, any, any>, res: Response<any>) {
        sendHTTPJSONResponse(res, updateProductCategory(req))

    }

    static destroy(req: Request<ParamsDictionary, any, any>, res: Response<any>) {
        sendHTTPJSONResponse(res, deleteProductCategory(req))
    }
}
