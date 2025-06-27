import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

export default function PieChart({ data, options }) {
  return <Pie data={data} options={options} />;
}