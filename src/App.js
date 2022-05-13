// Styling
import "./styles/sass/App.scss";
// Firebase Config
import firebase from "./firebase";
import {
	getDatabase,
	ref,
	onValue,
	push,
	remove,
	set,
	update,
	get,
} from "firebase/database";
//modules
import { useEffect, useState } from "react";
import axios from "axios";

// components
import Map from "./components/Map";
import TotalEarthquakeDisplay from "./components/TotalEarthquakeDisplay";
import TodaysEarthquakeDisplay from "./components/TodaysEarthquakeDisplay";

function App() {
	const [earthquakesData, setEarthquakesData] = useState([]);
	const [todaysEarthquakeData, setTodaysEarthquakeData] = useState([]);
	const [todaysCount, setTodaysCount] = useState([]);
	const [totalCount, setTotalCount] = useState([]);
	const [heroesSummary, setHeroesSummary] = useState([]);

	const startDate = "2022-05-05"; //start tracking from project start date
	let today = new Date();
	let userDate = today.toLocaleDateString("en-US");

	//function to get earthquake data from USGS API.
	//startTime argument passed to the function, limits data to events on or after the specified start time
	const getEqDataFromApi = (startTime) => {
		axios({
			url: "https://earthquake.usgs.gov/fdsnws/event/1/query",
			method: "GET",
			dataResponse: "json",
			params: {
				format: "geojson",
				starttime: startTime,
				eventtype: "earthquake",
				minmagnitude: 0,
				orderby: "time",
				limit: 20000,
			},
		})
			.then((response) => {
				const listOfEarthquakes = response.data.features;
				setEarthquakesData(listOfEarthquakes);
				console.log(listOfEarthquakes);
			})

			// Error 2: USGS API Call fails
			// When this happens, alert the user with the error message
			// It tells the user, what part of the app failed
			// IT tells the user, what to do next (hard-refresh: CTRL/CMD + SHIFT + R)

			// Error 3: API response array item limit reached (20,000 response objects)
			// When this happens, alert the user with the error message "Limit reached, data as far back as X"
			// If the limit is reached, grab the item at the end of the response object array,
			// target its time property, convert the time into a date, and then render that date
			// to the page as X, for example: "Total earthquake incidents since X"

			.catch((err) => console.log(err));
	};

	// Firebase Database
	const loadDataToFirebase = async (earthquakesData) => {
		const database = getDatabase(firebase);
		const dbRef = ref(database, `/incidents/${startDate}`);

		set(dbRef, earthquakesData);
		// Error 4: Firebase "set" method fails
		// Wrap the "set" method in a try...catch code block
		// If the try succeeds (i.e. sets the earthquake data at the dbRef), do nothing
		// If the try fails, capture the error, and alert the user indicating that the firebase "set" failed
	};

	const getDataFromFirebase = async () => {
		const database = getDatabase(firebase);
		const dbRef = ref(database, `/incidents/${startDate}`);

		// Error 5: Firebase "get" method fails
		// Wrap the get method in a try...catch block
		// If the try succeeds (i.e. sets the earthquake data at the dbRef), do nothing
		// If the try fails, capture the error, and alert the user indicating that the firebase "set" failed

		// Getting Data from Firebase
		get(dbRef).then((snapshot) => {
		const firebaseData = snapshot.val();
		const copyOfFirebaseData = [...firebaseData];

		// Filtering through the Data to get today's incidents
		//TODO: maybe update variable name below, since the state variable also has this name
		const todaysEarthquakeData = copyOfFirebaseData.filter((incident) => {
			// Converting the time from milliseconds to yyyy-mm-dd
			let rawDate = new Date(incident.properties.time);
			let convertedDate = rawDate.toLocaleDateString("en-US");

			return userDate === convertedDate;
		});
		setTodaysEarthquakeData(todaysEarthquakeData);
		});
	};

	//TODO: maybe consider changing parameter name
	const getTotals = (earthquakesData) => {
		const copyOfEarthQuakeData = [...earthquakesData];

		const teal = copyOfEarthQuakeData.filter((incident) => {
			const incidentMag = incident.properties.mag;
			if (incidentMag < 3) {
				return incidentMag;
			}
		});

		const blue = copyOfEarthQuakeData.filter((incident) => {
			const incidentMag = incident.properties.mag;
			if (incidentMag >= 3 && incidentMag < 6) {
				return incidentMag;
			}
		});

		const purple = copyOfEarthQuakeData.filter((incident) => {
			const incidentMag = incident.properties.mag;
			if (incidentMag >= 6 && incidentMag < 7) {
				return incidentMag;
			}
		});

		const darkPurple = copyOfEarthQuakeData.filter((incident) => {
			const incidentMag = incident.properties.mag;
			if (incidentMag >= 7) {
				return incidentMag;
			}
		});

		const heroTotals = {
			geoTeacher: teal.length,
			richMoral: blue.length,
			strongGoode: purple.length,
			allTeam: darkPurple.length,
		};
		return heroTotals;
	};

	const getHeroesSummary = () => {
		const summary = [
			{
				name: "general geology-teacher",
				totalIncidents: totalCount.geoTeacher,
				incidentsOver24Hrs: todaysCount.geoTeacher,
			},
			{
				name: "rich moral",
				totalIncidents: totalCount.richMoral,
				incidentsOver24Hrs: todaysCount.richMoral,
			},
			{
				name: "stronggoode",
				totalIncidents: totalCount.strongGoode,
				incidentsOver24Hrs: todaysCount.strongGoode,
			},
			{
				name: "all",
				totalIncidents: totalCount.allTeam,
				incidentsOver24Hrs: todaysCount.allTeam,
			},
		];
		setHeroesSummary(summary);
	};

	//on page load, the code in this useEffect is run
	//first step is to get data from APT
	useEffect(() => {
		getEqDataFromApi(startDate); 
    }, []);

	useEffect(() => {
		const fetchData = async () => {
			function sleep(ms) {
				return new Promise((resolve) => setTimeout(resolve, ms));
			}

			await loadDataToFirebase(earthquakesData);
			await sleep(1000);
			await getDataFromFirebase();
			// Error 1: API loading indicator
			// When page loads, isLoading state value = true
			// Once the functions above are done running (3 promises), toggle isLoading state = false
			// When this happens, conditionally render "loading" modal/element

			const allTotalCount = getTotals(earthquakesData);
			setTotalCount(allTotalCount);
		};
		fetchData();
	}, [earthquakesData]);

	useEffect(() => {
		const todayTotalCount = getTotals(todaysEarthquakeData);
		setTodaysCount(todayTotalCount);
    }, [todaysEarthquakeData]);

	useEffect(() => {
		getHeroesSummary();
	}, [totalCount, todaysCount]);

	return (
		<div className="App">
			<h1>Hello world!</h1>
			<Map earthquakesData={todaysEarthquakeData} />
			<TotalEarthquakeDisplay heroesSummary={heroesSummary} />
			<TodaysEarthquakeDisplay heroesSummary={heroesSummary} />
		</div>
	);
}

export default App;
