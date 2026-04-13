import { Link } from "@tanstack/react-router";

import { MainText } from "./MainText";

export const MainTitleLink = () => {
	return (
		<div className="flex h-full w-full max-w-full items-center justify-center gap-4 align-middle">
			<Link to="/" className="rounded px-2 hover:bg-gray-600">
				<MainText bold="medium" lg={false} />
			</Link>
			<Link to="/challenges" className="rounded px-2 text-sm hover:bg-gray-600">
				Challenges
			</Link>
		</div>
	);
};
