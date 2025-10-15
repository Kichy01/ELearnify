

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MOCK_PROGRESS_DATA } from '../../constants.ts';

const ProgressGraph: React.FC = () => {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <BarChart
          data={MOCK_PROGRESS_DATA}
          margin={{
            top: 5, right: 20, left: -10, bottom: 5,
          }}
          barGap={10}
          barCategoryGap="20%"
        >
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#0891b2" stopOpacity={0.2}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
          <XAxis dataKey="week" stroke="#A0AEC0" />
          <YAxis stroke="#A0AEC0" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1A202C',
              border: '1px solid #4A5568',
              color: '#E2E8F0'
            }}
            labelStyle={{ color: '#06b6d4' }}
            cursor={{fill: 'rgba(6, 182, 212, 0.1)'}}
          />
          <Bar dataKey="xp" fill="url(#colorUv)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProgressGraph;