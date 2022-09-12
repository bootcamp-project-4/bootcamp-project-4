import { Link } from "react-router-dom";
import QuestionsPageImg from "../assets/homepage-three-shields.png";
// Font awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";

const QuestionsPage = () => {
	return (
		<div className="questions-page">
			<div className="wrapper">
				<nav>
					<Link to="/">
						<FontAwesomeIcon icon={faHouse} />
					</Link>
				</nav>
				<div className="img-container">
					<img
						src={QuestionsPageImg}
						alt="Questions page three shields"
					/>
				</div>

				<h2>Extraordinary collective of superheroes</h2>
				<p>
					When an earthquake occurs, we are the superheroes that
					answer the call! Depending on the magnitude of the
					earthquake, we select the hero with the right expertise for
					the job.
				</p>
				<p>
					This app allows us to keep track of each hero's workload,
					log each incident that they attend, and display their
					vacation days accrued in their hero profiles.
				</p>
				<h3>How to use this App</h3>
				<ul>
					<li>
						<span>1. </span>Click on "Find Earthquakes" to view
						incidents that have happened within 24 hours
					</li>
					<li>
						<span>2. </span>To see total amount of incidents
						attended to by each superhero, click on their portrait
					</li>
				</ul>
				<Link to="/mappage" className="btn">
					Find Earthquakes
				</Link>
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

export default QuestionsPage;
