import {Request} from 'express-serve-static-core';
import {getCurrentUser, resolveSqlError} from '../../helpers/utils';
import {paymentOptions, responseCodes} from '../../helpers/constants';
import {OrderModel} from '../../models/OrderModel';
import {OrderProductModel} from '../../models/OrderProductModel';
import {PaymentMethodModel} from '../../models/PaymentMethodModel';
import {PaymentRequestModel} from '../../models/PaymentRequestModel';
import {PaymentTransactionModel} from '../../models/PaymentTransactionModel';
import {isValidMPesaNumber, isValidNumeric} from '../../helpers/validators';


export async function fetchAllPayments(req: Request): Promise<Response> {
    if (!req.params.code) {
        return {
            success: false,
            results: [],
            code: responseCodes.invalidData,
            message: 'Invalid order number. Kindly check and try again'
        }
    }

    const user = getCurrentUser(req);

    const order: any = await OrderModel.findOne({
        where: {customer_id: user.id, code: req.params.code}, // ensure the code belongs to the current customer
        attributes: [],
        include: [{
            association: OrderModel.payments, attributes: [
                'request_id', 'amount', 'code', 'transaction_id', 'first_name',
                'last_name', 'middle_name', 'success', 'createdAt'],
            include: [{association: PaymentTransactionModel.currency, attributes: ['code', 'id', 'symbol']}]
        }]
    });

    if (!order) {
        return {
            success: false,
            results: [],
            code: responseCodes.notfound,
            message: 'Order with similar code not found. Ensure your order code is correct'
        }
    }

    return {
        success: true,
        results: order.payment_transactions,
        code: responseCodes.ok,
        message: ''
    }
}

export async function fetchPayment(req: Request): Promise<Response> {
    if (!req.params.code) {
        return {
            success: false,
            results: [],
            code: responseCodes.invalidData,
            message: 'Invalid payment code. Kindly check and try again'
        }
    }

    const trans = await PaymentTransactionModel.findOne({
        where: {code: req.params.code},
        attributes: [
            'request_id', 'amount', 'code', 'transaction_id', 'first_name',
            'last_name', 'middle_name', 'success', 'createdAt'],
        include: [{association: PaymentTransactionModel.currency, attributes: ['code', 'id', 'symbol']}]
    });

    if (!trans) {
        return {
            success: false,
            results: [],
            code: responseCodes.notfound,
            message: 'Invalid payment code. Kindly check and try again'
        }
    }

    return {
        success: true,
        results: trans,
        code: responseCodes.ok,
        message: ''
    }

}

