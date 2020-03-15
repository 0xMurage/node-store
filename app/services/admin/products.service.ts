import {ProductModel} from '../../models/ProductModel';
import {responseCodes} from '../../helpers/constants';
import {ProductPriceModel} from '../../models/ProductPriceModel';
import {Request} from 'express-serve-static-core';

/**
 * includes audit purpose data
 */
export async function fetchAllProducts(): Promise<Response> {
    const users = await ProductModel.findAll({
        include: [
            {
                association: ProductModel.author,
                attributes: ['id', 'first_name', 'last_name']
            },
            {
                association: ProductModel.images,
                attributes: ['id', 'name', 'location', 'caption']
            },
            {
                association: ProductModel.categories,
                attributes: ['id', 'name']
            },
            {
                association: ProductModel.prices,
                attributes: ['id', 'price', 'currency_id'],
                limit: 2,
                order: [['createdAt', 'DESC']],
                include: [{
                    association: ProductPriceModel.currency,
                    attributes: ['id', 'code', 'symbol']
                }]
            }
        ]
    });
    return {
        code: responseCodes.ok,
        message: '',
        results: users,
        success: true
    }
}

export async function fetchProduct(req: Request): Promise<Response> {

    return {
        code: responseCodes.ok,
        message: '',
        results: [],
        success: true
    }

}

export async function createProduct(req: Request): Promise<Response> {


    return {
        code: responseCodes.created,
        message: '',
        results: [],
        success: true
    }
}

export async function updateProduct(req: Request): Promise<Response> {

    return {
        code: responseCodes.ok,
        message: '',
        results: [],
        success: true
    }
}

export async function deleteProduct(req: Request): Promise<Response> {

    return {
        code: responseCodes.ok,
        message: '',
        results: [],
        success: true
    }
}
