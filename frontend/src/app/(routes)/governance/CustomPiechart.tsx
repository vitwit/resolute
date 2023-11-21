'use client';
import { Chart as ChartJS, ArcElement } from 'chart.js';
import { Pie } from 'react-chartjs-2';
ChartJS.register(ArcElement);
const CustomPieChart = ({
  value,
  color,
  label,
}: {
  value: number;
  color: string;
  label: string;
}) => {
  const data = {
    datasets: [
      {
        label: label,
        data: [100 - value, value],
        backgroundColor: ['#FFFFFF1A', color],
        borderWidth: 0,
      },
    ],
  };
  return (
    <div className="w-[36px] h-[36px]">
      <Pie data={data} />
    </div>
  );
};
export default CustomPieChart;
