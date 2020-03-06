import {seqConnection} from '../../bootstrap/boot-sequelize'
import {DataTypes, Model, BelongsTo} from 'sequelize';


export class RolePermissionMapModel extends Model {
    public id: number;
    public role_id: number;
    public permission_id: number;
    public author_id: number;
    static author: BelongsTo<RolePermissionMapModel, StaffModel>;
}

RolePermissionMapModel.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    role_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    permission_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
    author_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    }
}, {
    sequelize: seqConnection,
    modelName: 'role_permission',
    tableName: 'role_permissions',
    underscored: true

});

import {StaffModel} from './StaffModel';

RolePermissionMapModel.author = RolePermissionMapModel.belongsTo(StaffModel, {
    as: 'author',
    foreignKey: 'author_id',
    targetKey: 'id'
});
