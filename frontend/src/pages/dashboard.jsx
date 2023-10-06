import React, { useState } from 'react'
import Sidebar from './components/Sidebar'
import BarListas from './components/BarListas'
import PieListas from './components/PieListas'

const Dashboard = () => {
  const [Listas, setListas]= useState([])
  return (
    <Sidebar>
      <div>
        <h2 style={{color:'navy'}}>GRAFICA DE BARRAS </h2>
        <BarListas data={Listas} />
      </div>
      <div>
        <h2 style={{color:'navy'}}>GRAFICA DE PASTEL</h2>
        <PieListas data={Listas} />
      </div>
    </Sidebar>
  )
}

export default Dashboard
