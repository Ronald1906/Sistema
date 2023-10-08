import React, { useEffect, useState } from 'react'
import styles from '@/styles/Home.module.css'
import Navbar from './Navbar'
import axios from 'axios'
import Sidemenu from './Sidemenu'
import {FaUser, FaClipboardList, FaHome, FaThList, FaUsers, FaRegCalendarCheck, FaTasks} from 'react-icons/fa'
import { useRouter } from 'next/router'

const Sidebar = ({children}) => {
  const router= useRouter()
  const [MenuArray, setMenuArray]= useState([])

  useEffect(()=>{
    let token= localStorage.getItem('token_eleccion_2023_app')
    if(token){
      axios.get(process.env.NEXT_PUBLIC_BACKEND+'controller/login',{
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

  },[router])

  useEffect(()=>{
    axios.get(process.env.NEXT_PUBLIC_BACKEND+'controller/login',{
      headers:{
        token_eleccion_2023_app: localStorage.getItem('token_eleccion_2023_app')
      }
    }).then((result)=>{
      //Si el rol es el de administrador
      if(result.data.token.data.id_rol === 'admin'){
        setMenuArray([
          {id: 1, label:'Dashboard', icon: FaHome, link:'/dashboard'},
          {id: 2, label:'Usuarios', icon: FaUser, link:'/usuarios'},
          {id: 3, label:'Zonas', icon: FaClipboardList, link:'/zonas'},
          {id: 4, label:'Candidatos', icon: FaUsers, link:'/candidatos'},
          {id: 5, label:'Reporte', icon: FaThList, link:'/reporte'},
          {id: 6, label:'Votos', icon: FaRegCalendarCheck, link:'/votacion'},
          {id: 7, label:'Sufragar', icon: FaTasks, link:'/sufragar'},
          //{id: 5, label:'Revisión', icon: FaThList, link:'/revision_sufragio'},
        ])
        //Si el rol es de supervisor
      }else if(result.data.token.data.id_rol === 'supervisor'){
        setMenuArray([          
          {id: 1, label:'Dashboard', icon: FaHome, link:'/dashboard'},
          {id: 2, label:'Sufragar', icon: FaRegCalendarCheck, link:'/sufragar'}
        ])
        //Si el rol es de coordinador
      }
    })
  },[])  

  return (
    <div className={styles.contenedorglobal}>
      <div className={styles.newsidebar} >
        <div style={{borderBottom:'1px solid white', padding:'15px', textAlign:'center'}}>
          <h2 style={{color:'white'}}>CONTROL ELECTORAL</h2>
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
