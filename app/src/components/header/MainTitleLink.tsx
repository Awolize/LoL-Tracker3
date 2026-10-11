import { Link } from "@tanstack/react-router";

import { headerWordmarkClassName } from "./header-link";
import { MainText } from "./MainText";

/** The wordmark only — the Challenge directory link moved into `HeaderNav` so the header's links live in one place. */
export const MainTitleLink = () => {
	return (
		<div className="flex h-full w-full max-w-full items-center justify-start gap-4 align-middle">
			<Link to="/" className={headerWordmarkClassName}>
				<MainText bold="medium" lg={false} />
			</Link>
		</div>
	);
};
