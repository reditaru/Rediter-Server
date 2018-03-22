import jwt from 'jsonwebtoken'
import db from '../data/index'
import ServerError from '../util/ServerError'
import * as Toolkit from '../util/Toolkit'
import config from '../config'

export const login = async({ account, password }) => {
    const AUTH_FAIL_MSG = 'Authentication Fail!';
    const user = await db.user.scope('valid').findOne({
        where: {
            [db.sequelize.Op.or]: [{ username: account }, { email: account }]
        }
    });
    Toolkit.assertNotNull(user, AUTH_FAIL_MSG);
    Toolkit.assertEqual(password, user.password, AUTH_FAIL_MSG);
    let info = {};
    Toolkit.copyProperties(info, user.toJSON(), 'password');
    let token = jwt.sign(
        { username: user.username, id: user.id },
        config.auth.secret,
        { expiresIn: config.auth.expiresIn }
    );
    info.token = token;
    return info;
}
export async function logout(userId) {
    return {}
}
export async function register(userInfo) {
    const result = await db.sequelize.transaction(async t => {
        let user = await db.user.findOne({
            where: {
                [db.sequelize.Op.or]: [{ username: userInfo.username }, { email: userInfo.email }]
            }
        })
        Toolkit.assertNull(user, 'The username or email has been registered!');
        user = await db.user.create({
            ...userInfo
        }, { transaction: t });
        return user;
    })
    .catch(err => {
        throw new ServerError(`Register failed! ${err}`, ServerError.DATA_TRANSACTION_FAIL);
    });
    let info = {};
    Toolkit.copyProperties(info, result.toJSON(), 'password');
    return info;
}
