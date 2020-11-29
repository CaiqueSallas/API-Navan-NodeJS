const Sequelize = require('sequelize')

const motoristaSchema = {
    name: 'motoristas',
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
        }        
    },
    options: {
        tableName: 'TB_MOTORISTAS',
        freezeTableName: false,
        timestamps: false
    }
}

module.exports = motoristaSchema

//INSERT INTO public.tb_motoristas(
//	username, password, nome, cpf, telefone, email, foto)
//	VALUES ('TesteFoto','$2b$04$B4Pwfp4SG/m.9CHPDpeWeub0bmzOgyLk7Ly.NSFzU9HzE3q/P8hnS','João','123456789','123456789','carlos@gmail.com','foto'); 
//