/**
 * Summoner spells, keyed by the numeric id Match-V5 stores (`summoner1Id` / `summoner2Id`).
 *
 * Data Dragon names spell images (`SummonerFlash.png`) rather than numbering them, so a stored id
 * needs this map to become an image. Ids, names and file names come from the published spell list,
 * <https://ddragon.leagueoflegends.com/cdn/<version>/data/en_US/summoner.json>; the `_Jade` entries
 * are the classic variants, which have their own ids and art and are reachable in this app because
 * it still serves the classic champion set.
 */
const SPELLS: Record<number, { name: string; image: string }> = {
	1: { name: "Cleanse", image: "SummonerBoost" },
	3: { name: "Exhaust", image: "SummonerExhaust" },
	4: { name: "Flash", image: "SummonerFlash" },
	6: { name: "Ghost", image: "SummonerHaste" },
	7: { name: "Heal", image: "SummonerHeal" },
	11: { name: "Smite", image: "SummonerSmite" },
	12: { name: "Teleport", image: "SummonerTeleport" },
	13: { name: "Clarity", image: "SummonerMana" },
	14: { name: "Ignite", image: "SummonerDot" },
	21: { name: "Barrier", image: "SummonerBarrier" },
	30: { name: "To the King!", image: "SummonerPoroRecall" },
	31: { name: "Poro Toss", image: "SummonerPoroThrow" },
	32: { name: "Mark", image: "SummonerSnowball" },
	39: { name: "Mark", image: "SummonerSnowURFSnowball_Mark" },
	54: { name: "Ultimate Book", image: "Summoner_UltBookPlaceholder" },
	55: { name: "Ultimate Book (Smite)", image: "Summoner_UltBookSmitePlaceholder" },

	// Classic ("Jade") variants.
	71: { name: "Cleanse", image: "SummonerBoost_Jade" },
	73: { name: "Exhaust", image: "SummonerExhaust_Jade" },
	74: { name: "Flash", image: "SummonerFlash_Jade" },
	75: { name: "Clairvoyance", image: "SummonerClairvoyance_Jade" },
	76: { name: "Ghost", image: "SummonerHaste_Jade" },
	77: { name: "Heal", image: "SummonerHeal_Jade" },
	705: { name: "Fortify", image: "SummonerFortify_Jade" },
	709: { name: "Rally", image: "SummonerRally_Jade" },
	711: { name: "Smite", image: "SummonerSmite_Jade" },
	712: { name: "Teleport", image: "SummonerTeleport_Jade" },
	713: { name: "Clarity", image: "SummonerMana_Jade" },
	714: { name: "Ignite", image: "SummonerDot_Jade" },
	716: { name: "Surge", image: "SummonerBattleCry_Jade" },
	720: { name: "Promote", image: "SummonerSpell_Promote_Jade" },
	721: { name: "Barrier", image: "SummonerBarrier_Jade" },
	777: { name: "Revive", image: "SummonerRevive_Jade" },

	// Arena.
	2201: { name: "Flee", image: "SummonerCherryHold" },
	2202: { name: "Flash", image: "SummonerCherryFlash" },
};

/**
 * A spell's display name and image file. Unknown ids still get a usable label — Riot adds spells
 * between patches, and a new one should not blank the row. Id 0 is not a spell at all: it is the
 * empty slot Match-V5 reports.
 */
export const summonerSpell = (spellId: number): { name: string; image?: string } => {
	if (!spellId) return { name: "No spell" };
	return SPELLS[spellId] ?? { name: `Spell ${spellId}` };
};
