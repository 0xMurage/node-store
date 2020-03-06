import {StaffModel} from '../../models/StaffModel';
import {responseCodes} from '../../helpers/constants';
import {RoleModel} from '../../models/RoleModel';
import {getCurrentUser, uuid} from '../../helpers/utils';
import {encrypt} from '../encryption.service';
import {StaffAuthModel} from '../../models/StaffAuthModel';

import * as IValidator from '@cesium133/forgjs';
import {Request} from 'express-serve-static-core';
import {isValidNumeric} from '../../helpers/validators';

const {Validator, Rule} = IValidator;

export async function fetchStaffAccount(req: Request): Promise<Response> {
    if (!isValidNumeric(req.params.id)) {
        return {
            code: responseCodes.notfound,
            results: null,
            message: 'Invalid user identifier',
            success: false
        }
    }

    const user = await StaffModel.findByPk(req.params.id);

    if (!user) {
        return {
            code: responseCodes.notfound,
            success: false,
            results: null,
            message: 'User with similar ID not found'
        }
    }
    return {
        code: responseCodes.ok,
        message: '',
        results: user,
        success: true
    }
}

export async function fetchAllStaffAccounts(): Promise<Response> {
    const users = await StaffModel.findAll({
        include: [{
            association: StaffModel.author,
            attributes: ['id', 'first_name', 'last_name']
        }]
    });
    return {
        code: responseCodes.ok,
        message: '',
        results: users,
        success: true
    }
}

export async function createStaffAccount(req): Promise<Response> {
    const roles = (await RoleModel.findAll({attributes: ['id']})).map((obj) => obj.id);

    const validator = new Validator({
        role: new Rule({type: 'int', oneOf: roles}, 'Invalid user role provided'),
        first_name: new Rule({type: 'string'}, 'first name is required'),
        last_name: new Rule({type: 'string'}, 'last name is required'),
        username: new Rule({
            type: 'email',
            domain: d => ['outlook', 'gmail', 'yahoo'].indexOf(d) !== -1
        }, 'Username must be a valid email(outlook,GMail, or yahoo only)'),
        email: new Rule({
            type: 'email',
            domain: d => ['outlook', 'gmail', 'yahoo'].indexOf(d) !== -1
        }, 'Email is invalid.( should be a valid outlook,GMail, or yahoo email address only)'),
        password: new Rule({
            type: 'password',
            minLength: 8,
            uppercase: 1,
            numbers: 1
        }, 'Password does not comply with policy')
    });

    const errors = validator.getErrors(req.body);
    if (errors && errors.length > 0) {

        return {
            code: responseCodes.invalidData,
            message: 'Invalid request data. Try again',
            results: errors,
            success: false
        }
    }

    // create user account + auth info

    const user = await StaffModel.create({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        role_id: req.body.role,
        code: uuid(),
        author_id: getCurrentUser(req).id,
        modified_by_id: getCurrentUser(req).id,
        staff_auth: {
            username: req.body.username,
            password: req.body.password ? encrypt(req.body.password) : encrypt('P@ssword#'),
            author_id: getCurrentUser(req).id,
            modified_by_id: getCurrentUser(req).id
        }
    }, {include: [StaffModel.authInfo]}).catch((error) => {
        return {
            success: false,
            code: responseCodes.processError,
            message: 'User account could not created',
            results: error.errors.map((err) => err.message)
        };
    });

    if (!user || (user.code && user.results)) {
        return user;
    }
    delete user.dataValues.staff_auth;
    return {
        code: responseCodes.created,
        success: true,
        results: user,
        message: 'User account created successfully'
    }
}

export async function updateStaffAccount(req): Promise<Response> {
    if (isNaN(req.params.id)) {
        return {
            code: responseCodes.notfound,
            results: null,
            message: 'Invalid user identifier',
            success: false
        }
    }

    // validate the user data
    const roles = (await RoleModel.findAll({attributes: ['id']})).map((obj) => obj.id);

    const validator = new Validator({
        role: new Rule({type: 'int', optional: true, oneOf: roles}, 'Invalid user role provided'),
        first_name: new Rule({type: 'string', optional: true}, 'first name is required'),
        last_name: new Rule({type: 'string', optional: true}, 'last name is required'),
        email: new Rule({
            type: 'email',
            optional: true,
            domain: d => ['outlook', 'gmail', 'yahoo'].indexOf(d) !== -1
        }, 'Email is invalid.( should be a valid outlook,GMail, or yahoo email address only)')
    });

    const errors = validator.getErrors(req.body);
    if (errors && errors.length > 0) {

        return {
            code: responseCodes.invalidData,
            message: 'Invalid request data. Try again',
            results: errors,
            success: false
        }
    }


    const resp = await StaffModel.update({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        role_id: req.body.role,
        modified_by_id: getCurrentUser(req).id
    }, {where: {id: req.params.id}}).catch((error) => {
        return {
            code: responseCodes.processError,
            message: 'User account could not be updated. Internal system encountered',
            success: false,
            results: error.errors.map((err) => err.message)
        }
    });

    if (resp === 0 || !resp) {
        return {
            code: responseCodes.notfound,
            message: 'User account could not be updated',
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
        message: 'User account updated successfully'
    }
}

export async function deleteStaffAccount(req): Promise<Response> {
    if (isNaN(req.params.id)) {
        return {
            code: responseCodes.notfound,
            results: null,
            message: 'Invalid user identifier',
            success: false
        }
    }

    // we will fill the user account with dummy data
    const email = `${+new Date()}@labskenya.com`;

    const resp = await StaffModel.update({
        first_name: 'Deleted',
        last_name: 'Account',
        email,
        modified_by_id: getCurrentUser(req).id
    }, {where: {id: req.params.id}}).catch(() => {
        return {
            code: responseCodes.processError,
            message: 'User account could be deleted. Internal server error encountered',
            success: false,
            results: []
        }
    });

    if (resp === 0 || !resp) {
        return {
            code: responseCodes.notfound,
            message: 'User account could not be found',
            success: false,
            results: []
        };
    }

    if (resp.code && resp.results) {
        return resp
    }

    await StaffAuthModel.destroy({where: {user_id: req.params.id}});

    return {
        code: responseCodes.ok,
        success: true,
        results: [],
        message: 'User account has been replaced with dummy data. All user identifiable data have been erased'
    }
}
