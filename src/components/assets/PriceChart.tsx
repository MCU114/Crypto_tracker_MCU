'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { formatCurrency } from '@/src/lib/formatting'

interface PriceChartProps {
  data: { time: number; price: number }[]
  coinName: string
}

export default function PriceChart({ data, coinName }: PriceChartProps) {
  // Transform data for Recharts
  // Group data points if there are too many (for better performance)
  const chartData = data.map((point) => ({
    time: new Date(point.time).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    price: point.price,
    fullDate: new Date(point.time).toLocaleString(),
  }))

  // Custom tooltip formatter
  const formatTooltip = (value: number | string) => {
    return formatCurrency(Number(value))
  }

  if (chartData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <p className="text-slate-500">No chart data available.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-slate-900 mb-4">
        {coinName} Price Chart
      </h2>
      <div className="h-96 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="time"
              stroke="#64748b"
              tick={{ fill: '#64748b' }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis
              stroke="#64748b"
              tick={{ fill: '#64748b' }}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <Tooltip
              formatter={formatTooltip}
              labelFormatter={(label, payload) => {
                if (payload && payload[0]) {
                  return payload[0].payload.fullDate
                }
                return label
              }}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
              }}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
