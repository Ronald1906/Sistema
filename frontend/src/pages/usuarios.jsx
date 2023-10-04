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

const Usuarios = () => {

  const [InpCedula, setInpCedula]= useState('')
  const [InpNombres, setInpNombres]= useState('')
  const [DrpZonas, setDrpZonas]= useState([])
  const [DlgAddUser, setDlgAddUser]= useState(false)
  const [SlcZonas, setSlcZonas]= useState()

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

  useEffect(()=>{
    axios.get(process.env.NEXT_PUBLIC_BACKEND+'controller/zonas_user').then((result)=>{
      console.log(result.data)
      setDrpZonas(result.data)
    })
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
        Swal.fire({
          title: result.data.title,
          icon: result.data.icon,
          text: result.data.text
        })
      }
    })
  }

  return (
    <div>
      <DataTable header={HeaderTable}>

      </DataTable>
      <Dialog visible={DlgAddUser} onHide={CDlgAddUser} header='REGISTRO DE USUARIOS'>
        <form className={styles.registros} onSubmit={Registrar} >
          <InputText placeholder='Cedula' value={InpCedula} onChange={(e)=>{setInpCedula(e.target.value)}} />
          <InputText placeholder='Nombres' value={InpNombres} onChange={(e)=>{setInpNombres(e.target.value)}} />
          <MultiSelect placeholder='Seleccione la zonas' style={{marginBottom:'10px'}} options={DrpZonas} value={SlcZonas} onChange={(e)=>{setSlcZonas(e.value)}} optionLabel='zona'/>
          <Button label='REGISTRAR' />
        </form>
      </Dialog>
    </div>
  )
}

export default Usuarios
