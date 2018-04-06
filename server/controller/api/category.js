import Router from 'koa-joi-router'
import * as CategoryService from '../../service/category'
import * as Toolkit from '../../util/Toolkit'

const category = new Router();
const Joi = Router.Joi;
const validateCategory = {
    body: {
        name: Joi.string().required()
    },
    type: 'json'
}
category
.get('/categories', async ctx => {
    const { id } = ctx.state.user;
    const data = await CategoryService.getUserCategories(id);
    ctx.body = Toolkit.assemblyResponseBody(data);
})
.get('/category/:id', async ctx => {
    const { id } = ctx.state.user;
    const data = await CategoryService.getCategoryById(id, ctx.params.id);
    ctx.body = Toolkit.assemblyResponseBody(data);
})
.post('/categories', { validate: validateCategory }, async ctx => {
    const { id } = ctx.state.user;
    const data = await CategoryService.createCategory(id, ctx.request.body.name);
    ctx.body = Toolkit.assemblyResponseBody(data);
})
.put('/category/:id', { validate: validateCategory }, async ctx => {
    const { id } = ctx.state.user;
    const data = await CategoryService.updateCategory(id, ctx.params.id, ctx.request.body.name);
    ctx.body = Toolkit.assemblyResponseBody(data);
})
.delete('/category/:id', async ctx => {
    const { id } = ctx.state.user;
    const data = await CategoryService.deleteCategory(id, ctx.params.id);
    ctx.body = Toolkit.assemblyResponseBody(data);
})
export default category;
