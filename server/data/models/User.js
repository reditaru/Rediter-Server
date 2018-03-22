export default function(sequelize, DataTypes) {
    const User = sequelize.define('user', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING,
            unique: true
        },
        email: {
            type: DataTypes.STRING,
            unique: true
        },
        password: DataTypes.STRING,
        name: DataTypes.STRING,
        avatar: DataTypes.STRING
    }, {
        defaultScope: {
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'deletedAt', 'password']
            }
        },
        paranoid: true,
        scopes: {
            valid: {
                attributes: {
                    include: ['password']
                }
            }
        }
    })
    User.associate = function(models) {
        User.hasMany(models.category, { as: 'categories', foreignKey: 'userId' })
    }
    return User;
}
