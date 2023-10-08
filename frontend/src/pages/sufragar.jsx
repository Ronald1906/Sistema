import React, { useState } from 'react'
import Sidebar from './components/Sidebar'
import { DataTable } from 'primereact/datatable'
import { useEffect } from 'react'
import axios from 'axios'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'
import { Dialog } from 'primereact/dialog'
import { InputNumber } from 'primereact/inputnumber'
import { FileUpload } from 'primereact/fileupload'
import Swal from 'sweetalert2'

const Sufragar = () => {
  const [Datos, setDatos]= useState([])
  const [Zonas, setZonas]= useState([])
  const [DlgVotacion, setDlgVotacion]= useState(false)
  const [DlgImgV, setDlgImgV]= useState(false)
  const [Listas, setListas]= useState([])
  const [TituloJ, setTituloJ]= useState('')
  const [Usuario, setUsuario]= useState('')
  const [Junta, setJunta]= useState([])

  const consulta_user=(user)=>{
    let token= localStorage.getItem('token_eleccion_2023_app')
    axios.post(process.env.NEXT_PUBLIC_BACKEND+'controller/zonas_user',{
      users: user
    },{
      headers:{
        token_eleccion_2023_app: token
      }
    }).then((results)=>{
      setDatos(results.data.juntas)
      setZonas(results.data.zonas)
    })
  }
  
  useEffect(()=>{
    let token= localStorage.getItem('token_eleccion_2023_app')
    
    axios.get(process.env.NEXT_PUBLIC_BACKEND+'controller/login',{
      headers:{
        token_eleccion_2023_app: token
      }
    }).then((result)=>{
      let user= result.data.token.data.users
      setUsuario(result.data.token.data.users)
      consulta_user(user)
      
    })
  },[])  
  
  const BtnRevision = (rowData) => {
    return (
      <div>
        <Button label='VOTAR'  className="p-button p-button-success mr-2" onClick={() => IniciarVotacion(rowData)}  />
      </div>
    )
  }

  const  consulta=(()=>{
    let token= localStorage.getItem('token_eleccion_2023_app')
    axios.get(process.env.NEXT_PUBLIC_BACKEND + 'controller/realizar_acta',{
      headers:{
        token_eleccion_2023_app: token
      }
    }).then((result)=>{
        setListas(result.data)
    })
  })

  const IniciarVotacion=(e)=>{
    let dato= e
      if(dato.estado == 'PENDIENTE'){
        consulta()
        setDlgVotacion(true)
        setTituloJ('Zona: '+ dato.zona+ ', Parroquia: '+ dato.parroquia+', Junta: '+dato.junta)
        setJunta(dato)
      }else if(dato.estado == 'REGISTRADO'){
        Swal.fire({
          title: '¡Error!',
          icon: 'error',
          text: 'Esta Junta ya ha sido registrada'
        })
      }
  }

  const ZonaTemplateFilter = (options) => {
    return <Dropdown options={Zonas} value={options.value} onChange={(e) => {options.filterApplyCallback(e.target.value)}} showClear placeholder='Zonas'  />;
  }

  const HeaderTableVotos=(()=>{
    return(
      <div>
        <Button label='Registrar Votos' onClick={RegistrarVotos}  />
      </div>
    )
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

  const RegistrarVotos=(()=>{
    let vacias=0
    for(let i=0; i<Listas.length; i++){
      if(Listas[i].total === '' || Listas[i].total === null){
        vacias+=1
      }
    }
  
    if(vacias >0){
      setDlgVotacion(false)
      Swal.fire({
        title: '¡Advertencia!',
        icon: 'warning',
        text: 'Existen listas vacias, ingrese todo los datos'
      }).then((result)=>{
        if(result.isConfirmed){
          setDlgVotacion(true)
        }
      })
    }else{
  
      // Calcula la sumatoria de los valores de los objetos a partir de la posición 1
      const sumatoria = Listas.slice(1).reduce((acumulador, objeto) => {
        const valor = objeto.total; // Obtiene el valor numérico del objeto
        return acumulador + valor;
      }, 0);
  
      let total= Listas[0].total
      
      if(sumatoria === total){
        setDlgVotacion(false)
        setDlgImgV(true)
      }else{
        setDlgVotacion(false)
        Swal.fire({
          title:'¡Advertencia!',
          icon: 'warning',
          text: 'El valor ingresado como total de votos es: '+total+ ' y el valor de la sumatoria de los votos es: '+ sumatoria
        }).then((result)=>{
          if(result.isConfirmed){
            setDlgVotacion(true)
          }
        })
      }
    }
  })

  const CDlgImgV=(()=>{
    setDlgImgV(false)
    setDlgVotacion(true)
  })

  const generateUniqueFileName = (username) => {
    const timestamp = Date.now();
    return `${username}_${timestamp}.jpg`; // Ejemplo de formato de nombre único
  };

  const SubiendoFoto = (e) => {
    let nombre_imagen= generateUniqueFileName(Usuario)
    let token= localStorage.getItem('token_eleccion_2023_app')
    axios.post(process.env.NEXT_PUBLIC_BACKEND+'controller/sufragar',{
      votos: Listas,
      junta: Junta,
      usuario: Usuario,
      img_name: nombre_imagen
    },{
      headers:{
        token_eleccion_2023_app: token
      }
    }).then((result)=>{
      if(result.data.icon == 'success'){
        const formData = new FormData();
        formData.append('file', e.files[0], nombre_imagen);
        axios.post(process.env.NEXT_PUBLIC_BACKEND+'controller/img_votacion', formData,{
          headers:{
            token_eleccion_2023_app: token
          }
        }).then((results)=>{
          CDlgImgV(false)
          CDlgVotacion()
          consulta_user(Usuario)
          Swal.fire({
            title: results.data.title,
            icon: results.data.icon,
            text: results.data.text
          })
        })
      }
    })    
  };

  const CDlgVotacion=(()=>{
    setDlgVotacion(false)
    setListas([])
  })


  return (
    <Sidebar>
      <DataTable value={Datos} paginator 
      stripedRows rows={10} filterDisplay='row'>
        <Column field='zona' header='Zona' align='center' filter showClearButton={false} showFilterMenu={false} filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} filterElement={ZonaTemplateFilter} />
        <Column field='parroquia' header='Parroquia' align='center' />
        <Column field='junta' header='Junta' align='center' filter style={{ minWidth: '40rem' }} showFilterMenu={false} filterMatchMode={'contains'} filterPlaceholder='JUNTA' />
        <Column field='estado' header='ESTADO' align='center' />
        <Column body={BtnRevision} header='DETALLES' align='center' exportable={false} style={{minWidth: '8rem' }} />             
      </DataTable>
      {/* Dialogo para visualizar el datatable de los candidatos */}
      <Dialog visible={DlgVotacion} onHide={CDlgVotacion} style={{minWidth:'40%'}} header={<h2> {TituloJ} </h2>}>
        <DataTable value={Listas} header={HeaderTableVotos}  editMode="row" onRowEditComplete={onRowEditComplete} >
          <Column field='nombre' header='Listas' alignHeader='center' />
          <Column field='total' header='Votos' editor={(options) => votosEditor(options)} align='center' />
          <Column rowEditor headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }} />
        </DataTable>
      </Dialog>
      {/* Dialogo para agregar la imagen del sufragio */}
      <Dialog visible={DlgImgV} onHide={CDlgImgV} style={{minWidth:'40%'}}>
        
        <FileUpload url=''  accept="image/*" maxFileSize={1000000} chooseLabel='Buscar'  cancelLabel='Cancelar'  onUpload={SubiendoFoto} />
        
      </Dialog>
    </Sidebar>
  )
}

export default Sufragar
