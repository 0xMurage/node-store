import {Request} from 'express-serve-static-core';
import {responseCodes} from '../../helpers/constants';
import {verifyPassword} from '../encryption.service';
import {allocateJWTToken} from '../../middleware/auth-middleware';
import {CustomerAuthModel} from '../../models/CustomerAuthModel';

import * as IValidator from '@cesium133/forgjs';

const {Validator, Rule} = IValidator;

export async function authenticate(req: Request): Promise<Response> {
    // validate user data first
    const validator = new Validator({
        username: new Rule({type: 'string'}, 'Username is required'),
        password: new Rule({type: 'string'}, 'Password is required'),
    });

    const errors = validator.getErrors(req.body);

    if (errors && errors.length > 0) {
        return {
            code: responseCodes.invalidData,
            message: 'Invalid username/password. Kindly try again',
            results: errors,
            success: false
        }
    }

    const res: any = await CustomerAuthModel.findOne({
        where: {username: req.body.username},
        include: [{
            association: CustomerAuthModel.customer,
            attributes: ['id', 'first_name', 'last_name', 'code']
        }]
    });

    // if no account was found
    if (!res) {
        return {
            code: responseCodes.ok,
            message: 'Invalid username/password. Kindly try again',
            success: false,
            results: []
        }
    }


    if (verifyPassword(req.body.password, res.password)) {

        const customer: User = {
            id: res.customer.id,
            code: res.customer.code,
            name: `${res.customer.first_name} ${res.customer.last_name}`,
            role: {id: 0, name: 'customer'},
            permissions: [{name: 'customer', id: 0}]
        };

        // check if password match, send response with token
        const jwtToken = await allocateJWTToken({user: customer});

        if (!jwtToken || !jwtToken.success) {
            return {
                code: responseCodes.serverError,
                message: 'System encountered an error',
                success: false,
                results: jwtToken.result
            }
        }
        return {
            code: responseCodes.ok,
            message: 'Authenticated successfully',
            success: true,
            results: {access_token: jwtToken.result}
        }
    }

    return {
        code: responseCodes.ok,
        message: 'Invalid username/password. Kindly try again',
        success: false,
        results: []
    }
}

