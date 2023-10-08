import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import React, { useEffect, useState } from 'react'
import Sidebar from './components/Sidebar'
import axios from 'axios'
import { Dialog } from 'primereact/dialog'
import { InputNumber } from 'primereact/inputnumber'

const Votacion = () => {
  
  const [Datos, setDatos]= useState([])
  const [DlgVotacion, setDlgVotacion]= useState(false)
  const [Listas, setListas]= useState([])
  const [TituloJ, setTituloJ]= useState('')

  useEffect(()=>{
    let token= localStorage.getItem('token_eleccion_2023_app')
    axios.get(process.env.NEXT_PUBLIC_BACKEND+'controller/revision',{
      headers:{
        token_eleccion_2023_app: token
      }
    }).then((result)=>{
      setDatos(result.data)
    })
  },[])
  
  const BtnRevision = (rowData) => {
    return (
      <div style={{display:'flex', flexDirection:'column'}}>
        <Button label='Revision'  className="p-button p-button-success mr-2" onClick={() => IniciaRevision(rowData)}  style={{marginBottom:'5px'}}  />
        <Button label='Imagen'  className="p-button p-button mr-2" onClick={() => ImagenRevision(rowData)}   />
      </div>
    )
  }

  const IniciaRevision=(e)=>{
    let dato= e
    setListas(dato.votos)
    setDlgVotacion(true)
    setTituloJ('Zona: '+ dato.zona+ ', Parroquia: '+ dato.parroquia+', Junta: '+dato.junta)
  }

  const ImagenRevision=(e)=>{
    let dato = e
    let imagen= process.env.NEXT_PUBLIC_IMG_BACK+dato.img_jpg
    window.open(imagen)
  }

  const CDlgVotacion=(()=>{
    setDlgVotacion(false)
  })

  const onRowEditComplete = (e) => {
    let _products = [...Listas];
    let { newData, index } = e;

    _products[index] = newData;

    setListas(_products);
  };

  const votosEditor = (options) => {
    return <InputNumber value={options.value} onValueChange={(e) => options.editorCallback(e.value)} />    
  };

  return (
    <Sidebar>
      <DataTable value={Datos} paginator 
      stripedRows rows={10} >
        <Column field='zona'  header='ZONA' align='center' />
        <Column field='parroquia'  header='PARROQUIA' align='center' />
        <Column field='junta'  header='JUNTA' align='center' />
        <Column body={BtnRevision} header='Revision' align='center' exportable={false} style={{minWidth: '8rem' }} />             
      </DataTable>
      {/* Dialogo para revisar los valores de los sufragios */}
      <Dialog visible={DlgVotacion} onHide={CDlgVotacion} style={{minWidth:'40%'}} header={<h2> {TituloJ} </h2>}>
        <DataTable value={Listas}  editMode="row" onRowEditComplete={onRowEditComplete} >
          <Column field='nombre' header='Listas' alignHeader='center' />
          <Column field='total' header='Votos' editor={(options) => votosEditor(options)} align='center' />
          <Column rowEditor headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }} />
        </DataTable>
      </Dialog>
    </Sidebar>
  )
}

export default Votacion
