import {
  Card,
  CardContent,
  FormControl,
  MenuItem,
  Select,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import "./App.css";
import axios from "./axios";
import InfoBox from "./components/InfoBox";
import LineGraph from "./components/LineGraph";
import Map from "./components/Map";
import Table from "./components/Table";
import { prettyPrintStats, sortData } from "./utils";
import "leaflet/dist/leaflet.css";
import PieGraph from "./components/PieGraph";
function App() {
  const [countries, setCountries] = useState([]);
  const [mapCountries, setMapCountries] = useState([]);
  const [countryInfo, setCountryInfo] = useState({ name: "Worldwide" });
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [defaultCenter, setDefaultCenter] = useState(mapCenter);
  const [mapZoom, setMapZoom] = useState(3);
  const [country, setCountry] = useState("worldwide");
  const [casesTypes, setCasesTypes] = useState("cases");

  useEffect(() => {
    // Get worldwide data
    const getAllCountriesData = async () => {
      const cases = await axios.get("/all");
      setCountryInfo(cases.data);
    };
    getAllCountriesData();
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      await axios.get("/countries").then((response) => {
        const countries = response.data.map((country) => ({
          name: country.country,
          value: country.countryInfo.iso2,
        }));
        const sortedData = sortData(response.data);
        setTableData(sortedData);
        setCountries(countries);
        setMapCountries(response.data);
      });
    };
    getCountriesData();
  }, []);
  const handleChange = async (e) => {
    const countryCode = e.target.value;
    const url =
      countryCode === "worldwide" ? "/all" : `/countries/${countryCode}`;
    const cases = await axios.get(url);

    const coordinates =
      countryCode === "worldwide"
        ? defaultCenter
        : { lat: cases.data.countryInfo.lat, lng: cases.data.countryInfo.long };
    setMapCenter(coordinates);
    setCountry(countryCode);
    setCountryInfo(cases.data);
    setMapZoom(4);
  };
  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 TRACKER</h1>
          <FormControl className="app__dropdown">
            <Select variant="outlined" value={country} onChange={handleChange}>
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem key={country.name} value={country.value}>
                  {country.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="app_stats">
          <InfoBox
            isRed
            title="Covid-19 Cases"
            active={casesTypes === "cases"}
            cases={prettyPrintStats(countryInfo.todayCases)}
            total={countryInfo.cases}
            onClick={() => setCasesTypes("cases")}
          />
          <InfoBox
            title="Recovered"
            active={casesTypes === "recovered"}
            cases={prettyPrintStats(countryInfo.todayRecovered)}
            total={countryInfo.recovered}
            onClick={() => setCasesTypes("recovered")}
          />
          <InfoBox
            isRed
            title="Deaths"
            active={casesTypes === "deaths"}
            cases={prettyPrintStats(countryInfo.todayDeaths)}
            total={countryInfo.deaths}
            onClick={() => setCasesTypes("deaths")}
          />
        </div>
        <Map
          casesType={casesTypes}
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
        />
        <h3>
          {countryInfo.country ? countryInfo.country : "Worlwide"} new{" "}
          {casesTypes}
        </h3>
        <LineGraph casesType={casesTypes} countryCode={country} />
        <div className="app__cards">
          <Card>
            <CardContent>
              <h3>Live Cases by Country</h3>
              <Table countries={tableData} />
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <h3>Number of cases per million by Country</h3>
              <Table countries={tableData} column="casesPerOneMillion" />
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <h3>Number of recovered per million by Country</h3>
              <Table countries={tableData} column="recoveredPerOneMillion" />
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <h3>Number of deaths per million by Country</h3>
              <Table countries={tableData} column="deathsPerOneMillion" />
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <h3>Today Cases by Country</h3>
              <Table countries={tableData} column="todayCases" />
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <h3>Today Recovered by Country</h3>
              <Table countries={tableData} column="todayRecovered" />
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <h3>Today Deaths by Country</h3>
              <Table countries={tableData} column="todayDeaths" />
            </CardContent>
          </Card>
        </div>
        <div className="app_graphs">
          <div className="app__graphsPie">
            <PieGraph
              dataset={countryInfo}
              label1="cases"
              label2="population"
            />
          </div>
          <div className="app__graphsPie">
            <PieGraph dataset={countryInfo} label1="recovered" label2="cases" />
          </div>
          <div className="app__graphsPie">
            <PieGraph dataset={countryInfo} label1="deaths" label2="cases" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
