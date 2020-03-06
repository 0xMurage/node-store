import {seqConnection} from '../../bootstrap/boot-sequelize'
import {DataTypes, Model, BelongsTo} from 'sequelize';


export class OrderStatusModel extends Model {
    public id: number;
    public order_id: number;
    public status: number;
    public description: string;
    static order: BelongsTo<OrderStatusModel,OrderModel>;
}

OrderStatusModel.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    order_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        unique: true
    },
    status: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    sequelize: seqConnection,
    modelName: 'order_status',
    tableName: 'order_statuses',
    underscored: true

});

import {OrderModel} from './OrderModel';

OrderStatusModel.order = OrderStatusModel.belongsTo(OrderModel, {
    as: 'order',
    foreignKey: 'order_id',
    targetKey: 'id'
});
