'use client';
import { Chart as ChartJS, ArcElement } from 'chart.js';
import { Pie } from 'react-chartjs-2';
ChartJS.register(ArcElement);
const CustomPieChart = ({
  value,
  color,
  label,
}: {
  value: number | string;
  color: string;
  label: string;
}) => {
  const data = {
    datasets: [
      {
        label: label,
        data: [100 - Number(value), Number(value)],
        backgroundColor: ['#FFFFFF1A', color],
        borderWidth: 0,
      },
    ],
  };
  return (
    <div className="w-[48px] h-[48px]">
      <Pie data={data} />
    </div>
  );
};
export default CustomPieChart;
