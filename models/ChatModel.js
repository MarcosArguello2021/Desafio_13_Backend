import ContenedorMongoDb from "../containers/ContenedorMongoDb.js"
import { Schema } from "mongoose"
class ChatDaoMongo extends ContenedorMongoDb {

    constructor() {
        super('chat', Schema({
            author: {
                id: {
                    type: String,
                    required: true
                },
                nombre: {
                    type: String,
                    required: true
                },
                apellido: {
                    type: String,
                    required: true
                },
                edad: {
                    type: String,
                    required: true
                },
                alias: {
                    type: String,
                    required: true
                },
                avatar: {
                    type: String,
                    required: true
                }
            },
            mensaje: {
                type: String,
                required: true
            }
        }))
    }
}

export default ChatDaoMongo;