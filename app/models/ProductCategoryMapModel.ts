import {seqConnection} from '../../bootstrap/boot-sequelize'
import {DataTypes, Model, BelongsTo} from 'sequelize';


export class ProductCategoryMapModel extends Model {
    public id: number;
    public product_id: string;
    public category_id: string;
    public author_id: number;
    static product: BelongsTo<ProductCategoryMapModel, ProductModel>;
    static author: BelongsTo<ProductCategoryMapModel, StaffModel>;
}

ProductCategoryMapModel.init({
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
    category_id: {
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
    modelName: 'product_category_map',
    tableName: 'product_category_map',
    underscored: true

});

import {StaffModel} from './StaffModel';

ProductCategoryMapModel.author = ProductCategoryMapModel.belongsTo(StaffModel, {
    as: 'author',
    foreignKey: 'author_id',
    targetKey: 'id'
});

import {ProductModel} from './ProductModel';

ProductCategoryMapModel.product = ProductCategoryMapModel.belongsTo(ProductModel, {
    foreignKey: 'product_id',
    targetKey: 'id'
});

