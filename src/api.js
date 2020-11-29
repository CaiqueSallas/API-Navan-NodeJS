// npm i hapi
// npm i vision inert hapi-swagger
// "hapi-swagger": "^9.1.3", "inert": "^5.1.3", "vision": "^5.4.4"
// npm i hapi-auth-jwt2

// npm i bcrypt
const { config } = require('dotenv')
const { join } = require('path')
const { ok } = require('assert')

const env = process.env.NODE_ENV || "dev"
ok(env === "prod" || env == "dev", "a env é invalida, ou dev ou prod")

const configPath = join(__dirname, './../config', `.env.${env}`)
config({
    path: configPath
})

const Hapi = require('hapi')
const Postgres = require('./db/strategies/postgres/postgres')
const MotoristaSchema = require('./db/strategies/postgres/schemas/motoristaSchema')
const PassageiroSchema = require('./db/strategies/postgres/schemas/passageiroSchema')
const CalendarioSchema = require('./db/strategies/postgres/schemas/calendarioSchema')
const Context = require('./db/strategies/base/contextStrategy')
const MotoristaRoute = require('./routes/motoristaRoute')
const PassageiroRoute = require('./routes/passageiroRoute')
const CalendarioRoute = require('./routes/calendarioRoute')
const AuthMotoristaRoutes = require('./routes/authMotoristaRoutes')
const AuthPassageiroRoutes = require('./routes/authPassageiroRoutes')


const HapiSwagger = require('hapi-swagger')
const Vision = require('vision')
const Inert = require('inert')
const HapiJwt = require('hapi-auth-jwt2')

const MINHA_CHAVE_SECRETA = process.env.JWT_KEY 

const swaggerOptions = {
    info: {
        title: 'API Navan',
        version: 'v1.0'
    }
}

const app = new Hapi.Server({
    port: process.env.PORT,
    routes: {
        cors: true
    }
})

function mapRoutes(instance, methods) {
    return methods.map(method => instance[method]())
}



let contextPassageiro = {}
let contextMotorista = {}
let contextCalendario = {}
async function main() {
    const connection = await Postgres.connect()
    const modelMotorista = await Postgres.defineModel(connection, MotoristaSchema)
    const modelPassageiro = await Postgres.defineModel(connection, PassageiroSchema)   
    const modelCalendario = await Postgres.defineModel(connection, CalendarioSchema) 
    contextMotorista = new Context(new Postgres(connection,modelMotorista))
    contextPassageiro = new Context(new Postgres(connection,modelPassageiro))
    contextCalendario = new Context(new Postgres(connection,modelCalendario))

    await app.register([
        HapiJwt,
        Vision,
        Inert,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
    ])
    app.auth.strategy('jwt', 'jwt', {
        key: MINHA_CHAVE_SECRETA,
        // options: {
        //     expiresIn: 20
        // },
        validate: async (dado, request) => {
            const [result] = await contextMotorista.read({
                username: dado.username.toLowerCase()
            })
            if(!result) {
                const [result2] = await contextPassageiro.read({
                    username: dado.username.toLowerCase()
                })
                if(!result2) {
                  return{
                      isValid: false
                  }
                }else{
                    return {
                        isValid: true
                    }
                }
            }else{
                return {
                    isValid: true
                }
            }
        }
    })
    
    app.auth.default('jwt')
    app.route([
        ...mapRoutes(new MotoristaRoute(contextMotorista), MotoristaRoute.methods()),
        ...mapRoutes(new PassageiroRoute(contextPassageiro), PassageiroRoute.methods()),
        ...mapRoutes(new CalendarioRoute(contextCalendario), CalendarioRoute.methods()),
        ...mapRoutes(new AuthMotoristaRoutes(MINHA_CHAVE_SECRETA, contextMotorista), AuthMotoristaRoutes.methods()),
        ...mapRoutes(new AuthPassageiroRoutes(MINHA_CHAVE_SECRETA, contextPassageiro), AuthPassageiroRoutes.methods())
    ]
    )

    await app.start()
    console.log('Servidor rodando na porta: ' + app.info.port)

    return app;
}

module.exports = main()