const BaseRoute = require('./base/baseRoute')
const Joi = require('@hapi/joi');
const Boom = require('Boom')

//npm i jsonwebtoken
// "@hapi/joi": "^15.1.1",
const Jwt = require('jsonwebtoken')
const PasswordHelper = require('./../helpers/passwordHelper')

const failAction = (request, headers, erro) => {
    throw erro;
}

class AuthMotoristaRoutes extends BaseRoute {
    constructor(secret, db) {
        super()
        this.secret = secret
        this.db = db
    }
    loginMotorista() {
        return {
            path: '/loginMotorista',
            method: 'POST',
            config: {
                auth: false,
                tags: ['api'],
                description: 'Obter token',
                notes: 'Faz login com user e senha do banco',
                validate: {
                    failAction,
                    payload: {
                        username: Joi.string().required(),
                        password: Joi.string().required()
                    }
                }
            },
            handler: async (request) => {
                const { username, password } = request.payload
                const [usuario] = await this.db.read({
                    username: username.toLowerCase()
                })
                if (!usuario) {
                    return Boom.unauthorized('O usuário informado não existe!')
                }
                const match = await PasswordHelper
                    .comparePassword(password, usuario.password)
                if (!match) {
                    return Boom.unauthorized('O usuário ou senha invalidos')
                }
                // if (
                //     username.toLowerCase() !== USER.username ||
                //     password !== USER.password
                // )
                //     return Boom.unauthorized()

                const token = Jwt.sign({
                    username: username,
                    id: usuario.id
                }, this.secret)
                return {
                    token,
                    usuario
                }
            }
        }
    }

    register() {
        return {
            path: `/registerMotorista`,
            method: 'POST',
            config: {
                auth: false,
                tags: ['api'],
                description: 'Deve criar um motorista',
                notes: 'Cria um motorista e retorna o ID criado',
                validate: {
                    // payload -> body
                    // headers -> header
                    //params -> na URL :id
                    //query -> ?nome=Batman
                    failAction,
                    payload: {
                        username: Joi.string().required().min(3).max(100),
                        password: Joi.string().required().min(3),
                        nome: Joi.string().required().min(3).max(100),
                        cpf: Joi.string().required().min(9).max(100),
                        telefone: Joi.number().required().min(3),
                        email: Joi.string().required().min(3).max(100),
                    }
                }
            },
            handler: async (request, response) => {
                const userData = request.payload
                const cod = await PasswordHelper.hashPassword(userData.password)
                userData.password = cod

                // try {
                //     await this.db.create(userData)
                // } catch (error){
                //     console.log('error', error)
                // }

                const result = await this.db.create(userData);
                
                return {
                    message: "Motorista criado com sucesso!",
                    id: result.id
                }

            }

        }
    }
}
module.exports = AuthMotoristaRoutes

