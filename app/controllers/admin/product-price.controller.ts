import {sendHTTPJSONResponse} from '../../helpers/utils';

import {ParamsDictionary, Response, Request} from 'express-serve-static-core';
import {createProductPrice, fetchProductPrice} from '../../services/admin/product-pricing.service';

export class ProductPriceController {

    static index(req: Request<ParamsDictionary, any, any>, res: Response<any>) {
        sendHTTPJSONResponse(res, fetchProductPrice(req))
    }

    static store(req: Request<ParamsDictionary, any, any>, res: Response<any>) {
        sendHTTPJSONResponse(res, createProductPrice(req))
    }


}
