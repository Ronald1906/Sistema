import Sidebar from '@/components/Sidebar'
import { Button } from 'primereact/button'
import { DataTable } from 'primereact/datatable'
import React, { useEffect, useState } from 'react'
import styles from '@/styles/Home.module.css'
import { InputText } from 'primereact/inputtext'
import { Dialog } from 'primereact/dialog'

const Registro_zona = () => {

  const [DlgRegister, setDlgRegister]= useState(false)

  const HeaderTable=(()=>{
    return(
      <div className={styles.headerstable}>
        <h2>Registro de Recintos</h2>
        <Button label='Registrar' onClick={()=>{setDlgRegister(true)}} />
      </div>
    )
  })  

  const CDlgRegister=(()=>{

  })

  const RegistrarDatos=(e)=>{
    e.preventDefault()
  }

  return (
    <Sidebar>
      <DataTable header={HeaderTable}>

      </DataTable>
      {/* Dialogo para registrar las zonas */}
      <Dialog visible={DlgRegister} onHide={CDlgRegister} style={{width:'auto'}} 
      header='Registro de Recintos'>
        <form className={styles.registros} onSubmit={RegistrarDatos}> 
          <InputText type='file' className={styles.filesinp} onChange={(e)=>handleFile(e)} />
          <Button label='Registrar' />
        </form>
      </Dialog>
    </Sidebar>
  )
}

export default Registro_zona
