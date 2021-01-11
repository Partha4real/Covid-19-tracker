import React, { useState, useEffect } from 'react';
import {Line} from 'react-chartjs-2';
import {buildChartData} from '../utils/util';
import numeral from 'numeral';

const options = {
    legend: {
        display: false,
    },
    elements: {
        point: {
            radius: 0,
        },
    },
    maintainAspectRatio: false,
    tooltips: {
        mode: 'index',
        intersect: false,
        callbacks: {
            label: function (tooltipItem, data) {
                return numeral(tooltipItem.value).format("+0,0");
            },
        },
    },
    scales: {
        xAxes: [
            {
                type: "time",
                time: {
                    format: "MM/DD/YY",
                    tooltipFormat: "ll",
                },
            },
        ],
        yAxes: [
            {
                gridLines: {
                    display: false,
                },
                ticks: {
                    // includes a doller sign in the ticks
                    callback: function (value, index, values) {
                        return numeral(value).format("0a");
                    }
                }
            }
        ]
    }
};

function LineGraph({casesTypes, ...props}) {
    const [data, setData] = useState({});

    //https://disease.sh/v3/covid-19/historical/all?lastdays=30

    useEffect(async () => {
        await fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=120')
            .then(response => response.json())
            .then((data) => {
                console.log('LINEGRAPH >>>', data);
                let chartData = buildChartData(data, casesTypes);
                setData(chartData);
            })
    }, [casesTypes]);

    return (
        <div className={props.className}>
            {data?.length > 0 && (
                <Line 
                    options={options}
                    data={{
                        datasets: [{
                            backgroundColor: "lightGrey",
                            borderColor: "lightBlue",
                            data: data
                        }]
                }} />
            )}
            
        </div>
    );
}

export default LineGraph;