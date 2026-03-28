import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, Tooltip, Legend, Title, LinearScale, CategoryScale } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
ChartJS.register(LinearScale, CategoryScale, BarElement, Tooltip, Legend, Title, ChartDataLabels);

const NeutralizationChart = ({ data }) => {
    const chartData = {
        labels: ['EV Transport', 'Green Fuel', 'Remaining', 'Afforestation (ha)', 'Electricity (MWh)'],
        datasets: [{
            label: 'CO₂ Reduction (kg)',
            data: [
                data.transportation_footprint_reduction,
                data.fuel_footprint_reduction,
                data.remaining_footprint_after_reduction,
                data.land_required_for_afforestation_hectares,
                data.estimated_electricity_savings_mwh,
            ],
            backgroundColor: ['#36A2EB', '#4BC0C0', '#FF6384', '#00F020', '#9966FF'],
            borderRadius: 8,
            borderSkipped: false,
        }],
    };

    const options = {
        responsive: true,
        plugins: {
            datalabels: {
                color: '#fff',
                display: true,
                formatter: (value) => Number(value).toFixed(1),
                font: { weight: 'bold', size: 11 },
                anchor: 'end',
                align: 'start',
            },
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: (ctx) => `${ctx.label}: ${Number(ctx.parsed.y).toFixed(2)} kg CO₂`,
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: 'rgba(255,255,255,0.05)' },
                ticks: { color: '#888' },
                title: { display: true, text: 'kg CO₂', color: '#888' },
            },
            x: {
                grid: { display: false },
                ticks: { color: '#888' },
            },
        },
    };

    return <Bar data={chartData} options={options} />;
};

export default NeutralizationChart;