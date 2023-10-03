import Sidebar from '@/components/Sidebar'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Dialog } from 'primereact/dialog'
import React, { useEffect, useState } from 'react'
import styles from '@/styles/Home.module.css'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import axios from 'axios'
import Swal from 'sweetalert2'
import { MultiSelect } from 'primereact/multiselect';
        

const Usuarios = () => {

  const [DlgSlcUser, setDlgSlcUser]= useState(false)
  const [DlgRegisterAdm, setDlgRegisterAdm]= useState(false)
  const [DlgSupervisor, setDlgSupervisor]= useState(false)
  const [DlgCoordinador, setDlgCoordinador]= useState(false)
  const [DlgVeedor, setDlgVeedor]= useState(false)
  const [DlgParroquias, setDlgParroquias]= useState(false)
  const [InpCedula, setInpCedula]= useState('')
  const [InpNombres, setInpNombres]= useState('')
  const [InpApellidos, setInpApellidos]= useState('')
  const [DrpCanton, setDrpCanton]= useState([])
  const [DrpParroquia, setDrpParroquia]= useState([])
  const [DrpJuntas, setDrpJuntas]= useState([])
  const [DrpRecinto, setDrpRecinto]= useState([])
  const [SlcCanton, setSlcCanton]= useState('')
  const [SlcTUsuario, setSlcTUsuario]= useState('')
  const [InpUsuario, setInpUsuario]= useState('')
  const [InpPass, setInpPass]= useState('')
  const [InpCelular, setInpCelular]= useState('')
  const [SlcParroquia, setSlcParroquia]= useState([])
  const [SlcParroquias, setSlcParroquias]= useState('')
  const [SlcJuntas, setSlcJuntas] = useState([]);
  const [Parroquias, setParroquias]= useState([])
  const [Recintos, setRecintos]= useState([])
  const [SlcRecintos, setSlcRecintos]= useState('')
  const [DlgViewRecintos, setDlgViewRecintos]= useState(false)
  const [UsuariosRegistrados, setUsuariosRegistrados]= useState([])

  const arrayUser=[
    {id: 1, usuario: 'Administrador del Sistema'},
    {id: 2, usuario: 'Supervisor'},
    {id: 3, usuario: 'Coordinador'},
    {id: 4, usuario: 'Veedor'}
  ]

  const consulta1=(()=>{
    axios.get(process.env.NEXT_PUBLIC_BACKEND+'recintos/recintos').then((result)=>{
      setDrpCanton(result.data)
    })
  })


  const consulta2=(()=>{
    axios.get(process.env.NEXT_PUBLIC_BACKEND+'usuarios').then((result)=>{
      setUsuariosRegistrados(result.data)
    })
  })


  /*useEffect(()=>{
    consulta1()
    consulta2()
  },[])*/


  const HeaderUsuarios=(()=>{
    return(
      <div className={styles.headerstable}>
        <h2>INGRESAR USUARIOS</h2>
        <Button  label='Registrar Usuarios'  onClick={()=>{setDlgSlcUser(true)}} />
      </div>
    )
  })  

  const CDlgSlcUser=(()=>{
    setDlgSlcUser(false)
    setSlcTUsuario('')
  })

  //Para abrir la ventana dependiendo de lo que se elige
  const SelectTUsuario=(()=>{
    if(SlcTUsuario !== ''){
      setDlgSlcUser(false)
      if(SlcTUsuario == 'Administrador del Sistema'){
        setDlgRegisterAdm(true)
      }else if(SlcTUsuario == 'Supervisor'){
        setDlgSupervisor(true)
      }else if(SlcTUsuario == 'Coordinador'){
        setDlgCoordinador(true)
      }else if(SlcTUsuario == 'Veedor'){
        setDlgVeedor(true)
      }
    }
  })

  //Limpiar el Dlg de registro de administrador
  const CDlgRegisterAdm=(()=>{
    setInpUsuario('')
    setInpPass('')
    setDlgRegisterAdm(false)
    setSlcTUsuario('')
    setDlgSlcUser(true)
  })

  //Registrar Usuarios Administrador
  const RegistrarAdmin=(e)=>{
    e.preventDefault()
    axios.post(process.env.NEXT_PUBLIC_BACKEND+'usuarios/add_admin',{
      user: InpUsuario,
      pass: InpPass
    }).then((result)=>{
      if(result.data.icon == 'error'){
        setDlgRegisterAdm(false)
        Swal.fire({
          title:result.data.title,
          icon: result.data.icon,
          text: result.data.text
        }).then((resp)=>{
          if(resp.isConfirmed){
            setDlgRegisterAdm(true)
          }
        })
      }else{
        CDlgRegisterAdm()
        setDlgSlcUser(false)
        Swal.fire({
          title:result.data.title,
          icon: result.data.icon,
          text: result.data.text
        })
      }
    })
  }

  //Limpiar el Dlg de registro de supervisores
  const  CDlgSupervisor=(()=>{
    setInpCedula('')
    setInpNombres('')
    setInpApellidos('')
    setInpCelular('')
    setSlcCanton('')
    setSlcParroquia('')
    setDrpParroquia([])
    setDlgSupervisor(false)
    setSlcTUsuario('')
    setDlgSlcUser(true)
  })

  //Limpiar el Dlg de registro de coordinadores
  const CDlgCoordinador=(()=>{
    setInpCedula('')
    setInpNombres('')
    setInpApellidos('')
    setInpCelular('')
    setSlcCanton('')
    setSlcParroquias('')
    setSlcRecintos('')
    setDrpParroquia([])
    setDrpRecinto([])
    setDlgCoordinador(false)
    setSlcTUsuario('')
    setDlgSlcUser(true)
  })

  
  //Limpiar el Dlg de registro de veedores
  const CDlgVeedor=(()=>{
    setInpCedula('')
    setInpNombres('')
    setInpApellidos('')
    setInpCelular('')
    setSlcCanton('')
    setSlcParroquias('')
    setDrpParroquia([])
    setDrpRecinto([])
    setSlcRecintos('')
    setDlgVeedor(false)
    setSlcTUsuario('')
    setDlgSlcUser(true)
    setDrpJuntas([])
    setSlcJuntas([])    
  })

  //Para filtrar las parroquias acorde al canton seleccionado
  const SelectCanton=(()=>{
    if(SlcCanton !== ''){
      const filtro= DrpCanton.filter((e)=>e.codigo_canton === SlcCanton )
      setDrpParroquia(filtro[0].parroquias)
    }
  })

  //Registro de usuarios supervisores
  const RegistrarSuperv=(e)=>{
    e.preventDefault()
    if(SlcCanton !== '' && SlcParroquia.length>0){
      axios.post(process.env.NEXT_PUBLIC_BACKEND+'usuarios/add_superv',{
        cedula: InpCedula,
        nombres: InpNombres,
        apellidos: InpApellidos,
        celular: InpCelular,
        cod_canton: SlcCanton,
        recintos: SlcParroquia
      }).then((result)=>{
        if(result.data.icon === 'success'){
          CDlgSupervisor()
          setDlgSlcUser(false)
          consulta2()
          Swal.fire({
            title: result.data.title,
            icon: result.data.icon,
            text: result.data.text
          })
        }else if(result.data.icon === 'warning'){
          setDlgSupervisor(false)
          Swal.fire({
            title: result.data.title,
            icon: result.data.icon,
            text: result.data.text
          }).then((resp)=>{
            if(resp.isConfirmed){
              setDlgSupervisor(true)
            }
          })
        }
      })
    }else{
      setDlgSupervisor(false)
      Swal.fire({
        title: '¡Advertencia!',
        icon: 'warning',
        text: 'Le falto ingresar datos'
      }).then((resp)=>{
        if(resp.isConfirmed){
          setDlgSupervisor(true)
        }
      })
    }
  }

  //Para filtrar las zonas acorde a la parroquia seleccionada
  const SelectParroquia=(()=>{
    if(SlcParroquias !== ''){
      const filtro= DrpParroquia.filter((e)=>e.codigo_parroquia === SlcParroquias )
      let array=[]
      for(let i=0; i<filtro[0].zonas.length; i++){
        for(let j=0; j<filtro[0].zonas[i].recintos.length; j++){
          array.push(filtro[0].zonas[i].recintos[j])
        }
      }
      setDrpRecinto(array)
    }
  })

  //Registro de usuarios coordinadores
  const RegistrarCoord=(e)=>{
    e.preventDefault()
    if(SlcCanton !== '' && SlcParroquias !== '' && SlcRecintos !== ''){
      axios.post(process.env.NEXT_PUBLIC_BACKEND+'usuarios/add_coord',{
        cedula: InpCedula,
        nombres: InpNombres,
        apellidos: InpApellidos,
        celular: InpCelular,
        cod_canton: SlcCanton,
        cod_parroquia: SlcParroquias,
        cod_recinto: SlcRecintos
      }).then((result)=>{
        if(result.data.icon === 'success'){
          CDlgCoordinador()
          setDlgSlcUser(false)
          consulta2()
          Swal.fire({
            title: result.data.title,
            icon: result.data.icon,
            text: result.data.text
          })
        }else if(result.data.icon === 'warning'){
          setDlgCoordinador(false)
          Swal.fire({
            title: result.data.title,
            icon: result.data.icon,
            text: result.data.text
          }).then((resp)=>{
            if(resp.isConfirmed){
              setDlgCoordinador(true)
            }
          })
        }
      })
    }else{
      setDlgCoordinador(false)
      Swal.fire({
        title: '¡Advertencia!',
        icon: 'warning',
        text: 'Le falto ingresar datos'
      }).then((resp)=>{
        if(resp.isConfirmed){
          setDlgCoordinador(true)
        }
      })
    }
  }

  //Registro de usuarios veedores
  const RegistrarVeedor=(e)=>{
    e.preventDefault()
    if(SlcCanton !== '' && SlcParroquias !== '' && SlcRecintos !== '' && SlcJuntas.length >0){
      axios.post(process.env.NEXT_PUBLIC_BACKEND+'usuarios/add_veedor',{
        cedula: InpCedula,
        nombres: InpNombres,
        apellidos: InpApellidos,
        celular: InpCelular,
        cod_canton: SlcCanton,
        cod_parroquia: SlcParroquias,
        cod_recinto: SlcRecintos,
        recintos: SlcJuntas
      }).then((result)=>{
        if(result.data.icon === 'success'){
          CDlgVeedor()
          setDlgSlcUser(false)
          consulta2()
          Swal.fire({
            title: result.data.title,
            icon: result.data.icon,
            text: result.data.text
          })
        }else if(result.data.icon === 'warning'){
          setDlgVeedor(false)
          Swal.fire({
            title: result.data.title,
            icon: result.data.icon,
            text: result.data.text
          }).then((resp)=>{
            if(resp.isConfirmed){
              setDlgVeedor(true)
            }
          })
        }
      })
    }else{
      setDlgVeedor(false)
      Swal.fire({
        title: '¡Advertencia!',
        icon: 'warning',
        text: 'Le falto ingresar datos'
      }).then((resp)=>{
        if(resp.isConfirmed){
          setDlgVeedor(true)
        }
      })
    }

  }

  //Metodo para cargar el dlg de recintos
  const ZonasRecintos =(e)=>{
    let dato=[e]
    if(dato[0].id_rol == 2 ){
      setDlgParroquias(true)
      setParroquias(dato[0].recintos)
    }else if(dato[0].id_rol == 3){
      setDlgViewRecintos(true)
      setRecintos(dato[0].recintos)
    }else if(dato[0].id_rol == 4){
      setDlgViewRecintos(true)
      setRecintos(dato[0].recintos)
    }
    
  }

  const SelectRecinto=(()=>{
    if(SlcRecintos !== ''){
      let filtro= DrpRecinto.filter((e)=>e.codigo_recinto == SlcRecintos)
      let array=[]
      for(let i=0; i<filtro.length; i++){
        for(let j=1; j<=filtro[i].juntas_fem; j++){
          array.push({
            cod_recinto: filtro[i].codigo_recinto,
            num_junta: j+'F',
            ejecutado: 0
          })
        }
        for(let j=1; j<=filtro[i].juntas_mas; j++){
          array.push({
            cod_recinto: filtro[i].codigo_recinto,
            num_junta: j+'M',
            ejecutado: 0
          })
        }
      }

      setDrpJuntas(array)
    }
  })

  const RecintoSuperv=(e)=>{
    let dato=[e]
    setRecintos(dato[0].recintos)
    setDlgViewRecintos(true)
  }

  //Eliminar un Usuarios
  const EliminarUsuario=(e)=>{
    let dato=[e]
    Swal.fire({
      title: '¡Confirmación!',
      icon: 'question',
      text: '¿Está seguró de eliminar este usuario?',
      showConfirmButton: true,
      showCancelButton: true
    }).then((result)=>{
      if(result.isConfirmed){
        axios.post(process.env.NEXT_PUBLIC_BACKEND+'usuarios/delete',{
          cedula: dato[0].cedula
        }).then((result)=>{
          consulta2()
          Swal.fire({
            title: result.data.title,
            icon: result.data.icon,
            text: result.data.text
          })
        })
      }
    })
  }

  //Metodo par ver los recintos asignados
  const Acciones = (rowData) => {
    return (
      <div>
        <Button icon="pi pi-eye" className="p-button-rounded p-button-success mr-2"  onClick={() => ZonasRecintos(rowData)} />
        <Button icon="pi pi-trash" className="p-button-rounded p-button-danger"  onClick={() => EliminarUsuario(rowData)} />
      </div>
    )
  }

  const Acciones2=(rowData)=>{
    return(
      <div>
        <Button icon="pi pi-eye" className="p-button-rounded p-button-success mr-2"  onClick={() => RecintoSuperv(rowData)} />
      </div>
    )
  }


  const CDlgViewRecintos=(()=>{
    setDlgViewRecintos(false)
    setRecintos([])
  })

  const CDlgParroquias=(()=>{
    setDlgParroquias(false)
    setParroquias([])
  })

  return (
    <Sidebar>
      <DataTable header={HeaderUsuarios} value={UsuariosRegistrados} paginator 
        stripedRows rows={10}>
        <Column field='rol' header='Rol' />
        <Column field='cedula' header='Cédula' />
        <Column field='nombre' header='Nombre' />
        <Column field='celular' header='Celular' />
        <Column field='canton' header='Cantón' />
        <Column body={Acciones} align='center' exportable={false} style={{minWidth: '8rem' }} />
      </DataTable>
      {/* Dialogo para elegir el tipo de usuario a ingresar */}
      <Dialog visible={DlgSlcUser} header='Tipo de Usuario a registrar' onHide={CDlgSlcUser} style={{width:'auto'}} >
        <div className={styles.registros}>
          <Dropdown options={arrayUser} optionLabel='usuario' optionValue='usuario' value={SlcTUsuario} onChange={(e)=>{setSlcTUsuario(e.target.value)}} placeholder='Tipo de Usuario' onSelect={SelectTUsuario} />
        </div>
      </Dialog>
      {/* Dialogo para registrar los usuarios Administradores del sistema */}
      <Dialog visible={DlgRegisterAdm} onHide={CDlgRegisterAdm} header='Registrando un Administrador del Sistema' style={{width:'auto'}}>
        <form className={styles.registros} onSubmit={RegistrarAdmin}>
          <InputText type='text' placeholder='Usuario' value={InpUsuario} onChange={(e)=>{setInpUsuario(e.target.value)}} required />
          <InputText type='password' placeholder='Contraseña' value={InpPass} onChange={(e)=>{setInpPass(e.target.value)}} required />
          <Button label='Registrar' />
        </form>
      </Dialog>
      {/* Dialogo para registrar los usuarios Supervisores */}
      <Dialog visible={DlgSupervisor} onHide={CDlgSupervisor} header='Registrando un usuario Supervisor' style={{width:'auto'}} >
        <form className={styles.registros} onSubmit={RegistrarSuperv}>
          <InputText type='text' placeholder='Cédula' value={InpCedula} onChange={(e)=>{setInpCedula(e.target.value)}} required />
          <InputText type='text' placeholder='Nombres' value={InpNombres} onChange={(e)=>{setInpNombres(e.target.value)}} required />
          <InputText type='text' placeholder='Apellidos' value={InpApellidos} onChange={(e)=>{setInpApellidos(e.target.value)}} required />
          <InputText type='text' placeholder='Celular' value={InpCelular} onChange={(e)=>{setInpCelular(e.target.value)}} required />
          <Dropdown options={DrpCanton} optionLabel='nombre_canton' optionValue='codigo_canton' value={SlcCanton} onChange={(e)=>{setSlcCanton(e.target.value)}} placeholder='Canton' onSelect={SelectCanton} className={styles.drpdown} />
          <MultiSelect options={DrpParroquia} optionLabel='nombre_parroquia' placeholder='Parroquias' value={SlcParroquia} onChange={(e)=>{setSlcParroquia(e.value)}} className={styles.drpdown}  />
          <Button label='Registrar' />
        </form>
      </Dialog>
      {/* Dialogo para registrar los usuarios coordinadores */}
      <Dialog visible={DlgCoordinador} onHide={CDlgCoordinador} header='Registrando un usuario Coordinador' style={{width:'auto'}} >
        <form className={styles.registros} onSubmit={RegistrarCoord} >
          <InputText type='text' placeholder='Cédula' value={InpCedula} onChange={(e)=>{setInpCedula(e.target.value)}} required />
          <InputText type='text' placeholder='Nombres' value={InpNombres} onChange={(e)=>{setInpNombres(e.target.value)}} required />
          <InputText type='text' placeholder='Apellidos' value={InpApellidos} onChange={(e)=>{setInpApellidos(e.target.value)}} required />
          <InputText type='text' placeholder='Celular' value={InpCelular} onChange={(e)=>{setInpCelular(e.target.value)}} required />
          <Dropdown options={DrpCanton} optionLabel='nombre_canton' optionValue='codigo_canton' value={SlcCanton} onChange={(e)=>{setSlcCanton(e.target.value)}} placeholder='Canton' onSelect={SelectCanton} className={styles.drpdown} />
          <Dropdown options={DrpParroquia} optionLabel='nombre_parroquia' optionValue='codigo_parroquia' value={SlcParroquias} onChange={(e)=>{setSlcParroquias(e.target.value)}} placeholder='Parroquia' onSelect={SelectParroquia}  className={styles.drpdown} />
          <Dropdown options={DrpRecinto} optionLabel='nombre_recinto' optionValue='codigo_recinto'  placeholder='Recinto' value={SlcRecintos} onChange={(e)=>{setSlcRecintos(e.target.value)}}  className={styles.drpdown} />
          <Button label='Registrar' />
        </form>
      </Dialog>
      {/* Dialogo para registrar los usuarios veedores */}
      <Dialog visible={DlgVeedor} onHide={CDlgVeedor} header='Registrando un usuario Veedor' style={{width:'auto'}} >
        <form className={styles.registros}  onSubmit={RegistrarVeedor} >
          <InputText type='text' placeholder='Cédula' value={InpCedula} onChange={(e)=>{setInpCedula(e.target.value)}} required />
          <InputText type='text' placeholder='Nombres' value={InpNombres} onChange={(e)=>{setInpNombres(e.target.value)}} required />
          <InputText type='text' placeholder='Apellidos' value={InpApellidos} onChange={(e)=>{setInpApellidos(e.target.value)}} required />
          <InputText type='text' placeholder='Celular' value={InpCelular} onChange={(e)=>{setInpCelular(e.target.value)}} required />
          <Dropdown options={DrpCanton} optionLabel='nombre_canton' optionValue='codigo_canton' value={SlcCanton} onChange={(e)=>{setSlcCanton(e.target.value)}} placeholder='Canton' onSelect={SelectCanton} className={styles.drpdown} />
          <Dropdown options={DrpParroquia} optionLabel='nombre_parroquia' optionValue='codigo_parroquia' value={SlcParroquias} onChange={(e)=>{setSlcParroquias(e.target.value)}} placeholder='Parroquia' onSelect={SelectParroquia}  className={styles.drpdown} />
          <Dropdown options={DrpRecinto} optionLabel='nombre_recinto' optionValue='codigo_recinto' value={SlcRecintos} onChange={(e)=>{setSlcRecintos(e.target.value)}} placeholder='Recinto' onSelect={SelectRecinto}   className={styles.drpdown} />
          <MultiSelect options={DrpJuntas} optionLabel='num_junta' placeholder='Juntas' value={SlcJuntas} onChange={(e)=>{setSlcJuntas(e.value)}} className={styles.drpdown} />
          <Button label='Registrar' />
        </form>
      </Dialog>
      {/* Dialogo para mostrar las parroquias asignadas a los usuarios supervisor */}
      <Dialog visible={DlgParroquias} onHide={CDlgParroquias} header='Parroquias asignadas' style={{width: '100%'}} >
        <DataTable value={Parroquias}>
          <Column field='nombre_parroquia' header='Parroquias' />
          <Column body={Acciones2} header='Recintos' align='center' exportable={false} style={{minWidth: '8rem' }} />
        </DataTable>
      </Dialog>
      {/* Dialogo para mostrar los recintos asignados a cada persona */}
      <Dialog visible={DlgViewRecintos} onHide={CDlgViewRecintos} style={{width: '100%'}} >
        <DataTable value={Recintos} paginator 
          stripedRows rows={5}>
          <Column field='nombre_zona' header='Zona' />
          <Column field='cod_recinto' header='Código Recinto' />
          <Column field='nombre_recinto' header='Recinto' />
          <Column field='direccion' header='Dirección' />
          <Column field='num_junta' header='Junta' />
        </DataTable>
      </Dialog>
      
    </Sidebar>
  )
}

export default Usuarios
