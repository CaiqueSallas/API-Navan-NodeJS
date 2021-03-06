const assert = require('assert')
const api = require('../api')
const Context = require('./../db/strategies/base/contextStrategy')
const Postgres = require('./../db/strategies/postgres/postgres')
const MotoristaSchema = require('./../db/strategies/postgres/schemas/motoristaSchema')
let app={}
const USER_CADASTRO = {
    username: JSON.stringify('TesteFoto' + Math.random()), 
    password: '123', 
    nome: 'João', 
    cpf: '123456789', 
    telefone: '123456789', 
    email: 'carlos@gmail.com'
}
const USER = {
    username: 'caique123', 
    password: '123', 
}

describe('Suite de testes da API motoristas', function () {
    this.beforeAll(async() => {
        app = await api
        // const result = await app.inject()
        const connectionPostgres = await Postgres.connect()
        const model = await Postgres.defineModel(connectionPostgres, MotoristaSchema)
        const postgres = new Context(new Postgres(connectionPostgres, model))
        // await postgres.update(null, USER_DB, true)
    })

    it('deve obter um token', async() => {
        const result = await app.inject({
            method: 'POST',
            url: '/loginMotorista',
            payload: USER
        })

        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)
        assert.deepStrictEqual(statusCode, 200)
        assert.ok(dados.token.length > 10)
    })

    it('deve retornar não autorizado ao tentar obter um login errado', async() => {
        const result = await app.inject({
            method: 'POST',
            url: '/loginMotorista',
            payload: {
                username: 'caiquesallas',
                password: '123'
            }
        })
        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)
        
        assert.deepStrictEqual(statusCode, 401)
        assert.deepStrictEqual(dados.error, "Unauthorized")
    })

    it('Cadastrar /motoristas - deve cadastrar um motorista', async () => {
        const result = await app.inject({
            method: 'POST',
            url: `/registerMotorista`,
            payload: USER_CADASTRO
        })
        const statusCode = result.statusCode
        const {
            message,
            id
        } = JSON.parse(result.payload)
        assert.ok(statusCode === 200)
        assert.notStrictEqual(id, undefined)
        assert.deepStrictEqual(message, "Motorista criado com sucesso!")
    })

})


