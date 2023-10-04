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
                            junta: k+'F'
                        })
                    }

                    for(let k=1; k<=consulta2.rows[i].parroquia[j].juntas_mas; k++){
                        arrayF.push({
                            zona: consulta2.rows[i].zona,
                            parroquia: consulta2.rows[i].parroquia[j].parroquia,
                            junta: k+'M'
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
            //Recorremos las juntas enviadas
            for(let i=0; i<datos.juntas.length; i++){
                //Creamos la consulta
                const consulta2 = 'SELECT * FROM tbl_usuarios WHERE EXISTS (SELECT 1 FROM jsonb_array_elements(juntas) AS junta WHERE junta->>"zona" = $1)';
                
                //Ejecutamos la consulta
                let zonaParametro = { zona:datos.juntas[i].zona };
                const eje_consulta2= await conexion.query(consulta2,[datos.juntas[i].zona])
                
                if(eje_consulta2.rowCount>0){
                    usados.push(datos.juntas[i].zona)
                }
            }

            if(usados.length>0){
                res.send({
                    title: '¡Advertencia!',
                    icon: 'warning',
                    text: 'Por favor excluir las siguientes zonas: '+ usados.toString()
                })
            }else{
                let arrayF=[]
                //Recorremos los datos para agregar las juntas
                for(let i=0; i<datos.juntas.length; i++){
                    for(let j=0; j<datos.juntas[i].parroquia.length; j++){
                        arrayF.push({
                            zona: datos.juntas[i].zona,
                            parroquia: datos.juntas[i].parroquia[j].parroquia,
                            juntas_fem: datos.juntas[i].parroquia[j].juntas_fem,
                            juntas_mas: datos.juntas[i].parroquia[j].juntas_mas,
                            total_juntas: datos.juntas[i].parroquia[j].total_juntas,
                        })
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
                    }else{
                        console.log(result.rows)
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

//Metodo para revisar los usuarios
router.get('/usuarios', async(req,res)=>{
    try {
        await conexion.query("SELECT * FROM tbl_usuarios").then((result)=>{
            res.send(result.rows)
        })
    } catch (error) {
        console.log('Error en Contoladores en el metodo get /usuarios: '+ error)
    }
})


module.exports = router