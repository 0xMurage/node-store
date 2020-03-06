import {responseCodes} from '../../helpers/constants';
import {encrypt} from '../encryption.service';
import {Request} from 'express-serve-static-core';
import {CustomerModel} from '../../models/CustomerModel';
import {getCurrentUser, resolveSqlError, uuid} from '../../helpers/utils';
import {allocateJWTToken} from '../../middleware/auth-middleware';

import * as IValidator from '@cesium133/forgjs';

const {Validator, Rule} = IValidator;

export async function fetchCustomerAccount(req: Request): Promise<Response> {

    const user = getCurrentUser(req);

    if (!(user.code)) {
        return {
            code: responseCodes.notfound,
            results: null,
            message: 'Account not found. Please check and try again',
            success: false
        }

    }
    const account = await CustomerModel.findOne({where: {code: user.code}});

    return {
        code: responseCodes.ok,
        message: '',
        results: account,
        success: true
    }
}


export async function createCustomerAccount(req): Promise<Response> {

    const basicInfoValidator = new Validator({
        first_name: new Rule({type: 'string'}, 'first name is required'),
        last_name: new Rule({type: 'string'}, 'last name is required'),
        email: new Rule({
            type: 'email',
            // domain: d => ['outlook', 'gmail', 'yahoo'].indexOf(d) !== -1
        }, 'Email is invalid.( should be a valid working email address )'),
    });

    let errors = basicInfoValidator.getErrors(req.body);
    if (errors && errors.length > 0) {

        return {
            code: responseCodes.invalidData,
            message: 'Invalid basic information data provided. Try again',
            results: errors,
            success: false
        }
    }


    const addressValidator = new Validator({
        first_name: new Rule({type: 'string'}, 'first name is required'),
        last_name: new Rule({type: 'string'}, 'last name is required'),
        email: new Rule({
            type: 'email',
            // domain: d => ['outlook', 'gmail', 'yahoo'].indexOf(d) !== -1
        }, 'Email is invalid.( should be a valid working email address)'),
        mobile: new Rule({type: 'string'}, 'Mobile number is required'),
        address: new Rule({type: 'string'}, 'address is required'),
        zip_code: new Rule({type: 'string'}, 'zip code is required'),
        city: new Rule({type: 'string'}, 'city of residence is required'),
        county: new Rule({type: 'string'}, 'county residence is required'),
        country: new Rule({type: 'string'}, 'country of residence is required'),
    });
    errors = addressValidator.getErrors(req.body.address);
    if (errors && errors.length > 0) {

        return {
            code: responseCodes.invalidData,
            message: 'Invalid shipping address data. Try again',
            results: errors,
            success: false
        }

    }

    /*index details is optional to allow for guest checkout*/
    if (req.body.auth_info) {
        const authInfoValidator = new Validator({
            username: new Rule({type: 'string'}, 'username is required'),
            password: new Rule({
                type: 'password',
                minLength: 8,
                uppercase: 1,
                numbers: 1
            }, 'Invalid password (minimum 8 characters with 1 uppercase letter and 1 number)'),
        });

        errors = authInfoValidator.getErrors(req.body.auth_info);
        if (errors && errors.length > 0) {

            return {
                code: responseCodes.invalidData,
                message: 'Invalid index details. Try again',
                results: errors,
                success: false
            }

        }
    }

    // create user account+ shipping address + auth info

    const account = await CustomerModel.create({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        code: uuid(),
        addresses: [{
            first_name: req.body.address.first_name,
            last_name: req.body.address.last_name,
            email: req.body.address.email,
            mobile: req.body.address.mobile,
            post_code: req.body.address.zip_code,
            address: req.body.address.address,
            city: req.body.address.city,
            country: req.body.address.country,
            county: req.body.address.county,
        }],
        auth_info: [{
            username: req.body.auth_info.username,
            password: encrypt(req.body.auth_info.password),
        }]
    }, {include: [CustomerModel.authInfo, CustomerModel.addresses]})
        .catch((error) => {
            return {
                success: false,
                code: responseCodes.processError,
                message: 'Account could not created. We seem to be experiencing an internal error. Try again later',
                results: resolveSqlError(error)
            };
        });

    if (!account || (account.code && account.success === false)) {
        return account;
    }

    const customer: User = {
        id: account.id,
        code: account.code,
        name: `${account.first_name} ${account.last_name}`,
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
        code: responseCodes.created,
        success: true,
        results: {access_token: jwtToken.result},
        message: 'Account created successfully'
    }
}

export async function updateCustomerAccount(req): Promise<Response> {
    const user = getCurrentUser(req);

    if (!(user.code)) {
        return {
            code: responseCodes.notfound,
            results: null,
            message: 'Account not found. Please check and try again',
            success: false
        }
    }


    // validate the user data

    const validator = new Validator({
        first_name: new Rule({type: 'string', optional: true}, 'first name is invalid'),
        last_name: new Rule({type: 'string', optional: true}, 'last name is invalid'),
        email: new Rule({
            type: 'email',
            optional: true,
            // domain: d => ['outlook', 'gmail', 'yahoo'].indexOf(d) !== -1
        }, 'Email is invalid.( should be a valid outlook,GMail, or yahoo email address only)')
    });

    const errors = validator.getErrors(req.body);
    if (errors && errors.length > 0) {

        return {
            code: responseCodes.invalidData,
            message: 'Update information is invalid. Try again',
            results: errors,
            success: false
        }
    }


    const resp = await CustomerModel.update({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
    }, {where: {code: user.code}}).catch((error) => {
        return {
            code: responseCodes.processError,
            message: 'Account could not be updated. Internal system encountered',
            success: false,
            results: error.errors.map((err) => err.message)
        }
    });

    if (resp === 0 || !resp) {
        return {
            code: responseCodes.notfound,
            message: 'Account could not be updated. Try again later',
            success: false,
            results: []
        };
    }

    if (resp.code && resp.results) {
        return resp
    }


    return {
        code: responseCodes.ok,
        success: true,
        results: [],
        message: 'Account updated successfully'
    }
}
