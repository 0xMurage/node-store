import {seqConnection} from '../../bootstrap/boot-sequelize'
import {DataTypes, Model, BelongsTo, BelongsToMany,HasMany} from 'sequelize';


export class CartModel extends Model {
    public id: number;
    public code: string;
    public customer_id: number;
    public author_id: number;
    public modified_id: number;
    public createdAt:string;
    static customer: BelongsTo<CartModel, CustomerModel>;
    static products: BelongsToMany<CartModel, ProductModel>;
    static productsMap: HasMany<CartModel, CartProductModel>;
    static modifiedBy: BelongsTo<CartModel, CustomerModel>;
    static author: BelongsTo<CartModel, CustomerModel>;
}

CartModel.init({
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
    modelName: 'cart',
    tableName: 'cart',
    underscored: true,
    indexes:[{fields:['customer_id','code']}]

});


import {CustomerModel} from './CustomerModel';

CartModel.customer = CartModel.belongsTo(CustomerModel, {
    foreignKey: 'customer_id',
    targetKey: 'id',
});


CartModel.modifiedBy = CartModel.belongsTo(CustomerModel, {
    as: 'modified_by',
    foreignKey: 'modified_by_id',
    targetKey: 'id'
});


import {ProductModel} from './ProductModel';
import {CartProductModel} from './CartProductModel';

CartModel.products = CartModel.belongsToMany(ProductModel, {
    through: CartProductModel,
    foreignKey: 'cart_id',
    targetKey: 'id'
});

CartModel.productsMap=CartModel.hasMany(CartProductModel,{
    foreignKey:'cart_id',
    sourceKey:'id',
    as:'products_map',
    onDelete:'CASCADE'
});
