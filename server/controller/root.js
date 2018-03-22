import jwt from 'koa-jwt'
import Router from 'koa-joi-router'
import feedApi from './api/feed'
import categoryApi from './api/category'
import authApi from './api/auth'
import userApi from './api/user'
import config from '../config'
import * as Toolkit from '../util/Toolkit'

const root = new Router();
const api = new Router();
api.prefix('/api')
api.use(async(ctx, next) => {
        try {
            await next();
        } catch (err) {
            console.log(err);
            ctx.body = {
                code: err.status || err.code,
                success: false,
                msg: err.message
            }
        }
    })
    .use(jwt({ secret: config.auth.secret }).unless({ path: config.auth.path }))
    .use(authApi.middleware())
    .use(feedApi.middleware())
    .use(categoryApi.middleware())
    .use(userApi.middleware())
    .get('*', async ctx => {
        await ctx.render('404');
    })
export {
    root,
    api
}
