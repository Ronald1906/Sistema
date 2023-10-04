import { Button } from 'primereact/button'
import { DataTable } from 'primereact/datatable'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import React, { useEffect, useState } from 'react'
import styles from '@/styles/Home.module.css'
import * as XLSX from 'xlsx'
import axios from 'axios'
import Swal from 'sweetalert2'
import { Column } from 'primereact/column'

const zonas = () => {
  const [DlgAddZ, setDlgAddZ]= useState(false)
  const [InpFile, setInpFile]= useState([])
  const [Datos, setDatos]= useState([])

  const consulta=(()=>{
    axios.get(process.env.NEXT_PUBLIC_BACKEND+'controller/zonas').then((result)=>{
      setDatos(result.data)
    })
  })

  useEffect(()=>{
    consulta()
  },[])

  const HeaderTable=(()=>{
    return(
      <div>
        <Button label='REGISTRAR' onClick={()=>{setDlgAddZ(true)}} />
      </div>
    )
  })

  const CDlgAddZ=(()=>{
    setDlgAddZ(false)
    setInpFile([])
  })
  
  const handleFile=async(e)=>{
    const file =e.target.files[0] 
    const data= await file.arrayBuffer()
    const workbook = XLSX.read(data)
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]
    

    //Se obtiene todos los datos del excel
    const jsonData = XLSX.utils.sheet_to_json(worksheet,{header:1})
  
    jsonData.shift()

    let arrayD=[]

    for(let i=0; i<jsonData.length;i++){
      arrayD.push({
        parroquia: jsonData[i][0].trim(),
        zona: jsonData[i][1].trim(),
        juntas_fem: jsonData[i][3],
        juntas_mas: jsonData[i][4],
        total_juntas: jsonData[i][5]
      })
    }

    const nombresDeZona = [...new Set(arrayD.map(item => item.zona))];

    let arrayFinal=[]

    for(let i=0; i<nombresDeZona.length; i++){
      let filtrozona= arrayD.filter((e)=>e.zona == nombresDeZona[i])
      let array_parroquia=[]
      for(let j=0; j<filtrozona.length; j++){
        array_parroquia.push({
          parroquia: filtrozona[j].parroquia,
          juntas_fem: filtrozona[j].juntas_fem,
          juntas_mas: filtrozona[j].juntas_mas,
          total_juntas: filtrozona[j].total_juntas
        })
      }
      arrayFinal.push({
        zona: nombresDeZona[i],
        parroquia: array_parroquia
      })
    }
    setInpFile(arrayFinal)
  }

  const RegistrarZonas=(e)=>{
    e.preventDefault()
    axios.post(process.env.NEXT_PUBLIC_BACKEND+'controller/add_zona',{
      datos: InpFile
    }).then((result)=>{
      CDlgAddZ()
      consulta()
      Swal.fire({
        title: result.data.title,
        icon: result.data.icon,
        text: result.data.text
      })
    })
  }


  return (
    <div>
      <DataTable header={HeaderTable} value={Datos} paginator 
      stripedRows rows={10} >
        <Column field='zona' header='ZONA' />
        <Column field='parroquia' header='PARROQUIA' />
        <Column field='juntas_fem' header='JUNTAS FEM' />
        <Column field='juntas_mas' header='JUNTAS MAS' />
        <Column field='total_juntas' header='TOTAL' />
      </DataTable>
      <Dialog visible={DlgAddZ} onHide={CDlgAddZ} header='REGISTRO DE ZONAS' >
        <form className={styles.registros} onSubmit={RegistrarZonas} > 
          <InputText type='file' onChange={(e)=>handleFile(e)} />
          <Button label='Registra' />
        </form>
      </Dialog>
    </div>
  )
}

export default zonas
