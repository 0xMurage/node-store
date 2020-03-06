import {seqConnection} from '../../bootstrap/boot-sequelize'
import {DataTypes, Model, BelongsTo, HasOne} from 'sequelize';

export class StaffModel extends Model {
    public id: number;
    public first_name: string;
    public last_name: string;
    public role_id: number;
    public code: string;
    public email: string;
    public author_id: number;
    static role: BelongsTo<StaffModel, RoleModel>;
    static author: BelongsTo<StaffModel, StaffModel>;
    static authInfo: HasOne<StaffModel, StaffAuthModel>;
    static modifiedBy: BelongsTo<StaffModel, StaffModel>;

}

StaffModel.init({
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
        allowNull: true
    },
    role_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
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
    tableName: 'staff',
    modelName: 'staff   ',
    underscored: true,
    indexes: [{fields: ['code']}]
});


import {RoleModel} from './RoleModel';

StaffModel.role = StaffModel.belongsTo(RoleModel, {
    foreignKey: 'role_id',
    targetKey: 'id',
});

import {StaffAuthModel} from './StaffAuthModel';

StaffModel.authInfo = StaffModel.hasOne(StaffAuthModel, {
    foreignKey: 'user_id',
    sourceKey: 'id',
});

StaffModel.author = StaffModel.belongsTo(StaffModel, {
    as: 'author',
    foreignKey: 'author_id',
    targetKey: 'id'
});

StaffModel.modifiedBy = StaffModel.belongsTo(StaffModel, {
    as: 'modifiedBy',
    foreignKey: 'modified_by_id',
    targetKey: 'id'
});