// ** create a payment request and initiate payment checkout
export async function createPayment(req: Request): Promise<Response> {
    if (!req.params.code) {
        return {
            success: false,
            results: [],
            code: responseCodes.invalidData,
            message: 'Invalid order number. Kindly check and try again'
        }
    }

    if (!isValidNumeric(req.body.payment_method_id)) {
        return {
            success: false,
            results: [],
            code: responseCodes.invalidData,
            message: 'Invalid payment method. Kindly try again'
        }
    }
    if (!req.body.mobile && !req.body.email) {
        return {
            success: false,
            results: [],
            code: responseCodes.invalidData,
            message: 'Your request was denied as no billing detail was received by our systems. Kindly try again'
        }
    }

    const paymentMethod = await PaymentMethodModel.findByPk(req.body.payment_method_id);

    // VALIDATE if either a mobile or email address was provided
      if ( !req.body.mobile && paymentMethod.code.toUpperCase() === paymentOptions.LNMO.code.toUpperCase() ||
          !isValidMPesaNumber(req.body.mobile)) {
          return {
              success: false,
              results: [],
              code: responseCodes.invalidData,
              message: `Your request was rejected. ${paymentOptions.LNMO.name} requires a valid phone number`
          }
      }else if(!req.body.email && paymentMethod.code.toUpperCase() === paymentOptions.PAYPAL.code.toUpperCase()){
          return {
              success: false,
              results: [],
              code: responseCodes.invalidData,
              message: `Your request was rejected. ${paymentOptions.PAYPAL.name} requires a valid email address`
          }
      }

    const user = getCurrentUser(req);

    const order: any = await OrderModel.findOne({
        where: {customer_id: user.id, code: req.params.code}, // ensure the code belongs to the current customer
        attributes: ['id'],
        include: [{
            association: OrderModel.productsMap,
            include: [{association: OrderProductModel.currency, attributes: ['code', 'name', 'id']}]
        }
        ]
    });

    if (!order) {
        return {
            success: false,
            results: [],
            code: responseCodes.notfound,
            message: 'Order with similar code not found. Ensure your order code is correct'
        }
    }

    if (!order.products_map) {
        return {
            success: false,
            results: [],
            code: responseCodes.notfound,
            message: 'Order does not have any items. Ensure your order code is correct'
        }
    }

    // calculate total order cost
    const totalValue = order.products_map.reduce((accum, row) => {
        return accum + (row.amount * row.quantity)
    }, 0);

    const currency = order.products_map[0].currency;

    let paymentRequestResponse;


    // initiate payment the payment request
    if (paymentMethod.code.toUpperCase() === paymentOptions.LNMO.code.toUpperCase()) {
        paymentRequestResponse = await requestMPesaPayment({
            amount: totalValue,
            order: order.code,
            mobile: req.body.mobile
        });
    } else if (paymentMethod.code.toUpperCase() === paymentOptions.PAYPAL.code.toUpperCase()) {
        paymentRequestResponse = await requestPayPalPayment({
            amount: totalValue,
            order: order.code,
            email: req.body.email
        });
    } else {
        return {
            success: false,
            results: [],
            code: responseCodes.invalidData,
            message: 'Invalid payment method. Kindly try again after some time'
        }
    }

    if (!paymentRequestResponse.success) {
        return paymentRequestResponse;
    }

    // save the response into the database

    const res = await PaymentRequestModel.create({
        order_id: order.id,
        payment_method_id: paymentMethod.id,
        amount: paymentRequestResponse.results.amount,
        currency_id: currency.id,
        checkout_id: paymentRequestResponse.results.checkout_id,
        merchant_id: paymentRequestResponse.results.merchant_id,
        mobile: paymentRequestResponse.results.mobile,
        email: paymentRequestResponse.results.email,
        remarks: paymentRequestResponse.results.remarks,
        invoice: paymentRequestResponse.results.invoice,
        author_id: user.id,
        modified_by_id: user.id
    }).catch((error) => {
        return {
            success: false,
            code: responseCodes.processError,
            message: 'Fatal system error. The system could not save your payment request. We have been notified',
            results: resolveSqlError(error)
        }
    });

    if (!res || (res.code && res.results)) {
        // NOTIFY THE SYSTEM ADMIN
        return res;
    }


    return {
        success: true,
        results: res,
        code: responseCodes.created,
        message: 'Payment request accepted successfully'
    }
}

// TODO
export async function requestMPesaPayment(data: {
    amount: number,
    order: string, mobile: string
}): Promise<PaymentResponse> {

    return {
        success: true,
        results: {
            amount: 1,
            mobile: '070293838',
            checkout_id: 'DEMO1828388',
            merchant_id: 'DEMO-MERCHANT',
            currency: 'KSH',
            transaction_code: 'TRANS-DEMO-383838'
        },
        message: '',
        code: responseCodes.ok
    }
}


// TODO
export async function requestPayPalPayment(data: {
    amount: number,
    order: string, email: string
}): Promise<PaymentResponse> {

    return {
        success: true,
        results: {
            amount: 1,
            email: 'james@paylpal.com',
            checkout_id: 'DEMO2183282',
            merchant_id: 'DEMO-PAYPAL-MERCHANT',
            currency: 'KSH',
            transaction_code: 'TRANS-DEMO-92298'
        },
        message: '',
        code: responseCodes.ok
    }
}
