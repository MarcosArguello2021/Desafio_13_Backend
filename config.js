import { config } from 'dotenv'

config()

const { MONGO_USER, 
        MONGO_PASS,
        MONGO_CLUSTER, 
        GOOGLE_APPLICATION_CREDENTIALS 
    } = process.env


export default {
    fileSystem: {
        path: './DB/'
    },
    mongodb: {
        cnxStr: `mongodb+srv://${MONGO_USER}:${encodeURIComponent(MONGO_PASS)}${MONGO_CLUSTER}`,
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    },
    firebase: GOOGLE_APPLICATION_CREDENTIALS
}
