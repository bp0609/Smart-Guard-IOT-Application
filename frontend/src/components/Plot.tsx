import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
export default function Plot({ chartData }: { chartData: any }) {
    return (
        <div className="w-50 mb-3 align-items-center">
            <Line data={chartData} />
        </div>
    );
}