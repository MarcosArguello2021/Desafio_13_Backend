import session from "express-session"
import MongoStore from 'connect-mongo'
import config from '../config.js'

export default session({
    store: MongoStore.create({ 
        mongoUrl: config.mongodb.cnxStr,
        mongoOptions: config.mongodb.options
    }),
    secret: 'shhhhhhhhhh',
    resave: false ,
    saveUninitialized: false,
    rolling: true,
    cookie: {
        maxAge: 600000
    }
})