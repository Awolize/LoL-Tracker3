// app/routes/$region/$username.tsx
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { db } from "@/db";
import { regionToConstant } from "@/lib/champs";
import { getUserByNameAndRegion } from "@/server/get-user-by-name-and-region";

const paramsSchema = z.object({
	region: z.string(),
	username: z.string(),
});

export const Route = createFileRoute("/$region/$username/")({
	loader: async ({ params }) => {
		const { region: rawRegion, username: rawUsername } =
			paramsSchema.parse(params);
		const username = rawUsername.replace("-", "#");
		const region = regionToConstant(rawRegion.toUpperCase());

		let summonerData;
		let error: string | null = null;

		try {
			summonerData = await getUserByNameAndRegion(
				username.toLowerCase(),
				region,
			);
		} catch (err: any) {
			if (err?.status === 429) {
				error = "rate_limit";
			} else {
				error = "not_found";
			}
		}

		const versionRow = await db.query.championDetails.findFirst({
			columns: { version: true },
		});
		const version = versionRow?.version ?? "latest";

		const profileIconUrl =
			summonerData?.profileIconId != null
				? `https://ddragon.leagueoflegends.com/cdn/${version}/img/profileicon/${summonerData.profileIconId}.png`
				: null;

		return {
			username,
			region,
			rawUsername,
			summonerData,
			profileIconUrl,
			error,
		};
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { username, region, rawUsername, summonerData, profileIconUrl, error } =
		Route.useLoaderData();

	if (error === "rate_limit") {
		return (
			<div className="flex items-center justify-center h-screen">
				<p className="text-xl text-red-500">
					Riot API rate limit reached. Please try again in a few seconds.
				</p>
			</div>
		);
	}

	if (!summonerData) {
		return (
			<div className="flex items-center justify-center h-screen">
				<p className="text-xl text-red-500">Summoner not found.</p>
			</div>
		);
	}

	const { summonerLevel } = summonerData;

	return (
		<div className="flex h-screen w-screen justify-center">
			<ul className="flex flex-col text-xl">
				<div className="h-5" />
				<div className="relative flex flex-row items-center justify-center gap-6">
					<div className="absolute left-0">
						<img
							src={profileIconUrl!}
							alt={String(username)}
							height={90}
							width={90}
						/>
					</div>
					<div className="flex-col items-center bg-linear-to-r from-green-600 via-sky-600 to-purple-600 bg-clip-text text-transparent">
						<div className="text-6xl">{username}</div>
						<div className="flex flex-row items-center justify-between ">
							<div className="font-bold text-sm ">{region}</div>
							<div className="font-bold text-sm ">{summonerLevel}</div>
						</div>
					</div>
				</div>
				<div className="h-10" />
				<div className="flex flex-col items-center">
					<div className="flex flex-col gap-6 ">
						<div>
							<a href={`${rawUsername}/mastery`} className="underline">
								Mastery Points Tracker
							</a>
							<div className="text-sm">
								Tailored for{" "}
								<span className="font-bold italic">Catch ’em all</span>, but
								works with{" "}
								<span className="font-bold italic">Master yourself</span> and{" "}
								<span className="font-bold italic">Master your enemy</span>
							</div>
						</div>
						<div>
							<a href={`${rawUsername}/different`} className="underline">
								Champion Tracker
							</a>
							<div className="text-sm">
								Manually track heroes. For challenges such as{" "}
								<span className="font-bold italic">
									All Random All Champions
								</span>
								, <span className="font-bold italic">Jack of All Champs</span>,
								and <span className="font-bold italic">Protean Override</span>.
							</div>
						</div>
					</div>
				</div>
			</ul>
		</div>
	);
}
