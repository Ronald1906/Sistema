import React, { useEffect, useState } from 'react'
import {DataTable} from 'primereact/datatable'
import styles from '@/styles/Home.module.css'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import axios from 'axios'
import { MultiSelect } from 'primereact/multiselect'
import Swal from 'sweetalert2'
import { Column } from 'primereact/column'
import Sidebar from './components/Sidebar'

const Usuarios = () => {

  const [InpCedula, setInpCedula]= useState('')
  const [InpNombres, setInpNombres]= useState('')
  const [DrpZonas, setDrpZonas]= useState([])
  const [DlgAddUser, setDlgAddUser]= useState(false)
  const [DlgDetalles, setDlgDetalles]= useState(false)
  const [SlcZonas, setSlcZonas]= useState()
  const [Datos, setDatos]= useState([])
  const [Detalles, setDetalles]= useState([])

  const HeaderTable=(()=>{
    return(
      <div>
        <Button label='AGREGAR' onClick={()=>{setDlgAddUser(true)}} />
      </div>
    )
  })

  const CDlgAddUser=(()=>{
    setDlgAddUser(false)
    setInpCedula('')
    setInpNombres('')
  })

  const consulta=(()=>{
    axios.get(process.env.NEXT_PUBLIC_BACKEND+'controller/usuarios').then((result)=>{
      setDatos(result.data)
    })
  })

  useEffect(()=>{
    axios.get(process.env.NEXT_PUBLIC_BACKEND+'controller/zonas_user').then((result)=>{
      setDrpZonas(result.data)
    })
    consulta()
  },[])

  const Registrar=(e)=>{
    e.preventDefault()
    axios.post(process.env.NEXT_PUBLIC_BACKEND+'controller/add_supervisor',{
      cedula: InpCedula,
      nombres: InpNombres,
      juntas: SlcZonas
    }).then((result)=>{
      if(result.data.icon=='warning'){
        setDlgAddUser(false)
        Swal.fire({
          title: result.data.title,
          icon: result.data.icon,
          text: result.data.text
        }).then((result)=>{
          if(result.isConfirmed){
            setDlgAddUser(true)
          }
        })
      }else{
        CDlgAddUser()
        consulta()
        Swal.fire({
          title: result.data.title,
          icon: result.data.icon,
          text: result.data.text
        })
      }
    })
  }

  const BtnRevision = (rowData) => {
    return (
      <div>
        <Button label='Revision'  className="p-button p-button-success mr-2" onClick={() => ViewDetalles(rowData)}   />
      </div>
    )
  }

  const ViewDetalles=(e)=>{
    let dato=e
    setDetalles(dato.juntas)
    setDlgDetalles(true)
  }

  const CDlgDetalles=(()=>{
    setDlgDetalles(false)
    setDetalles([])
  })

  return (
    <Sidebar>
      <DataTable header={HeaderTable} value={Datos} paginator 
      stripedRows rows={10}>
        <Column field='cedula' header='CÉDULA' alignHeader='center'  />
        <Column field='nombres' header='NOMBRES' alignHeader='center'  />
        <Column field='usuario' header='USUARIOS' alignHeader='center'  />
        <Column field='zonas' header='ZONAS' alignHeader='center'  />
        <Column body={BtnRevision} header='DETALLES' align='center' exportable={false} style={{minWidth: '8rem' }} />             
      </DataTable>
      <Dialog visible={DlgAddUser} onHide={CDlgAddUser} header='REGISTRO DE USUARIOS'
      style={{maxWidth:'40%', minWidth:'30%'}}>
        <form className={styles.registros} onSubmit={Registrar} >
          <InputText placeholder='Cedula' value={InpCedula} onChange={(e)=>{setInpCedula(e.target.value)}} />
          <InputText placeholder='Nombres' value={InpNombres} onChange={(e)=>{setInpNombres(e.target.value)}} />
          <MultiSelect placeholder='Seleccione la zonas' style={{marginBottom:'10px'}} options={DrpZonas} value={SlcZonas} onChange={(e)=>{setSlcZonas(e.value)}} optionLabel='zona'/>
          <Button label='REGISTRAR' />
        </form>
      </Dialog>
      <Dialog visible={DlgDetalles} onHide={CDlgDetalles} style={{width:'70%'}} 
      header='DETALLE DE LAS JUNTAS'>
        <DataTable value={Detalles} paginator stripedRows rows={7}>
          <Column field='zona' header='ZONA' align='center' />
          <Column field='parroquia' header='PARROQUIA' align='center' />
          <Column field='junta' header='JUNTA' align='center' />
          <Column field='estado' header='ESTADO' align='center' />
        </DataTable>
      </Dialog>
    </Sidebar>
  )
}

export default Usuarios
