/**
 * Remove 'R$ ' from string and convert to float
 * @param {*} str 
 * @returns 
 */
function stringToFloat(str) {

    var flt = str.replace("R$ ", "");
    flt = (flt).replace(",", "#");
    flt = (flt).replace(".", "");
    flt = (flt).replace("#", ".");

    return parseFloat(flt);
}

/**
 * Format number like a PHP number_format
 * @param {*} number 
 * @param {*} decimals 
 * @param {*} dec_point 
 * @param {*} thousands_point 
 * @returns 
 */
function number_format(number, decimals, dec_point, thousands_point) {

    if (number == null || !isFinite(number)) {
        throw new TypeError("number is not valid");
    }

    if (!decimals) {
        var len = number.toString().split('.').length;
        decimals = len > 1 ? len : 0;
    }

    if (!dec_point) {
        dec_point = '.';
    }

    if (!thousands_point) {
        thousands_point = ',';
    }

    number = parseFloat(number).toFixed(decimals);

    number = number.replace(".", dec_point);

    var splitNum = number.split(dec_point);
    splitNum[0] = splitNum[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousands_point);
    number = splitNum.join(dec_point);

    return number;
}

module.exports = { stringToFloat, number_format };