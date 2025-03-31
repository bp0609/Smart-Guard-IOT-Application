import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Plot({ chartData, mode }: { chartData: any; mode: 'light' | 'dark' }) {
    const textColor = mode === 'light' ? '#000' : '#ccc';
    const gridColor = mode === 'light' ? '#ccc' : '#777';

    return (
        <div className="d-flex flex-wrap justify-content-around w-100">
            {chartData.map((data: any, index: number) => {
                const latestValue = data.datasets[0].data[data.datasets[0].data.length - 1];
                const threshold = data.threshold; // Assuming threshold is passed in chartData

                const isDanger = latestValue > threshold;

                return (
                    <div className="w-50 mb-3 align-items-center position-relative" key={index}>
                        <div className="mb-3">
                            <Line
                                data={data}
                                options={{
                                    interaction: {
                                        mode: 'index',
                                        intersect: false
                                    },
                                    plugins: {
                                        tooltip: {
                                            backgroundColor: mode === 'light' ? '#fff' : '#333',
                                            titleColor: textColor,
                                            bodyColor: textColor,
                                            borderColor: mode === 'light' ? '#ccc' : '#777',
                                            borderWidth: 1
                                        },
                                        legend: {
                                            display: true,
                                            labels: {
                                                color: textColor
                                            }
                                        }
                                    },
                                    scales: {
                                        x: {
                                            ticks: {
                                                color: textColor,
                                                maxTicksLimit: 5
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
                            <div
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    right: 0,
                                    backgroundColor: isDanger ? 'red' : mode === 'light' ? '#fff' : '#333',
                                    color: textColor,
                                    borderRadius: '50%',
                                    width: '80px',
                                    height: '80px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: isDanger ? '0 0 15px red' : '0 0 10px rgba(0, 200, 0, 0.3)',
                                    animation: isDanger ? 'blink 1s infinite' : 'none'
                                }}
                            >
                                {latestValue}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
