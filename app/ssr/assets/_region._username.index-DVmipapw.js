import { d as createServerRpc, c as createServerFn, j as jsxRuntimeExports } from "../server.js";
import { g as getSummonerByUsernameRateLimit, c as createFileRoute, d as regionToConstant, e as MainTitleLink, P as Profile, S as Search, f as ThemeSelector, F as FooterLinks, R as RiotGamesDisclaimer, L as Link } from "./get-summoner-by-username-rate-limit-DUX4FPAh.js";
import { d as db } from "./riot-api-DL3qE7bV.js";
import "node:async_hooks";
import "node:stream";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "node:stream/web";
import "node:assert";
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
const getUserByNameAndRegionFn_createServerFn_handler = createServerRpc("d6bee84c77c91ae738810ece8ad5e4c8bcff495a8cd90ba43c9dd2ee233800a8", (opts, signal) => {
  return getUserByNameAndRegionFn.__executeServer(opts, signal);
});
const getUserByNameAndRegionFn = createServerFn({
  method: "GET"
}).inputValidator((input) => input).handler(getUserByNameAndRegionFn_createServerFn_handler, async ({
  data
}) => {
  const {
    username,
    region
  } = data;
  try {
    const user = await getSummonerByUsernameRateLimit(username.toLowerCase(), region);
    const versionRow = await db.query.championDetails.findFirst({
      columns: {
        version: true
      }
    });
    const version = versionRow?.version ?? "latest";
    const profileIconUrl = user.summoner?.profileIconId ? `https://ddragon.leagueoflegends.com/cdn/${version}/img/profileicon/${user.summoner.profileIconId}.png` : null;
    return {
      summonerData: user.summoner,
      profileIconUrl,
      error: null
    };
  } catch (err) {
    console.log(err);
    const error = err?.status === 429 ? "rate_limit" : "not_found";
    return {
      summonerData: null,
      profileIconUrl: null,
      error
    };
  }
});
const Route = createFileRoute("/$region/$username/")({
  loader: async ({
    params: {
      username: rawUsername,
      region: rawRegion
    }
  }) => {
    const username = rawUsername.replace("-", "#");
    const region = regionToConstant(rawRegion.toUpperCase());
    const result = await getUserByNameAndRegionFn({
      data: {
        username,
        region
      }
    });
    return {
      username,
      region,
      rawUsername,
      rawRegion,
      ...result
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
      meta: [{
        name: "application-name",
        content: "LoL Mastery Tracker"
      }, {
        name: "description",
        content: "Made using Riot API. Repo can be found at https://github.com/Awolize. Built with Tanstack Start"
      }, {
        name: "keywords",
        content: [region, username, "LoL", "mastery", "tracker"].join(", ")
      }, {
        name: "title",
        content: "LoL Mastery Tracker: ${username} Profile"
      }]
    };
  }
});
function RouteComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col ", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "sticky top-0 z-30 grid grid-cols-3 w-screen justify-between bg-primary-foreground px-1 md:px-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(MainTitleLink, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Profile, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-4 right-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeSelector, {}) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Client, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "flex flex-col items-center gap-4 p-2 text-sm opacity-50", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(FooterLinks, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(RiotGamesDisclaimer, {})
    ] })
  ] });
}
function Client() {
  const {
    username,
    region,
    rawUsername,
    rawRegion,
    summonerData,
    profileIconUrl,
    error
  } = Route.useLoaderData();
  if (error === "rate_limit") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center h-screen", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl text-red-500", children: "Riot API rate limit reached. Please try again in a few seconds." }) });
  }
  if (!summonerData) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center h-screen", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl text-red-500", children: "Summoner not found." }) });
  }
  const {
    summonerLevel
  } = summonerData;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-screen w-screen justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "flex flex-col text-xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-5" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex flex-row items-center justify-center gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute left-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: profileIconUrl, alt: String(username), height: 90, width: 90 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-col items-center bg-linear-to-r from-green-600 via-sky-600 to-purple-600 bg-clip-text text-transparent", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-6xl", children: username }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-row items-center justify-between ", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-sm ", children: region }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-sm ", children: summonerLevel })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-6 ", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/$region/$username/mastery", params: {
          region: rawRegion,
          username: rawUsername
        }, preload: "intent", className: "underline", children: "Mastery Points Tracker" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm", children: [
          "Tailored for",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold italic", children: "Catch ’em all" }),
          ", but works with",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold italic", children: "Master yourself" }),
          " and",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold italic", children: "Master your enemy" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/$region/$username/different", params: {
          region: rawRegion,
          username: rawUsername
        }, preload: "intent", className: "underline", children: "Champion Tracker" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm", children: [
          "Manually track heroes. For challenges such as",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold italic", children: "All Random All Champions" }),
          ", ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold italic", children: "Jack of All Champs" }),
          ", and ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold italic", children: "Protean Override" }),
          "."
        ] })
      ] })
    ] }) })
  ] }) });
}
export {
  getUserByNameAndRegionFn_createServerFn_handler
};
