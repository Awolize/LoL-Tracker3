import { j as jsxRuntimeExports } from "../server.js";
import { e as MainTitleLink, P as Profile, S as Search, f as ThemeSelector, F as FooterLinks, R as RiotGamesDisclaimer } from "./get-summoner-by-username-rate-limit-DUX4FPAh.js";
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
function RouteComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "sticky top-0 z-30 grid grid-cols-3 w-screen justify-between bg-primary-foreground px-1 md:px-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(MainTitleLink, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Profile, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-4 right-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeSelector, {}) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex flex-col", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: 'Hello "/$region/$username/different"!' }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "flex flex-col items-center gap-4 p-2 text-sm opacity-50", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(FooterLinks, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(RiotGamesDisclaimer, {})
    ] })
  ] });
}
export {
  RouteComponent as component
};
