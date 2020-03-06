import {responseCodes} from '../../helpers/constants';
import {PaymentMethodModel} from '../../models/PaymentMethodModel';
import {isValidNumeric} from '../../helpers/validators';

export async function fetchAllPaymentMethods(): Promise<Response> {

    const methods = await PaymentMethodModel.findAll();
    return {
        success: true,
        results: methods,
        code: responseCodes.ok,
        message: ''
    }
}


export async function fetchPaymentMethod(req): Promise<Response> {
    if (!isValidNumeric(req.params.id)) {
        return {
            success: false,
            results: [],
            code: responseCodes.invalidData,
            message: 'Invalid identifier. Check the payment method ID and try again'
        }
    }

    const res = await PaymentMethodModel.findByPk(req.params.id);
    return {
        success: true,
        results: res,
        code: responseCodes.ok,
        message: ''
    }
}

