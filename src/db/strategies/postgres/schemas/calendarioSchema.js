const Sequelize = require('sequelize')
const PassageiroSchema = require('./passageiroSchema')

const calendarioSchema = {
    name: 'calendario',
    schema: {
        id: {
            type: Sequelize.INTEGER,
            required: true,
            primaryKey: true,
            autoIncrement: true
        },
        presenca: {
            type: Sequelize.BOOLEAN,
            required: true,
        },
        date: {
            type: Sequelize.DATEONLY,
            required: true
        },
        id_passageiro: {
            //fk na tabela passageiro
            type: Sequelize.INTEGER,
            references: { model: 'tb_passageiros', key: 'id' },
            onDelete: 'CASCADE'
        }
    },
    options: {
        tableName: 'tb_calendario',
        freezeTableName: false,
        timestamps: false
    }
}

module.exports = calendarioSchema