import {responseCodes} from '../../helpers/constants';
import {Request} from 'express-serve-static-core';

export async function fetchOrderStatuses(req: Request): Promise<Response> {

    if (!req.params.code) {
        return {
            code: responseCodes.invalidData,
            message: 'Order not found. Try again',
            results: [],
            success: false
        }

    }

    return {
        code: responseCodes.ok,
        message: '',
        results: [],
        success: true
    }
}

export async function fetchOrderStatus(req: Request): Promise<Response> {
}

export async function createOrderStatus(req: Request): Promise<Response> {

}
