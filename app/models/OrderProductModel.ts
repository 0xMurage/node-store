import {seqConnection} from '../../bootstrap/boot-sequelize'
import {DataTypes, Model, BelongsTo} from 'sequelize';


export class OrderProductModel extends Model {
    public id: number;
    public order_id: number;
    public product_id: number;
    public amount: number; // amount at which the product was sold at
    public quantity: number;
    static order: BelongsTo<OrderProductModel, OrderModel>;
    static product: BelongsTo<OrderProductModel, ProductModel>;
    static currency: BelongsTo<OrderProductModel, CurrencyModel>;
}

OrderProductModel.init({
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
    product_id: {
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
    }, quantity: {
        type: DataTypes.TINYINT.UNSIGNED,
        allowNull: false
    }
}, {
    sequelize: seqConnection,
    modelName: 'order_product',
    tableName: 'order_products',
    underscored: true

});

import {OrderModel} from './OrderModel';

OrderProductModel.order = OrderProductModel.belongsTo(OrderModel, {
    foreignKey: 'order_id',
    targetKey: 'id'
});

import {ProductModel} from './ProductModel';

OrderProductModel.product = OrderProductModel.belongsTo(ProductModel, {
    foreignKey: 'product_id',
    targetKey: 'id'
});

import {CurrencyModel} from './CurrencyModel';

OrderProductModel.currency = OrderProductModel.belongsTo(CurrencyModel, {
    foreignKey: 'currency_id',
    targetKey: 'id'
});

