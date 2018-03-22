import db from '../data/index'
import ServerError from '../util/ServerError'
import * as Toolkit from '../util/Toolkit'

export const validteUserCategory = async(userId, categoryId) => {
    let data = await db.category.findOne({
        where: {
            userId,
            id: categoryId
        }
    });
    Toolkit.assertNotNull(data, 'Authentication failed!');
}

export const getUserCategories = async userId => {
    let data = await db.category.findAll({
        where: {
            userId
        }
    });
    data = data.map(item => item.toJSON());
    return data;
}
export const getCategoryById = async(userId, categoryId) => {
    await validteUserCategory(userId, categoryId);
    const data = await db.category.findById(categoryId, {
        include: [{ model: db.feed, as: 'feeds', through: { attributes: [] } }]
    });
    return data.toJSON();
}
export const createCategory = async(userId, name) => {
    const result = await db.sequelize.transaction(async t => {
        const category = await db.category.create({
            name,
            userId
        }, { transaction: t });
        return category;
    })
    .catch(err => {
        throw new ServerError(`Create failed! Error:${err.name}`, ServerError.DATA_TRANSACTION_FAIL);
    });
    return result.toJSON();
}
export const updateCategory = async(userId, id, name) => {
    await validteUserCategory(userId, id);
    let category = await db.category.findById(id);
    Toolkit.assertNotNull(category, 'The request category does not exist!');
    const result = await db.sequelize.transaction(async t => {
            category = await category.updateAttribute({
                name
            }, { transaction: t });
            return category;
    })
    .catch(err => {
        throw new ServerError(`Update failed! Error:${err.name}`, ServerError.DATA_TRANSACTION_FAIL);
    });
    return result.toJSON();
}
export const deleteCategory = async(userId, id) => {
    await validteUserCategory(userId, id);
    let category = await db.category.findById(id);
    Toolkit.assertNotNull(category, 'The request category does not exist!');
    const result = await db.sequelize.transaction(async t => {
            category = await category.destroy({ transaction: t });
            return category;
    })
    .catch(err => {
        throw new ServerError(`Delete failed! Error:${err.name}`, ServerError.DATA_TRANSACTION_FAIL);
    });
    return result.toJSON();
}
