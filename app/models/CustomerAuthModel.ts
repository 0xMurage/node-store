import {seqConnection} from '../../bootstrap/boot-sequelize'
import {DataTypes, Model, BelongsTo} from 'sequelize';


export class CustomerAuthModel extends Model {
    public id: number;
    public customer_id: number;
    public username: string;
    public password: string;
    static customer: BelongsTo<CustomerAuthModel, CustomerModel>;
}

CustomerAuthModel.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    customer_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        unique: true,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true

    },
    password: {
        type: DataTypes.TEXT,
        allowNull: false
    }

}, {
    sequelize: seqConnection,
    modelName: 'customer_auth',
    tableName: 'customer_auth',
    underscored: true

});

import {CustomerModel} from './CustomerModel';

CustomerAuthModel.customer = CustomerAuthModel.belongsTo(CustomerModel, {
    foreignKey: 'customer_id',
    targetKey: 'id'
});

