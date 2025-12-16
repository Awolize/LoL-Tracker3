import { Link } from "@tanstack/react-router";
import { MainText } from "./MainText";

export const MainTitleLink = () => {
	return (
		<div className="flex h-full w-full max-w-full items-center justify-center align-middle gap-4">
			<Link to="/" className="rounded px-2 hover:bg-gray-600">
				<MainText bold="medium" lg={false} />
			</Link>
			<Link to="/challenges" className="rounded px-2 hover:bg-gray-600 text-sm">
				Challenges
			</Link>
		</div>
	);
};
