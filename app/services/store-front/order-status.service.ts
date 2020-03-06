import {getCurrentUser} from '../../helpers/utils';
import {OrderModel} from '../../models/OrderModel';
import {responseCodes} from '../../helpers/constants';
import {Request} from 'express-serve-static-core';

export async function fetchOrderStatuses(req: Request) {

    if (!req.params.code) {
        return {
            code: responseCodes.invalidData,
            message: 'Order not found. Try again',
            results: [],
            success: false
        }

    }

    const user = getCurrentUser(req);

    const orders = await OrderModel.findOne({
        where: {customer_id: user.id, code: req.params.code},
        attributes: [],
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
