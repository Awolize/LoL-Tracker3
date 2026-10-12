import * as Sentry from "@sentry/tanstackstart-react";
import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { motion } from "motion/react";

import FooterLinks from "~/components/footer/FooterLinks";
import RiotGamesDisclaimer from "~/components/footer/RiotGamesDisclaimer";
import { SiteHeader } from "~/components/header/SiteHeader";
import { CapstonePanel } from "~/features/challenges/capstone-panel";
import { ProfileChallengesSection } from "~/features/challenges/profile-challenges-section";
import type { ProfileHubChallengesPayload } from "~/features/challenges/types/profile-challenge-row";
import { regionToConstant, regionToDisplay } from "~/features/shared/champs";
import { PersonalRecordsPanel } from "~/features/summoner/components/personal-records";
import { RecentFormPanel, RECENT_FORM_GAMES } from "~/features/summoner/components/recent-form";
import { FullSummonerUpdate } from "~/features/summoner/components/summoner-update";
import type { ProfileCapstones } from "~/server/challenges/capstone-progress";
import type { FormEntry } from "~/server/matches/match-participants";
import { getRecentFormFn, getUserQueuesFn } from "~/server/matches/mutations";
import {
	getPersonalRecordsFn,
	getProfileCapstonesFn,
	getProfileHubChallengesFn,
	getUserByNameAndRegionFn,
} from "~/server/summoner/mutations";
import type { PersonalRecords } from "~/server/summoner/personal-records";
import { seo } from "~/utils/seo";

const containerVariants = {
	hidden: { opacity: 0 },
	show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	show: { opacity: 1, y: 0 },
};

export const Route = createFileRoute("/$region/$username/")({
	loader: async ({ params: { username: rawUsername, region: rawRegion } }) => {
		const lastDash = rawUsername.lastIndexOf("-");
		const username = rawUsername.slice(0, lastDash) + "#" + rawUsername.slice(lastDash + 1);
		const region = regionToConstant(rawRegion.toUpperCase());

		Sentry.metrics.count("profile_view", 1, {
			attributes: { endpoint: `/${rawRegion}/${rawUsername}`, region, username },
		});

		const result = await getUserByNameAndRegionFn({
			data: { username, region },
		});

		// Name changed - PUUID fallback found the new name
		if (result.error === "name_changed" && result.newUsername) {
			throw redirect({
				to: "/$region/$username",
				params: {
					region: rawRegion,
					username: result.newUsername.replace("#", "-"),
				},
				statusCode: 301,
			});
		}

		// Truly not found - 404 the page
		if (result.error === "not_found") {
			throw notFound();
		}

		if (result.error === "rate_limit") {
			throw redirect({ to: "/", search: { error: "rate_limit" } });
		}

		let profileChallenges: ProfileHubChallengesPayload | null = null;
		let personalRecords: PersonalRecords | null = null;
		let capstones: ProfileCapstones | null = null;
		let recentForm: FormEntry[] = [];
		let formQueueIds: number[] = [];
		if (result.summonerData) {
			// Independent of each other, so they share one round trip.
			[profileChallenges, personalRecords, capstones, recentForm, formQueueIds] =
				await Promise.all([
					getProfileHubChallengesFn({ data: { puuid: result.summonerData.puuid } }),
					getPersonalRecordsFn({ data: { puuid: result.summonerData.puuid } }),
					getProfileCapstonesFn({ data: { puuid: result.summonerData.puuid } }),
					getRecentFormFn({
						data: { puuid: result.summonerData.puuid, take: RECENT_FORM_GAMES },
					}),
					getUserQueuesFn({ data: { puuid: result.summonerData.puuid } }),
				]);
		}

		return {
			username,
			region,
			rawUsername,
			rawRegion,
			profileChallenges,
			personalRecords,
			capstones,
			recentForm,
			formQueueIds,
			...result,
		};
	},
	component: RouteComponent,
	head: ({ loaderData }) => {
		if (!loaderData) return {};
		const { username, region, summonerData, error } = loaderData;
		const regionLabel = regionToDisplay(region);

		if (error === "rate_limit") {
			return {
				meta: [
					...seo({
						title: `League profile temporarily unavailable - ${username} (${regionLabel})`,
						description: `Riot's League of Legends API rate limit was hit while loading ${username} on ${regionLabel}. Wait a few seconds, refresh, and try again to open mastery, challenges, and match history.`,
						keywords: [regionLabel, username, "LoL", "mastery", "tracker"].join(", "),
					}),
				],
			};
		}

		if (!summonerData) {
			return {
				meta: [
					...seo({
						title: `Summoner not found - ${username} (${regionLabel})`,
						description: `We could not find ${username} on the ${regionLabel} shard. Double-check the Riot ID spelling, tag line, and region, then search again to load champion mastery, challenge helpers, and match history.`,
						keywords: [regionLabel, username, "LoL", "mastery", "tracker"].join(", "),
					}),
				],
			};
		}

		const { summonerLevel } = summonerData;
		return {
			meta: [
				...seo({
					title: `${username} (${regionLabel}) - League mastery, challenges and match hub`,
					description: `${username} on ${regionLabel}, summoner level ${summonerLevel}: champion mastery totals, challenges, and recent LoL match history (Riot API).`,
					keywords: [
						regionLabel,
						username,
						"LoL",
						"mastery",
						"tracker",
						"challenges",
					].join(", "),
				}),
			],
		};
	},
});

