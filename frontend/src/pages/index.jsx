import React, { useState } from 'react'
import styles from '@/styles/Home.module.css'
import {InputText} from 'primereact/inputtext'
import {Button} from 'primereact/button'

const Index = () => {
  const [InpUser, setInpUser]= useState('')
  const [InpPass, setInpPass]= useState('')

  return (
    <div className={styles.bodyLogin}>
      <form className={styles.frmlogin} >
        <h1>Control Electoral</h1>
        <InputText placeholder='Usuario' type='text' className={styles.inputText} value={InpUser} onChange={(e)=>{setInpUser(e.target.value)}} required />
        <InputText placeholder='Contraseña' type='password' className={styles.inputPass} value={InpPass} onChange={(e)=>{setInpPass(e.target.value)}} required />
        <Button label='Iniciar Sesión' className={styles.buttonlog} />
      </form>
    </div>
  )
}

export default Index
