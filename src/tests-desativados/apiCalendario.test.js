const assert = require('assert')
const api = require('../api')
let app={}

describe('Suite de testes da API motoristas', function () {
    this.beforeAll(async() => {        
        app = await api
        MOCK_ID = 1
    })

    it('Agendar uma data' , async () => {
        const id = MOCK_ID
        const expected = {
            date: 2020-11-28,
            presenca: false,
            id_passageiro: 4
        }
        const result = await app.inject({
            method: 'POST',
            url: `/registerCalendario`,
            payload: JSON.stringify(expected),
        })
        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)

        assert.ok(statusCode, 200)
        assert.deepStrictEqual(dados.message,'Data agendada com sucesso')

    })

    })