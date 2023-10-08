import React, { useEffect, useState } from 'react'
import Sidebar from './components/Sidebar'
import BarListas from './components/BarListas'
import PieListas from './components/PieListas'
import axios from 'axios'

const Dashboard = () => {
  const [Listas, setListas]= useState([])

  useEffect(()=>{
    let token= localStorage.getItem('token_eleccion_2023_app')
    axios.get(process.env.NEXT_PUBLIC_BACKEND+'controller/total_votos',{
      headers:{
        token_eleccion_2023_app: token
      }
    }).then((result)=>{
      setListas(result.data)
    })
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
