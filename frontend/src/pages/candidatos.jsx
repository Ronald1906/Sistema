import React, { useEffect, useState } from 'react'
import Sidebar from './components/Sidebar'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import axios from 'axios'

const candidatos = () => {
  const [Datos, setDatos]= useState([])

  useEffect(()=>{
    let token= localStorage.getItem('token_eleccion_2023_app')
    
    axios.get(process.env.NEXT_PUBLIC_BACKEND+'controller/candidatos',{
      headers:{
        token_eleccion_2023_app: token
      }
    }).then((result)=>{
      setDatos(result.data)
    })
  },[])

  return (
    <Sidebar>
      <DataTable value={Datos} header={<h2>CANDIDATOS</h2>}>
        <Column field='lista' header='Lista' align='center' />
        <Column field='num_lista' header='Número de Lista' align='center' />
        <Column field='candidato' header='Candidato' align='center' />
      </DataTable>
    </Sidebar>
  )
}

export default candidatos
