import React, { useEffect, useState } from 'react'
import Sidebar from './components/Sidebar'
import BarListas from './components/BarListas'
import PieListas from './components/PieListas'
import axios from 'axios'

const Dashboard = () => {
  const [Listas, setListas]= useState([])

  useEffect(()=>{
    const consulta=(()=>{
      let token= localStorage.getItem('token_eleccion_2023_app')
      axios.get(process.env.NEXT_PUBLIC_BACKEND+'controller/total_votos',{
        headers:{
          token_eleccion_2023_app: token
        }
      }).then((result)=>{
        setListas(result.data)
      })
    })

    consulta()

    // Configurar el intervalo para obtener los datos cada 5 minutos
    const interval = setInterval(consulta, 5* 60 * 1000);

    // Limpieza del intervalo cuando se desmonte el componente
    return () => clearInterval(interval);


  },[])

  return (
    <Sidebar>
      <div>
        <h2 style={{color:'navy'}}>GRAFICA DE BARRAS </h2>
        <BarListas data={Listas} />
      </div>
      <div>
        <h2 style={{color:'navy'}}>GRAFICA DE PASTEL</h2>
        <PieListas data={Listas} />
      </div>
    </Sidebar>
  )
}

export default Dashboard
