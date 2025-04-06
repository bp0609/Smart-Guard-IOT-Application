import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useRef, useEffect } from 'react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Plot({ chartData, mode }: { chartData: any[]; mode: 'light' | 'dark' }) {
    const chartRef = useRef<ChartJS>(null!);

    useEffect(() => {
        const handleResize = () => {
            if (chartRef.current) {
                chartRef.current.update();
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const textColor = mode === 'light' ? '#000' : '#ccc';
    const gridColor = mode === 'light' ? '#ccc' : '#777';

    return (
        <div className="container-fluid">
            <div className="row">
                {chartData.map((data, index) => {
                    const latestValue = data.datasets[0].latestValue;
                    const isDanger = latestValue < data.thresholds.min || latestValue > data.thresholds.max;
                    const options = {
                        responsive: true,
                        maintainAspectRatio: false,
                        interaction: {
                            mode: 'index' as const,
                            intersect: false
                        },
                        plugins: {
                            tooltip: {
                                backgroundColor: mode === 'light' ? '#fff' : '#333',
                                titleColor: textColor,
                                bodyColor: textColor,
                                borderColor: mode === 'light' ? '#ccc' : '#777',
                                borderWidth: 1,
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
                                },
                                title: {
                                    display: true,
                                    text: 'Time',
                                }
                            },
                            y: {
                                ticks: {
                                    color: textColor,
                                },
                                grid: {
                                    color: gridColor
                                },
                                title: {
                                    display: true,
                                    text: 'Value (' + data.datasets[0].unit + ')',

                                },
                            }
                        }
                    };
                    return (
                        <div className="col-12 col-md-6 mb-3 position-relative" key={index}>
                            <div style={{ position: 'relative', width: '100%', height: '300px' }}>
                                <Line ref={(instance) => { if (instance) chartRef.current = instance; }} data={data} options={options} />
                            </div>
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
                    );
                })}
            </div>
        </div>
    );
}
