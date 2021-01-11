// sortind data base on cases
export const sortData = (data) => {
    const sortedData = [...data];

    return sortedData.sort((a, b) => a.cases > b.cases ? -1 : 1);
} 

// converting data ti x-axia and y-axis
export const buildChartData = (data, casesTypes) => {
    const chartData = [];
    let lastDataPoint;

    for(let date in data.cases) {
        if (lastDataPoint) {
            const newDataPoint = {
                x: date,
                y: data[casesTypes][date] - lastDataPoint
            }
            chartData.push(newDataPoint);
        }
        lastDataPoint= data['cases'][date];
    };
    return chartData;
}