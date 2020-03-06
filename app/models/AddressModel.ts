import {seqConnection} from '../../bootstrap/boot-sequelize'
import {DataTypes, Model, BelongsTo} from 'sequelize';

export class AddressModel extends Model {
    public id: number;
    public customer_id: number;
    public first_name: string;
    public last_name: string;
    public email: string;
    public mobile: string;
    public post_code: string;
    public address: string;
    public city: string;
    public county?: string;
    public country: string;
    static customer: BelongsTo<AddressModel, CustomerModel>;
    static author: BelongsTo<AddressModel, CustomerModel>;
    static modifiedBy: BelongsTo<AddressModel, CustomerModel>;

}

AddressModel.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    mobile: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    post_code: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    county: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    country: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    customer_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
    },
    author_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
    },
    modified_by_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
    },
}, {
    sequelize: seqConnection,
    tableName: 'addresses',
    modelName: 'address',
    underscored: true
});


import {CustomerModel} from './CustomerModel';

AddressModel.customer = AddressModel.belongsTo(CustomerModel, {
    foreignKey: 'customer_id',
    targetKey: 'id',
    as: 'customer'
});

AddressModel.author = AddressModel.belongsTo(CustomerModel, {
    foreignKey: 'author_id',
    targetKey: 'id',
    as: 'author'
});

AddressModel.modifiedBy = AddressModel.belongsTo(CustomerModel, {
    foreignKey: 'modified_by_id',
    targetKey: 'id',
    as: 'modified_by'
});


