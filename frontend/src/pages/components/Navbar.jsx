import React from 'react'
import styles from '@/styles/Home.module.css'
import { Button } from 'primereact/button'
import { useRouter } from 'next/router'

const Navbar = ({ valor }) => {
  const router = useRouter()

  const CloseSession = () => {
    window.localStorage.removeItem('token_eleccion_2023_app')
    router.push('/')
  }

  return (
    <div className={styles.navbarpages}>
      <Button className={styles.btncsession} label='Cerrar Sesión' icon='pi pi-power-off' onClick={CloseSession} />
    </div>   
  )
}

export default Navbar
