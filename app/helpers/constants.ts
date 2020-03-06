export const responseCodes = {
    ok: 200,
    created: 201,
    processError: 400,
    notfound: 404,
    serverError: 500,
    unauthorized: 401,
    forbidden: 403,
    invalidCRSF: 419,
    invalidData: 422,
    unknownError: 520,
};

export const paymentOptions = {
    LNMO: {name: 'Lipa na M-PESA Online', code: 'LNMO-MPESA'},
    C2B: {name: 'M-PESA Paybill', code: 'C2B-MPESA'},
    PAYPAL: {name: 'Paypal', code: 'PAYPAL'},
};
