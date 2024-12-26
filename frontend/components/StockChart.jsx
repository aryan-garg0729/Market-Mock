import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from "chart.js";
import { Line } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

const StockChart = ({ stock }) => {
  const generateRandomPrices = () =>
    Array.from({ length: 10 }, () => stock.price + Math.random() * 10 - 5);

  const chartData = {
    labels: Array.from({ length: 10 }, (_, i) => `T-${10 - i}`),
    datasets: [
      {
        label: `${stock.name} Price`,
        data: generateRandomPrices(),
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
      },
    ],
  };

  return <Line data={chartData} />;
};

export default StockChart;
