import {Circle, Popup} from 'react-leaflet';
import numeral from 'numeral';

const casesTypesColours = {
    cases: {
        hex: "#CC1034",
        multiplier: 400, //size of circle
    },
    recovered: {
        hex: "#7dd71d",
        multiplier: 600,
    },
    recovered: {
        hex: "#fb4443",
        multiplier: 1000,
    },
};

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
};

export const prettyPrintStat = (stat) => stat ? `${numeral(stat).format("0.0a")}` : "+0";

// circle on Map
export const showDataOnMap = (data, casesTypes='cases') => 
    data.map((country) => (
        <Circle
            center={[country.countryInfo.lat, country.countryInfo.long]}
            fillOpacity={0.4}
            color={casesTypesColours[casesTypes].hex}
            fillcolor={casesTypesColours[casesTypes].hex}
            radius={Math.sqrt(country[casesTypes]) * casesTypesColours[casesTypes].multiplier}
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
