const express = require('express');
const router = express.Router();
const conexion = require('../Database/database');
const verifyTokenMiddleware= require('../index')

//Metodo para agregar el usuario administrador
router.post('/add_admin', async(req,res)=>{
    try {
        const datos= req.body

        //Consulta de ingreso 
        const consulta= "SELECT * FROM tbl_usuarios"
        await conexion.query()

    } catch (error) {
        console.log('Error en UserController en el metodo post: /add_admin: '+ error)
    }
})

//Metodo para agregar una eleccion
router.post('/add_evento', async(req,res)=>{
    try {
        const datos= req.body

        //Consulta para averiguar si no existe un evento ya registrado 
        const consulta1= "SELECT * FROM tbl_elecciones WHERE nombre_eleccion = $1"

        //Procedemos a registrar
        try {
            await conexion.query(consulta1,[datos.nombre]).then((result)=>{
                console.log(result.rows)
            })

        } catch (error) {
            console.log('Error al intentar hacer la consulta de si existe el nombre del evento')
        }

    } catch (error) {
        console.log('Error en Controladores en el metodo post /add_evento: '+ error)
    }
})

module.exports = router