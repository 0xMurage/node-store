import {Request} from 'express-serve-static-core';
import {getCurrentUser, resolveSqlError, uuid} from '../../helpers/utils';
import {responseCodes} from '../../helpers/constants';
import {CartModel} from '../../models/CartModel';
import {ProductModel} from '../../models/ProductModel';
import {CartProductModel} from '../../models/CartProductModel';
import {ProductPriceModel} from '../../models/ProductPriceModel';

import * as IValidator from '@cesium133/forgjs';

const {Validator, Rule} = IValidator;

export async function fetchAllCarts(req: Request): Promise<Response> {
    const user = getCurrentUser(req);

    const carts: [any] = await CartModel.findAll({
        order: [['createdAt', 'DESC']],
        where: {customer_id: user.id},
        attributes: ['code', 'id', 'createdAt'],
        include: [
            {association: CartModel.productsMap, attributes: []},
            {
                association: CartModel.products,
                attributes: ['id', 'code', 'name'],
                include: [{
                    association: ProductModel.prices,
                    limit: 1,
                    order: [['createdAt', 'DESC']],
                    include: [
                        {association: ProductPriceModel.currency, attributes: ['id', 'code', 'symbol']}
                    ]
                }, {
                    association: ProductModel.images,
                    attributes: ['caption', 'name', 'location'],
                    limit: 1
                }]
            }],
    });

    return {
        success: true,
        results: carts.map((d) => {
            return {
                id: d.id, code: d.code, createdAt: d.createdAt, products: d.products.map((p) => {
                    return {
                        id: p.id,
                        code: p.code,
                        name: p.name,
                        quantity: p.quantity,
                        cost: p.prices[0].amount,
                        currency: p.prices[0].currency,
                        image: p.images[0]
                    }
                })
            }
        }),
        code: responseCodes.ok,
        message: ''
    }
}

export async function fetchCart(req: Request): Promise<Response> {

    if (!req.params.code) {

        return {
            success: false,
            results: [],
            code: responseCodes.notfound,
            message: 'No cart items found with such identifier.x'
        }
    }

    const user = getCurrentUser(req);


    const cart: any = await CartModel.findOne({
        where: {customer_id: user.id, code: req.params.code},
        attributes: ['code', 'id', 'createdAt'],
        include: [
            {association: CartModel.productsMap, attributes: []},
            {
                association: CartModel.products,
                attributes: ['id', 'code', 'name'],
                include: [{
                    association: ProductModel.prices,
                    limit: 1,
                    order: [['createdAt', 'DESC']],
                    include: [
                        {association: ProductPriceModel.currency, attributes: ['id', 'code', 'symbol']}
                    ]
                }, {
                    association: ProductModel.images,
                    attributes: ['caption', 'name', 'location'],
                }]
            }],
    });


    if (!cart) {

        return {
            success: false,
            results: [],
            code: responseCodes.notfound,
            message: 'No cart items found with such identifier'
        }
    }

    return {
        success: true,
        results: {
            id: cart.id,
            code: cart.code,
            createdAt: cart.createdAt,
            products: cart.products.map((p) => {
                return {
                    id: p.id,
                    code: p.code,
                    name: p.name,
                    quantity: p.quantity,
                    cost: p.prices[0].amount,
                    currency: p.prices[0].currency,
                    images: p.images
                }
            })
        },
        code: responseCodes.ok,
        message: ''
    }

}

