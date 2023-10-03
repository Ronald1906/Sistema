import Sidebar from '@/components/Sidebar'
import axios from 'axios'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Dialog } from 'primereact/dialog'
import { InputNumber } from 'primereact/inputnumber'
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'

const votacion = () => {
  const [Votos, setVotos]= useState([])
  const [Totales, setTotales]= useState([])
  const [DlgVotos, setDlgVotos]= useState(false)
  const [JuntaI, setJuntaI]= useState(null)

  const consulta=(()=>{
    axios.get(process.env.NEXT_PUBLIC_BACKEND+'usuarios/votos', {
      headers:{
        token_eleccion_2023_app: localStorage.getItem('token_eleccion_2023_app'),
      }
    }).then((result)=>{
      setVotos(result.data)
    })
  })

  /*useEffect(()=>{
    consulta()
  },[])*/


  const BtnRevision = (rowData) => {
    return (
      <div>
        <Button label='Revision'  className="p-button p-button-success mr-2" onClick={() => IniciaRevision(rowData)}   />
        <Button label='Imagen'  className="p-button p-button mr-2" onClick={() => ImagenRevision(rowData)}   />
      </div>
    )
  }

  const ImagenRevision=(e)=>{
    let dato= e
    let imagen= process.env.NEXT_PUBLIC_IMG_BACK+dato.img_ejecucion
    window.open(imagen)
  }

  const IniciaRevision=(e)=>{
    let dato= e  
    setTotales(dato.votos)
    setJuntaI(dato)
    setDlgVotos(true)
  }

  const onRowEditComplete = (e) => {
    let _products = [...Totales];
    let { newData, index } = e;

    _products[index] = newData;

    setTotales(_products);
  };

  const votosEditor = (options) => {
    return <InputNumber value={options.value} onValueChange={(e) => options.editorCallback(e.value)} />    
  };

  const CDlgVotos=(()=>{
    setDlgVotos(false)
    setJuntaI(null)
    setTotales([])
  })

  const HeaderVotos=(()=>{
    return(
      <Button label='ACTUALIZAR VOTOS' onClick={Actualizar} />
    )
  })

  const Actualizar=(()=>{
    let vacias=0
    for(let i=0; i<Totales.length; i++){
      if(Totales[i].total==='' || Totales[i].total === null){
        vacias+=1
      }
    }
  
    if(vacias >0){
      setDlgVotos(false)
      Swal.fire({
        title: '¡Advertencia!',
        icon: 'warning',
        text: 'Existen listas vacias, ingrese todo los datos'
      }).then((result)=>{
        if(result.isConfirmed){
          setDlgVotos(true)
        }
      })
    }else{
      // Calcula la sumatoria de los valores de los objetos a partir de la posición 1
      const sumatoria = Totales.slice(1).reduce((acumulador, objeto) => {
        const valor = objeto.total; // Obtiene el valor numérico del objeto
        return acumulador + valor;
      }, 0);
  
      let total= Totales[0].total
      
      if(sumatoria === total){
        setDlgVotos(false)
        axios.post(process.env.NEXT_PUBLIC_BACKEND+'usuarios/actualizar_votos',{
          junta: JuntaI,
          votos: Totales
        },{
          headers:{
            token_eleccion_2023_app: localStorage.getItem('token_eleccion_2023_app'),
          }
        }).then((result)=>{
          CDlgVotos()
          consulta()

          
          Swal.fire({
            title: result.data.title,
            icon: result.data.icon,
            text: result.data.text
          })
        })
        
      }else{
        setDlgVotos(false)
        Swal.fire({
          title:'¡Advertencia!',
          icon: 'warning',
          text: 'El valor ingresado como total de votos es: '+total+ ' y el valor de la sumatoria de los votos es: '+ sumatoria
        }).then((result)=>{
          if(result.isConfirmed){
            setDlgVotos(true)
          }
        })
      }

    }
  })

  return (
    <Sidebar>
      <DataTable value={Votos} filterDisplay='row'>
        <Column field='cod_recinto' header='COD RECINTO' filter filterPlaceholder="Buscar código" style={{ minWidth: '8rem' }}  />
        <Column field='nombre_recinto' header='NOMBRE RECINTO' />
        <Column field='num_junta' header='NUM JUNTA' filter filterPlaceholder="Buscar junta" style={{ minWidth: '8rem' }} />
        <Column body={BtnRevision} header='Revision' align='center' exportable={false} style={{minWidth: '8rem' }} />             
      </DataTable>
      <Dialog visible={DlgVotos} onHide={CDlgVotos} header={HeaderVotos}>
        <DataTable value={Totales} editMode="row" onRowEditComplete={onRowEditComplete}>
          <Column field='nombre' header='NOMBRE' />
          <Column field='total' header='TOTAL' editor={(options) => votosEditor(options)} />
          <Column rowEditor headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }} />
        </DataTable>
      </Dialog>
    </Sidebar>
  )
}

export default votacion
