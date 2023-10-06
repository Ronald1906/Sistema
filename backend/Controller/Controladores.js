const express = require('express');
const router = express.Router();
const conexion = require('../Database/database');
const verifyTokenMiddleware= require('../index')
const bcryptjs= require('bcryptjs')
const jwt= require('jsonwebtoken')

//Metodo para agregar el usuario administrador
router.post('/add_admin', async(req,res)=>{
    try {
        const datos= req.body
        const pwd= await bcryptjs.hash(datos.passw, 10)

        //Consulta de ingreso 
        const consulta= "SELECT * FROM tbl_usuarios WHERE usuario = $1 AND rol = $2"

        //Realizamos la consulta
        const conexion1= await conexion.query(consulta, [datos.usuario, 'admin'])

        if(conexion1.rowCount>0){
            res.send({
                title: '¡Advertencia!',
                icon: 'warning',
                text: 'El usuario ya existe'
            })
        }else{
            //Consultamos las zonas
            const consulta2= await conexion.query("SELECT * FROM tbl_zonas")
            let arrayF=[]
            //Creamos un array con todas las juntas 
            for(let i=0; i<consulta2.rowCount; i++){
                for(let j=0; j<consulta2.rows[i].parroquia.length; j++){
                    for(let k=1; k<=consulta2.rows[i].parroquia[j].juntas_fem; k++){
                        arrayF.push({
                            zona: consulta2.rows[i].zona,
                            parroquia: consulta2.rows[i].parroquia[j].parroquia,
                            junta: k+'F',
                            estado: 'PENDIENTE',
                            jpg_instalacion: '',
                            jpg_votos: '',
                        })
                    }

                    for(let k=1; k<=consulta2.rows[i].parroquia[j].juntas_mas; k++){
                        arrayF.push({
                            zona: consulta2.rows[i].zona,
                            parroquia: consulta2.rows[i].parroquia[j].parroquia,
                            junta: k+'M',
                            estado: 'PENDIENTE',
                            jpg_instalacion: '',
                            jpg_votos: '',
                        })
                    }

                }
            }

            //Insertamos los datos a la base de datos
            const consulta3="INSERT INTO tbl_usuarios (usuario, passwords, rol, juntas) VALUES ($1,$2,$3,$4)"
            await conexion.query(consulta3, [datos.usuario, pwd, "admin", arrayF]).then((result)=>{
                if(result.rowCount>0){
                    res.send({
                        title: '¡Registro Éxitoso!',
                        icon: 'success',
                        text: 'Usuario ingresado'
                    })
                    //En caso de que no se halla ingresado el sistema
                }else{
                    res.send({
                        title: '¡Advertencia!',
                        icon: 'warning',
                        text: 'Existe un error al ingresar al usuario'
                    })
                }
            })
        }

    } catch (error) {
        console.log('Error en UserController en el metodo post: /add_admin: '+ error)
    }
})

