import {seqConnection} from '../../bootstrap/boot-sequelize'
import {DataTypes, Model, BelongsTo} from 'sequelize';


export class PaymentRequestModel extends Model {
    public id: number;
    public order_id: number;
    public payment_method_id: number;
    public amount: number;
    public currency_id: number;
    public checkout_id: string;
    public merchant_id: string;
    public mobile?: string;
    public email?: string;
    public remarks?: number;
    public invoice?: string;
    public author_id: number;
    public modified_by_id: number;
    static order: BelongsTo<PaymentRequestModel, OrderModel>;
    static method: BelongsTo<PaymentRequestModel, PaymentMethodModel>;
    static currency: BelongsTo<PaymentRequestModel, CurrencyModel>;
    static author: BelongsTo<PaymentRequestModel, StaffModel>;
    static modifiedBy: BelongsTo<PaymentRequestModel, StaffModel>;
}

PaymentRequestModel.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    order_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        unique: true
    },
    payment_method_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    amount: {
        type: DataTypes.DECIMAL(9),
        allowNull: false,
        validate: {max: 400000, min: 1}
    },
    currency_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
    checkout_id: {
        type: DataTypes.STRING,
        allowNull: true
    },
    merchant_id: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mobile: {
        type: DataTypes.STRING,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true
    },
    remarks: {
        type: DataTypes.STRING,
        allowNull: true
    },
    invoice: {
        type: DataTypes.STRING,
        allowNull: true
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
    modelName: 'payment_request',
    tableName: 'payment_requests',
    underscored: true

});


import {OrderModel} from './OrderModel';

PaymentRequestModel.order = PaymentRequestModel.belongsTo(OrderModel, {
    foreignKey: 'order_id',
    targetKey: 'id'
});


import {CurrencyModel} from './CurrencyModel';

PaymentRequestModel.currency = PaymentRequestModel.belongsTo(CurrencyModel, {
    foreignKey: 'currency_id',
    targetKey: 'id'
});

import {PaymentMethodModel} from './PaymentMethodModel';

PaymentRequestModel.method = PaymentRequestModel.belongsTo(PaymentMethodModel, {
    foreignKey: 'payment_method_id',
    as: 'method',
    targetKey: 'id'
});


import {StaffModel} from './StaffModel';

PaymentRequestModel.author = PaymentRequestModel.belongsTo(StaffModel, {
    as: 'author',
    foreignKey: 'author_id',
    targetKey: 'id'
});

PaymentRequestModel.modifiedBy = PaymentRequestModel.belongsTo(StaffModel, {
    as: 'modified_by',
    foreignKey: 'modified_by_id',
    targetKey: 'id'
});

