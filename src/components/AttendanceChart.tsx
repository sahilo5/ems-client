import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Legend,
    Label,
  } from "recharts";
  import React from "react";
  import { AttendanceSummary } from "../pages/admin/AdminDashboard.hooks";
  
  type Props = { data: AttendanceSummary[] };
  
  export const AttendanceChart: React.FC<Props> = ({ data }) => {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} barCategoryGap="20%">
          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
          
          {/* X-Axis with Label */}
          <XAxis dataKey="date">
            <Label value="Date" offset={-5} position="insideBottom" />
          </XAxis>
          
          {/* Y-Axis with Label */}
          <YAxis>
            <Label
              value="Number of Employees"
              angle={-90}
              position="insideLeft"
              style={{ textAnchor: "middle" }}
            />
          </YAxis>
  
          <Tooltip />
          <Legend verticalAlign="top" align="center" />
  
          {/* Bars */}
          <Bar dataKey="present" fill="#586E9A" name="Present (Blue)" />
          <Bar dataKey="absent" fill="#857373" name="Absent (Brown)" />
        </BarChart>
      </ResponsiveContainer>
    );
  };
  