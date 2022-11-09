import { Router } from "express";
const numerosRouter = Router();
import path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
import { fork } from 'child_process'

numerosRouter.get('/:cant?', (req, res) => {
    const cant = req.query.cant || 100000000
    const numerosRandom = fork(path.resolve(__dirname, '../utils/random.js'))
    numerosRandom.send(cant)
    numerosRandom.on('message', obj => {
        res.send(obj)
    })
})

export default numerosRouter;