import React, { useEffect, useState } from 'react'
import styles from '@/styles/Home.module.css'
import {InputText} from 'primereact/inputtext'
import {Button} from 'primereact/button'
import axios from 'axios'
import { useRouter } from 'next/router'
import Swal from 'sweetalert2'

const Index = () => {
  const router= useRouter()
  const [InpUser, setInpUser]= useState('')
  const [InpPass, setInpPass]= useState('')

  useEffect(()=>{
    axios.get(process.env.NEXT_PUBLIC_BACKEND+'controller/login',{
      headers: {
        token_eleccion_2023_app: localStorage.getItem('token_eleccion_2023_app')
      }
    }).then((result)=>{     
      if(result.data.auth === true){
        router.push('/validacion')
      }
    })
  },[])


  const IniciarSesion=(e)=>{
    e.preventDefault()
    axios.post(process.env.NEXT_PUBLIC_BACKEND+'controller/login',{
      usuario: InpUser.trim(),
      passw: InpPass.trim()
    }).then((result)=>{
      if(result.data.auth == false){
        Swal.fire({
          title: result.data.title,
          icon: result.data.icon,
          text: result.data.tex
        })
      }else{
        localStorage.setItem('token_eleccion_2023_app',result.data.token)
        router.push('/usuarios')
      }
    })
  }

  return (
    <div className={styles.bodyLogin}>
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
