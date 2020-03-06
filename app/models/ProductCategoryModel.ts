import {seqConnection} from '../../bootstrap/boot-sequelize'
import {DataTypes, Model, BelongsTo, BelongsToMany} from 'sequelize';


export class ProductCategoryModel extends Model {
    public id: number;
    public name: string;
    public description: string;
    public author_id: number;
    public modified_by_id: number;
    static author: BelongsTo<ProductCategoryModel, StaffModel>;
    static modifiedBy: BelongsTo<ProductCategoryModel, StaffModel>;
    static products: BelongsToMany<ProductCategoryModel, ProductModel>;
}

ProductCategoryModel.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
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
    modelName: 'category',
    tableName: 'category',
    underscored: true

});


import {ProductModel} from './ProductModel';
import {ProductCategoryMapModel} from './ProductCategoryMapModel';

ProductCategoryModel.products = ProductCategoryModel.belongsToMany(ProductModel, {
    through: ProductCategoryMapModel,
    foreignKey: 'category_id',
    sourceKey: 'id'
});

import {StaffModel} from './StaffModel';

ProductCategoryModel.author = ProductCategoryModel.belongsTo(StaffModel, {
    as: 'author',
    foreignKey: 'author_id',
    targetKey: 'id'
});

ProductCategoryModel.modifiedBy = ProductCategoryModel.belongsTo(StaffModel, {
    as: 'modified_by',
    foreignKey: 'modified_by_id',
    targetKey: 'id'
});

