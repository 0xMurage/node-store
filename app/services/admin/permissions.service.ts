import {PermissionModel} from '../../models/PermissionModel';
import {responseCodes} from '../../helpers/constants';
import {isValidNumeric} from '../../helpers/validators';
import {Request} from 'express-serve-static-core';

export async function fetchAllPermissions(): Promise<Response> {
    const permissions = await PermissionModel.findAll();

    return {
        code: responseCodes.ok,
        success: true,
        results: permissions,
        message: 'ok'
    }
}

export async function fetchPermission(req:Request): Promise<Response> {
    if (isValidNumeric(req.params.id)) {

        return {
            code: responseCodes.notfound,
            results: null,
            message: 'Invalid permission identifier',
            success: false
        }
    }

    const permission = await PermissionModel.findByPk(req.params.id);

    if (!permission) {
        return {
            code: responseCodes.notfound,
            success: false,
            results: null,
            message: 'Permission with similar ID not found'
        }
    }
    return {
        code: responseCodes.ok,
        success: true,
        results: permission,
        message: ''
    }
}
