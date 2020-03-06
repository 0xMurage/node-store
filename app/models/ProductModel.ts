import {seqConnection} from '../../bootstrap/boot-sequelize'
import {DataTypes, Model, BelongsTo, HasMany, BelongsToMany} from 'sequelize';


export class ProductModel extends Model {
    public id: number;
    public code: string;
    public name: string;
    public author_id: number;
    public modified_by_id: number;
    static images: HasMany<ProductModel, ProductImageModel>;
    static prices: HasMany<ProductModel, ProductPriceModel>;
    static categories: BelongsToMany<ProductModel, ProductCategoryModel>;
    static categoryMap: HasMany<ProductModel, ProductCategoryMapModel>;
    static author: BelongsTo<ProductModel, StaffModel>;
    static modifiedBy: BelongsTo<ProductModel, StaffModel>;
}

ProductModel.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    code: {
        type: DataTypes.STRING,
        unique: true,
    },
    name: {
        type: DataTypes.STRING,
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
    modelName: 'product',
    tableName: 'products',
    underscored: true,
    indexes: [{fields: ['code']}]
});

import {ProductImageModel} from './ProductImageModel';

ProductModel.images = ProductModel.hasMany(ProductImageModel, {
    foreignKey: 'product_id',
    sourceKey: 'id',
    as: 'images'
});

import {ProductPriceModel} from './ProductPriceModel';

ProductModel.prices = ProductModel.hasMany(ProductPriceModel, {
    foreignKey: 'product_id',
    sourceKey: 'id',
    as: 'prices'
});


import {ProductCategoryModel} from './ProductCategoryModel';
import {ProductCategoryMapModel} from './ProductCategoryMapModel';

ProductModel.categories = ProductModel.belongsToMany(ProductCategoryModel, {
    through: ProductCategoryMapModel,
    foreignKey: 'product_id',
    sourceKey: 'id'
});

ProductModel.categoryMap = ProductModel.hasMany(ProductCategoryMapModel, {
    sourceKey: 'id',
    foreignKey: 'product_id',
    as: 'product_category_map'
});

import {StaffModel} from './StaffModel';

ProductModel.author = ProductModel.belongsTo(StaffModel, {
    as: 'author',
    foreignKey: 'author_id',
    targetKey: 'id'
});

ProductModel.modifiedBy = ProductModel.belongsTo(StaffModel, {
    as: 'modified_by',
    foreignKey: 'modified_by_id',
    targetKey: 'id'
});

