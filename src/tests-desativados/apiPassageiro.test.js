const assert = require('assert')
const api = require('./../api')
let app={}
const MOCK_PASS_CADASTRAR = {
    username: JSON.stringify('TesteFoto' + Math.random()), 
    password: '123', 
    nome: 'João', 
    cpf: '123456789', 
    telefone: 123456789, 
    email: 'carlos@gmail.com',
    destino: 'Fernando Prestes',
    presenca: true,
    id_motorista: 1
}

const MOCK_PASS_INICIAL = {
    username: JSON.stringify('TesteFoto' + Math.random()), 
    password: '123', 
    nome: 'Roberto', 
    cpf: '123456789', 
    telefone: 123456789, 
    email: 'carlos@gmail.com',
    destino: 'Fernando Prestes',
    presenca: true,
    id_motorista: 1
}

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJlbmFuNCIsImlkIjoxNCwiaWF0IjoxNjA1NTU5NTE3fQ.-A8Gm91l5G8mDeFIb8NCLlFL1qnqSFeVY2Q7ZUcgQak'

const headers = {
    Authorization: TOKEN
}
let MOCK_ID = 77
describe('Suite de testes da API passageiros', function () {
    this.beforeAll(async() => {        
        app = await api
    }) 
    it('Listar /passageiros - Deve listar passageiros', async () => {
        const result = await app.inject({
            method: 'GET',
            url: `/passageiros`,       
            headers
        })
        const dados = JSON.parse(result.payload)
        const statusCode = result.statusCode
        assert.deepStrictEqual(statusCode, 200)
        assert.ok(Array.isArray(dados))
    })

    it('Listar /passageiros - deve retornar de acordo com o ID enviado', async () => {
        const id_motorista = MOCK_ID
        
        const result = await app.inject({
            method: 'GET',
            url: `/passageiros?id_motorista=${id_motorista}`,
            headers
        })
        const dados = JSON.parse(result.payload)
        const statusCode = result.statusCode
        assert.deepStrictEqual(statusCode, 200)
        assert.ok(dados[0].id_motorista, id_motorista)
    })

    it('Atualizar PATCH - /passageiros/:id' , async () => {
        const id = 13
        const expected = {
            username: 'renanzin2',
            nome: 'Renan Lucca',
            cpf: '987654321',
            telefone: 987654321,
            email: 'betaEgirl@gmail.com'
        }
        const result = await app.inject({
            method: 'PATCH',
            url: `/passageiros/${id}`,
            payload: JSON.stringify(expected),
            headers
        })
        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)

        assert.ok(statusCode, 200)
        assert.deepStrictEqual(dados.message,'Passageiro atualizado com sucesso!')
    })

    it('Atualizar PATCH - /passageiros/:id - não deve atualizar com ID incorreto!' , async () => {
        const id = `${MOCK_ID}01`
        const expected = {
            nome: 'sebastião'
        }
        const result = await app.inject({
            method: 'PATCH',
            url: `/passageiros/${id}`,
            payload: JSON.stringify(expected),
            headers
        })
        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)
        assert.ok(statusCode, 412)
        assert.deepStrictEqual(dados.message,'Não foi possivel atualizar!')

    })

    it('Deletar DELETE - /passageiros/:id', async () => {
        const id = 13
        const result = await app.inject({
            method: 'DELETE',
            url: `/passageiros/${id}`,
            headers
        })
        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)

        assert.ok(statusCode === 200)
        assert.deepStrictEqual(dados.message, 'Passageiro removido com sucesso!')
    })

    it('Deletar DELETE - /passageiros/:id não deve remover', async () => {
        const id = `${MOCK_ID}01`
        const result = await app.inject({
            method: 'DELETE',
            url: `/passageiros/${id}`,
            headers
        })
        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)

        assert.ok(statusCode === 412)
        assert.deepStrictEqual(dados.message,'Não encontrado no banco')
    })
})