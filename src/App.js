// styling
import "./styles/sass/App.scss";

//modules
import { useEffect, useState } from "react";
import axios from "axios";


function App() {
	const [earthquakesData, setEarthquakesData] = useState([]);

	const startDate = "2022-05-05"; //start tracking from project start date

	//function to get earthquake data from USGS API.
	//startTime argument passed to the function, limits data to events on or after the specified start time
	function getEqDataFromApi(startTime){
		axios({
			url: "https://earthquake.usgs.gov/fdsnws/event/1/query",
			method: "GET",
			dataResponse: "json",
			params: {
				format: "geojson",
				starttime: startTime,
				eventtype: "earthquake",
				minmagnitude:0,
			},
		}).then((response) => {
			const listOfEarthquakes = response.data.features;
			setEarthquakesData(listOfEarthquakes);
		}).catch((err) => console.log(err));
	}

	useEffect(()=>{
		getEqDataFromApi(startDate);
	},[]);

	return (
		<div className="App">
			<h1>Hello world</h1>
		</div>
	);
}

export default App;
