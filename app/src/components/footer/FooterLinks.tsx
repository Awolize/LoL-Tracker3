import github from "./github.svg";
import githubColor from "./github-color.svg";
import league from "./leagueoflegends.svg";
import leagueColor from "./leagueoflegends-color.svg";
import riot from "./riotgames.svg";
import riotColor from "./riotgames-color.svg";

export default function FooterLinks() {
	return (
		<div className="flex flex-row gap-4">
			<a href="https://github.com/Awolize/LoL-Tracker2">
				<img alt="riotIconColor" src={githubColor} />
			</a>
			<a href="https://www.leagueoflegends.com/en-gb/">
				<img alt="leagueIconColor" src={leagueColor} />
			</a>
			<a href="https://www.riotgames.com/en">
				<img alt="riotIconColor" src={riotColor} />
			</a>
		</div>
	);
}
