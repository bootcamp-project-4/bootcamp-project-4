// Styling
import "./styles/sass/App.scss";

//modules
import { Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";

import { getDatabase, ref, set, get } from "firebase/database";

import axios from "axios";

import firebase from "./firebase";

// components
import HomePage from "./components/HomePage";
import QuestionsPage from "./components/QuestionsPage";
import MapPage from "./components/MapPage";
import HeroProfile from "./components/HeroProfile";
import ErrorPage from "./components/ErrorPage";

function App() {
	// loader messages
	const LOADING = "Fetching data...";
	const BUILDING = "Building app...";

	// state
	const [allEarthquakeData, setAllEarthquakeData] = useState();
	const [todaysEarthquakeData, setTodaysEarthquakeData] = useState();
	const [heroesSummary, setHeroesSummary] = useState([]);
	const [firstIncidentDate, setFirstIncidentDate] = useState([]);
	const [animation, setAnimation] = useState("fade-in");
	const [isLoading, setIsLoading] = useState(true);
	const [status, setStatus] = useState(LOADING);

	useEffect(() => {
		axios({
			url: "https://earthquake.usgs.gov/fdsnws/event/1/query",
			method: "GET",
			dataResponse: "json",
			params: {
				format: "geojson",
				starttime: "2022-05-05",
				eventtype: "earthquake",
				minmagnitude: 0,
				orderby: "time",
				limit: 20000,
			},
		})
			.then((response) => {
				if (response.status === 200) {
					const listOfEarthquakes = response.data.features;
					const firstDate = new Date(
						listOfEarthquakes[
							listOfEarthquakes.length - 1
						].properties.time
					);
					const displayDate = firstDate.toDateString();

					setFirstIncidentDate(displayDate);
					loadAPIData(listOfEarthquakes);
				} else {
					throw new Error("Problem fetching from USGS API");
				}
			})
			.catch((err) => {
				alert(
					`Please hard refresh your browser with CTRL/CMD + SHIFT + R. Error message: ${err.message}`
				);
			});
	}, []);

	useEffect(() => {
		if (todaysEarthquakeData && allEarthquakeData) {
			const todaysCount = getTotals(todaysEarthquakeData);
			const totalCount = getTotals(allEarthquakeData);

			getHeroesSummary(totalCount, todaysCount);

			setIsLoading(false);
		}
	}, [todaysEarthquakeData, allEarthquakeData]);

	useEffect(() => {
		if (status === BUILDING) {
			setAnimation("fade-out");
		}
	}, [status]);

	const loadAPIData = async (earthquakesData) => {
		const database = getDatabase(firebase);
		const dbRef = ref(database, `/incidents/2022-05-05`);

		try {
			setStatus(BUILDING);

			await set(dbRef, earthquakesData);
			await getDataFromFirebase(dbRef);

			setAllEarthquakeData(earthquakesData);
		} catch (error) {
			alert(
				"Firebase data has failed to load. Please refresh your browser."
			);
		}
	};

	const getDataFromFirebase = async (dbRef) => {
		try {
			get(dbRef).then((snapshot) => {
				const firebaseData = snapshot.val();
				const copyOfFirebaseData = [...firebaseData];
				const yesterday = calculateYesterday();

				// Filtering through the Data
				const todaysData = copyOfFirebaseData.filter((incident) => {
					let eventDate = incident.properties.time;
					return yesterday <= eventDate;
				});

				// update state with todays data
				setTodaysEarthquakeData(todaysData);
			});
		} catch (error) {
			alert(
				"Firebase data has failed to load. Please refresh your browser."
			);
		}
	};

	const getHeroesSummary = async (totalCount, todaysCount) => {
		const summary = [
			{
				name: "general geology-teacher",
				totalIncidents: totalCount.geoTeacher,
				incidentsOver24Hrs: todaysCount.geoTeacher,
				bio: "The geology teacher has been sent to educate the neighbourhood on earthquake tendencies and how to prepare for any larger event.",
				fullImage: {
					src: require("./assets/geo-teacher-transparent.png"),
					alt: "A geo teacher flying through the air.",
				},
				shieldImage: {
					src: require("./assets/teal-shield.png"),
					alt: "A teal shield.",
				},
				icon: {
					src: require("./assets/geo-teacher-headshot-transparent.png"),
					alt: "headshot of geo teacher",
				},
				color: "teal",
			},
			{
				name: "rich moral",
				totalIncidents: totalCount.richMoral,
				incidentsOver24Hrs: todaysCount.richMoral,
				bio: "With their flashy technology, Rich Moral will be able to reassure the public with earthquakes that have a higher magnitude.",
				fullImage: {
					src: require("./assets/rich-moral-transparent.png"),
					alt: "The superhero Rich Moral kneeling on the ground.",
				},
				shieldImage: {
					src: require("./assets/blue-shield.png"),
					alt: "A blue shield.",
				},
				icon: {
					src: require("./assets/rich-moral-headshot-transparent.png"),
					alt: "headshot of rich moral",
				},
				color: "blue",
			},
			{
				name: "stronggoode",
				totalIncidents: totalCount.strongGoode,
				incidentsOver24Hrs: todaysCount.strongGoode,
				bio: "With unnatural lifting abilities, StrongGood will be able to handle any crisis and will reassure the public there is nothing to fear.",
				fullImage: {
					src: require("./assets/stronggoode-transparent.png"),
					alt: "The superhero, StrongGoode running fast.",
				},
				shieldImage: {
					src: require("./assets/purple-shield.png"),
					alt: "A purple shield.",
				},
				icon: {
					src: require("./assets/stronggoode-headshot-transparent.png"),
					alt: "headshot of stronggoode",
				},
				color: "purple",
			},
			{
				name: "all",
				totalIncidents: totalCount.allTeam,
				incidentsOver24Hrs: todaysCount.allTeam,
				bio: "With the strongest earthquakes, we send our entire team of superheroes to ensure safety and peace of mind to the public.",
				fullImage: {
					src: require("./assets/three-shields-transparent.png"),
					alt: "Three shields, a teal one, a blue one and a purple one.",
				},
				shieldImage: {
					src: require("./assets/three-color-square.png"),
					alt: "Teal, Blue and Purple stripes.",
				},
				icon: {
					src: require("./assets/three-shields-transparent.png"),
					alt: "Three shields, a teal one, a blue one and a purple one.",
				},
				color: "dark-purple",
			},
		];
		setHeroesSummary(summary);
	};

	const getTotals = (earthquakesList) => {
		const copyOfEarthQuakeData = [...earthquakesList];

		const teal = copyOfEarthQuakeData.filter((incident) => {
			const incidentMag = incident.properties.mag;
			if (incidentMag < 3.5) {
				return incidentMag;
			}
		});

		const blue = copyOfEarthQuakeData.filter((incident) => {
			const incidentMag = incident.properties.mag;
			if (incidentMag >= 3.5 && incidentMag < 6) {
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

	const calculateYesterday = () => {
		let today = new Date();
		let yesterday = new Date(today.getTime() - 86400000);
		let convertedYesterday = yesterday.getTime();
		return convertedYesterday;
	};

	return (
		<div className="App">
			{isLoading ? (
				<div className="loader-container">
					<p className={animation}>{status}</p>
					<div className="loader"></div>
				</div>
			) : (
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/questionspage" element={<QuestionsPage />} />
					<Route
						path="/mappage"
						element={
							<MapPage
								todaysEarthquakeData={todaysEarthquakeData}
								heroesSummary={heroesSummary}
								firstIncidentDate={firstIncidentDate}
							/>
						}
					/>
					<Route path="/heroprofile/" element={<HeroProfile />} />
					<Route path="/*" element={<ErrorPage />} />
				</Routes>
			)}
		</div>
	);
}

export default App;
