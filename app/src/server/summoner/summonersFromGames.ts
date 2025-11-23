import type { Regions } from "twisted/dist/constants";
import type { MatchV5DTOs } from "twisted/dist/models-dto";
import { createSummoner } from "@/server/summoner/create-summoner";

export const summonersFromGames = (game: MatchV5DTOs.MatchDto) => {
	const participantSummoners = game.metadata.participants;

	// Create or find existing Summoner records for each participant

	const summonerPromises = participantSummoners.map(async (participant) => {
		const region: Regions | null = game.metadata.matchId.split(
			"_",
		)[0] as Regions | null;
		if (!region) {
			console.log(
				`could not summonersFromGames based on matchId splice ${game.metadata.matchId}`,
			);
			throw new Error(
				`could not summonersFromGames based on matchId splice ${game.metadata.matchId}`,
			);
		}

		const upsertedSummoner = createSummoner(participant, region);

		return upsertedSummoner;
	});

	return summonerPromises;
};
