import React, { useEffect, useState } from 'react'
import styles from '@/styles/Home.module.css'
import Navbar from './Navbar'
import axios from 'axios'
import Sidemenu from './Sidemenu'
import {FaUser, FaClipboardList, FaHome, FaThList} from 'react-icons/fa'
import { useRouter } from 'next/router'

const Sidebar = ({children}) => {
  const router= useRouter()
  const [MenuArray, setMenuArray]= useState([])

  /*useEffect(()=>{
    let token= localStorage.getItem('token_eleccion_2023_app')
    if(token){
      axios.get(process.env.NEXT_PUBLIC_BACKEND+'usuarios/login',{
        headers:{
          token_eleccion_2023_app: token
        }
      }).then((result)=>{
        if(result.data.auth === false){
          router.push('/')
        }
      })
    }else{
      router.push('/')
    }

  },[router])*/

  /*useEffect(()=>{
    axios.get(process.env.NEXT_PUBLIC_BACKEND+'usuarios/login',{
      headers:{
        token_eleccion_2023_app: localStorage.getItem('token_eleccion_2023_app')
      }
    }).then((result)=>{
      //Si el rol es el de administrador
      if(result.data.token.data.id_rol === 1){
        setMenuArray([
          {id: 1, label:'Dashboard', icon: FaHome, link:'/dashboard'},
          {id: 2, label:'Usuarios', icon: FaUser, link:'/usuarios'},
          {id: 3, label:'Recintos', icon: FaClipboardList, link:'/recintos'},
          {id: 4, label:'Candidatos', icon: FaThList, link:'/candidatos'},
          {id: 5, label:'Reporte', icon: FaThList, link:'/reporte'},
          {id: 6, label:'Votos', icon: FaThList, link:'/votacion'},
          //{id: 5, label:'Revisión', icon: FaThList, link:'/revision_sufragio'},
        ])
        //Si el rol es de supervisor
      }else if(result.data.token.data.id_rol === 2){
        setMenuArray([          
          {id: 1, label:'Sufragar', icon: FaThList, link:'sufragar'}
        ])
        //Si el rol es de coordinador
      }else if(result.data.token.data.id_rol === 3){
        setMenuArray([
          {id: 1, label:'Veedores', icon: FaUser, link:'/veedor'},
          {id: 2, label:'Recintos', icon: FaClipboardList, link:'/recintos'},
        ])
      }
    })
  },[])  */

  return (
    <div className={styles.contenedorglobal}>
      <div className={styles.newsidebar} >
        <div style={{borderBottom:'1px solid white', padding:'15px', textAlign:'center'}}>
          <h2>CONTROL ELECTORAL</h2>
        </div> 
        <Sidemenu valor={{menu:MenuArray}} />
      </div>
      <div className={styles.contenedorsecun}>
        <Navbar/>
        <div className={styles.contenedorpages} >
          {children}
        </div>
      </div>
    </div>
  )
}

export default Sidebar
