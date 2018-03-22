export default function(sequelize, DataTypes) {
    const Category = sequelize.define('category', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: DataTypes.STRING
    }, {
        defaultScope: {
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'deletedAt']
            }
        },
        paranoid: true
    })
    Category.associate = function(models) {
        Category.belongsTo(models.user, { as: 'user', foreignKey: 'userId' })
        Category.belongsToMany(models.feed, { as: 'feeds', through: 'feed_category', otherKey: 'feedId', foreignKey: 'categoryId', timestamps: false })
    }
    return Category;
}
