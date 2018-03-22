export default function(sequelize, DataTypes) {
    const Feed = sequelize.define('feed', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: DataTypes.STRING,
        address: DataTypes.STRING,
        description: DataTypes.STRING
    }, {
        defaultScope: {
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'deletedAt']
            }
        },
        paranoid: true
    })
    Feed.associate = function(models) {
        Feed.belongsToMany(models.category, { as: 'categories', through: 'feed_category', otherKey: 'categoryId', foreignKey: 'feedId', timestamps: false })
    }
    return Feed;
}
