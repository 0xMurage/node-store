import {PermissionModel} from '../../models/PermissionModel';
import {RoleModel} from '../../models/RoleModel';
import {StaffModel} from '../../models/StaffModel';
import {getRandomInt, resolveSqlError, uuid} from '../../helpers/utils';
import {paymentOptions, responseCodes} from '../../helpers/constants';
import {RolePermissionMapModel} from '../../models/RolePermissionMapModel';
import {encrypt} from '../encryption.service';
import {ProductModel} from '../../models/ProductModel';
import {ProductCategoryModel} from '../../models/ProductCategoryModel';
import {CurrencyModel} from '../../models/CurrencyModel';
import {PaymentMethodModel} from '../../models/PaymentMethodModel';


function seedPermissionsTable(): Promise<any> {

    return (PermissionModel.bulkCreate([
        {name: 'view_all_roles', description: 'Can view all user roles'},
        {name: 'create_user_role', description: 'Can create new user role'},
        {name: 'update_user_role', description: 'Can update user role details'},
        {name: 'delete_user_role', description: 'Can delete user role details'},

        {name: 'view_staff_accounts', description: 'Can view all users\' account'},
        {name: 'create_staff_account', description: 'Can create new user account'},
        {name: 'update_staff_account', description: 'Can update user account'},
        {name: 'delete_staff_account', description: 'Can delete user account'},

        {name: 'view_customer_accounts', description: 'Can view all customers\' account'},
        {name: 'create_customer_account', description: 'Can create new customer account'},
        {name: 'update_customer_account', description: 'Can update customer account'},
        {name: 'delete_customer_account', description: 'Can delete customer account'},

        {name: 'view_products', description: 'Can view all products\''},
        {name: 'create_product', description: 'Can create new product '},
        {name: 'update_product', description: 'Can update product details'},
        {name: 'delete_product', description: 'Can delete product details'},

        {name: 'view_product_categories', description: 'Can view all product categories'},
        {name: 'create_product_category', description: 'Can create new product category '},
        {name: 'update_product_category', description: 'Can update product category details'},
        {name: 'delete_product_category', description: 'Can delete product category details'},

        {name: 'view_customer_orders', description: 'Can view all customer orders'},

        {name: 'update_customer_order_status', description: 'Can update oder status '},
        {name: 'delete_customer_order_status', description: 'Can delete order status'},

    ]) as Promise<any>)
}

async function seedRolesTable(): Promise<any> {

    return RoleModel.bulkCreate([
        {
            name: 'admin',
            description: 'the overall admin account',
            author_id: 1,
            modified_by_id: 1,
        }
    ])
}

async function seedRolePermissionsTable() {
    const permissions = await PermissionModel.findAll({attributes: ['id']});
    const roles = await RoleModel.findAll({attributes: ['id', 'name']});
    const users = await StaffModel.findAll({attributes: ['id']});

    let rolePerms;

    roles.forEach((role) => {

        if (role.name === 'admin') {
            rolePerms = permissions.map((perm) => {
                return {role_id: role.id, permission_id: perm.id, author_id: users[getRandomInt(0, users.length)].id}
            })
        } else {
            rolePerms = [{
                role_id: role.id,
                permission_id: permissions[getRandomInt(0, permissions.length)].id,
                author_id: users[getRandomInt(0, users.length)].id
            }]
        }
        RolePermissionMapModel.bulkCreate(rolePerms);
    })
}

async function seedStaffAccountTable(): Promise<any> {
    const roles = await RoleModel.findAll({attributes: ['id']});

    return StaffModel.bulkCreate([
        {
            first_name: 'James',
            last_name: 'Doe',
            role_id: roles[getRandomInt(0, roles.length)].id,
            email: 'jamesdoe@gmail.com',
            author_id: 1,
            modified_by_id: 1,
            staff_auth: {
                username: 'james',
                password: encrypt('password'),
                author_id: 1,
                modified_by_id: 1
            }
        }
    ], {include: [{association: StaffModel.authInfo}]})
}

async function seedPaymentMethodsTable(): Promise<any> {
    const users = await StaffModel.findAll({attributes: ['id']});

    return PaymentMethodModel.bulkCreate([
        {
            code: paymentOptions.LNMO.code,
            name: paymentOptions.LNMO.name,
            description: 'Lipa na M-Pesa Online',
            author_id: users[getRandomInt(0, users.length)].id,
            modified_by_id: users[getRandomInt(0, users.length)].id
        }, {
            code: paymentOptions.C2B.code,
            name: paymentOptions.C2B.name,
            description: 'M-Pesa Paybill',
            author_id: users[getRandomInt(0, users.length)].id,
            modified_by_id: users[getRandomInt(0, users.length)].id
        },
        {
            code: paymentOptions.PAYPAL.code,
            name: paymentOptions.PAYPAL.name,
            description: 'PayPal global payments',
            author_id: users[getRandomInt(0, users.length)].id,
            modified_by_id: users[getRandomInt(0, users.length)].id

        }
    ])
}


