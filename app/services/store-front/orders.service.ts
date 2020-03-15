import {getCurrentUser, resolveSqlError, uuid} from '../../helpers/utils';
import {OrderModel} from '../../models/OrderModel';
import {responseCodes} from '../../helpers/constants';
import {Request} from 'express-serve-static-core';
import {ProductModel} from '../../models/ProductModel';
import {CartModel} from '../../models/CartModel';
import {AddressModel} from '../../models/AddressModel';

import * as IValidator from '@cesium133/forgjs';

const {Validator, Rule} = IValidator;

export async function fetchAllOrders(req) {
    const user = getCurrentUser(req);
    const orders = await OrderModel.findAll({
        where: {customer_id: user.id},
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

export async function fetchOrder(req: Request) {

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


export async function createOrder(req: Request) {

    // ensure shopping cart does not have duplicates
    if(req.body.cart && cartHasDuplicates(req.body.cart)){
        return {
            code: responseCodes.invalidData,
            message: 'Invalid order details. There are duplicate product items. Kindly try again',
            results: [],
            success: false
        }
    }

    const productIds = (await ProductModel.findAll({attributes: ['id']})).map((obj) => obj.id);

    const validator = new Validator({
        cart: new Rule({
            type: 'array',
            notEmpty: true,
            of: new Validator({
                product_id: new Rule({
                    type: 'int',
                    oneOf: productIds
                }, 'selection product does not exist'),
                quantity: new Rule({
                    type: 'int',
                    min: 0,
                    max: 100
                }, 'The quantity must be between 0 and 100')
            })
        }, 'Invalid cart products provided'),
        shipping_address_id: new Rule({type: 'int'}, 'Invalid shipping address'),
        cart_code: new Rule({type: 'string', optional: true}, 'Invalid cart identifier'),
    });

    const errors = validator.getErrors(req.body);

    if (errors && errors.length > 0) {
        return {
            code: responseCodes.invalidData,
            message: 'Invalid order details. Kindly try again',
            results: errors,
            success: false
        }
    }

    // check if shipping address exist?

    const address = await AddressModel.findByPk(req.body.shipping_address_id);
    if (!address) {
        return {
            code: responseCodes.invalidData,
            message: 'Invalid shipping address. Kindly try again',
            results: [],
            success: false
        }
    }

    // get products current price and set as selling price for the order
    const prod: any = await ProductModel.findAll({
        where: {id: [req.body.cart.map(d => d.product_id)]},
        attributes: ['id'],
        include: [{
            association: ProductModel.prices,
            limit: 1,
            order: [['createdAt', 'DESC']],
            attributes: ['currency_id', 'amount']
        }]
    });

    const productsMap = prod.map((p) => {
        return {
            product_id: p.id,
            currency_id: p.prices[0].currency_id,
            amount: p.prices[0].amount,
            quantity: req.body.cart.find((pred) => pred.product_id).quantity
        }
    });

    const user = getCurrentUser(req);

    const order = await OrderModel.create({
        customer_id: user.id,
        code: uuid(),
        shipping_address_id: req.body.shipping_address_id,
        author_id: user.id,
        products_map: productsMap
    }, {include: [{association: OrderModel.productsMap}]}).catch((error) => {
        return {
            success: false,
            code: responseCodes.processError,
            message: 'Order could not be created. Internal server error encountered',
            results: resolveSqlError(error)
        }
    });

    if (!order || (order.code && order.results)) {
        return order;
    }

    // delete the cart if provided
    if (req.body.cart_code) {
        await CartModel.destroy({where: {code: req.body.cart_code}});
    }

    return {
        code: responseCodes.created,
        message: '',
        results: order,
        success: true
    }

}

function cartHasDuplicates(cart: { product_id, quantity }[]):boolean {
    const obj = cart.reduce(((acc, val) => ({...acc, [val.product_id]: (acc[val.product_id] || 0) + 1})), {});
    return (Object.keys(obj).filter((id) => obj[id] > 1)).length > 0;
}
