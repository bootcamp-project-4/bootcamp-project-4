// Components
import Map from "./Map";
import TotalEarthquakeDisplay from "./TotalEarthquakeDisplay";
import TodaysEarthquakeDisplay from "./TodaysEarthquakeDisplay";
import MagLegend from "./MagLegend";

// Modules
import { Link } from "react-router-dom";

// Font awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";

const MapPage = ({
	todaysEarthquakeData,
	heroesSummary,
	firstIncidentDate,
}) => {
	return (
		<div className="outer-map-page wrapper">
			<div>
				<div className="home-icon-map-page">
					<nav>
						<Link to="/">
							<FontAwesomeIcon icon={faHouse} />
						</Link>
					</nav>
				</div>
				<div className="map-page">
					<div className="map-container">
						<div className="map-title-legend">
							<div className="map-title-container">
								<h1>
									Earthquakes <span>(Past 24 hrs)</span>
								</h1>
								<p>
									Click on the map markers to learn about the
									incidents.
								</p>
							</div>
							<MagLegend />
						</div>
						<Map earthquakesData={todaysEarthquakeData} />
						<Link to="/questionspage" className="btn">
							Questions?
						</Link>
					</div>
					<div className="legend-container">
						<TotalEarthquakeDisplay
							heroesSummary={heroesSummary}
							firstIncidentDate={firstIncidentDate}
						/>
						<TodaysEarthquakeDisplay
							heroesSummary={heroesSummary}
						/>
					</div>
				</div>
				<footer>
					Created by
					<a
						href="https://www.nicolebeckles.dev/"
						target="_blank"
						rel="noopener noreferrer"
					>
						{" "}
						Nicole Beckles |{" "}
					</a>
					<a
						href="https://www.royalbai.com"
						target="_blank"
						rel="noopener noreferrer"
					>
						Royal Bai |{" "}
					</a>
					<a
						href="https://www.gabrielwright.ca"
						target="_blank"
						rel="noopener noreferrer"
					>
						Gabriel Wright |{" "}
					</a>
					<a
						href="https://www.ellegassner.com/"
						target="_blank"
						rel="noopener noreferrer"
					>
						Elle Gassner{" "}
					</a>{" "}
					at
					<a
						href="https://junocollege.com/"
						target="_blank"
						rel="noopener noreferrer"
					>
						{" "}
						Juno College of Technology
					</a>
				</footer>
			</div>
		</div>
	);
};

export default MapPage;
