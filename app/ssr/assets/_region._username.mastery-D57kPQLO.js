import { d as createServerRpc, c as createServerFn, j as jsxRuntimeExports } from "../server.js";
import { d as regionToConstant, c as createFileRoute, e as MainTitleLink, P as Profile, S as Search, f as ThemeSelector, F as FooterLinks, R as RiotGamesDisclaimer } from "./get-summoner-by-username-rate-limit-DUX4FPAh.js";
import { g as getUserByNameAndRegion, a as getCompleteChampionData, b as getMatches, U as UserProvider, O as OptionsProvider, u as useOptionsPersistentContext, H as Header, S as SortedChampionList, C as ChampionList, M as MatchHistory } from "./get-user-by-name-and-region-BNrAFR6X.js";
import "node:async_hooks";
import "node:stream";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "node:stream/web";
import "./riot-api-DL3qE7bV.js";
import "events";
import "dns";
import "fs";
import "net";
import "tls";
import "path";
import "string_decoder";
import "os";
import "http";
import "https";
import "url";
import "assert";
import "zlib";
import "querystring";
import "node:assert";
import "./upsertSummoner-ZoG_kNj-.js";
const getSummonerByNameRegion_createServerFn_handler = createServerRpc("759629d30599a30dac1d9a60952d310d2645a1365eb755f1669302fb72318eb3", (opts, signal) => {
  return getSummonerByNameRegion.__executeServer(opts, signal);
});
const getSummonerByNameRegion = createServerFn({
  method: "GET"
}).inputValidator((input) => input).handler(getSummonerByNameRegion_createServerFn_handler, async ({
  data
}) => {
  const {
    username: rawUsername,
    region: rawRegion
  } = data;
  const username = rawUsername.replace("-", "#").toLowerCase();
  const region = regionToConstant(rawRegion.toUpperCase());
  const user = await getUserByNameAndRegion(username, region);
  const [completeChampionsData, matches] = await Promise.all([getCompleteChampionData(region, user), getMatches(user, 25)]);
  return {
    user,
    playerChampionInfo: completeChampionsData.completeChampionsData,
    matches,
    version: "latest"
  };
});
const Route = createFileRoute("/$region/$username/mastery")({
  loader: async ({
    params: {
      username,
      region
    }
  }) => {
    const result = await getSummonerByNameRegion({
      data: {
        username,
        region
      }
    });
    return {
      user: result.user,
      playerChampionInfo: result.playerChampionInfo,
      matches: result.matches,
      version: result.version,
      region,
      username
    };
  },
  component: RouteComponent,
  head: ({
    loaderData
  }) => {
    if (!loaderData) return {};
    const {
      username,
      region
    } = loaderData;
    return {
      title: `LoL Mastery Tracker: ${username} Profile`,
      meta: [{
        name: "application-name",
        content: "LoL Mastery Tracker"
      }, {
        name: "description",
        content: "Made using Riot API. Repo can be found using https://github.com/Awolize. Boilerplate was generated using https://create.t3.gg/"
      }, {
        name: "keywords",
        content: [region, username, "LoL", "mastery", "tracker"].join(", ")
      }]
    };
  }
});
function RouteComponent() {
  const {
    user,
    playerChampionInfo,
    matches,
    version,
    username,
    region
  } = Route.useLoaderData();
  playerChampionInfo.sort((a, b) => a.name.localeCompare(b.name));
  return /* @__PURE__ */ jsxRuntimeExports.jsx(UserProvider, { user, children: /* @__PURE__ */ jsxRuntimeExports.jsx(OptionsProvider, { persistName: `${user.gameName}-${user.tagLine}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "sticky top-0 z-30 grid grid-cols-3 w-screen justify-between bg-primary-foreground px-1 md:px-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(MainTitleLink, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Profile, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-4 right-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeSelector, {}) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Main, { playerChampionInfo, matches, user, version }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "flex flex-col items-center gap-4 p-2 text-sm opacity-50", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(FooterLinks, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(RiotGamesDisclaimer, {})
    ] })
  ] }) }) });
}
function Main({
  playerChampionInfo,
  matches
}) {
  const byRole = useOptionsPersistentContext((state) => state.byRole);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, { champions: playerChampionInfo }),
    byRole ? /* @__PURE__ */ jsxRuntimeExports.jsx(SortedChampionList, { champions: playerChampionInfo }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChampionList, { champions: playerChampionInfo }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(MatchHistory, { matches })
  ] });
}
export {
  getSummonerByNameRegion_createServerFn_handler
};
