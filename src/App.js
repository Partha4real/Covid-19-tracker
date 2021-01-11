import './App.css';
import {FormControl, Select, MenuItem, Card, CardContent} from '@material-ui/core'
import { useEffect, useState } from 'react';
import InfoBox from './components/InfoBox';
import Map from './components/Map';
import Table from './components/Table';
import {sortData, prettyPrintStat} from './utils/util';
import LineGraph from './components/LineGraph';

import "leaflet/dist/leaflet.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTabledata] = useState([]);
  const [casesTypes, setCasesType] = useState("cases");
  const [mapCenter, setMapCenter] = useState({lat: 12.876070, lng: 77.629580});
  const [mapZoom, setMapZoom] = useState(2);
  const [mapCountries, setMapCountries] = useState([]);

  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
      .then(response => response.json())
      .then(data => {
        setCountryInfo(data)
      });
  }, []);

  useEffect(() => {
    // https://disease.sh/v3/covid-19/countries
    const getCountriesData =  () =>{
       fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => (
            {
              name: country.country, // United States, France
              value: country.countryInfo.iso2, // UK, USA, FR
            }
          ));

          // sorting data bases on cases
          const sortedData = sortData(data);
          setMapCountries(data);
          setTabledata(sortedData);
          setCountries(countries);
        });
    };
    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    console.log('Yooo>>>', countryCode)

    // https://disease.sh/v3/covid-19/countries/all
    // https://disease.sh/v3/covid-19/countries/[COUNTRY_CODE]
    const url = countryCode === 'worldwide' ? 
      'https://disease.sh/v3/covid-19/all' : 
      `https://disease.sh/v3/covid-19/countries/${countryCode}`;
      

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        // All of the data from the country response
        setCountryInfo(data);
        //[data.countryInfo.lat, data.countryInfo.long]
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      });
    };
    console.log('COUNTRY INFO >>>', countryInfo)
  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 TRACKER</h1> 
          <FormControl className="app__dropdown">   
            <Select varient="outlined" value={country} onChange={onCountryChange}>
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {/* loop through all the countries and shoe dropdown */}
              {countries.map(country => (
                <MenuItem value={country.value}>
                  <p>{country.name}</p>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="app__stats">
          <InfoBox
            isRed 
            active={casesTypes === 'cases'} 
            onClick={e => setCasesType('cases')} 
            title="Coronavirus" 
            cases={prettyPrintStat(countryInfo.todayCases)} 
            total={prettyPrintStat(countryInfo.cases)}
          />
          <InfoBox 
            active={casesTypes === 'recovered'} 
            onClick={e => setCasesType('recovered')} 
            title="Recovered" 
            cases={prettyPrintStat(countryInfo.todayRecovered)} 
            total={prettyPrintStat(countryInfo.recovered)} 
          />
          <InfoBox
            isRed 
            active={casesTypes === 'deaths'} 
            onClick={e => setCasesType('deaths')} 
            title="Deaths" 
            cases={prettyPrintStat(countryInfo.todayDeaths)} 
            total={prettyPrintStat(countryInfo.deaths)} 
          />

        </div>
          {/* MAp container */}
          <Map countries={mapCountries} casesType={casesTypes} center={mapCenter} zoom={mapZoom}/>
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table  countries={tableData} />
          <h3 className="app__graphtitle">Worldwide New {(casesTypes).toUpperCase()}</h3>

          {/* LineGraph Container */}
          <LineGraph className="app__graph" casesTypes={casesTypes} />
        </CardContent>
      </Card>
      

    </div>
  );
}

export default App;
