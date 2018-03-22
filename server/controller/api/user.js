import Router from 'koa-joi-router'
import * as UserService from '../../service/user'
import * as Toolkit from '../../util/Toolkit'

const user = new Router();
const Joi = Router.Joi;
const validateUser = {
    body: {
        password: Joi.string().required(),
        avatar: Joi.string().required(),
        name: Joi.string().required()
    },
    type: 'json'
};
user.put('/users', { validate: validateUser }, async ctx => {
    const { id } = ctx.state.user;
    const data = await UserService.updateUser(id, ctx.request.body);
    ctx.body = Toolkit.assemblyResponseBody(data);
});
export default user;
