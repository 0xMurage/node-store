export function isValidNumeric(data, options = {min: 0, allowInfinity: false}): boolean {

    return !(
        !data || isNaN(data) || (options.min > data) ||
        (!options.allowInfinity && (data === Infinity || data === -Infinity))
    );

}

/**
 * Validates if a number for M-Pesa payment request
 * A number should start with country code (254) and max length of 11 xters
 * @param mobile
 */
export function isValidMPesaNumber(mobile): boolean {
    if (!mobile || isNaN(mobile || mobile.length!==11)) {
        return false
    }

}
