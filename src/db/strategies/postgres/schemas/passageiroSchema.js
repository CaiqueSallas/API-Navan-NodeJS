const Sequelize = require('sequelize')
const MotoristaSchema = require('./motoristaSchema')

const passageiroSchema = {
    name: 'passageiros',
    schema: {
        id: {
            type: Sequelize.INTEGER,
            required: true,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: Sequelize.STRING,
            unique: true,
            required: true
        },
        password: {
            type: Sequelize.STRING,
            required: true
        },
        nome: {
            type: Sequelize.STRING,
            required: true
        },
        cpf: {
            type: Sequelize.STRING,
            required: true
        },
        telefone: {
            type: Sequelize.INTEGER,
            required: true
        },
        email: {
            type: Sequelize.STRING,
            required: true
        },
        destino: {
            type: Sequelize.STRING,
            required: true
        },
        presenca: {
            type: Sequelize.BOOLEAN,
        },
        endereco: {
            type: Sequelize.STRING,
            required: true
        },
        id_motorista: {
            //fk na tabela motorista
            type: Sequelize.INTEGER,
            references: { model: 'tb_motoristas', key: 'id' },
            onDelete: 'CASCADE'
        }
    },
    options: {
        tableName: 'TB_PASSAGEIROS',
        freezeTableName: false,
        timestamps: false
    }
}

module.exports = passageiroSchema