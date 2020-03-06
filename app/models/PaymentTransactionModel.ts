import {seqConnection} from '../../bootstrap/boot-sequelize'
import {DataTypes, Model, BelongsTo} from 'sequelize';


export class PaymentTransactionModel extends Model {
    public id: number;
    public order_id: number;
    public request_id: number;
    public amount: number; // amount paid can be different from requested
    public currency_id: number;
    public code: string;
    public transaction_id: string;
    public first_name: string;
    public middle_name?: string;
    public last_name?: string;
    public success: number; // 0 or 1
    public author_id: number;
    public modified_by_id: number;
    static currency: BelongsTo<PaymentTransactionModel, CurrencyModel>;
    static order: BelongsTo<PaymentTransactionModel, OrderModel>;
    static paymentRequest: BelongsTo<PaymentTransactionModel, PaymentRequestModel>;
    static author: BelongsTo<PaymentTransactionModel, StaffModel>;
    static modifiedBy: BelongsTo<PaymentTransactionModel, StaffModel>;
}

PaymentTransactionModel.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    order_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    request_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    amount: {
        type: DataTypes.DECIMAL(9),
        allowNull: false
    },
    currency_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    transaction_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    middle_name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    success: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    author_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    modified_by_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    }
}, {
    sequelize: seqConnection,
    modelName: 'payment_transaction',
    tableName: 'payment_transactions',
    underscored: true,
    indexes: [{fields: ['code']}]

});

import {CurrencyModel} from './CurrencyModel';

PaymentTransactionModel.currency = PaymentTransactionModel.belongsTo(CurrencyModel, {
    foreignKey: 'currency_id',
    targetKey: 'id'
});

import {OrderModel} from './OrderModel';

PaymentTransactionModel.order = PaymentTransactionModel.belongsTo(OrderModel, {
    foreignKey: 'order_id',
    targetKey: 'id'
});

import {PaymentRequestModel} from './PaymentRequestModel';

PaymentTransactionModel.paymentRequest = PaymentTransactionModel.belongsTo(PaymentRequestModel, {
    foreignKey: 'request_id',
    targetKey: 'id'
});

import {StaffModel} from './StaffModel';

PaymentTransactionModel.author = PaymentTransactionModel.belongsTo(StaffModel, {
    as: 'author',
    foreignKey: 'author_id',
    targetKey: 'id'
});

PaymentTransactionModel.modifiedBy = PaymentTransactionModel.belongsTo(StaffModel, {
    as: 'modified_by',
    foreignKey: 'modified_by_id',
    targetKey: 'id'
});

