const ContextStrategy = require('./db/strategies/base/contextStrategy')
const Postgres = require('./db/strategies/postgres/postgres')

const contextPostgres = new ContextStrategy(new Postgres())
contextPostgres.create()

