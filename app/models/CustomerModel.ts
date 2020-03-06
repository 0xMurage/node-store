import {seqConnection} from '../../bootstrap/boot-sequelize'
import {DataTypes, Model, BelongsTo, HasOne, HasMany} from 'sequelize';


export class CustomerModel extends Model {
    public id: number;
    public code: string;
    public first_name: string;
    public last_name: string;
    public email: string;
    public author_id: number;
    static author: BelongsTo<CustomerModel, StaffModel>;
    static authInfo: HasOne<CustomerModel, CustomerAuthModel>;
    static orders: HasMany<CustomerModel, OrderModel>;
    static addresses: HasMany<CustomerModel, AddressModel>;
}

CustomerModel.init({
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
    first_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true
    },
    author_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
    },
    modified_by_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
    }
}, {
    sequelize: seqConnection,
    modelName: 'customer',
    tableName: 'customers',
    underscored: true,
    indexes:[{fields:['code']}]

});


import {OrderModel} from './OrderModel';

CustomerModel.orders = CustomerModel.hasMany(OrderModel, {
    sourceKey: 'id',
    foreignKey: 'customer_id'
});

import {StaffModel} from './StaffModel';

CustomerModel.author = CustomerModel.belongsTo(StaffModel, {
    as: 'author',
    foreignKey: 'author_id',
    targetKey: 'id'
});


import {CustomerAuthModel} from './CustomerAuthModel';

CustomerModel.authInfo = CustomerModel.hasOne(CustomerAuthModel, {
    foreignKey: 'customer_id',
    sourceKey: 'id',
    as: 'auth_info'
});

import {AddressModel} from './AddressModel';

CustomerModel.addresses = CustomerModel.hasMany(AddressModel, {
    foreignKey: 'customer_id',
    sourceKey: 'id'
});
