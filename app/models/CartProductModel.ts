import {seqConnection} from '../../bootstrap/boot-sequelize'
import {DataTypes, Model, BelongsTo} from 'sequelize';


export class CartProductModel extends Model {
    public id: number;
    public cart_id: number;
    public product_id: number;
    public quantity: number;
    static cart: BelongsTo<CartProductModel, CartModel>;
    static product: BelongsTo<CartProductModel, ProductModel>;
}

CartProductModel.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    cart_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        unique: true,
        onDelete:'CASCADE'
    },
    product_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    } ,
    quantity: {
        type: DataTypes.TINYINT.UNSIGNED,
        allowNull: false
    }
}, {
    sequelize: seqConnection,
    modelName: 'cart_product',
    tableName: 'cart_products',
    underscored: true

});


import {CartModel} from './CartModel';

CartProductModel.cart = CartProductModel.belongsTo(CartModel, {
    foreignKey: 'cart_id',
    targetKey: 'id'
});

import {ProductModel} from './ProductModel';

CartProductModel.product = CartProductModel.belongsTo(ProductModel, {
    foreignKey: 'product_id',
    targetKey: 'id'
});

