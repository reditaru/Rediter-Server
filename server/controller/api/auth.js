import Router from 'koa-joi-router'
import * as AuthService from '../../service/auth'
import * as Toolkit from '../../util/Toolkit'

const auth = new Router();
const Joi = Router.Joi;
const validateLogin = {
    body: {
        account: Joi.string().required(),
        password: Joi.string().min(6).max(16).required()
    },
    type: 'json'
}
const validateRegister = {
    body: {
        username: Joi.string().min(6).max(16).required(),
        password: Joi.string().min(6).max(16).required(),
        email: Joi.string().lowercase().email().required(),
        name: Joi.string().required()
    },
    type: 'json'
};
auth.post('/login', { validate: validateLogin }, async ctx => {
    const data = await AuthService.login(ctx.request.body);
    ctx.body = Toolkit.assemblyResponseBody(data);
})
.post('/register', { validate: validateRegister }, async ctx => {
    const data = await AuthService.register(ctx.request.body);
    ctx.body = Toolkit.assemblyResponseBody(data);
})
export default auth;
