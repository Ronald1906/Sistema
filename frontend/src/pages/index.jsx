import React, { useEffect, useState } from 'react'
import styles from '@/styles/Home.module.css'
import {InputText} from 'primereact/inputtext'
import {Button} from 'primereact/button'
import axios from 'axios'
import Swal from 'sweetalert2'
import { useRouter } from 'next/router'


const Index = () => {

  const router= useRouter()
  const [InpUser, setInpUser]= useState('')
  const [InpPass, setInpPass]= useState('')

  const IniciarSesion=(e)=>{
    e.preventDefault()
    /*axios.post(process.env.NEXT_PUBLIC_BACKEND+'usuarios/login',{
      user: InpUser,
      pass: InpPass
    }).then((result)=>{
      if(result.data.icon === 'warning'){
        Swal.fire({
          title:result.data.title,
          icon: result.data.icon,
          text: result.data.text
        })
      }else{
        localStorage.setItem('token_eleccion_2023_app',result.data.token)
        router.push('/validacion')
      }
    })*/
  }

  /*useEffect(()=>{
    axios.get(process.env.NEXT_PUBLIC_BACKEND+'usuarios/login',{
      headers: {
        token_eleccion_2023_app: localStorage.getItem('token_eleccion_2023_app')
      }
    }).then((result)=>{     
      if(result.data.auth === true){
        router.push('/validacion')
      }
    })
  },[router])*/

  return (
    <div className={styles.loginpage}>
      <form className={styles.frmlogin} onSubmit={IniciarSesion} >
        <h1>Control Electoral</h1>
        <InputText placeholder='Usuario' type='text' className={styles.inputText} value={InpUser} onChange={(e)=>{setInpUser(e.target.value)}} required />
        <InputText placeholder='Contraseña' type='password' className={styles.inputPass} value={InpPass} onChange={(e)=>{setInpPass(e.target.value)}} required />
        <Button label='Iniciar Sesión' className={styles.buttonlog} />
      </form>
    </div>
  )
}

export default Index
