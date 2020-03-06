import {Request} from 'express-serve-static-core';
import {getCurrentUser} from '../../helpers/utils';
import {responseCodes} from '../../helpers/constants';
import {AddressModel} from '../../models/AddressModel';
import {isValidNumeric} from '../../helpers/validators';

import * as IValidator from '@cesium133/forgjs';

const {Validator, Rule} = IValidator;

export async function fetchAllAddresses(req: Request): Promise<Response> {
    const user = getCurrentUser(req);
    const addresses = await AddressModel.findAll({where: {customer_id: user.id}, order: [['createdAt', 'DESC']]});

    return {
        success: true,
        results: addresses,
        code: responseCodes.ok,
        message: ''
    }
}

export async function fetchAddress(req: Request): Promise<Response> {
    if (!isValidNumeric(req.params.id)) {
        return {
            code: responseCodes.notfound,
            results: null,
            message: 'Invalid request for address. Kindly check your request and try again',
            success: false
        }
    }

    const user = getCurrentUser(req);

    const address = await AddressModel.findOne({where: {id: req.params.id, customer_id: user.id}});
    if (!address) {
        return {
            code: responseCodes.notfound,
            success: false,
            results: null,
            message: 'Address with similar identifiable information does not exist'
        }
    }


    return {
        success: true,
        results: address,
        code: responseCodes.ok,
        message: ''
    }

}

// ** create a payment request and initiate payment checkout
export async function createAddress(req: Request): Promise<Response> {

    const validator = new Validator({
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

    const errors = validator.getErrors(req.body);
    if (errors && errors.length > 0) {
        return {
            code: responseCodes.invalidData,
            message: 'Invalid shipping address data. Try again',
            results: errors,
            success: false
        }

    }

    const res = await AddressModel.create({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        mobile: req.body.mobile,
        post_code: req.body.zip_code,
        address: req.body.address,
        city: req.body.city,
        county: req.body.county,
        country: req.body.country,
        customer_id: getCurrentUser(req).id
    }).catch((error) => {
        return {
            success: false,
            code: responseCodes.processError,
            message: 'Address could not be created. We seem to be experiencing an internal error. Try again later',
            results: error.errors.map((err) => err.message)
        };
    });


    if (!res || (res.code && res.results)) {
        return res;
    }

    return {
        success: true,
        results: res,
        code: responseCodes.created,
        message: ''
    }
}
