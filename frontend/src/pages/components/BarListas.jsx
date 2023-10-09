import React from 'react'
import {Bar, BarChart, Cell,CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts'

const BarListas = ({ data }) => {
  // Verifica si data está presente antes de usarlo
  if (!data) {
    return null; // O puedes mostrar un mensaje de error u otra cosa
  }

  const colors = ['#d4c716', '#d48216', '#9516d4', '#0088FE','#3ba000','#006ba0','#d4c716','#9516d4', '#16bed4','#d48216','#a1d416','#1649d4'];  

  const CustomLabel = ({ value, x, y, width, height, index }) => {
    const barData = data[index];
    
    // Verifica si barData y porcentaje están presentes antes de usarlos
    if (barData && typeof barData.porcentaje !== 'undefined') {
      const porcentaje = barData.porcentaje;
    
      return (
        <g>
          <text x={x + width / 2} y={y} fill="#000" dy={-10} textAnchor="middle">
            {value}
          </text>
          <text x={x + width / 2} y={y} fill="#000" dy={16} textAnchor="middle">
            {porcentaje} %
          </text>
        </g>
      );
    }

    // Si no se pueden obtener los datos, simplemente muestra el valor sin porcentaje
    return (
      <text x={x + width / 2} y={y} fill="#000" dy={-10} textAnchor="middle">
        {value}
      </text>
    );
  };
  
  return (
    <div>
      <ResponsiveContainer width={"100%"}  aspect={2.5}>
        <BarChart 
          data={data} 
          isAnimationActive={false}
          layout='horizontal'
          barCategoryGap={1}
          height={300}
          margin={{
            top:50,
            right:10,
            left:10,
            bottom:5
          }}
        >
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis padding={{ left: 100 }} dataKey="candidato" axisLine={false} tickLine={false}  />
          <YAxis type="number" />
          <Tooltip />              
          <Bar dataKey='total'  fill='#00009d' label={<CustomLabel />}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % 20]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}


export default BarListas
