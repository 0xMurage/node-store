import {sendHTTPJSONResponse} from '../../helpers/utils';
import {ParamsDictionary, Response, Request} from 'express-serve-static-core';
import {createAddress, fetchAddress, fetchAllAddresses} from '../../services/store-front/addresses.service';

export class ShippingAddressController {

    static index(req: Request<ParamsDictionary, any, any>, res: Response<any>) {
        sendHTTPJSONResponse(res, fetchAllAddresses(req))
    }

    static show(req: Request<ParamsDictionary, any, any>, res: Response<any>) {
        sendHTTPJSONResponse(res, fetchAddress(req))
    }

    static store(req: Request<ParamsDictionary, any, any>, res: Response<any>) {
        sendHTTPJSONResponse(res, createAddress(req))
    }

}
