import Sidebar from '@/components/Sidebar'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import BarListas from '@/components/BarListas';
import { useRouter } from 'next/router';


const Dashboard = () => {

  const router= useRouter()

  const [Listas, setListas] = useState([]);


  /*useEffect(()=>{
    axios.get(process.env.NEXT_PUBLIC_BACKEND+'usuarios/login',{
      headers:{
        token_eleccion_2023_app: localStorage.getItem('token_eleccion_2023_app')
      }
    }).then((result)=>{
      if(result.data.token.data.id_rol !== 1){
        router.push('/')
      }
    })
  },[router])*/

  /*useEffect(()=>{
    const consulta=(()=>{

      axios.get(process.env.NEXT_PUBLIC_BACKEND+'registros/totales',{
        headers:{
          token_eleccion_2023_app: localStorage.getItem('token_eleccion_2023_app')
        }
      }).then((result)=>{
        const datos=result.data
        const ordenado= datos.sort((a,b)=>b.total - a.total)
        setListas(ordenado)
        console.log(ordenado)
      })
    })

    consulta()

    // Configurar el intervalo para obtener los datos cada 5 minutos
    const interval = setInterval(consulta, 5* 60 * 1000);

    // Limpieza del intervalo cuando se desmonte el componente
    return () => clearInterval(interval);

  },[])*/

  return (
    <Sidebar>
      <h2>Dashboard</h2>
      <div>
        <h2 style={{color:'navy'}}>TOTAL DE VOTOS</h2>
        <BarListas data={Listas} />
      </div>
    </Sidebar>
  )
}

export default Dashboard
