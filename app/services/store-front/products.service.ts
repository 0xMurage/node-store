import {ProductModel} from '../../models/ProductModel';
import {responseCodes} from '../../helpers/constants';
import {ProductPriceModel} from '../../models/ProductPriceModel';
import {Request} from 'express-serve-static-core';

export async function fetchAllProducts(): Promise<Response> {
    const products = await ProductModel.findAll({
        include: [
            {
                association: ProductModel.images,
                attributes: ['id', 'location', 'name', 'caption']
            },
            {
                association: ProductModel.prices,
                attributes: ['id', 'amount', 'currency_id'],
                limit: 2,
                order: [['createdAt', 'DESC']],
                include: [{
                    association: ProductPriceModel.currency,
                    attributes: ['id', 'code', 'symbol']
                }]
            },
            {
                association: ProductModel.categories,
                attributes: ['id', 'name']
            }
        ]
    });
    return {
        code: responseCodes.ok,
        message: '',
        results: products,
        success: true
    }
}

export async function fetchProduct(req: Request): Promise<Response> {
    if (!req.params.code) {
        return {
            code: responseCodes.notfound,
            results: null,
            message: 'Product with similar information not found. Please check and try again',
            success: false
        }
    }

    const product = await ProductModel.findOne({
        where: {code: req.params.code},
        include: [
            {
                association: ProductModel.images,
                attributes: ['id', 'location','name', 'caption']
            },
            {
                association: ProductModel.prices,
                attributes: ['id', 'amount', 'currency_id'],
                limit: 2,
                order: [['createdAt', 'DESC']],
                include: [{
                    association: ProductPriceModel.currency,
                    attributes: ['id', 'code', 'symbol']
                }]
            },
            {
                association: ProductModel.categories,
                attributes: ['id', 'name']
            }
        ]
    });

    if (!product) {
        return {
            code: responseCodes.notfound,
            success: false,
            results: null,
            message: 'No product with similar details found'
        }
    }
    return {
        code: responseCodes.ok,
        message: '',
        results: product,
        success: true
    }
}
