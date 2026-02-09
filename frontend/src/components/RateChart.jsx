import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import './RateChart.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'top' },
    title: {
      display: true,
      text: 'Exchange Rates',
    },
  },
  scales: {
    x: {
      title: { display: true, text: 'Date' },
    },
    y: {
      title: { display: true, text: 'Rate' },
    },
  },
  elements: {
    line: { tension: 0.1 },
  },
  interaction: {
    mode: 'index',
    intersect: false,
  },
};

const RateChart = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="rate-chart-container rate-chart-loading">
        <span className="spinner" />
        Loading chart...
      </div>
    );
  }

  if (!data || !data.datasets?.length) {
    return (
      <div className="rate-chart-container rate-chart-empty">
        No data available
      </div>
    );
  }

  return (
    <div className="rate-chart-container">
      <Line data={data} options={chartOptions} />
    </div>
  );
};

export default RateChart;
