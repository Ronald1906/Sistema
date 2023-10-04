const express = require('express');
const router = express.Router();
const conexion = require('../Database/database');
const verifyTokenMiddleware= require('../index')
const bcryptjs= require('bcryptjs')

//Metodo para agregar el usuario administrador
router.post('/add_admin', async(req,res)=>{
    try {
        const datos= req.body
        const pwd= await bcryptjs.hash(datos.passw, 10)

        //Consulta de ingreso 
        const consulta= "SELECT * FROM tbl_usuarios WHERE usuario = $1 AND rol = $2"

        //Verificamos si no existe un usuario ya registrado
        await conexion.query(consulta, [datos.usuario, "admin"]).then((result)=>{
            if(result.rowCount>0){
                res.send({
                    title: '¡Advertencia!',
                    icon: 'warning',
                    text: 'El usuario ya existe'
                })
            }else{
                //Creamos la consulta para la insercion 
                const consulta2="INSERT INTO tbl_usuarios (usuario, passwords, rol) VALUES ($1,$2,$3)"
                //Realizamos el ingreso 
                conexion.query(consulta2, [datos.usuario, pwd, "admin"]).then((result)=>{
                    //Verificamos si se ingreso el usuario
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
        })

    } catch (error) {
        console.log('Error en UserController en el metodo post: /add_admin: '+ error)
    }
})

//Metodo para agregar los supervisores
router.post('/add_supervisor', async(req,res)=>{
    try {
        const datos= req.body
        const pwd= await bcryptjs.hash(datos.cedula, 10)

        //Consulta de ingreso 
        const consulta= "SELECT * FROM tbl_usuarios WHERE usuario = $1 AND rol = $2"

        //Verificamos si no existe un usuario ya registrado
        await conexion.query(consulta, [datos.usuario, "supervisor"]).then((result)=>{
            if(result.rowCount>0){
                res.send({
                    title: '¡Advertencia!',
                    icon: 'warning',
                    text: 'El usuario ya existe'
                })
            }else{
                //Creamos la consulta para la insercion 
                const consulta2="INSERT INTO tbl_usuarios (cedula, nombres, usuario, passwords, rol) VALUES ($1,$2,$3,$4,$5)"
                //Realizamos el ingreso 
                conexion.query(consulta2, [datos.usuario, pwd, "supervisor"]).then((result)=>{
                    //Verificamos si se ingreso el usuario
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
        })


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

module.exports = router