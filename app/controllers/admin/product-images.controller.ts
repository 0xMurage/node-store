import {sendHTTPJSONResponse} from '../../helpers/utils';

import {ParamsDictionary, Response, Request} from 'express-serve-static-core';
import {
    createProductImage, deleteProductImage,
    fetchAllProductImages,
    fetchProductImage, updateProductImage
} from '../../services/admin/product-images.service';

export class ProductImagesController {

    static index(req: Request<ParamsDictionary, any, any>, res: Response<any>) {
        sendHTTPJSONResponse(res, fetchAllProductImages())
    }

    static show(req: Request<ParamsDictionary, any, any>, res: Response<any>) {
        sendHTTPJSONResponse(res, fetchProductImage(req))
    }

    static store(req: Request<ParamsDictionary, any, any>, res: Response<any>) {
        sendHTTPJSONResponse(res, createProductImage(req))
    }

    static update(req: Request<ParamsDictionary, any, any>, res: Response<any>) {
        sendHTTPJSONResponse(res, updateProductImage(req))

    }

    static destroy(req: Request<ParamsDictionary, any, any>, res: Response<any>) {
        sendHTTPJSONResponse(res, deleteProductImage(req))
    }
}