export async function createCart(req: Request): Promise<Response> {

    // ensure the has no duplicates products. It should increase the quantity not array length
    if (req.body.cart && cartHasDuplicates(req.body.cart)) {
        return {
            code: responseCodes.invalidData,
            message: 'Invalid order details. There are duplicate product items. Kindly try again',
            results: [],
            success: false
        }
    }


    const productIds = (await ProductModel.findAll({attributes: ['id']})).map((d) => d.id);

    // validate the user data
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
    });

    const errors = validator.getErrors(req.body);

    if (errors && errors.length > 0) {
        return {
            code: responseCodes.invalidData,
            message: 'Invalid cart products. Kindly try again',
            results: errors,
            success: false
        }
    }


    const user = getCurrentUser(req);
    // create new cart
    const cart = await CartModel.create({
        code: uuid(),
        customer_id: user.id,
        author_id: user.id,
        modified_by_id: user.id,
        products_map: req.body.cart
    }, {include: [{association: CartModel.productsMap}]})
        .catch((error) => {
            return {
                success: false,
                code: responseCodes.processError,
                message: 'Cart could not created',
                results: resolveSqlError(error)
            }
        });

    if (!cart || (cart.code && cart.results)) {
        return cart;
    }

    delete cart.dataValues.products_map;
    delete cart.dataValues.customer_id;

    return {
        success: true,
        results: cart,
        code: responseCodes.created,
        message: 'Cart created successfully'
    }
}

export async function updateCart(req: Request): Promise<Response> {

    if (!req.params.code) {

        return {
            success: false,
            results: [],
            code: responseCodes.notfound,
            message: 'No cart items found with such identifier.x'
        }
    }

    // ensure the has no duplicates products. It should increase the quantity not array length
    if (req.body.cart && cartHasDuplicates(req.body.cart)) {
        return {
            code: responseCodes.invalidData,
            message: 'Invalid order details. There are duplicate product items. Kindly try again',
            results: [],
            success: false
        }
    }


    const productIds = (await ProductModel.findAll({attributes: ['id']}) as [any]).map((d) => d.id);

    // validate product items exist
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
    });

    const errors = validator.getErrors(req.body);

    if (errors && errors.length > 0) {
        return {
            code: responseCodes.invalidData,
            message: 'Invalid cart products. Kindly try again',
            results: errors,
            success: false
        }
    }

    // clear current products then create
    const cart = await CartModel.findOne({where: {code: req.params.code}});

    if (!cart) {
        return {
            code: responseCodes.notfound,
            message: 'Cart not found. Kindly try again',
            results: errors,
            success: false
        }
    }

    // delete all product items

    const re = await CartProductModel.destroy({where: {cart_id: cart.id}})
        .catch(() => {
            return {
                code: responseCodes.processError,
                message: 'Internal server error encountered. Cart could not be updated',
                success: false,
                results: []
            }
        });


    if (re.code && re.results) {
        return re;
    }


    const resX = await CartProductModel.bulkCreate(req.body.cart.map((d) => {
        return {...d, ...{cart_id: cart.id}} // join the cart data with cart_id
    })).catch((e) => {
        return {
            code: responseCodes.processError,
            message: 'Your cart could not be updated. Fatal internal system error encountered',
            success: false,
            results: resolveSqlError(e)
        }
    });

    if (resX.code && resX.results) {
        return resX;
    }

    return {
        success: true,
        results: [],
        code: responseCodes.ok,
        message: 'Cart updated successfully'
    }
}

export async function deleteCart(req: Request): Promise<Response> {
    if (!req.params.code) {

        return {
            success: false,
            results: [],
            code: responseCodes.notfound,
            message: 'No cart items found with such identifier.x'
        }
    }

    const resp = await CartModel.destroy({where: {code: req.params.code}})
        .catch((e) => {
            return {
                code: responseCodes.processError,
                message: 'Cart could not be deleted. Internal server error encountered',
                success: false,
                results: resolveSqlError(e)
            }
        });

    if (resp === 0) {
        return {
            code: responseCodes.notfound,
            message: 'Cart with similar details not found',
            success: false,
            results: []
        };
    }

    if (resp && !resp.results) {
        return {
            results: [],
            success: true,
            message: 'Cart deleted successfully',
            code: responseCodes.ok
        }
    }

    return {
        success: false,
        results: [],
        code: responseCodes.processError,
        message: 'Unexpected error encountered and your request could not be processed'
    }
}

function cartHasDuplicates(cart: { product_id, quantity }[]): boolean {
    const obj = cart.reduce(((acc, val) => ({...acc, [val.product_id]: (acc[val.product_id] || 0) + 1})), {});
    return (Object.keys(obj).filter((id) => obj[id] > 1)).length > 0;
}
