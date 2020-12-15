const BaseRoute = require('./base/baseRoute')
const Joi = require('@hapi/joi');
const Boom = require('Boom')
const failAction = (request, headers, erro) => {
    throw erro;
} 
class MotoristaRoutes extends BaseRoute {
    constructor(db) {
        super()
        this.db = db
    }

    list() {
        return {
            path: '/motoristas',
            method: 'GET',
            config: {
                auth: false,
                tags: ['api'],
                description: 'Deve listar motoristas',
                notes: 'Pode filtar por nome',
                validate: {
                    failAction,                    
                    query: {
                        nome: Joi.string().min(3).max(100)
                    },               
                }
            },
            handler: (request, ) => {
                try {
                    const { nome } = request.query
                    const query = nome ? {
                        nome: nome
                    } : {}
                    return this.db.read(query)
                } catch (erro) {
                    console.log('Erro:', erro)
                    return Boom.internal()
                }
            }
        }
        
    }

    update() {
        return {
            path: '/motoristas/{id}',
            method: 'PATCH',
            config: {
                tags: ['api'],
                auth: false,
                description: 'Deve atualizar Motorista',
                notes: 'Deve atualizar motorista através do ID',
                validate: {
                    // payload -> body
                    //headers -> header
                    //params -> na URL :id
                    //query -> ?nome=Batman
                    failAction,
                    params: {
                        id: Joi.string().required(),
                    },
                    payload: {                        
                        username: Joi.string().min(3).max(100),
                        password: Joi.string().min(3).max(100),
                        nome: Joi.string().min(3).max(100),
                        cpf: Joi.string().min(9).max(100),
                        telefone: Joi.string().min(9).max(100),
                        email: Joi.string().min(3).max(100),       
                        foto: Joi.any()          
                    },
                    
                }
            },
            handler: async (request, ) => {
                try {
                    const {
                        id
                    } = request.params;

                    const {
                        payload
                    } = request

                    const dadosString = JSON.stringify(payload)
                    const dados = JSON.parse(dadosString)

                    const result = await this.db.update(id, dados)
                    if(JSON.parse(result) !== 1){ 
                    return Boom.preconditionFailed("Não foi possivel atualizar!")   
                    }else {
                        return {
                        message: 'Motorista atualizado com sucesso!'
                        }
                    }
                    

                } catch (error) {
                    console.error('Erro: ', error)
                    return Boom.internal()
                }
            }
        }
    }
    delete() {
        return {
            path: '/motoristas/{id}',
            method: 'DELETE',
            config: {
                tags: ['api'],
                auth: false,
                description: 'Deve excluir o motorista pelo ID',
                notes: 'o id tem que ser valido',
                validate: {
                    failAction,
                    params: {
                        id: Joi.string().required()
                    },                    
                }
            },
            handler: async (request) => {
                try {
                    const {id} = request.params
                    const result = await this.db.delete(id)               
                    if(result !== 1){
                        return Boom.preconditionFailed("Não encontrado no banco")           
                    }else{
                        return {
                            message: 'Motorista removido com sucesso!'
                        }
                    }                    
                } catch (erro) {
                    console.log("Erro: ", erro)
                    return Boom.internal()
                }
            }
        }
    }
}

module.exports = MotoristaRoutes