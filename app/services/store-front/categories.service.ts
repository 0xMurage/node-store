import {responseCodes} from '../../helpers/constants';
import {ProductCategoryModel} from '../../models/ProductCategoryModel';


export async function fetchAllCategories(): Promise<Response> {

    const permissions = await ProductCategoryModel.findAll();

    return {
        code: responseCodes.ok,
        success: true,
        results: permissions,
        message: 'ok'
    }
}