//Metodo para agregar los supervisores
router.post('/add_supervisor', async(req,res)=>{
    try {
        const datos= req.body
        const pwd= await bcryptjs.hash(datos.cedula, 10)

        //Consulta para verificar si el usuario ya esta ingresado
        const consulta= "SELECT * FROM tbl_usuarios WHERE usuario = $1 AND rol = $2"

        //Se ejecuta la consulta
        const eje_consulta= await conexion.query(consulta, [datos.cedula, "supervisor"])

        //En caso de que ya exista 
        if(eje_consulta.rowCount>0){
            res.send({
                title:'¡Advertencia!',
                icon: 'warning',
                text: 'El usuario que desea ingresar ya existe'
            })
            //En caso de no que exista
        }else{
            //Consultamos si las juntas ya estan siendo empleadas por otro usuario
            //Creamos una variable en 0 que me servirada de referencia para saber si tiene una junta ya en uso
            let usados=[]

            const consultastring= "SELECT * FROM tbl_usuarios WHERE rol = $1"

            //Creamos la consulta
            const consulta2= await conexion.query(consultastring,['supervisor'])

            //Recorremos los datos con un ciclo for
            for(let i=0; i<consulta2.rowCount; i++){
                //Recorremos los datos de las juntas que se desean asignar 
                for(let j=0; j<datos.juntas.length; j++){
                    //Filtramos en el array juntas de cada usuario para saber si no contiene la zona a ingresar
                    let filtro_junta= consulta2.rows[i].juntas.filter((e)=>e.zona == datos.juntas[j].zona)
                    //Si existe, se agrega al array usados
                    if(filtro_junta.length>0){
                        //Verificamos si esa zona esta ya registrada en el array
                        let filtro_usados= usados.filter((e)=>e == datos.juntas[j].zona)
                        if(filtro_usados.length == 0){
                            usados.push(datos.juntas[j].zona)
                        }
                    }
                }
            }

            //Verificamos si existen zonas ya en uso
            if(usados.length>0){
                res.send({
                    title: '¡Advertencia!',
                    icon: 'warning',
                    text: 'Por favor excluir las siguientes zonas: '+ usados.toString()
                })
            }else{
                //Si no existen zonas ya en uso 
                let arrayF=[]
                //Recorremos los datos para agregar las juntas
                for(let i=0; i<datos.juntas.length; i++){
                    for(let j=0; j<datos.juntas[i].parroquia.length; j++){
                        for(let k=1; k<=datos.juntas[i].parroquia[j].juntas_fem; k++){
                            arrayF.push({
                                zona: datos.juntas[i].zona,
                                parroquia: datos.juntas[i].parroquia[j].parroquia,
                                estado: 'PENDIENTE',
                                jpg_instalacion: '',
                                jpg_votos: '',
                                junta: k+'F'
                            })
                        }
    
                        for(let k=1; k<=datos.juntas[i].parroquia[j].juntas_mas; k++){
                            arrayF.push({
                                zona: datos.juntas[i].zona,
                                parroquia: datos.juntas[i].parroquia[j].parroquia,
                                estado: 'PENDIENTE',
                                jpg_instalacion: '',
                                jpg_votos: '',
                                junta: k+'M'
                            })
                        }
                    }
                }

                //Creamos la consulta para ingresar los datos
                const consulta3= "INSERT INTO tbl_usuarios (cedula, nombres, usuario, passwords, rol, juntas) VALUES($1,$2,$3,$4,$5,$6)"

                await conexion.query(consulta3,[datos.cedula, datos.nombres, datos.cedula,pwd, "supervisor", arrayF ]).then((result)=>{
                    if(result.rowCount>0){
                        res.send({
                            title: '¡Registro Éxitoso!',
                            icon:'success',
                            text: 'Usuario Registrado'
                        })
                    }
                })                
            }
        }
    } catch (error) {
        console.log('Error en Controladores en el metodo post /add_supervisor: '+ error)
    }
})

//Metodo para agregar las zonas
router.post('/add_zona', async(req,res)=>{
    try {
        const datos= req.body.datos

        //Limpiamos la tabla de las zonas
        const limpiar= await conexion.query("DELETE FROM tbl_zonas")
        if(limpiar.rowCount == 0){
            
            for(let i=0; i<datos.length; i++){
                const agregar= "INSERT INTO tbl_zonas (zona, parroquia) VALUES ($1,$2)"
                await conexion.query(agregar,[datos[i].zona, datos[i].parroquia])
            }

            res.send({
                title: '¡Registro Éxitoso!',
                icon: 'success',
                text: 'Zonas ingresadas'
            })
            
        }

    } catch (error) {
        console.log('Error en Controladores en el metodo post /add_evento: '+ error)
    }
})

