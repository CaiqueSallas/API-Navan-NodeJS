const BaseRoute = require('./base/baseRoute')
const Joi = require('@hapi/joi');
const Boom = require('Boom')
const failAction = (request, headers, erro) => {
    throw erro;
} 

const headers =  Joi.object({
    authorization: Joi.string().required()
}).unknown()


class PassageiroRoutes extends BaseRoute {
    constructor(db) {
        super()
        this.db = db
    }

    list() {
        return {
            path: '/passageiros',
            method: 'GET',
            config: {
                auth: false,
                tags: ['api'],
                description: 'Deve listar passageiros',
                notes: 'Pode filtar por nome',
                validate: {
                    failAction,
                    //headers,
                    query: {
                        presenca: Joi.boolean()
                    }
                }
            },
            handler: (request) => {
                try {
                    const { presenca } = request.query
                    const query = {presenca: presenca}
                    return this.db.read(query)
                } catch (erro) {
                    console.log('Erro:', erro)
                    return Boom.internal()
                }
            }
        }
        
    }
    listId() {
        return {
            path: '/passageiros/{id}',
            method: 'GET',
            config: {
                auth: false,
                tags: ['api'],
                description: 'Deve listar passageiros',
                notes: 'Pode filtar por nome',
                validate: {
                    failAction,
                    //headers,
                    params: {
                        id: Joi.string(),
                    }
                }
            },
            handler: (request) => {
                try {
                    const {
                        id
                    } = request.params;   
                    const query = {id}
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
            path: '/passageiros/{id}',
            method: 'PATCH',
            config: {
                tags: ['api'],
                description: 'Deve atualizar um passageiro',
                notes: 'Deve atualizar um passageiro através do ID',
                validate: {
                    // payload -> body
                    // headers -> header
                    //params -> na URL :id
                    //query -> ?nome=Batman
                    failAction: (erro) => {
                        throw erro;
                    },
                    params: {
                        id: Joi.string().required(),
                    },
                    payload: {                        
                        presenca: Joi.boolean().required(),  
                    },
                    headers
                }
            },
            handler: async (request, headers) => {
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
                        message: 'Passageiro atualizado com sucesso!'
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
            path: '/passageiros/{id}',
            method: 'DELETE',
            config: {
                tags: ['api'],
                description: 'Deve excluir o passageiro pelo ID',
                notes: 'o id tem que ser valido',
                validate: {
                    failAction: (requrest, headers, erro) => {
                        throw erro;
                    },
                    params: {
                        id: Joi.number().required()
                    },
                    headers
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
                            message: 'Passageiro removido com sucesso!'
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

module.exports = PassageiroRoutes