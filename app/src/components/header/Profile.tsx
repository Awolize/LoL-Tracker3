import { Link, useRouterState } from "@tanstack/react-router";

export default function Profile() {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const [_, server, username] = pathname.split("/");

	return (
		<div className="flex h-full w-full flex-row items-center justify-center px-4 align-middle">
			<Link
				to="/$region/$username"
				params={{ region: server, username: username }}
				className="rounded p-1 hover:bg-gray-600"
			>
				{username?.replace("-", "#")} ({server})
			</Link>
		</div>
	);
}
