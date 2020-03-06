import {seqConnection} from '../../bootstrap/boot-sequelize'
import {DataTypes, Model, BelongsTo} from 'sequelize';

export class StaffAuthModel extends Model {
    public id: number;
    public user_id: number;
    public username: string;
    public password: string;
    public author_id: number;
    static author: BelongsTo<StaffAuthModel, StaffModel>;
    static user: BelongsTo<StaffAuthModel, StaffModel>;
    static modifiedBy: BelongsTo<StaffAuthModel, StaffModel>;

}

StaffAuthModel.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        unique: true,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {isEmail: true}
    },
    password: {
        type: DataTypes.TEXT,
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
    tableName: 'staff_auth',
    modelName: 'staff_auth',
    underscored: true
});


import {StaffModel} from './StaffModel';

StaffAuthModel.user = StaffAuthModel.belongsTo(StaffModel, {
    foreignKey: 'user_id',
    targetKey: 'id',
    as: 'user',
});

StaffAuthModel.author = StaffAuthModel.belongsTo(StaffModel, {
    as: 'author',
    foreignKey: 'author_id',
    targetKey: 'id'
});

StaffAuthModel.modifiedBy = StaffAuthModel.belongsTo(StaffModel, {
    as: 'modified_by',
    foreignKey: 'modified_by_id',
    targetKey: 'id'
});