async function seedProductCategoriesTable(): Promise<any> {
    const users = await StaffModel.findAll({attributes: ['id']});

    return ProductCategoryModel.bulkCreate([
        {
            name: 'Groceries', description: 'Home Groceries',
            author_id: users[getRandomInt(0, users.length)].id,
            modified_by_id: users[getRandomInt(0, users.length)].id
        }, {
            name: 'Home Furniture & Appliances', description: 'Furniture and appliances for home use',
            author_id: users[getRandomInt(0, users.length)].id,
            modified_by_id: users[getRandomInt(0, users.length)].id
        }, {
            name: 'Electronics & Accessories', description: 'General electronics',
            author_id: users[getRandomInt(0, users.length)].id,
            modified_by_id: users[getRandomInt(0, users.length)].id
        }, {
            name: 'Computers & Accessories', description: 'Computer electronics',
            author_id: users[getRandomInt(0, users.length)].id,
            modified_by_id: users[getRandomInt(0, users.length)].id
        }, {
            name: 'Mobile phones & Tablets', description: 'Hand held devices',
            author_id: users[getRandomInt(0, users.length)].id,
            modified_by_id: users[getRandomInt(0, users.length)].id
        }
    ])
}

async function seedCurrencies(): Promise<any> {
    const users = await StaffModel.findAll({attributes: ['id']});
    return CurrencyModel.bulkCreate([
        {
            code: 'KSH',
            name: 'Kenya Shillings',
            symbol: 'Ksh',
            author_id: users[getRandomInt(0, users.length)].id,
            modified_by_id: users[getRandomInt(0, users.length)].id
        }
    ])
}

async function seedProductsTable(): Promise<any> {
    const users = await StaffModel.findAll({attributes: ['id']});
    const categories = await ProductCategoryModel.findAll({attributes: ['id']});
    const currency = await CurrencyModel.findOne({where: {code: 'KSH'}, attributes: ['id']});

    return ProductModel.bulkCreate([
        {
            code: uuid(),
            name: 'Green grams 1Kg',
            author_id: users[getRandomInt(0, users.length)].id,
            modified_by_id: users[getRandomInt(0, users.length)].id,
            images: [
                {
                    location: 'localhost:3000/images/',
                    name: 'test1.jpg',
                    caption: 'Best product in the market',
                    author_id: users[getRandomInt(0, users.length)].id,
                    modified_by_id: users[getRandomInt(0, users.length)].id,
                }
            ],
            prices: [
                {
                    amount: getRandomInt(200, 500),
                    currency_id: currency.id || 1,
                    author_id: users[getRandomInt(0, users.length)].id,
                    modified_by_id: users[getRandomInt(0, users.length)].id,
                }
            ],
            product_category_map: [
                {
                    category_id: categories[getRandomInt(0, categories.length)].id,
                    author_id: users[getRandomInt(0, users.length)].id,
                    modified_by_id: users[getRandomInt(0, users.length)].id,
                }
            ]
        },
        {
            code: uuid(),
            name: '1Kg Kabanas Sugar',
            author_id: users[getRandomInt(0, users.length)].id,
            modified_by_id: users[getRandomInt(0, users.length)].id,
            images: [
                {
                    location: 'localhost:3000/images/',
                    name: 'sugar273rh3.jpg',
                    caption: 'Kabanas Sugar 1 kg',
                    author_id: users[getRandomInt(0, users.length)].id,
                    modified_by_id: users[getRandomInt(0, users.length)].id,
                }
            ],
            prices: [
                {
                    amount: getRandomInt(100, 300),
                    currency_id: currency.id || 1,
                    author_id: users[getRandomInt(0, users.length)].id,
                    modified_by_id: users[getRandomInt(0, users.length)].id,
                }
            ],
            product_category_map: [
                {
                    category_id: categories[getRandomInt(0, categories.length)].id,
                    author_id: users[getRandomInt(0, users.length)].id,
                    modified_by_id: users[getRandomInt(0, users.length)].id,
                }
            ]
        },
        {
            code: uuid(),
            name: '32 Inch Sony Smart TV',
            author_id: users[getRandomInt(0, users.length)].id,
            modified_by_id: users[getRandomInt(0, users.length)].id,
            images: [
                {
                    location: 'localhost:3000/images/',
                    name: 'smart29348.jpg',
                    caption: 'Sony Smart TV',
                    author_id: users[getRandomInt(0, users.length)].id,
                    modified_by_id: users[getRandomInt(0, users.length)].id
                }
            ],
            prices: [
                {
                    amount: getRandomInt(20000, 60000),
                    currency_id: currency.id || 1,
                    author_id: users[getRandomInt(0, users.length)].id,
                    modified_by_id: users[getRandomInt(0, users.length)].id,
                }
            ],
            product_category_map: [
                {
                    category_id: categories[getRandomInt(0, categories.length)].id,
                    author_id: users[getRandomInt(0, users.length)].id,
                    modified_by_id: users[getRandomInt(0, users.length)].id,
                }
            ]
        },
    ], {
        include: [
            {association: ProductModel.images},
            {association: ProductModel.prices},
            {association: ProductModel.categoryMap}
        ]
    })
}


export async function seedDatabase(): Promise<Response> {
    // Check if database has data
    const permissionsTotal = await PermissionModel.count();
    if (permissionsTotal > 0) {
        return {
            code: responseCodes.forbidden,
            message: 'The system has already been initialized',
            results: [],
            success: false
        };
    }

    try {

        await seedPermissionsTable();
        await seedRolesTable();
        await seedStaffAccountTable();
        await seedPaymentMethodsTable();

        await seedRolePermissionsTable();
        await seedProductCategoriesTable();
        await seedCurrencies();
        await seedProductsTable();

        return {
            code: responseCodes.ok,
            message: 'Initialized successfully',
            results: [],
            success: true
        }
    } catch (e) {
        return {
            code: responseCodes.serverError,
            message: 'Unexpected error encountered. Check the logs for more info',
            results: resolveSqlError(e),
            success: false
        }
    }
}
