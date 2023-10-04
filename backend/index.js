const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken')
const cors = require('cors')
const pool= require('./Database/database')
const dotenv = require('dotenv')

app.use(express.json())

//Seteando las variables de entorno
dotenv.config({path: './Env/.env'})

app.use('/recursos', express.static('public'))
app.use('/recursos', express.static(__dirname+'/public'))

//Seteando las cookies
app.use(bodyParser.json({limit: "50mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true}))

app.use(cors({
  origin:['http://localhost:7000'], //Direccion de origen de donde provienen las peticiones
  methods: ['GET', 'POST'],
  credentials: true
}))

//Creamos un middleware para la validacion del token
const verifyTokenMiddleware = (req, res, next) => {
  const token = req.headers['token_eleccion_2023_app'];
  if (token) {
    jwt.verify(token, process.env.CLVSECRET, (err, decoded) => {
      if (err) {
        res.send({ auth: false, message: 'Fallo al autenticar el token' });
      } else {
        let objeto = {
          exp: decoded.exp,
          data: decoded.data
        };
        req.valtoken = objeto;
        next();
      }
    });
  }
};

module.exports = verifyTokenMiddleware

//Creamos las rutas para los controladores
const controladorRouter= require('./Controller/Controladores')
app.use('/controller', controladorRouter)

//Verificamos si existe conexion a la base de datos e inicializamos el server
pool.connect((error, client, release) => {
    if (error) {
      console.error('Error al conectar a la base de datos:', error);
      return;
    }else{
      console.log('Conexion exitosa ')
      release()
      //estableciendo el puerto con el que trabajara nodejs
      let puerto_api=process.env.PUERTO_API
      app.listen(puerto_api,()=>{
        console.log('Servidor iniciado en:'+process.env.IPBACK+puerto_api)
      })
    }
});
