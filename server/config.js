export default {
    env: 'dev',
    database: {
        name: 'rss',
        username: 'root',
        password: '123456',
        dialect: 'mysql',
        host: 'localhost',
        port: 3306,
        charset: 'utf-8',
        collate: 'utf8_general_ci',
        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 1000
        }
    },
    auth: {
        type: 'jwt',
        secret: 'enter the secret',
        path: [/^\/api\/login/, /^\/api\/logout/, /^\/api\/register/],
        expiresIn: '1d'
    }
}
