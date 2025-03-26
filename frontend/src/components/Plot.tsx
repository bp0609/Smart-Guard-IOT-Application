import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);


export default function Plot({ chartData }: { chartData: any }) {

    return (
        <div className="d-flex flex-wrap justify-content-around w-100">
            {chartData.map((data: any, index: number) => (
                <div className="w-50 mb-3 align-items-center">
                    <div key={index} className="mb-3">
                        <Line data={data} />
                    </div>
                </div>
            ))}
        </div>
    );
}