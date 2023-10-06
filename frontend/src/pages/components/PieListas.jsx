import React from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'

const PieListas = ({ data }) => {
  return (
    <div>
      {/* <ResponsiveContainer width="100%" height="100%">
        <PieChart width={400} height={400}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="total"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer> */}
    </div>
  )
}

export default PieListas
