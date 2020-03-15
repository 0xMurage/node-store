import {sendHTTPJSONResponse} from '../../helpers/utils';
import {ParamsDictionary, Request, Response} from 'express-serve-static-core';
import {fetchAllProductCategories, fetchProductCategory} from '../../services/store-front/categories.service';

export class CategoryController {

    static index(req: Request<ParamsDictionary, any, any>, res: Response<any>) {
        sendHTTPJSONResponse(res, fetchAllProductCategories())
    }

    static show(req: Request<ParamsDictionary, any, any>, res: Response<any>) {
        sendHTTPJSONResponse(res, fetchProductCategory(req))
    }

}
