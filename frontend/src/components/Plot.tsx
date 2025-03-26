import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Plot({ chartData, mode }: { chartData: any; mode: 'light' | 'dark' }) {
    // Define colors based on the mode
    const textColor = mode === 'light' ? '#000' : '#ccc';
    // If you want a different color for grid lines, you can adjust it here
    const gridColor = mode === 'light' ? '#ccc' : '#777';

    return (
        <div className="d-flex flex-wrap justify-content-around w-100">
            {chartData.map((data: any, index: number) => (
                <div className="w-50 mb-3 align-items-center" key={index}>
                    <div className="mb-3">
                        <Line
                            data={data}
                            options={{
                                plugins: {
                                    title: {
                                        display: true,
                                        text: 'Chart Title',
                                        color: textColor
                                    },
                                    legend: {
                                        labels: {
                                            color: textColor
                                        }
                                    }
                                },
                                scales: {
                                    x: {
                                        ticks: {
                                            color: textColor
                                        },
                                        grid: {
                                            color: gridColor
                                        }
                                    },
                                    y: {
                                        ticks: {
                                            color: textColor
                                        },
                                        grid: {
                                            color: gridColor
                                        }
                                    }
                                }
                            }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}
