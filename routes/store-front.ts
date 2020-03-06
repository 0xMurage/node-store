import {Router} from 'express';
import {apiRouteNotFound} from '../app/controllers/error.controller';
import {SessionController} from '../app/controllers/store-front/session.controller';
import {ProductController} from '../app/controllers/store-front/product.controller';
import {OrderController} from '../app/controllers/store-front/order.controller';
import {OrderPaymentController} from '../app/controllers/store-front/order-payment.controller';
import {CartController} from '../app/controllers/store-front/cart.controller';
import {CustomerController} from '../app/controllers/store-front/customer.controller';
import {ShippingAddressController} from '../app/controllers/store-front/shipping-address.controller';
import {AddressController} from '../app/controllers/store-front/address.controller';
import {OrderStatusController} from '../app/controllers/store-front/order-status.controller';
import {PaymentMethodController} from '../app/controllers/store-front/payment-method.controller';

const router = Router(); // instantiate the router object

router.route('/session/index')
    .post((req, res) => SessionController.index(req, res));

router.route('/products/:code')
    .get((req, res) => ProductController.show(req, res));

router.route('/products')
    .get((req, res) => ProductController.index(req, res));


router.route('/carts/:code')
    .get((req, res) => CartController.show(req, res))
    .patch((req, res) => CartController.update(req, res))
    .delete((req, res) => CartController.destroy(req, res));

router.route('/carts')
    .get((req, res) => CartController.index(req, res))
    .post((req, res) => CartController.store(req, res));


router.route('/customers/me')
    .get((req, res) => CustomerController.show(req, res))
    .patch((req, res) => CustomerController.update(req, res));

router.route('/customers')
    .post((req, res) => CustomerController.store(req, res));

router.route('/addresses/shipping/:id')
    .get((req, res) => ShippingAddressController.show(req, res));

router.route('/addresses/shipping')
    .get((req, res) => ShippingAddressController.index(req, res))
    .post((req, res) => ShippingAddressController.store(req, res));

router.route('/addresses/:id')
    .get((req, res) => AddressController.show(req, res));

router.route('/addresses')
    .get((req, res) => AddressController.index(req, res))
    .post((req, res) => AddressController.store(req, res));

router.route('/orders/:code/payments')
    .get((req, res) => OrderPaymentController.index(req, res))
    .post((req, res) => OrderPaymentController.store(req, res));

router.route('/payments/:code')
    .get((req, res) => OrderPaymentController.show(req, res));

router.route('/payments/methods')
    .get((req, res) => PaymentMethodController.index(req, res));


router.route('/orders/:code/statuses')
    .get((req, res) => OrderStatusController.index(req, res));

router.route('/orders/:code')
    .get((req, res) => OrderController.show(req, res));

router.route('/orders')
    .get((req, res) => OrderController.index(req, res))
    .post((req, res) => OrderController.store(req, res));


// ERROR  routes
router.route('*').all((req, res) => apiRouteNotFound(req, res));


export default router;
