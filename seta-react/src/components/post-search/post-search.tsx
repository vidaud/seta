import './style.css';
import React, { useState } from 'react';
import { Chart } from 'primereact/chart';

export const PostSearch = () => {
    const [chartData] = Array({
        datasets: [{
            data: [
                11,
                16,
                7,
                3,
                14
            ],
            backgroundColor: [
                "#42A5F5",
                "#66BB6A",
                "#FFA726",
                "#26C6DA",
                "#7E57C2"
            ],
            label: 'My dataset'
        }],
        labels: [
            "Red",
            "Green",
            "Yellow",
            "Grey",
            "Blue"
        ]
    });

    const [lightOptions] = useState({
        plugins: {
            legend: {
                labels: {
                    color: '#495057'
                }
            }
        },
        scales: {
            r: {
                grid: {
                    color: '#ebedef'
                }
            }
        }
    });

    return (
        <div className="card flex justify-content-center">
            <Chart type="polarArea" data={chartData} options={lightOptions} style={{ position: 'relative'}} />
        </div>
    );
}

export default PostSearch;