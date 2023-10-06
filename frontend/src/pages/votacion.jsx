import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import React, { useState } from 'react'

const Votacion = () => {
  
  const [Datos, setDatos]= useState([])
  
  const BtnRevision = (rowData) => {
    return (
      <div>
        <Button label='Revision'  className="p-button p-button-success mr-2" onClick={() => IniciaRevision(rowData)}   />
        <Button label='Imagen'  className="p-button p-button mr-2" onClick={() => ImagenRevision(rowData)}   />
      </div>
    )
  }

  return (
    <div>
      <DataTable value={Datos} paginator 
      stripedRows rows={10} >
        <Column field=''  header='ZONA' alignHeader='center' />
        <Column field=''  header='PARROQUIA' alignHeader='center' />
        <Column field=''  header='JUNTA' alignHeader='center' />
        <Column field=''  header='ESTADO' alignHeader='center' />
        <Column body={BtnRevision} header='Revision' align='center' exportable={false} style={{minWidth: '8rem' }} />             
      </DataTable>
    </div>
  )
}

export default Votacion
