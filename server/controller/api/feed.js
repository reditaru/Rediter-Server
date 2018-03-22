import Router from 'koa-joi-router'
import * as FeedService from '../../service/feed'
import * as Toolkit from '../../util/Toolkit'

const feed = new Router();
const Joi = Router.Joi;
const validateFeed = {
    body: {
        address: Joi.string().required()
    },
    type: 'json'
}
feed
.get('/feed/:id', async ctx => {
    const { id } = ctx.state.user.id;
    const data = await FeedService.getFeedById(id, ctx.params.id);
    ctx.body = Toolkit.assemblyResponseBody(data);
})
.post('/category/:id/feeds', { validate: validateFeed }, async ctx => {
    const { id } = ctx.state.user;
    const data = await FeedService.addFeed(id, ctx.params.id, ctx.request.body);
    ctx.body = Toolkit.assemblyResponseBody(data);
})
.delete('/category/:categoryId/feed/:feedId', async ctx => {
    const { id } = ctx.state.user;
    const data = await FeedService.deleteFeed(id, ctx.params.categoryId, ctx.params.feedId);
    ctx.body = Toolkit.assemblyResponseBody(data);
})
export default feed;
