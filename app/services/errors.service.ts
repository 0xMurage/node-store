import {responseCodes} from '../helpers/constants';

export async function pathNotFoundError(): Promise<Response> {
    return {
        results: [],
        message: 'Request path not found',
        code: responseCodes.notfound,
        success: false,
    }
}


export async function notAuthorizedError(): Promise<Response> {
    return {
        results: [],
        message: 'Authorization headers not received by server',
        code: responseCodes.unauthorized,
        success: false,
    }
}

export async function notAuthenticatedError(): Promise<Response> {
    return {
        results: [],
        message: 'Authorization rejected.Token invalid',
        code: responseCodes.forbidden,
        success: false,
    }
}

export async function authTokenNotGeneratedError(): Promise<Response> {
    return {
        results: [],
        message: 'Error generating authentication token',
        code: responseCodes.serverError,
        success: false,
    }
}

export async function CSRFTokenNotFoundError(): Promise<Response> {
    return {
        results: [],
        message: 'CSRF token missing.  Kindly reload and try again',
        code: responseCodes.invalidCRSF,
        success: false,
    }
}

export async function CSRFTokenInvalidError(): Promise<Response> {
    return {
        results: [],
        message: 'Invalid CSRF token. Page session expired. Kindly reload and try again',
        code: responseCodes.invalidCRSF,
        success: false,
    }
}

export async function pageNotFound(): Promise<Response> {
    return {
        results: [],
        message: 'Request page not found. Replace this with 404 page',
        code: responseCodes.notfound,
        success: false,
    }
}

