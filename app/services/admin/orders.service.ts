import {OrderModel} from '../../models/OrderModel';
import {responseCodes} from '../../helpers/constants';
import {Request} from 'express-serve-static-core';


export async function fetchAllOrders(req): Promise<Response> {
    const orders = await OrderModel.findAll({
        include: [{
            association: OrderModel.statuses,
        }]
    });

    return {
        code: responseCodes.ok,
        message: '',
        results: orders,
        success: true
    }
}

export async function fetchOrder(req: Request): Promise<Response> {

    if (!req.params.code) {
        return {
            code: responseCodes.invalidData,
            message: 'Order not found. Try again',
            results: [],
            success: false
        }


    }

    const orders = await OrderModel.findOne({
        where: {code: req.params.code},
        include: [{
            association: OrderModel.statuses,
        }]
    });

    if (!orders) {
        return {
            code: responseCodes.notfound,
            message: 'Order not found. Try again',
            results: [],
            success: false
        }
    }

    return {
        code: responseCodes.ok,
        message: '',
        results: orders,
        success: true
    }
}

