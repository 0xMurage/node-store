import {seqConnection} from '../../bootstrap/boot-sequelize'
import {DataTypes, Model, BelongsTo} from 'sequelize';


export class ProductPriceModel extends Model {
    public id: number;
    public product_id: number;
    public amount: number;
    public currency_id: number;
    public remarks: string;
    public author_id: number;
    public modified_by_id: number;
    static author: BelongsTo<ProductPriceModel, StaffModel>;
    static modifiedBy: BelongsTo<ProductPriceModel, StaffModel>;
    static currency: BelongsTo<ProductPriceModel, CurrencyModel>;
    static product: BelongsTo<ProductPriceModel, ProductModel>;
}

ProductPriceModel.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
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
    },
    remarks: {
        type: DataTypes.TEXT,
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
    modelName: 'product_price',
    tableName: 'product_prices',
    underscored: true

});

import {CurrencyModel} from './CurrencyModel';

ProductPriceModel.currency = ProductPriceModel.belongsTo(CurrencyModel, {
    foreignKey: 'currency_id',
    targetKey: 'id'
});

import {ProductModel} from './ProductModel';

ProductPriceModel.product = ProductPriceModel.belongsTo(ProductModel, {
    foreignKey: 'product_id',
    targetKey: 'id'
});


import {StaffModel} from './StaffModel';

ProductPriceModel.author = ProductPriceModel.belongsTo(StaffModel, {
    as: 'author',
    foreignKey: 'author_id',
    targetKey: 'id'
});

ProductPriceModel.modifiedBy = ProductPriceModel.belongsTo(StaffModel, {
    as: 'modified_by',
    foreignKey: 'modified_by_id',
    targetKey: 'id'
});

