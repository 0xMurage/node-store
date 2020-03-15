import {responseCodes} from '../../helpers/constants';
import {ProductCategoryModel} from '../../models/ProductCategoryModel';
import {Request} from 'express-serve-static-core';
import {isValidNumeric} from '../../helpers/validators';


export async function fetchAllProductCategories(): Promise<Response> {

    const categories = await ProductCategoryModel.findAll({attributes: ['id', 'name', 'description']});
    return {
        code: responseCodes.ok,
        success: true,
        results: categories,
        message: 'ok'
    }

}

export async function fetchProductCategory(req: Request): Promise<Response> {
    if (!isValidNumeric(req.params.id)) {
        return {
            code: responseCodes.invalidData,
            message: 'Invalid category. Check the category information and try again.',
            success: false,
            results: []
        }
    }
    const category = await ProductCategoryModel.findByPk(req.params.id, {attributes: ['id', 'name', 'description']});

    if (!category) {
        return {
            code: responseCodes.notfound,
            message: 'Invalid category. Check the category information and try again.',
            success: false,
            results: []
        }
    }

    return {
        code: responseCodes.ok,
        success: true,
        results: category,
        message: 'ok'
    }
}
