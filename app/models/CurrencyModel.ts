import {seqConnection} from '../../bootstrap/boot-sequelize';
import {DataTypes, Model, BelongsTo} from 'sequelize';

export class CurrencyModel extends Model {
    public id: number;
    public code: string;
    public name: string;
    public symbol: string;
    public author_id: number;
    public modified_by_id: number;
    static author: BelongsTo<CurrencyModel, StaffModel>;
    static modifiedBy: BelongsTo<CurrencyModel, StaffModel>;

}

CurrencyModel.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    symbol: {
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
    tableName: 'currencies',
    modelName: 'currency',
    underscored: true,
});


import {StaffModel} from './StaffModel';

CurrencyModel.author = CurrencyModel.belongsTo(StaffModel, {
    as: 'author',
    foreignKey: 'author_id',
    targetKey: 'id'
});

CurrencyModel.modifiedBy = CurrencyModel.belongsTo(StaffModel, {
    as: 'modifiedBy',
    foreignKey: 'modified_by_id',
    targetKey: 'id'
});
