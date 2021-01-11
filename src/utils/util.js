import {Circle, Popup} from 'react-leaflet';
import numeral from 'numeral';

const casesTypesColors = {
    cases: {
        hex: "red",
        multiplier: 400, //size of circle
    },
    recovered: {
        hex: "orange",
        multiplier: 600,
    },
    deaths: {
        hex: "green",
        multiplier: 1000,
    },
};

console.log("color>>>>>>>>",casesTypesColors.cases.hex);

// sorting data base on cases
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
        lastDataPoint= data[casesTypes][date];
    };
    return chartData;
};

// covid stats prettyfier
export const prettyPrintStat = (stat) => stat ? `${numeral(stat).format("0.0a")}` : "+0";

// circle on Map
export const showDataOnMap = (data, casesTypes) => 
data.map((country) => (
        <Circle
            center={[country.countryInfo.lat, country.countryInfo.long]}
            color={casesTypesColors[casesTypes].hex}
            fillColor={casesTypesColors[casesTypes].hex}
            fillOpacity={0.4}
            radius={Math.sqrt(country[casesTypes]) * casesTypesColors[casesTypes].multiplier}
        >
            <Popup>
                <div className="mapPopup-container">
                    <div className="mapPopup-flag" style={{backgroundImage: `url(${country.countryInfo.flag})`}} />
                    <div className="mapPopup-name">{country.country}</div>
                    <div className="mapPopup-cases">Cases: {numeral(country.cases).format("0,0")}</div>
                    <div className="mapPopup-recovered">Recovered: {numeral(country.recovered).format("0,0")}</div>
                    <div className="mapPopup-deaths">Deaths: {numeral(country.deaths).format("0,0")}</div>
                </div>
            </Popup>
        </Circle>
    ))
