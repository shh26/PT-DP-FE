import React from 'react';
import { PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const ChartPlaceholder: React.FC = () => {
  // Dummy data for the pie chart
  const pieData = [
    { name: 'Group A', value: 400, fill: '#A1A9B4' },
    { name: 'Group B', value: 300, fill: '#E1B77E' },
    { name: 'Group C', value: 300, fill: '#123F6D' },
    { name: 'Group D', value: 200, fill: '#CED9D7' },
  ];

  // Dummy data for the line chart
  const lineData = [
    { name: 'Page A', uv: 4000, pv: 2400, amt: 2400, fill:'#A1A9B4' },
    { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
    { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 },
    { name: 'Page D', uv: 2780, pv: 3908, amt: 2000 },
    { name: 'Page E', uv: 1890, pv: 4800, amt: 2181 },
    { name: 'Page F', uv: 2390, pv: 3800, amt: 2500 },
    { name: 'Page G', uv: 3490, pv: 4300, amt: 2100 },
  ];

  return (
    <div className="grid xl:grid-cols-2 sm:grid-cols-1">
      <div>
        <h2>Pie Chart</h2>
        <PieChart width={600} height={600}>
          <Pie dataKey="value" data={pieData} cx={200} cy={200} outerRadius={100} fill="#8884d8" label />
        </PieChart>
      </div>
      <div>
        <h2>Line Chart</h2>
        <LineChart width={400} height={400} data={lineData}>
          <XAxis dataKey="name" />
          <YAxis />
          <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="uv" stroke="#8884d8" />
          <Line type="monotone" dataKey="pv" stroke="#82ca9d" />
        </LineChart>
      </div>
    </div>
  );
};

export default ChartPlaceholder;
