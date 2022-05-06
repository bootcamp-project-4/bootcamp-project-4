// styling
import "./styles/sass/App.scss";

//modules
import { useEffect, useState } from "react";
import axios from "axios";


function App() {
	const [earthquakes, setEarthquakes] = useState([]);

	const startDate = "2022-05-06" //start tracking from project start date

	//TODO: move function to separate module and import
	function getEqDataFromApi(){
		axios({
			url: "https://earthquake.usgs.gov/fdsnws/event/1/query",
			method: "GET",
			dataResponse: "json",
			params: {
				format: "geojson",
				starttime: startDate,
				eventtype: "earthquake",
				// ? are we limiting the search to a specific location? if so, we may want to add the following parameters as well: minlatitude, minlongitude,maxlatitude,maxlongitude
			},
		})
		.then(response=> {
			const listOfEarthquakes = response.data.features;
			console.log(listOfEarthquakes);
			// ? need to get the following properties for each earthquake object in the array. any more?
				//geometry.coordinates[0] - longitude
				//geometry.coordinates[1] - latitude
				//properties.mag - magnitude
				//properties.ids - event id
				//properties.place - location of event
				//properties.time - date and time of event in numerical format. maybe convert to Date using new Date()
				//properties.tsunami - for stretch goals
			const filteredEarthquakes = listOfEarthquakes.map(earthquake => {
				return ({
					"longitude":earthquake.geometry.coordinates[0],
					"latitude":earthquake.geometry.coordinates[1],
					"magnitude":earthquake.properties.mag,
					"id":earthquake.properties.ids,
					"location": earthquake.properties.place,
					"date": new Date(earthquake.properties.time),
					"tsunami": earthquake.properties.tsunami
				})
			})
			setEarthquakes(filteredEarthquakes);
		})
		.catch(err=>console.log(err));
	}

	useEffect(()=>{
		getEqDataFromApi();
		console.log(earthquakes);
	},[]);

	return (
		<div className="App">
			<h1>Hello world</h1>
		</div>
	);
}

export default App;
