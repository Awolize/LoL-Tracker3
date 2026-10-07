import { Link } from "@tanstack/react-router";

import { headerLinkClassName, headerWordmarkClassName } from "./header-link";
import { MainText } from "./MainText";

export const MainTitleLink = () => {
	return (
		<div className="flex h-full w-full max-w-full items-center justify-center gap-4 align-middle">
			<Link to="/" className={headerWordmarkClassName}>
				<MainText bold="medium" lg={false} />
			</Link>
			<Link to="/challenges" className={headerLinkClassName}>
				Challenges
			</Link>
		</div>
	);
};
