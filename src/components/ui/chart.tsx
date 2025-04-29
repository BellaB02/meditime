
import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

type ChartType = "line" | "bar";

interface ChartProps {
  data: any[];
  type?: ChartType;
  dataKey: string;
  xAxisDataKey?: string;
  strokeColor?: string;
  fillColor?: string;
  height?: number;
  className?: string;
  children?: React.ReactNode;
}

export const Chart = ({
  data,
  type = "line",
  dataKey,
  xAxisDataKey = "name",
  strokeColor = "#0284c7",
  fillColor = "rgba(2, 132, 199, 0.2)",
  height = 300,
  className,
  children,
}: ChartProps) => {
  return (
    <div className={className} style={{ width: "100%", height: height }}>
      <ResponsiveContainer width="100%" height="100%">
        {type === "line" ? (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey={xAxisDataKey} 
              fontSize={12}
              tickMargin={10}
            />
            <YAxis fontSize={12} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={strokeColor}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              fill={fillColor}
            />
            {children}
          </LineChart>
        ) : (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey={xAxisDataKey}
              fontSize={12}
              tickMargin={10}
            />
            <YAxis fontSize={12} />
            <Tooltip />
            <Legend />
            <Bar
              dataKey={dataKey}
              fill={strokeColor}
              radius={[4, 4, 0, 0]}
            />
            {children}
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};
