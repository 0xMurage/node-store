import {seqConnection} from '../../bootstrap/boot-sequelize'
import {DataTypes, Model, BelongsTo, HasMany, BelongsToMany} from 'sequelize';


export class OrderModel extends Model {
    public id: number;
    public customer_id: number;
    public code: string;
    public shipping_address_id: number;
    public author_id: number;
    static customer: BelongsTo<OrderModel, CustomerModel>;
    static statuses: HasMany<OrderModel, OrderStatusModel>;
    static payments: HasMany<OrderModel, PaymentTransactionModel>;
    static paymentRequests: HasMany<OrderModel, PaymentRequestModel>;
    static shippingAddress: BelongsTo<OrderModel, AddressModel>;
    static products: BelongsToMany<OrderModel, ProductModel>;
    static modifiedBy: BelongsTo<OrderModel, StaffModel>;
    static author: BelongsTo<OrderModel, CustomerModel>;
    static productsMap: HasMany<OrderModel, OrderProductModel>;
}

OrderModel.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    code: {
        type: DataTypes.STRING,
        unique: true
    },
    customer_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    shipping_address_id: {
        type: DataTypes.INTEGER.UNSIGNED
    },
    author_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    modified_by_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
    }
}, {
    sequelize: seqConnection,
    modelName: 'order',
    tableName: 'orders',
    underscored: true

});

import {StaffModel} from './StaffModel';

OrderModel.modifiedBy = OrderModel.belongsTo(StaffModel, {
    as: 'modified_by',
    foreignKey: 'modified_by_id',
    targetKey: 'id'
});

import {CustomerModel} from './CustomerModel';

OrderModel.customer = OrderModel.belongsTo(CustomerModel, {
    foreignKey: 'customer_id',
    targetKey: 'id',
});

import {PaymentTransactionModel} from './PaymentTransactionModel';

OrderModel.payments = OrderModel.hasMany(PaymentTransactionModel, {
    foreignKey: 'order_id',
    sourceKey: 'id',
});

import {PaymentRequestModel} from './PaymentRequestModel';

OrderModel.paymentRequests = OrderModel.hasMany(PaymentRequestModel, {
    foreignKey: 'order_id',
    sourceKey: 'id',
});

OrderModel.author = OrderModel.belongsTo(CustomerModel, {
    foreignKey: 'author_id',
    targetKey: 'id',
    as: 'author'
});

import {OrderStatusModel} from './OrderStatusModel';

OrderModel.statuses = OrderModel.hasMany(OrderStatusModel, {
    sourceKey: 'id',
    foreignKey: 'order_id',
});


import {AddressModel} from './AddressModel';

OrderModel.shippingAddress = OrderModel.belongsTo(AddressModel, {
    foreignKey: 'shipping_address_id',
    targetKey: 'id',
    as: 'shipping_address'
});

import {ProductModel} from './ProductModel';
import {OrderProductModel} from './OrderProductModel';

OrderModel.products = OrderModel.belongsToMany(ProductModel, {
    through: OrderProductModel,
    foreignKey: 'order_id',
    targetKey: 'id'
});

OrderModel.productsMap = OrderModel.hasMany(OrderProductModel, {
    foreignKey: 'order_id',
    sourceKey: 'id',
    as: 'products_map'
});
