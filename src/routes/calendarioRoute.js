const BaseRoute = require('./base/baseRoute')
const Joi = require('@hapi/joi');
const Boom = require('Boom')
const failAction = (request, headers, erro) => {
    throw erro;
} 

class CalendarioRoutes extends BaseRoute {
    constructor(db) {
        super()
        this.db = db
    }

    list() {
        return {
            path: '/calendario',
            method: 'GET',
            config: {
                auth: false,
                tags: ['api'],
                description: 'Deve listar o calendario pelo id',
                notes: 'Filtra pela data e pelo ID',
                validate: {
                    failAction,                    
                    query: {
                        id_passageiro: Joi.number().required(),
                        date: Joi.date().required()
                    },
                }
            },
            handler: (request) => {
                try {
                    const { id_passageiro, date } = request.query
                    const query = {id_passageiro: id_passageiro, date: date}
                    return this.db.read(query)
                } catch (erro) {
                    console.log('Erro:', erro)
                    return Boom.internal()
                }
            }
        }
        
    }

    create() {
        return {
            path: `/registerCalendario`,
            method: 'POST',
            config: {
                auth: false,
                tags: ['api'],
                description: 'Deve agendar uma data no calendário',  
                notes: 'Agenda uma data no calendário pelo id do passageiro',              
                validate: {
                    // payload -> body
                    // headers -> header
                    //params -> na URL :id
                    //query -> ?nome=Batman
                    failAction,
                    payload: {
                        date: Joi.date().required(),
                        presenca: Joi.boolean().required(),
                        id_passageiro: Joi.number().required()
                    }          
                }
            },
            handler: async (request, headers) => {                
                const userData = request.payload
                const result = await this.db.create(userData)
                return {
                    message: "Data agendada com sucesso!",
                    id: result.id
                }
            }
        }
    }
}

module.exports = CalendarioRoutes