interface Response {
    success: boolean,
    message: string,
    results: [object] | object | number | string,
    code: number // HTTP Response code

}

interface PaymentResponse extends Response{
    results:{
        transaction_code:string,
        mobile?:string,
        email?:string,
        amount?:number,
        currency?:string,
        checkout_id?:string,
        merchant_id?:string,
        remarks?:string,
    }
}
