import {seqConnection} from '../../bootstrap/boot-sequelize'
import {DataTypes, Model, BelongsTo} from 'sequelize';


export class ProductImageModel extends Model {
    public id: number;
    public product_id: number;
    public location: string;
    public name: string;
    public caption: string;
    public author_id: number;
    static author: BelongsTo<ProductImageModel, StaffModel>;
    static modifiedBy: BelongsTo<ProductImageModel, StaffModel>;
    static product: BelongsTo<ProductImageModel, ProductModel>;
}

ProductImageModel.init({
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
    location: {
        type: DataTypes.TEXT,
        allowNull: false
    },name: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    caption: {
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
    modelName: 'product_image',
    tableName: 'product_images',
    underscored: true

});

import {ProductModel} from './ProductModel';

ProductImageModel.product = ProductImageModel.belongsTo(ProductModel, {
    foreignKey: 'product_id',
    targetKey: 'id'
});

import {StaffModel} from './StaffModel';

ProductImageModel.author = ProductImageModel.belongsTo(StaffModel, {
    as: 'author',
    foreignKey: 'author_id',
    targetKey: 'id'
});

ProductImageModel.modifiedBy = ProductImageModel.belongsTo(StaffModel, {
    as: 'modified_by',
    foreignKey: 'modified_by_id',
    targetKey: 'id'
});

