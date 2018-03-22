import Koa from 'koa'
import views from 'koa-views'
import serve from 'koa-static'
import mount from 'koa-mount'
import logger from 'koa-logger'
import path from 'path'
import { root, api } from './controller/root'

const app = new Koa();
app.use(async(ctx, next) => {
    try {
        await next();
    } catch (err) {
        console.log(err)
    }
});
app.use(logger())
app.use(views(path.join(__dirname, 'views'), {
    extension: 'jade'
}))
app.use(mount('/static', serve('static/')))
app.use(api.middleware())
app.use(root.middleware())
app.listen(3000)
