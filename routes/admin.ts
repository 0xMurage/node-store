import {Router} from 'express';
import {apiRouteNotFound} from '../app/controllers/error.controller';
import {StaffController} from '../app/controllers/admin/staff.controller';
import {SessionController} from '../app/controllers/admin/session.controller';
import {PermissionController} from '../app/controllers/admin/permission.controller';
import {RoleController} from '../app/controllers/admin/role.controller';
import {SeederController} from '../app/controllers/admin/seeder.controller';
import {CustomerController} from '../app/controllers/admin/customer.controller';
import {ProductController} from '../app/controllers/admin/product.controller';
import {ProductPriceController} from '../app/controllers/admin/product-price.controller';
import {ProductImagesController} from '../app/controllers/admin/product-images.controller';
import {ProductCategoryController} from '../app/controllers/admin/product-category.controller';
import {OrderController} from '../app/controllers/admin/order.controller';
import {OrderStatusController} from '../app/controllers/admin/order-status.controller';


const router = Router();

// {PRODUCTS}

router.route('/products/:code/pricing')
    .get((req, res) => ProductPriceController.index(req, res))
    .post((req, res) => ProductPriceController.store(req, res));


router.route('/products/:code/images/:id')
    .get((req, res) => ProductImagesController.show(req, res))
    .patch((req, res) => ProductImagesController.update(req, res))
    .delete(((req, res) => ProductImagesController.destroy(req, res)));

router.route('/products/:code/images')
    .get((req, res) => ProductImagesController.index(req, res))
    .post((req, res) => ProductImagesController.store(req, res)); //create new images for product

router.route('/products/categories/:id')
    .get((req, res) => ProductCategoryController.show(req, res))
    .patch((req, res) => ProductCategoryController.update(req, res))
    .delete(((req, res) => ProductCategoryController.destroy(req, res)));

router.route('/products/categories')
    .get((req, res) => ProductCategoryController.index(req, res))
    .post((req, res) => ProductCategoryController.store(req, res));

router.route('/products/:code')
    .get((req, res) => ProductController.show(req, res))
    .patch((req, res) => ProductController.update(req, res))
    .delete(((req, res) => ProductController.destroy(req, res)));


router.route('/products')
    .get((req, res) => ProductController.index(req, res))
    .post((req, res) => ProductController.store(req, res));


// {ORDERS + SALES MANAGEMENT}

router.route('/orders/:id/status')
    .get((req, res) => OrderStatusController.index(req, res))
    .post((req, res) => OrderStatusController.store(req, res)); //update order status


router.route('/orders/:id')
    .get((req, res) => OrderController.show(req, res));

router.route('/orders')
    .get((req, res) => OrderController.index(req, res));



// {SYSTEM USERS MANAGEMENT}

router.route('/customers/:id')
    .get((req, res) => CustomerController.show(req, res))
    .patch((req, res) => CustomerController.update(req, res))
    .delete(((req, res) => CustomerController.destroy(req, res)));

router.route('/customers')
    .get((req, res) => CustomerController.index(req, res))
    .post((req, res) => CustomerController.store(req, res));



router.route('/staff/:id')
    .get((req, res) => StaffController.show(req, res))
    .patch((req, res) => StaffController.update(req, res))
    .delete((req, res) => StaffController.destroy(req, res));

router.route('/staff')
    .get((req, res) => StaffController.index(req, res))
    .post((req, res) => StaffController.store(req, res));


// {SYSTEM AUTH & PERMISSIONS}
router.route('/session/index')
    .post((req, res) => SessionController.show(req, res));


router.route('/permissions')
    .get((req, res) => PermissionController.index(req, res));

router.route('/roles/:id')
    .get((req, res) => RoleController.show(req, res))
    .patch((req, res) => RoleController.update(req, res))
    .delete(((req, res) => RoleController.destroy(req, res)));

router.route('/roles')
    .get((req, res) => RoleController.index(req, res))
    .post((req, res) => RoleController.store(req, res));

// {SYSTEM DATABASE INIT}

router.route('/system/init')
    .post((req, res) => SeederController.seed(req, res));


// ERROR  routes
router.route('*').all((req, res) => apiRouteNotFound(req, res));


export default router;
