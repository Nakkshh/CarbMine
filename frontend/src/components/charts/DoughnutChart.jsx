import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
ChartJS.register(ArcElement, Tooltip, Legend, Title, ChartDataLabels);

const DoughnutChart = ({ data }) => {
    const chartData = {
        labels: ['Excavation', 'Transportation', 'Equipment'],
        datasets: [{
            data: [
                data.excavationEmissions,
                data.transportationEmissions,
                data.equipmentEmissions,
            ],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
            hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
            borderWidth: 2,
            borderColor: 'transparent',
        }],
    };

    const options = {
        responsive: true,
        plugins: {
            datalabels: {
                color: '#fff',
                display: true,
                formatter: (value) => `${Number(value).toFixed(1)}`,
                font: { weight: 'bold', size: 11 },
            },
            legend: {
                position: 'bottom',
                labels: {
                    color: '#888',
                    padding: 16,
                    font: { size: 12 },
                },
            },
            tooltip: {
                callbacks: {
                    label: (ctx) => `${ctx.label}: ${Number(ctx.parsed).toFixed(2)} kg CO₂`,
                },
            },
        },
    };

    return <Pie data={chartData} options={options} />;
};

export default DoughnutChart;