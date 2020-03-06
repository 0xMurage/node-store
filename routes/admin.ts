import {Router} from 'express';
import {apiRouteNotFound} from '../app/controllers/error.controller';
import {StaffController} from '../app/controllers/admin/staff.controller';
import {SessionController} from '../app/controllers/admin/session.controller';
import {PermissionController} from '../app/controllers/admin/permission.controller';
import {RoleController} from '../app/controllers/admin/role.controller';
import {SeederController} from '../app/controllers/admin/seeder.controller';

const router = Router();

// {SYSTEM USERS MANAGEMENT}

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