//Metodo para visualizar las zonas
router.get('/zonas', async(req,res)=>{
    try {
        await conexion.query("SELECT * FROM tbl_zonas").then((result)=>{
            let arrayF=[]
            for(let i=0; i<result.rowCount; i++){
                for(let j=0; j<result.rows[i].parroquia.length; j++){
                    arrayF.push({
                        zona: result.rows[i].zona,
                        parroquia: result.rows[i].parroquia[j].parroquia,
                        juntas_fem: result.rows[i].parroquia[j].juntas_fem,
                        juntas_mas: result.rows[i].parroquia[j].juntas_mas,
                        total_juntas: result.rows[i].parroquia[j].total_juntas,
                    })
                }
            }
            res.send(arrayF)
        })
    } catch (error) {
        console.log('Error en Controladores en el metodo get /zonas: '+ error)
    }
})

//Metodo para visualizar todas las zonas para asignar a los usuarios
router.get('/zonas_user', async(req,res)=>{
    try {
        await conexion.query("SELECT * FROM tbl_zonas").then((result)=>{
            res.send(result.rows)
        })
    } catch (error) {
        console.log('Error en Controladores en el metodo get /zonas_user: '+ error)
    }
})

//Metodo para visualizar todos los usuarios
router.get('/usuarios', async(req,res)=>{
    try {
        //Creamos la consulta
        const consulta1_string= "SELECT * FROM tbl_usuarios WHERE rol = $1"
        //Generamos la consulta
        const consulta1= await conexion.query(consulta1_string, ['supervisor'])

        //Creamos un array que almacenara todos los datos
        let array1=[]

        //Recorremos los usuarios obtenidos
        for(let i=0; i< consulta1.rowCount; i++){
            const nombresDeZona = [...new Set(consulta1.rows[i].juntas.map(item => item.zona))];
            array1.push({
                cedula: consulta1.rows[i].cedula,
                nombres:  consulta1.rows[i].nombres,
                usuario: consulta1.rows[i].usuario,
                zonas: nombresDeZona.toString(),
                juntas: consulta1.rows[i].juntas
            })
        }

        res.send(array1)

    } catch (error) {
        console.log('Error en Controladores en el metodo get /usuarios: '+ error)
    }
})

//Metodo para el login al sistema
router.post('/login', async(req,res)=>{
    try {
        const datos= req.body

        //Creamos la consulta del usuario
        const con1_string= "SELECT * FROM tbl_usuarios WHERE usuario = $1"
        
        //Ejecutamos la consulta
        const consulta1= await conexion.query(con1_string, [datos.usuario])
        if(consulta1.rowCount>0){
            //Verificamos si la contraseña enviada es correcta
            const verificar= await bcryptjs.compare(datos.passw, consulta1.rows[0].passwords)

            //Hacemos una comparacion
            if(consulta1.rows[0].usuario == datos.usuario && verificar == true){
                
                const expiracion = Math.floor(Date.now() / 1000) + (60 * 60 * 24); // 12 horas de expiración

                let objeto={
                    users: consulta1.rows[0].usuario,
                    id_rol: consulta1.rows[0].rol,
                }

                const token= jwt.sign({
                    exp: expiracion,
                    data:objeto
                },process.env.CLVSECRET)

                res.send({token: token, auth: true, expiracion: expiracion})

            }else{
                res.send({
                    title: '¡Advertencia!',
                    icon: 'warning',
                    text: 'El usuario y/o contraseña incorrectos',
                    auth: false
                })
            }

        }else{
            res.send({
                title:'¡Error!',
                icon: 'error',
                text: '¡El usuario ingresado no existe!',
                auth: false
            })
        }
        
    } catch (error) {
        console.log('Error en Controladores en el metodo post: /login: '+ error)
    }
})

//Ruta para obtener el usuario logueado
router.get('/login', verifyTokenMiddleware, async(req,res)=>{
    try {
        res.send({token: req.valtoken, auth: true})
    } catch (error) {
        console.log('Error en UserController en el metodo get /login: '+ error)
    }
})



module.exports = router