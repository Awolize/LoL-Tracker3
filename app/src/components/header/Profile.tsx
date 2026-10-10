import { Link, useRouterState } from "@tanstack/react-router";

import { headerLinkClassName } from "~/components/header/header-link";
import { isShardRegionParam, regionToDisplay } from "~/features/shared/champs";
import { parseRiotId } from "~/features/shared/riot-id";

export default function Profile() {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const segments = pathname.split("/").filter(Boolean);
	const [regionSegment, usernameSegment] = segments;

	if (!regionSegment || !usernameSegment || !isShardRegionParam(regionSegment)) {
		return null;
	}

	return (
		<div className="flex h-full w-full flex-row items-center justify-center px-4 align-middle">
			<Link
				to="/$region/$username"
				params={{ region: regionSegment, username: usernameSegment }}
				className={headerLinkClassName}
			>
				{parseRiotId(usernameSegment)} ({regionToDisplay(regionSegment)})
			</Link>
		</div>
	);
}
