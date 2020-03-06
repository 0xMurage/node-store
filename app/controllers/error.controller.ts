import {sendHTTPJSONResponse} from '../helpers/utils';
import {
    authTokenNotGeneratedError, CSRFTokenInvalidError, CSRFTokenNotFoundError,
    notAuthenticatedError,
    notAuthorizedError, pageNotFound,
    pathNotFoundError
} from '../services/errors.service';

export function apiRouteNotFound(req, resp) {
    sendHTTPJSONResponse(resp, pathNotFoundError());
}

export function authorizationHeaderNotReceived(req, resp) {
    sendHTTPJSONResponse(resp, notAuthorizedError());
}

export function notAuthenticated(req, resp) {
    sendHTTPJSONResponse(resp, notAuthenticatedError());
}

export function authTokenGeneration(req, resp) {
    sendHTTPJSONResponse(resp, authTokenNotGeneratedError());
}

export function CSRFTokenNotFound(req, resp) {
    sendHTTPJSONResponse(resp, CSRFTokenNotFoundError());
}

export function invalidCSRFToken(req, resp) {
    sendHTTPJSONResponse(resp, CSRFTokenInvalidError());
}

export function webRouteNotFound(req, resp) {
    sendHTTPJSONResponse(resp, pageNotFound());
}
