import db from '../data/index'
import ServerError from '../util/ServerError'
import * as Toolkit from '../util/Toolkit'

export default async function updateUser(userId, userInfo) {
    let user = await db.user.scope('valid').findById(userId);
    Toolkit.assertNotNull(user, 'The request user does not exist!');
    const result = await db.sequlize.transaction(async t => {
        user = user.updateAttributes({
            password: userInfo.password,
            name: userInfo.name,
            avatar: userInfo.avatar
        });
        return user;
    })
    .catch(err => {
        throw new ServerError(`Register failed! ${err}`, ServerError.DATA_TRANSACTION_FAIL);
    });
    return result.toJSON();
}
