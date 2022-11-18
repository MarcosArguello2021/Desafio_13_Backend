import router from './routes/routes.js';
import numerosRouter from './routes/random.js';
import express from 'express';
import { Server as HTTPServer } from 'http';
import { Server as IOServer } from 'socket.io';
import socket from './utils/socket.js';
import { engine } from 'express-handlebars';
import session from './utils/session.js';
import passport from './utils/passport.js';
import {User} from "./models/user.js";
import { auth } from './controllers/userController.js';
// import yargs from 'yargs/yargs';
import {infoProcess} from './utils/info.js';
import cluster from 'cluster';
import os from 'os';
import { config } from 'dotenv'
config()

const numCPUs = os.cpus().length
const modoCluster = process.argv[3] == 'CLUSTER'
const app = express()
const http = new HTTPServer(app)
const io = new IOServer(http)
socket(io);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session);
app.use(passport.initialize())
app.use(passport.session())
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')

app.get('/', auth ,async (req, res) => {
  let idSession = await req.session.passport.user
  let infoUser = await User.findOne({ '_id': idSession })
  const userInfo = infoUser.email;
    if(userInfo){
      res.render('form', {userInfo}); 
    }
    else{ 
      res.render('login')
    }
})

app.get('/info', infoProcess); 
app.use('/api', router);
app.use('/api', numerosRouter);


const PORT = parseInt(process.argv[2]) || process.env.PUERTO
app.set('port', PORT)

if(modoCluster && cluster.isPrimary) {
  console.log(`Número de procesadores: ${numCPUs}`)
  console.log(`PID MASTER ${process.pid}`)
  for(let i=0; i<numCPUs; i++) {
      cluster.fork()
  }
  cluster.on('exit', worker => {
      console.log('Worker', worker.process.pid, 'died', new Date().toLocaleString())
      cluster.fork()
  })
}
else {  
  estadoNgix(process.argv[4])
}

// const args = yargs(process.argv.slice(2))
//     .default('puerto', 8080)
//     .argv
// app.set('port', args.puerto)

// const connectedServer = http.listen(app.get('port'), () => {
//   console.log(`Servidor http con web sockets, escuchando en puerto: ${app.get('port')}`)
// })
// connectedServer.on("error", error => console.log)


function estadoNgix(nginx){
  if(nginx === 'NGINX'){
    if(app.get('port')==8080){
      const appRandom = express()
      appRandom.use('/api/randoms', router)
      appRandom.listen(PORT, err => {
          if(!err) console.log(`Servidor express escuchando en el puerto ${app.get('port')} - PID WORKER ${process.pid}`)
      })  
      appRandom.get('/api/randoms', (req,res) => {
        res.send(`Server en PORT(${app.get('port')}) - PID(${process.pid}) - FYH(${new Date().toLocaleString()})`)
      })          
    }else{
        http.listen(app.get('port'), (err) => {
          if (err) return console.log('error en listen server', err);
          console.log(`Servidor express escuchando en el puerto ${app.get('port')} - PID WORKER ${process.pid}`)
        })  
      }
  }
  if(nginx!=='NGINX'){
    // const port = parseInt(process.argv[2]) || parseInt(process.env.PUERTO)
      http.listen(app.get('port'), (err) => {
        if (err) return console.log('error en listen server', err);
        console.log(`Servidor express escuchando en el puerto ${app.get('port')} - PID WORKER ${process.pid}`)
      })  
    }   

}