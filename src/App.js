import './App.css';
import {FormControl, Select, MenuItem} from '@material-ui/core'
import { useEffect, useState } from 'react';

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");

  useEffect(() => {
    // https://disease.sh/v3/covid-19/countries
    const getCountriesDAta = async () =>{
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => (
            {
              name: country.country, // United States, France
              value: country.countryInfo.iso2, // UK, USA, FR
              flag: country.countryInfo.flag
            }
          ));
          setCountries(countries);
        });
    };
    getCountriesDAta();
  }, []);

  const onCountryChange = (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);
    console.log('Yooo>>>', countryCode)
  }
  return (
    <div className="app">
      <div className="app__header">
        <h1>COVID-19 TRACKER</h1> 
        <FormControl className="app__dropdown">   
          <Select varient="outlined" value={country} onChange={onCountryChange}>
            <MenuItem value="worldwide">Worldwide</MenuItem>
            {/* loop through all the countries and shoe dropdown */}
            {countries.map(country => (
              <MenuItem value={country.value}>
                 <p>{country.name}</p>
                <img className="app__dropdownFlag" src={country.flag} alt="country-flag" />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <div className="app__stats">
        
      </div>
    </div>
  );
}

export default App;