export default function RouteComponent() {
	return (
		<div className="flex min-h-screen flex-col">
			<Header />
			<main className="flex-1">
				<Client />
			</main>
			<Footer />
		</div>
	);
}

function Client() {
	const {
		username,
		region,
		rawUsername,
		rawRegion,
		summonerData,
		profileIconUrl,
		error,
		profileChallenges,
		personalRecords,
		capstones,
		recentForm,
		formQueueIds,
	} = Route.useLoaderData();

	if (error === "rate_limit")
		return (
			<ErrorState
				title="Riot API rate limit reached"
				message="Please try again in a few seconds."
			/>
		);
	if (!summonerData)
		return (
			<ErrorState
				title="Summoner not found"
				message="Please check the username and region."
			/>
		);

	const { summonerLevel } = summonerData;

	return (
		<div className="flex w-full justify-center px-4 py-8">
			<motion.div
				className="flex w-full max-w-3xl flex-col gap-12"
				variants={containerVariants}
				initial="hidden"
				animate="show"
			>
				<motion.div variants={itemVariants} className="flex flex-col items-center gap-6">
					<div className="flex w-full flex-col gap-6 sm:grid sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:gap-4">
						<div className="flex w-full shrink-0 justify-start sm:w-auto sm:justify-self-start">
							<div className="relative shrink-0">
								<img
									src={
										profileIconUrl ??
										"/api/images/cdn/latest/img/profileicon/29.webp"
									}
									alt={username}
									className="border-primary bg-accent h-24 w-24 rounded-full border-4 object-cover shadow-lg"
								/>
							</div>
						</div>
						<div className="mx-auto w-max max-w-full min-w-0 sm:mx-0">
							<div className="grid w-full grid-cols-1 justify-items-center text-center">
								<h2 className="bg-linear-to-r from-green-600 via-sky-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent md:text-6xl">
									{username}
								</h2>
								<div className="text-muted-foreground mt-1 flex w-full min-w-0 justify-between gap-4 text-sm font-bold">
									<span className="uppercase">{regionToDisplay(region)}</span>
									<span className="shrink-0 tabular-nums">
										Level {summonerLevel}
									</span>
								</div>
							</div>
						</div>
					</div>

					<FullSummonerUpdate user={{ ...summonerData, region }} awaitMatches={false} />
				</motion.div>

				{recentForm.length > 1 ? (
					<motion.div variants={itemVariants}>
						<RecentFormPanel
							entries={recentForm}
							puuid={summonerData?.puuid ?? ""}
							queueIds={formQueueIds}
						/>
					</motion.div>
				) : null}

				{personalRecords ? (
					<motion.div variants={itemVariants}>
						<PersonalRecordsPanel records={personalRecords} />
					</motion.div>
				) : null}

				{capstones && profileChallenges ? (
					<motion.div variants={itemVariants}>
						<CapstonePanel
							capstones={capstones}
							dataDragonVersion={profileChallenges.dataDragonVersion}
						/>
					</motion.div>
				) : null}

				{profileChallenges ? (
					<motion.div variants={itemVariants}>
						<ProfileChallengesSection
							rows={profileChallenges.rows}
							challengesSynced={profileChallenges.challengesSynced}
							dataDragonVersion={profileChallenges.dataDragonVersion}
							rawRegion={rawRegion}
							rawUsername={rawUsername}
							hubUsername={username}
						/>
					</motion.div>
				) : null}
			</motion.div>
		</div>
	);
}

function Header() {
	return <SiteHeader variant="hub" />;
}

function Footer() {
	return (
		<footer className="flex flex-col items-center gap-4 p-6 text-sm opacity-50">
			<FooterLinks />
			<RiotGamesDisclaimer />
		</footer>
	);
}

function ErrorState({ title, message }: { title: string; message: string }) {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="flex h-[60vh] flex-col items-center justify-center gap-2"
		>
			<p className="text-xl font-semibold text-red-500">{title}</p>
			<p className="text-muted-foreground text-sm">{message}</p>
		</motion.div>
	);
}
