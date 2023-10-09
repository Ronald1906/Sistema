import React from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

const PieListas = ({ data }) => {

  const COLORS = ['#d4c716', '#d48216', '#9516d4', '#0088FE','#3ba000','#006ba0','#d4c716','#9516d4', '#16bed4','#d48216','#a1d416','#1649d4'];  

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
  

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const RADIAN = Math.PI / 180;

  return (
    <div>
      <div style={{ marginLeft: '20px' }}>
        <table style={{ borderCollapse: 'collapse', width: '30%' }}>
          <thead>
            <tr>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.map((entry, index) => (
              <tr key={`row-${index}`}>
                <td>{entry.candidato}</td>
                <td style={{ backgroundColor: COLORS[index % COLORS.length], width: '20px', height: '20px' }}></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ResponsiveContainer width="100%" aspect={3.5}>
        <PieChart width={400} height={300}>
          <Pie
            data={data}
            width={'100%'}
            style={{backgroundColor:'red'}}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={150}
            fill="#8884d8"
            dataKey="total"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            content={({ payload }) => {
              if (payload && payload.length > 0) {
                return (
                  <div style={{ backgroundColor: 'white', padding: '10px', border: '1px solid #ccc' }}>
                    <p>{`${payload[0].payload.candidato}`}</p>
                  </div>
                );
              }
              return null;
            }}
            isAlwaysActive
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default PieListas
