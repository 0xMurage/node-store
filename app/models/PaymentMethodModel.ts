import {seqConnection} from '../../bootstrap/boot-sequelize'
import {DataTypes, Model, BelongsTo} from 'sequelize';


export class PaymentMethodModel extends Model {
    public id: number;
    public code: string;
    public name: string;
    public description?:string;
    public author_id: number;
    public modified_by_id: number;
    static author: BelongsTo<PaymentMethodModel, StaffModel>;
    static modifiedBy: BelongsTo<PaymentMethodModel, StaffModel>;
}

PaymentMethodModel.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique:true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
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
    modelName: 'payment_method',
    tableName: 'payment_methods',
    underscored: true

});

import {StaffModel} from './StaffModel';

PaymentMethodModel.author = PaymentMethodModel.belongsTo(StaffModel, {
    as: 'author',
    foreignKey: 'author_id',
    targetKey: 'id'
});

PaymentMethodModel.modifiedBy = PaymentMethodModel.belongsTo(StaffModel, {
    as: 'modified_by',
    foreignKey: 'modified_by_id',
    targetKey: 'id'
});

