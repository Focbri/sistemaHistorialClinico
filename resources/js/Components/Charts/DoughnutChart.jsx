import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

export default function DoughnutChart({ data, options }) {
  return <Doughnut data={data} options={options} />;
}