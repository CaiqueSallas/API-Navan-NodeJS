const assert = require('assert')
const api = require('../api')
let app={}

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImNhaXF1ZSIsImlkIjoyLCJpYXQiOjE2MDYzODAzMDV9.TN_ic8b94ePCqQHjJNr0KgIkMI6Bj9wl1-03frL_3qI'

const headers = {
    Authorization: TOKEN
}

let MOCK_ID = ''
describe('Suite de testes da API motoristas', function () {
    this.beforeAll(async() => {        
        app = await api
        MOCK_ID = 1
    })

    
    
    it('Listar /motoristas - Deve listar motoristas', async () => {
        const result = await app.inject({
            method: 'GET',
            url: `/motoristas`,       
            headers,
        })
        const dados = JSON.parse(result.payload)
        const statusCode = result.statusCode

        assert.deepStrictEqual(statusCode, 200)
        assert.ok(Array.isArray(dados))
    })

    it('Listar /motoristas - deve retornar de acordo com o nome enviado', async () => {
        const NOME = 'TesteFoto4'
        
        const result = await app.inject({
            method: 'GET',
            url: `/motoristas?nome=${NOME}`,
            headers
        })
        const dados = JSON.parse(result.payload)
        const statusCode = result.statusCode
        assert.deepStrictEqual(statusCode, 200)
        assert.ok(dados[0].nome, NOME)
    })

    it('Atualizar PATCH - /motoristas/:id' , async () => {
        const id = MOCK_ID
        const expected = {
            nome: 'Renan Lucca',
            cpf: '987654321',
            telefone: '987654321',
            email: 'betaEgirl@gmail.com'

        }
        const result = await app.inject({
            method: 'PATCH',
            url: `/motoristas/${id}`,
            payload: JSON.stringify(expected),
            headers
        })
        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)

        assert.ok(statusCode, 200)
        assert.deepStrictEqual(dados.message,'Motorista atualizado com sucesso!')

    })
    it('Atualizar PATCH - /motoristas/:id - não deve atualizar com ID incorreto!' , async () => {
        const id = `${MOCK_ID}01`
        const expected = {
            nome: 'sebastião'
        }
        const result = await app.inject({
            method: 'PATCH',
            url: `/motoristas/${id}`,
            payload: JSON.stringify(expected),
            headers
        })
        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)
        assert.ok(statusCode, 412)
        assert.deepStrictEqual(dados.message,'Não foi possivel atualizar!')

    })
    it('Deletar DELETE - /motoristas/:id', async () => {
        const id = MOCK_ID
        const result = await app.inject({
            method: 'DELETE',
            url: `/motoristas/${id}`,
            headers
        })
        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)

        assert.ok(statusCode === 200)
        assert.deepStrictEqual(dados.message, 'Motorista removido com sucesso!')
    })

    it('Deletar DELETE - /motoristas/:id não deve remover', async () => {
        const id = `${MOCK_ID}01`
        const result = await app.inject({
            method: 'DELETE',
            url: `/motoristas/${id}`,
            headers
        })
        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)

        assert.ok(statusCode === 412)
        assert.deepStrictEqual(dados.message,'Não encontrado no banco')
    })
    


})


