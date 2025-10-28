import { i as isModuleNotFoundError, r as reactExports, R as RouterCore, j as jsxRuntimeExports, u as useRouter, a as useRouterState, b as isRedirect, c as createServerFn, d as createServerRpc, g as getDefaultExportFromCjs$1, e as getAugmentedNamespace, f as commonjsGlobal } from "../server.js";
import { c as createFileRoute, a as createLazyFileRoute, r as reactDomExports, b as createRootRouteWithContext, T as ThemeProvider, M as MainText, S as Search, d as regionToConstant, e as MainTitleLink, P as Profile, f as ThemeSelector, F as FooterLinks, R as RiotGamesDisclaimer, g as getSummonerByUsernameRateLimit, L as Link } from "./get-summoner-by-username-rate-limit-DUX4FPAh.js";
import { d as db, r as requireLodash, a as requireMimeTypes, m as mainExports } from "./riot-api-DL3qE7bV.js";
import * as stream$1 from "stream";
import stream__default, { pipeline } from "stream";
import require$$1$1 from "string_decoder";
import require$$0 from "events";
import require$$4 from "timers";
import * as crypto from "crypto";
import * as fs from "fs";
import * as http from "http";
import * as https from "https";
import * as path from "path";
import require$$2 from "buffer";
import require$$0$1, { promisify as promisify$1 } from "util";
import { inherits as inherits$1 } from "node:util";
import require$$10 from "node:string_decoder";
import { promises } from "node:fs";
import { U as UserProvider, O as OptionsProvider, g as getUserByNameAndRegion, a as getCompleteChampionData, b as getMatches, u as useOptionsPersistentContext, H as Header, S as SortedChampionList, C as ChampionList, M as MatchHistory } from "./get-user-by-name-and-region-BNrAFR6X.js";
function lazyRouteComponent(importer, exportName) {
  let loadPromise;
  let comp;
  let error;
  let reload;
  const load = () => {
    if (!loadPromise) {
      loadPromise = importer().then((res) => {
        loadPromise = void 0;
        comp = res[exportName];
      }).catch((err) => {
        error = err;
        if (isModuleNotFoundError(error)) {
          if (error instanceof Error && typeof window !== "undefined" && typeof sessionStorage !== "undefined") {
            const storageKey = `tanstack_router_reload:${error.message}`;
            if (!sessionStorage.getItem(storageKey)) {
              sessionStorage.setItem(storageKey, "1");
              reload = true;
            }
          }
        }
      });
    }
    return loadPromise;
  };
  const lazyComp = function Lazy(props) {
    if (reload) {
      window.location.reload();
      throw new Promise(() => {
      });
    }
    if (error) {
      throw error;
    }
    if (!comp) {
      throw load();
    }
    return reactExports.createElement(comp, props);
  };
  lazyComp.preload = load;
  return lazyComp;
}
const createRouter = (options) => {
  return new Router(options);
};
class Router extends RouterCore {
  constructor(options) {
    super(options);
  }
}
if (typeof globalThis !== "undefined") {
  globalThis.createFileRoute = createFileRoute;
  globalThis.createLazyFileRoute = createLazyFileRoute;
} else if (typeof window !== "undefined") {
  window.createFileRoute = createFileRoute;
  window.createLazyFileRoute = createLazyFileRoute;
}
function Asset({
  tag,
  attrs,
  children: children2,
  nonce
}) {
  switch (tag) {
    case "title":
      return /* @__PURE__ */ jsxRuntimeExports.jsx("title", { ...attrs, suppressHydrationWarning: true, children: children2 });
    case "meta":
      return /* @__PURE__ */ jsxRuntimeExports.jsx("meta", { ...attrs, suppressHydrationWarning: true });
    case "link":
      return /* @__PURE__ */ jsxRuntimeExports.jsx("link", { ...attrs, nonce, suppressHydrationWarning: true });
    case "style":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        "style",
        {
          ...attrs,
          dangerouslySetInnerHTML: { __html: children2 },
          nonce
        }
      );
    case "script":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Script, { attrs, children: children2 });
    default:
      return null;
  }
}
function Script({
  attrs,
  children: children2
}) {
  const router2 = useRouter();
  reactExports.useEffect(() => {
    if (attrs?.src) {
      const normSrc = (() => {
        try {
          const base = document.baseURI || window.location.href;
          return new URL(attrs.src, base).href;
        } catch {
          return attrs.src;
        }
      })();
      const existingScript = Array.from(
        document.querySelectorAll("script[src]")
      ).find((el) => el.src === normSrc);
      if (existingScript) {
        return;
      }
      const script = document.createElement("script");
      for (const [key, value] of Object.entries(attrs)) {
        if (key !== "suppressHydrationWarning" && value !== void 0 && value !== false) {
          script.setAttribute(
            key,
            typeof value === "boolean" ? "" : String(value)
          );
        }
      }
      document.head.appendChild(script);
      return () => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };
    }
    if (typeof children2 === "string") {
      const typeAttr = typeof attrs?.type === "string" ? attrs.type : "text/javascript";
      const nonceAttr = typeof attrs?.nonce === "string" ? attrs.nonce : void 0;
      const existingScript = Array.from(
        document.querySelectorAll("script:not([src])")
      ).find((el) => {
        if (!(el instanceof HTMLScriptElement)) return false;
        const sType = el.getAttribute("type") ?? "text/javascript";
        const sNonce = el.getAttribute("nonce") ?? void 0;
        return el.textContent === children2 && sType === typeAttr && sNonce === nonceAttr;
      });
      if (existingScript) {
        return;
      }
      const script = document.createElement("script");
      script.textContent = children2;
      if (attrs) {
        for (const [key, value] of Object.entries(attrs)) {
          if (key !== "suppressHydrationWarning" && value !== void 0 && value !== false) {
            script.setAttribute(
              key,
              typeof value === "boolean" ? "" : String(value)
            );
          }
        }
      }
      document.head.appendChild(script);
      return () => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };
    }
    return void 0;
  }, [attrs, children2]);
  if (!router2.isServer) {
    return null;
  }
  if (attrs?.src && typeof attrs.src === "string") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("script", { ...attrs, suppressHydrationWarning: true });
  }
  if (typeof children2 === "string") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "script",
      {
        ...attrs,
        dangerouslySetInnerHTML: { __html: children2 },
        suppressHydrationWarning: true
      }
    );
  }
  return null;
}
const useTags = () => {
  const router2 = useRouter();
  const nonce = router2.options.ssr?.nonce;
  const routeMeta = useRouterState({
    select: (state2) => {
      return state2.matches.map((match) => match.meta).filter(Boolean);
    }
  });
  const meta = reactExports.useMemo(() => {
    const resultMeta = [];
    const metaByAttribute = {};
    let title;
    for (let i = routeMeta.length - 1; i >= 0; i--) {
      const metas = routeMeta[i];
      for (let j = metas.length - 1; j >= 0; j--) {
        const m = metas[j];
        if (!m) continue;
        if (m.title) {
          if (!title) {
            title = {
              tag: "title",
              children: m.title
            };
          }
        } else {
          const attribute = m.name ?? m.property;
          if (attribute) {
            if (metaByAttribute[attribute]) {
              continue;
            } else {
              metaByAttribute[attribute] = true;
            }
          }
          resultMeta.push({
            tag: "meta",
            attrs: {
              ...m,
              nonce
            }
          });
        }
      }
    }
    if (title) {
      resultMeta.push(title);
    }
    if (nonce) {
      resultMeta.push({
        tag: "meta",
        attrs: {
          property: "csp-nonce",
          content: nonce
        }
      });
    }
    resultMeta.reverse();
    return resultMeta;
  }, [routeMeta, nonce]);
  const links = useRouterState({
    select: (state2) => {
      const constructed = state2.matches.map((match) => match.links).filter(Boolean).flat(1).map((link) => ({
        tag: "link",
        attrs: {
          ...link,
          nonce
        }
      }));
      const manifest = router2.ssr?.manifest;
      const assets = state2.matches.map((match) => manifest?.routes[match.routeId]?.assets ?? []).filter(Boolean).flat(1).filter((asset) => asset.tag === "link").map(
        (asset) => ({
          tag: "link",
          attrs: {
            ...asset.attrs,
            suppressHydrationWarning: true,
            nonce
          }
        })
      );
      return [...constructed, ...assets];
    },
    structuralSharing: true
  });
  const preloadMeta = useRouterState({
    select: (state2) => {
      const preloadMeta2 = [];
      state2.matches.map((match) => router2.looseRoutesById[match.routeId]).forEach(
        (route) => router2.ssr?.manifest?.routes[route.id]?.preloads?.filter(Boolean).forEach((preload) => {
          preloadMeta2.push({
            tag: "link",
            attrs: {
              rel: "modulepreload",
              href: preload,
              nonce
            }
          });
        })
      );
      return preloadMeta2;
    },
    structuralSharing: true
  });
  const styles = useRouterState({
    select: (state2) => state2.matches.map((match) => match.styles).flat(1).filter(Boolean).map(({ children: children2, ...attrs }) => ({
      tag: "style",
      attrs,
      children: children2,
      nonce
    })),
    structuralSharing: true
  });
  const headScripts = useRouterState({
    select: (state2) => state2.matches.map((match) => match.headScripts).flat(1).filter(Boolean).map(({ children: children2, ...script }) => ({
      tag: "script",
      attrs: {
        ...script,
        nonce
      },
      children: children2
    })),
    structuralSharing: true
  });
  return uniqBy(
    [
      ...meta,
      ...preloadMeta,
      ...links,
      ...styles,
      ...headScripts
    ],
    (d) => {
      return JSON.stringify(d);
    }
  );
};
function HeadContent() {
  const tags = useTags();
  const router2 = useRouter();
  const nonce = router2.options.ssr?.nonce;
  return tags.map((tag) => /* @__PURE__ */ reactExports.createElement(Asset, { ...tag, key: `tsr-meta-${JSON.stringify(tag)}`, nonce }));
}
function uniqBy(arr, fn) {
  const seen = /* @__PURE__ */ new Set();
  return arr.filter((item) => {
    const key = fn(item);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}
const Scripts = () => {
  const router2 = useRouter();
  const nonce = router2.options.ssr?.nonce;
  const assetScripts = useRouterState({
    select: (state2) => {
      const assetScripts2 = [];
      const manifest = router2.ssr?.manifest;
      if (!manifest) {
        return [];
      }
      state2.matches.map((match) => router2.looseRoutesById[match.routeId]).forEach(
        (route) => manifest.routes[route.id]?.assets?.filter((d) => d.tag === "script").forEach((asset) => {
          assetScripts2.push({
            tag: "script",
            attrs: { ...asset.attrs, nonce },
            children: asset.children
          });
        })
      );
      return assetScripts2;
    },
    structuralSharing: true
  });
  const { scripts } = useRouterState({
    select: (state2) => ({
      scripts: state2.matches.map((match) => match.scripts).flat(1).filter(Boolean).map(({ children: children2, ...script }) => ({
        tag: "script",
        attrs: {
          ...script,
          suppressHydrationWarning: true,
          nonce
        },
        children: children2
      }))
    }),
    structuralSharing: true
  });
  const allScripts = [...scripts, ...assetScripts];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: allScripts.map((asset, i) => /* @__PURE__ */ reactExports.createElement(Asset, { ...asset, key: `tsr-scripts-${asset.tag}-${i}` })) });
};
var Subscribable = class {
  constructor() {
    this.listeners = /* @__PURE__ */ new Set();
    this.subscribe = this.subscribe.bind(this);
  }
  subscribe(listener) {
    this.listeners.add(listener);
    this.onSubscribe();
    return () => {
      this.listeners.delete(listener);
      this.onUnsubscribe();
    };
  }
  hasListeners() {
    return this.listeners.size > 0;
  }
  onSubscribe() {
  }
  onUnsubscribe() {
  }
};
var defaultTimeoutProvider = {
  // We need the wrapper function syntax below instead of direct references to
  // global setTimeout etc.
  //
  // BAD: `setTimeout: setTimeout`
  // GOOD: `setTimeout: (cb, delay) => setTimeout(cb, delay)`
  //
  // If we use direct references here, then anything that wants to spy on or
  // replace the global setTimeout (like tests) won't work since we'll already
  // have a hard reference to the original implementation at the time when this
  // file was imported.
  setTimeout: (callback, delay) => setTimeout(callback, delay),
  clearTimeout: (timeoutId) => clearTimeout(timeoutId),
  setInterval: (callback, delay) => setInterval(callback, delay),
  clearInterval: (intervalId) => clearInterval(intervalId)
};
var TimeoutManager = class {
  // We cannot have TimeoutManager<T> as we must instantiate it with a concrete
  // type at app boot; and if we leave that type, then any new timer provider
  // would need to support ReturnType<typeof setTimeout>, which is infeasible.
  //
  // We settle for type safety for the TimeoutProvider type, and accept that
  // this class is unsafe internally to allow for extension.
  #provider = defaultTimeoutProvider;
  #providerCalled = false;
  setTimeoutProvider(provider) {
    if (process.env.NODE_ENV !== "production") {
      if (this.#providerCalled && provider !== this.#provider) {
        console.error(
          `[timeoutManager]: Switching provider after calls to previous provider might result in unexpected behavior.`,
          { previous: this.#provider, provider }
        );
      }
    }
    this.#provider = provider;
    if (process.env.NODE_ENV !== "production") {
      this.#providerCalled = false;
    }
  }
  setTimeout(callback, delay) {
    if (process.env.NODE_ENV !== "production") {
      this.#providerCalled = true;
    }
    return this.#provider.setTimeout(callback, delay);
  }
  clearTimeout(timeoutId) {
    this.#provider.clearTimeout(timeoutId);
  }
  setInterval(callback, delay) {
    if (process.env.NODE_ENV !== "production") {
      this.#providerCalled = true;
    }
    return this.#provider.setInterval(callback, delay);
  }
  clearInterval(intervalId) {
    this.#provider.clearInterval(intervalId);
  }
};
var timeoutManager = new TimeoutManager();
function systemSetTimeoutZero(callback) {
  setTimeout(callback, 0);
}
var isServer = typeof window === "undefined" || "Deno" in globalThis;
function noop() {
}
function functionalUpdate(updater, input) {
  return typeof updater === "function" ? updater(input) : updater;
}
function isValidTimeout(value) {
  return typeof value === "number" && value >= 0 && value !== Infinity;
}
function timeUntilStale(updatedAt, staleTime) {
  return Math.max(updatedAt + (staleTime || 0) - Date.now(), 0);
}
function resolveStaleTime(staleTime, query) {
  return typeof staleTime === "function" ? staleTime(query) : staleTime;
}
function resolveEnabled(enabled, query) {
  return typeof enabled === "function" ? enabled(query) : enabled;
}
function matchQuery(filters, query) {
  const {
    type = "all",
    exact,
    fetchStatus,
    predicate,
    queryKey,
    stale
  } = filters;
  if (queryKey) {
    if (exact) {
      if (query.queryHash !== hashQueryKeyByOptions(queryKey, query.options)) {
        return false;
      }
    } else if (!partialMatchKey(query.queryKey, queryKey)) {
      return false;
    }
  }
  if (type !== "all") {
    const isActive = query.isActive();
    if (type === "active" && !isActive) {
      return false;
    }
    if (type === "inactive" && isActive) {
      return false;
    }
  }
  if (typeof stale === "boolean" && query.isStale() !== stale) {
    return false;
  }
  if (fetchStatus && fetchStatus !== query.state.fetchStatus) {
    return false;
  }
  if (predicate && !predicate(query)) {
    return false;
  }
  return true;
}
function matchMutation(filters, mutation) {
  const { exact, status, predicate, mutationKey } = filters;
  if (mutationKey) {
    if (!mutation.options.mutationKey) {
      return false;
    }
    if (exact) {
      if (hashKey(mutation.options.mutationKey) !== hashKey(mutationKey)) {
        return false;
      }
    } else if (!partialMatchKey(mutation.options.mutationKey, mutationKey)) {
      return false;
    }
  }
  if (status && mutation.state.status !== status) {
    return false;
  }
  if (predicate && !predicate(mutation)) {
    return false;
  }
  return true;
}
function hashQueryKeyByOptions(queryKey, options) {
  const hashFn = options?.queryKeyHashFn || hashKey;
  return hashFn(queryKey);
}
function hashKey(queryKey) {
  return JSON.stringify(
    queryKey,
    (_2, val) => isPlainObject$2(val) ? Object.keys(val).sort().reduce((result, key) => {
      result[key] = val[key];
      return result;
    }, {}) : val
  );
}
function partialMatchKey(a, b) {
  if (a === b) {
    return true;
  }
  if (typeof a !== typeof b) {
    return false;
  }
  if (a && b && typeof a === "object" && typeof b === "object") {
    return Object.keys(b).every((key) => partialMatchKey(a[key], b[key]));
  }
  return false;
}
var hasOwn = Object.prototype.hasOwnProperty;
function replaceEqualDeep(a, b) {
  if (a === b) {
    return a;
  }
  const array = isPlainArray(a) && isPlainArray(b);
  if (!array && !(isPlainObject$2(a) && isPlainObject$2(b))) return b;
  const aItems = array ? a : Object.keys(a);
  const aSize = aItems.length;
  const bItems = array ? b : Object.keys(b);
  const bSize = bItems.length;
  const copy2 = array ? new Array(bSize) : {};
  let equalItems = 0;
  for (let i = 0; i < bSize; i++) {
    const key = array ? i : bItems[i];
    const aItem = a[key];
    const bItem = b[key];
    if (aItem === bItem) {
      copy2[key] = aItem;
      if (array ? i < aSize : hasOwn.call(a, key)) equalItems++;
      continue;
    }
    if (aItem === null || bItem === null || typeof aItem !== "object" || typeof bItem !== "object") {
      copy2[key] = bItem;
      continue;
    }
    const v = replaceEqualDeep(aItem, bItem);
    copy2[key] = v;
    if (v === aItem) equalItems++;
  }
  return aSize === bSize && equalItems === aSize ? a : copy2;
}
function isPlainArray(value) {
  return Array.isArray(value) && value.length === Object.keys(value).length;
}
function isPlainObject$2(o) {
  if (!hasObjectPrototype(o)) {
    return false;
  }
  const ctor = o.constructor;
  if (ctor === void 0) {
    return true;
  }
  const prot = ctor.prototype;
  if (!hasObjectPrototype(prot)) {
    return false;
  }
  if (!prot.hasOwnProperty("isPrototypeOf")) {
    return false;
  }
  if (Object.getPrototypeOf(o) !== Object.prototype) {
    return false;
  }
  return true;
}
function hasObjectPrototype(o) {
  return Object.prototype.toString.call(o) === "[object Object]";
}
function sleep$1(timeout) {
  return new Promise((resolve) => {
    timeoutManager.setTimeout(resolve, timeout);
  });
}
function replaceData(prevData, data, options) {
  if (typeof options.structuralSharing === "function") {
    return options.structuralSharing(prevData, data);
  } else if (options.structuralSharing !== false) {
    if (process.env.NODE_ENV !== "production") {
      try {
        return replaceEqualDeep(prevData, data);
      } catch (error) {
        console.error(
          `Structural sharing requires data to be JSON serializable. To fix this, turn off structuralSharing or return JSON-serializable data from your queryFn. [${options.queryHash}]: ${error}`
        );
        throw error;
      }
    }
    return replaceEqualDeep(prevData, data);
  }
  return data;
}
function addToEnd(items, item, max = 0) {
  const newItems = [...items, item];
  return max && newItems.length > max ? newItems.slice(1) : newItems;
}
function addToStart(items, item, max = 0) {
  const newItems = [item, ...items];
  return max && newItems.length > max ? newItems.slice(0, -1) : newItems;
}
var skipToken = Symbol();
function ensureQueryFn(options, fetchOptions) {
  if (process.env.NODE_ENV !== "production") {
    if (options.queryFn === skipToken) {
      console.error(
        `Attempted to invoke queryFn when set to skipToken. This is likely a configuration error. Query hash: '${options.queryHash}'`
      );
    }
  }
  if (!options.queryFn && fetchOptions?.initialPromise) {
    return () => fetchOptions.initialPromise;
  }
  if (!options.queryFn || options.queryFn === skipToken) {
    return () => Promise.reject(new Error(`Missing queryFn: '${options.queryHash}'`));
  }
  return options.queryFn;
}
var FocusManager = class extends Subscribable {
  #focused;
  #cleanup;
  #setup;
  constructor() {
    super();
    this.#setup = (onFocus) => {
      if (!isServer && window.addEventListener) {
        const listener = () => onFocus();
        window.addEventListener("visibilitychange", listener, false);
        return () => {
          window.removeEventListener("visibilitychange", listener);
        };
      }
      return;
    };
  }
  onSubscribe() {
    if (!this.#cleanup) {
      this.setEventListener(this.#setup);
    }
  }
  onUnsubscribe() {
    if (!this.hasListeners()) {
      this.#cleanup?.();
      this.#cleanup = void 0;
    }
  }
  setEventListener(setup) {
    this.#setup = setup;
    this.#cleanup?.();
    this.#cleanup = setup((focused) => {
      if (typeof focused === "boolean") {
        this.setFocused(focused);
      } else {
        this.onFocus();
      }
    });
  }
  setFocused(focused) {
    const changed = this.#focused !== focused;
    if (changed) {
      this.#focused = focused;
      this.onFocus();
    }
  }
  onFocus() {
    const isFocused = this.isFocused();
    this.listeners.forEach((listener) => {
      listener(isFocused);
    });
  }
  isFocused() {
    if (typeof this.#focused === "boolean") {
      return this.#focused;
    }
    return globalThis.document?.visibilityState !== "hidden";
  }
};
var focusManager = new FocusManager();
function pendingThenable() {
  let resolve;
  let reject2;
  const thenable = new Promise((_resolve, _reject) => {
    resolve = _resolve;
    reject2 = _reject;
  });
  thenable.status = "pending";
  thenable.catch(() => {
  });
  function finalize(data) {
    Object.assign(thenable, data);
    delete thenable.resolve;
    delete thenable.reject;
  }
  thenable.resolve = (value) => {
    finalize({
      status: "fulfilled",
      value
    });
    resolve(value);
  };
  thenable.reject = (reason) => {
    finalize({
      status: "rejected",
      reason
    });
    reject2(reason);
  };
  return thenable;
}
function tryResolveSync(promise) {
  let data;
  promise.then((result) => {
    data = result;
    return result;
  }, noop)?.catch(noop);
  if (data !== void 0) {
    return { data };
  }
  return void 0;
}
function defaultTransformerFn(data) {
  return data;
}
function dehydrateMutation(mutation) {
  return {
    mutationKey: mutation.options.mutationKey,
    state: mutation.state,
    ...mutation.options.scope && { scope: mutation.options.scope },
    ...mutation.meta && { meta: mutation.meta }
  };
}
function dehydrateQuery(query, serializeData, shouldRedactErrors) {
  const promise = query.promise?.then(serializeData).catch((error) => {
    if (!shouldRedactErrors(error)) {
      return Promise.reject(error);
    }
    if (process.env.NODE_ENV !== "production") {
      console.error(
        `A query that was dehydrated as pending ended up rejecting. [${query.queryHash}]: ${error}; The error will be redacted in production builds`
      );
    }
    return Promise.reject(new Error("redacted"));
  });
  promise?.catch(noop);
  return {
    dehydratedAt: Date.now(),
    state: {
      ...query.state,
      ...query.state.data !== void 0 && {
        data: serializeData(query.state.data)
      }
    },
    queryKey: query.queryKey,
    queryHash: query.queryHash,
    ...query.state.status === "pending" && {
      promise
    },
    ...query.meta && { meta: query.meta }
  };
}
function defaultShouldDehydrateMutation(mutation) {
  return mutation.state.isPaused;
}
function defaultShouldDehydrateQuery(query) {
  return query.state.status === "success";
}
function defaultShouldRedactErrors(_2) {
  return true;
}
function dehydrate(client, options = {}) {
  const filterMutation = options.shouldDehydrateMutation ?? client.getDefaultOptions().dehydrate?.shouldDehydrateMutation ?? defaultShouldDehydrateMutation;
  const mutations = client.getMutationCache().getAll().flatMap(
    (mutation) => filterMutation(mutation) ? [dehydrateMutation(mutation)] : []
  );
  const filterQuery = options.shouldDehydrateQuery ?? client.getDefaultOptions().dehydrate?.shouldDehydrateQuery ?? defaultShouldDehydrateQuery;
  const shouldRedactErrors = options.shouldRedactErrors ?? client.getDefaultOptions().dehydrate?.shouldRedactErrors ?? defaultShouldRedactErrors;
  const serializeData = options.serializeData ?? client.getDefaultOptions().dehydrate?.serializeData ?? defaultTransformerFn;
  const queries = client.getQueryCache().getAll().flatMap(
    (query) => filterQuery(query) ? [dehydrateQuery(query, serializeData, shouldRedactErrors)] : []
  );
  return { mutations, queries };
}
function hydrate(client, dehydratedState, options) {
  if (typeof dehydratedState !== "object" || dehydratedState === null) {
    return;
  }
  const mutationCache = client.getMutationCache();
  const queryCache = client.getQueryCache();
  const deserializeData = client.getDefaultOptions().hydrate?.deserializeData ?? defaultTransformerFn;
  const mutations = dehydratedState.mutations || [];
  const queries = dehydratedState.queries || [];
  mutations.forEach(({ state: state2, ...mutationOptions }) => {
    mutationCache.build(
      client,
      {
        ...client.getDefaultOptions().hydrate?.mutations,
        ...options?.defaultOptions?.mutations,
        ...mutationOptions
      },
      state2
    );
  });
  queries.forEach(
    ({ queryKey, state: state2, queryHash, meta, promise, dehydratedAt }) => {
      const syncData = promise ? tryResolveSync(promise) : void 0;
      const rawData = state2.data === void 0 ? syncData?.data : state2.data;
      const data = rawData === void 0 ? rawData : deserializeData(rawData);
      let query = queryCache.get(queryHash);
      const existingQueryIsPending = query?.state.status === "pending";
      const existingQueryIsFetching = query?.state.fetchStatus === "fetching";
      if (query) {
        const hasNewerSyncData = syncData && // We only need this undefined check to handle older dehydration
        // payloads that might not have dehydratedAt
        dehydratedAt !== void 0 && dehydratedAt > query.state.dataUpdatedAt;
        if (state2.dataUpdatedAt > query.state.dataUpdatedAt || hasNewerSyncData) {
          const { fetchStatus: _ignored, ...serializedState } = state2;
          query.setState({
            ...serializedState,
            data
          });
        }
      } else {
        query = queryCache.build(
          client,
          {
            ...client.getDefaultOptions().hydrate?.queries,
            ...options?.defaultOptions?.queries,
            queryKey,
            queryHash,
            meta
          },
          // Reset fetch status to idle to avoid
          // query being stuck in fetching state upon hydration
          {
            ...state2,
            data,
            fetchStatus: "idle",
            status: data !== void 0 ? "success" : state2.status
          }
        );
      }
      if (promise && !existingQueryIsPending && !existingQueryIsFetching && // Only hydrate if dehydration is newer than any existing data,
      // this is always true for new queries
      (dehydratedAt === void 0 || dehydratedAt > query.state.dataUpdatedAt)) {
        query.fetch(void 0, {
          // RSC transformed promises are not thenable
          initialPromise: Promise.resolve(promise).then(deserializeData)
        }).catch(noop);
      }
    }
  );
}
var defaultScheduler = systemSetTimeoutZero;
function createNotifyManager() {
  let queue = [];
  let transactions = 0;
  let notifyFn = (callback) => {
    callback();
  };
  let batchNotifyFn = (callback) => {
    callback();
  };
  let scheduleFn = defaultScheduler;
  const schedule = (callback) => {
    if (transactions) {
      queue.push(callback);
    } else {
      scheduleFn(() => {
        notifyFn(callback);
      });
    }
  };
  const flush = () => {
    const originalQueue = queue;
    queue = [];
    if (originalQueue.length) {
      scheduleFn(() => {
        batchNotifyFn(() => {
          originalQueue.forEach((callback) => {
            notifyFn(callback);
          });
        });
      });
    }
  };
  return {
    batch: (callback) => {
      let result;
      transactions++;
      try {
        result = callback();
      } finally {
        transactions--;
        if (!transactions) {
          flush();
        }
      }
      return result;
    },
    /**
     * All calls to the wrapped function will be batched.
     */
    batchCalls: (callback) => {
      return (...args) => {
        schedule(() => {
          callback(...args);
        });
      };
    },
    schedule,
    /**
     * Use this method to set a custom notify function.
     * This can be used to for example wrap notifications with `React.act` while running tests.
     */
    setNotifyFunction: (fn) => {
      notifyFn = fn;
    },
    /**
     * Use this method to set a custom function to batch notifications together into a single tick.
     * By default React Query will use the batch function provided by ReactDOM or React Native.
     */
    setBatchNotifyFunction: (fn) => {
      batchNotifyFn = fn;
    },
    setScheduler: (fn) => {
      scheduleFn = fn;
    }
  };
}
var notifyManager = createNotifyManager();
var OnlineManager = class extends Subscribable {
  #online = true;
  #cleanup;
  #setup;
  constructor() {
    super();
    this.#setup = (onOnline) => {
      if (!isServer && window.addEventListener) {
        const onlineListener = () => onOnline(true);
        const offlineListener = () => onOnline(false);
        window.addEventListener("online", onlineListener, false);
        window.addEventListener("offline", offlineListener, false);
        return () => {
          window.removeEventListener("online", onlineListener);
          window.removeEventListener("offline", offlineListener);
        };
      }
      return;
    };
  }
  onSubscribe() {
    if (!this.#cleanup) {
      this.setEventListener(this.#setup);
    }
  }
  onUnsubscribe() {
    if (!this.hasListeners()) {
      this.#cleanup?.();
      this.#cleanup = void 0;
    }
  }
  setEventListener(setup) {
    this.#setup = setup;
    this.#cleanup?.();
    this.#cleanup = setup(this.setOnline.bind(this));
  }
  setOnline(online) {
    const changed = this.#online !== online;
    if (changed) {
      this.#online = online;
      this.listeners.forEach((listener) => {
        listener(online);
      });
    }
  }
  isOnline() {
    return this.#online;
  }
};
var onlineManager = new OnlineManager();
function defaultRetryDelay(failureCount) {
  return Math.min(1e3 * 2 ** failureCount, 3e4);
}
function canFetch(networkMode) {
  return (networkMode ?? "online") === "online" ? onlineManager.isOnline() : true;
}
var CancelledError = class extends Error {
  constructor(options) {
    super("CancelledError");
    this.revert = options?.revert;
    this.silent = options?.silent;
  }
};
function createRetryer(config) {
  let isRetryCancelled = false;
  let failureCount = 0;
  let continueFn;
  const thenable = pendingThenable();
  const isResolved = () => thenable.status !== "pending";
  const cancel = (cancelOptions) => {
    if (!isResolved()) {
      const error = new CancelledError(cancelOptions);
      reject2(error);
      config.onCancel?.(error);
    }
  };
  const cancelRetry = () => {
    isRetryCancelled = true;
  };
  const continueRetry = () => {
    isRetryCancelled = false;
  };
  const canContinue = () => focusManager.isFocused() && (config.networkMode === "always" || onlineManager.isOnline()) && config.canRun();
  const canStart = () => canFetch(config.networkMode) && config.canRun();
  const resolve = (value) => {
    if (!isResolved()) {
      continueFn?.();
      thenable.resolve(value);
    }
  };
  const reject2 = (value) => {
    if (!isResolved()) {
      continueFn?.();
      thenable.reject(value);
    }
  };
  const pause = () => {
    return new Promise((continueResolve) => {
      continueFn = (value) => {
        if (isResolved() || canContinue()) {
          continueResolve(value);
        }
      };
      config.onPause?.();
    }).then(() => {
      continueFn = void 0;
      if (!isResolved()) {
        config.onContinue?.();
      }
    });
  };
  const run = () => {
    if (isResolved()) {
      return;
    }
    let promiseOrValue;
    const initialPromise = failureCount === 0 ? config.initialPromise : void 0;
    try {
      promiseOrValue = initialPromise ?? config.fn();
    } catch (error) {
      promiseOrValue = Promise.reject(error);
    }
    Promise.resolve(promiseOrValue).then(resolve).catch((error) => {
      if (isResolved()) {
        return;
      }
      const retry = config.retry ?? (isServer ? 0 : 3);
      const retryDelay = config.retryDelay ?? defaultRetryDelay;
      const delay = typeof retryDelay === "function" ? retryDelay(failureCount, error) : retryDelay;
      const shouldRetry = retry === true || typeof retry === "number" && failureCount < retry || typeof retry === "function" && retry(failureCount, error);
      if (isRetryCancelled || !shouldRetry) {
        reject2(error);
        return;
      }
      failureCount++;
      config.onFail?.(failureCount, error);
      sleep$1(delay).then(() => {
        return canContinue() ? void 0 : pause();
      }).then(() => {
        if (isRetryCancelled) {
          reject2(error);
        } else {
          run();
        }
      });
    });
  };
  return {
    promise: thenable,
    status: () => thenable.status,
    cancel,
    continue: () => {
      continueFn?.();
      return thenable;
    },
    cancelRetry,
    continueRetry,
    canStart,
    start: () => {
      if (canStart()) {
        run();
      } else {
        pause().then(run);
      }
      return thenable;
    }
  };
}
var Removable = class {
  #gcTimeout;
  destroy() {
    this.clearGcTimeout();
  }
  scheduleGc() {
    this.clearGcTimeout();
    if (isValidTimeout(this.gcTime)) {
      this.#gcTimeout = timeoutManager.setTimeout(() => {
        this.optionalRemove();
      }, this.gcTime);
    }
  }
  updateGcTime(newGcTime) {
    this.gcTime = Math.max(
      this.gcTime || 0,
      newGcTime ?? (isServer ? Infinity : 5 * 60 * 1e3)
    );
  }
  clearGcTimeout() {
    if (this.#gcTimeout) {
      timeoutManager.clearTimeout(this.#gcTimeout);
      this.#gcTimeout = void 0;
    }
  }
};
var Query = class extends Removable {
  #initialState;
  #revertState;
  #cache;
  #client;
  #retryer;
  #defaultOptions;
  #abortSignalConsumed;
  constructor(config) {
    super();
    this.#abortSignalConsumed = false;
    this.#defaultOptions = config.defaultOptions;
    this.setOptions(config.options);
    this.observers = [];
    this.#client = config.client;
    this.#cache = this.#client.getQueryCache();
    this.queryKey = config.queryKey;
    this.queryHash = config.queryHash;
    this.#initialState = getDefaultState$1(this.options);
    this.state = config.state ?? this.#initialState;
    this.scheduleGc();
  }
  get meta() {
    return this.options.meta;
  }
  get promise() {
    return this.#retryer?.promise;
  }
  setOptions(options) {
    this.options = { ...this.#defaultOptions, ...options };
    this.updateGcTime(this.options.gcTime);
    if (this.state && this.state.data === void 0) {
      const defaultState = getDefaultState$1(this.options);
      if (defaultState.data !== void 0) {
        this.setData(defaultState.data, {
          updatedAt: defaultState.dataUpdatedAt,
          manual: true
        });
        this.#initialState = defaultState;
      }
    }
  }
  optionalRemove() {
    if (!this.observers.length && this.state.fetchStatus === "idle") {
      this.#cache.remove(this);
    }
  }
  setData(newData, options) {
    const data = replaceData(this.state.data, newData, this.options);
    this.#dispatch({
      data,
      type: "success",
      dataUpdatedAt: options?.updatedAt,
      manual: options?.manual
    });
    return data;
  }
  setState(state2, setStateOptions) {
    this.#dispatch({ type: "setState", state: state2, setStateOptions });
  }
  cancel(options) {
    const promise = this.#retryer?.promise;
    this.#retryer?.cancel(options);
    return promise ? promise.then(noop).catch(noop) : Promise.resolve();
  }
  destroy() {
    super.destroy();
    this.cancel({ silent: true });
  }
  reset() {
    this.destroy();
    this.setState(this.#initialState);
  }
  isActive() {
    return this.observers.some(
      (observer) => resolveEnabled(observer.options.enabled, this) !== false
    );
  }
  isDisabled() {
    if (this.getObserversCount() > 0) {
      return !this.isActive();
    }
    return this.options.queryFn === skipToken || this.state.dataUpdateCount + this.state.errorUpdateCount === 0;
  }
  isStatic() {
    if (this.getObserversCount() > 0) {
      return this.observers.some(
        (observer) => resolveStaleTime(observer.options.staleTime, this) === "static"
      );
    }
    return false;
  }
  isStale() {
    if (this.getObserversCount() > 0) {
      return this.observers.some(
        (observer) => observer.getCurrentResult().isStale
      );
    }
    return this.state.data === void 0 || this.state.isInvalidated;
  }
  isStaleByTime(staleTime = 0) {
    if (this.state.data === void 0) {
      return true;
    }
    if (staleTime === "static") {
      return false;
    }
    if (this.state.isInvalidated) {
      return true;
    }
    return !timeUntilStale(this.state.dataUpdatedAt, staleTime);
  }
  onFocus() {
    const observer = this.observers.find((x) => x.shouldFetchOnWindowFocus());
    observer?.refetch({ cancelRefetch: false });
    this.#retryer?.continue();
  }
  onOnline() {
    const observer = this.observers.find((x) => x.shouldFetchOnReconnect());
    observer?.refetch({ cancelRefetch: false });
    this.#retryer?.continue();
  }
  addObserver(observer) {
    if (!this.observers.includes(observer)) {
      this.observers.push(observer);
      this.clearGcTimeout();
      this.#cache.notify({ type: "observerAdded", query: this, observer });
    }
  }
  removeObserver(observer) {
    if (this.observers.includes(observer)) {
      this.observers = this.observers.filter((x) => x !== observer);
      if (!this.observers.length) {
        if (this.#retryer) {
          if (this.#abortSignalConsumed) {
            this.#retryer.cancel({ revert: true });
          } else {
            this.#retryer.cancelRetry();
          }
        }
        this.scheduleGc();
      }
      this.#cache.notify({ type: "observerRemoved", query: this, observer });
    }
  }
  getObserversCount() {
    return this.observers.length;
  }
  invalidate() {
    if (!this.state.isInvalidated) {
      this.#dispatch({ type: "invalidate" });
    }
  }
  async fetch(options, fetchOptions) {
    if (this.state.fetchStatus !== "idle" && // If the promise in the retyer is already rejected, we have to definitely
    // re-start the fetch; there is a chance that the query is still in a
    // pending state when that happens
    this.#retryer?.status() !== "rejected") {
      if (this.state.data !== void 0 && fetchOptions?.cancelRefetch) {
        this.cancel({ silent: true });
      } else if (this.#retryer) {
        this.#retryer.continueRetry();
        return this.#retryer.promise;
      }
    }
    if (options) {
      this.setOptions(options);
    }
    if (!this.options.queryFn) {
      const observer = this.observers.find((x) => x.options.queryFn);
      if (observer) {
        this.setOptions(observer.options);
      }
    }
    if (process.env.NODE_ENV !== "production") {
      if (!Array.isArray(this.options.queryKey)) {
        console.error(
          `As of v4, queryKey needs to be an Array. If you are using a string like 'repoData', please change it to an Array, e.g. ['repoData']`
        );
      }
    }
    const abortController = new AbortController();
    const addSignalProperty = (object) => {
      Object.defineProperty(object, "signal", {
        enumerable: true,
        get: () => {
          this.#abortSignalConsumed = true;
          return abortController.signal;
        }
      });
    };
    const fetchFn = () => {
      const queryFn = ensureQueryFn(this.options, fetchOptions);
      const createQueryFnContext = () => {
        const queryFnContext2 = {
          client: this.#client,
          queryKey: this.queryKey,
          meta: this.meta
        };
        addSignalProperty(queryFnContext2);
        return queryFnContext2;
      };
      const queryFnContext = createQueryFnContext();
      this.#abortSignalConsumed = false;
      if (this.options.persister) {
        return this.options.persister(
          queryFn,
          queryFnContext,
          this
        );
      }
      return queryFn(queryFnContext);
    };
    const createFetchContext = () => {
      const context2 = {
        fetchOptions,
        options: this.options,
        queryKey: this.queryKey,
        client: this.#client,
        state: this.state,
        fetchFn
      };
      addSignalProperty(context2);
      return context2;
    };
    const context = createFetchContext();
    this.options.behavior?.onFetch(context, this);
    this.#revertState = this.state;
    if (this.state.fetchStatus === "idle" || this.state.fetchMeta !== context.fetchOptions?.meta) {
      this.#dispatch({ type: "fetch", meta: context.fetchOptions?.meta });
    }
    this.#retryer = createRetryer({
      initialPromise: fetchOptions?.initialPromise,
      fn: context.fetchFn,
      onCancel: (error) => {
        if (error instanceof CancelledError && error.revert) {
          this.setState({
            ...this.#revertState,
            fetchStatus: "idle"
          });
        }
        abortController.abort();
      },
      onFail: (failureCount, error) => {
        this.#dispatch({ type: "failed", failureCount, error });
      },
      onPause: () => {
        this.#dispatch({ type: "pause" });
      },
      onContinue: () => {
        this.#dispatch({ type: "continue" });
      },
      retry: context.options.retry,
      retryDelay: context.options.retryDelay,
      networkMode: context.options.networkMode,
      canRun: () => true
    });
    try {
      const data = await this.#retryer.start();
      if (data === void 0) {
        if (process.env.NODE_ENV !== "production") {
          console.error(
            `Query data cannot be undefined. Please make sure to return a value other than undefined from your query function. Affected query key: ${this.queryHash}`
          );
        }
        throw new Error(`${this.queryHash} data is undefined`);
      }
      this.setData(data);
      this.#cache.config.onSuccess?.(data, this);
      this.#cache.config.onSettled?.(
        data,
        this.state.error,
        this
      );
      return data;
    } catch (error) {
      if (error instanceof CancelledError) {
        if (error.silent) {
          return this.#retryer.promise;
        } else if (error.revert) {
          if (this.state.data === void 0) {
            throw error;
          }
          return this.state.data;
        }
      }
      this.#dispatch({
        type: "error",
        error
      });
      this.#cache.config.onError?.(
        error,
        this
      );
      this.#cache.config.onSettled?.(
        this.state.data,
        error,
        this
      );
      throw error;
    } finally {
      this.scheduleGc();
    }
  }
  #dispatch(action) {
    const reducer = (state2) => {
      switch (action.type) {
        case "failed":
          return {
            ...state2,
            fetchFailureCount: action.failureCount,
            fetchFailureReason: action.error
          };
        case "pause":
          return {
            ...state2,
            fetchStatus: "paused"
          };
        case "continue":
          return {
            ...state2,
            fetchStatus: "fetching"
          };
        case "fetch":
          return {
            ...state2,
            ...fetchState(state2.data, this.options),
            fetchMeta: action.meta ?? null
          };
        case "success":
          const newState = {
            ...state2,
            data: action.data,
            dataUpdateCount: state2.dataUpdateCount + 1,
            dataUpdatedAt: action.dataUpdatedAt ?? Date.now(),
            error: null,
            isInvalidated: false,
            status: "success",
            ...!action.manual && {
              fetchStatus: "idle",
              fetchFailureCount: 0,
              fetchFailureReason: null
            }
          };
          this.#revertState = action.manual ? newState : void 0;
          return newState;
        case "error":
          const error = action.error;
          return {
            ...state2,
            error,
            errorUpdateCount: state2.errorUpdateCount + 1,
            errorUpdatedAt: Date.now(),
            fetchFailureCount: state2.fetchFailureCount + 1,
            fetchFailureReason: error,
            fetchStatus: "idle",
            status: "error"
          };
        case "invalidate":
          return {
            ...state2,
            isInvalidated: true
          };
        case "setState":
          return {
            ...state2,
            ...action.state
          };
      }
    };
    this.state = reducer(this.state);
    notifyManager.batch(() => {
      this.observers.forEach((observer) => {
        observer.onQueryUpdate();
      });
      this.#cache.notify({ query: this, type: "updated", action });
    });
  }
};
function fetchState(data, options) {
  return {
    fetchFailureCount: 0,
    fetchFailureReason: null,
    fetchStatus: canFetch(options.networkMode) ? "fetching" : "paused",
    ...data === void 0 && {
      error: null,
      status: "pending"
    }
  };
}
function getDefaultState$1(options) {
  const data = typeof options.initialData === "function" ? options.initialData() : options.initialData;
  const hasData = data !== void 0;
  const initialDataUpdatedAt = hasData ? typeof options.initialDataUpdatedAt === "function" ? options.initialDataUpdatedAt() : options.initialDataUpdatedAt : 0;
  return {
    data,
    dataUpdateCount: 0,
    dataUpdatedAt: hasData ? initialDataUpdatedAt ?? Date.now() : 0,
    error: null,
    errorUpdateCount: 0,
    errorUpdatedAt: 0,
    fetchFailureCount: 0,
    fetchFailureReason: null,
    fetchMeta: null,
    isInvalidated: false,
    status: hasData ? "success" : "pending",
    fetchStatus: "idle"
  };
}
function infiniteQueryBehavior(pages) {
  return {
    onFetch: (context, query) => {
      const options = context.options;
      const direction = context.fetchOptions?.meta?.fetchMore?.direction;
      const oldPages = context.state.data?.pages || [];
      const oldPageParams = context.state.data?.pageParams || [];
      let result = { pages: [], pageParams: [] };
      let currentPage = 0;
      const fetchFn = async () => {
        let cancelled = false;
        const addSignalProperty = (object) => {
          Object.defineProperty(object, "signal", {
            enumerable: true,
            get: () => {
              if (context.signal.aborted) {
                cancelled = true;
              } else {
                context.signal.addEventListener("abort", () => {
                  cancelled = true;
                });
              }
              return context.signal;
            }
          });
        };
        const queryFn = ensureQueryFn(context.options, context.fetchOptions);
        const fetchPage = async (data, param, previous) => {
          if (cancelled) {
            return Promise.reject();
          }
          if (param == null && data.pages.length) {
            return Promise.resolve(data);
          }
          const createQueryFnContext = () => {
            const queryFnContext2 = {
              client: context.client,
              queryKey: context.queryKey,
              pageParam: param,
              direction: previous ? "backward" : "forward",
              meta: context.options.meta
            };
            addSignalProperty(queryFnContext2);
            return queryFnContext2;
          };
          const queryFnContext = createQueryFnContext();
          const page = await queryFn(queryFnContext);
          const { maxPages } = context.options;
          const addTo = previous ? addToStart : addToEnd;
          return {
            pages: addTo(data.pages, page, maxPages),
            pageParams: addTo(data.pageParams, param, maxPages)
          };
        };
        if (direction && oldPages.length) {
          const previous = direction === "backward";
          const pageParamFn = previous ? getPreviousPageParam : getNextPageParam;
          const oldData = {
            pages: oldPages,
            pageParams: oldPageParams
          };
          const param = pageParamFn(options, oldData);
          result = await fetchPage(oldData, param, previous);
        } else {
          const remainingPages = pages ?? oldPages.length;
          do {
            const param = currentPage === 0 ? oldPageParams[0] ?? options.initialPageParam : getNextPageParam(options, result);
            if (currentPage > 0 && param == null) {
              break;
            }
            result = await fetchPage(result, param);
            currentPage++;
          } while (currentPage < remainingPages);
        }
        return result;
      };
      if (context.options.persister) {
        context.fetchFn = () => {
          return context.options.persister?.(
            fetchFn,
            {
              client: context.client,
              queryKey: context.queryKey,
              meta: context.options.meta,
              signal: context.signal
            },
            query
          );
        };
      } else {
        context.fetchFn = fetchFn;
      }
    }
  };
}
function getNextPageParam(options, { pages, pageParams }) {
  const lastIndex = pages.length - 1;
  return pages.length > 0 ? options.getNextPageParam(
    pages[lastIndex],
    pages,
    pageParams[lastIndex],
    pageParams
  ) : void 0;
}
function getPreviousPageParam(options, { pages, pageParams }) {
  return pages.length > 0 ? options.getPreviousPageParam?.(pages[0], pages, pageParams[0], pageParams) : void 0;
}
var Mutation = class extends Removable {
  #client;
  #observers;
  #mutationCache;
  #retryer;
  constructor(config) {
    super();
    this.#client = config.client;
    this.mutationId = config.mutationId;
    this.#mutationCache = config.mutationCache;
    this.#observers = [];
    this.state = config.state || getDefaultState();
    this.setOptions(config.options);
    this.scheduleGc();
  }
  setOptions(options) {
    this.options = options;
    this.updateGcTime(this.options.gcTime);
  }
  get meta() {
    return this.options.meta;
  }
  addObserver(observer) {
    if (!this.#observers.includes(observer)) {
      this.#observers.push(observer);
      this.clearGcTimeout();
      this.#mutationCache.notify({
        type: "observerAdded",
        mutation: this,
        observer
      });
    }
  }
  removeObserver(observer) {
    this.#observers = this.#observers.filter((x) => x !== observer);
    this.scheduleGc();
    this.#mutationCache.notify({
      type: "observerRemoved",
      mutation: this,
      observer
    });
  }
  optionalRemove() {
    if (!this.#observers.length) {
      if (this.state.status === "pending") {
        this.scheduleGc();
      } else {
        this.#mutationCache.remove(this);
      }
    }
  }
  continue() {
    return this.#retryer?.continue() ?? // continuing a mutation assumes that variables are set, mutation must have been dehydrated before
    this.execute(this.state.variables);
  }
  async execute(variables) {
    const onContinue = () => {
      this.#dispatch({ type: "continue" });
    };
    const mutationFnContext = {
      client: this.#client,
      meta: this.options.meta,
      mutationKey: this.options.mutationKey
    };
    this.#retryer = createRetryer({
      fn: () => {
        if (!this.options.mutationFn) {
          return Promise.reject(new Error("No mutationFn found"));
        }
        return this.options.mutationFn(variables, mutationFnContext);
      },
      onFail: (failureCount, error) => {
        this.#dispatch({ type: "failed", failureCount, error });
      },
      onPause: () => {
        this.#dispatch({ type: "pause" });
      },
      onContinue,
      retry: this.options.retry ?? 0,
      retryDelay: this.options.retryDelay,
      networkMode: this.options.networkMode,
      canRun: () => this.#mutationCache.canRun(this)
    });
    const restored = this.state.status === "pending";
    const isPaused = !this.#retryer.canStart();
    try {
      if (restored) {
        onContinue();
      } else {
        this.#dispatch({ type: "pending", variables, isPaused });
        await this.#mutationCache.config.onMutate?.(
          variables,
          this,
          mutationFnContext
        );
        const context = await this.options.onMutate?.(
          variables,
          mutationFnContext
        );
        if (context !== this.state.context) {
          this.#dispatch({
            type: "pending",
            context,
            variables,
            isPaused
          });
        }
      }
      const data = await this.#retryer.start();
      await this.#mutationCache.config.onSuccess?.(
        data,
        variables,
        this.state.context,
        this,
        mutationFnContext
      );
      await this.options.onSuccess?.(
        data,
        variables,
        this.state.context,
        mutationFnContext
      );
      await this.#mutationCache.config.onSettled?.(
        data,
        null,
        this.state.variables,
        this.state.context,
        this,
        mutationFnContext
      );
      await this.options.onSettled?.(
        data,
        null,
        variables,
        this.state.context,
        mutationFnContext
      );
      this.#dispatch({ type: "success", data });
      return data;
    } catch (error) {
      try {
        await this.#mutationCache.config.onError?.(
          error,
          variables,
          this.state.context,
          this,
          mutationFnContext
        );
        await this.options.onError?.(
          error,
          variables,
          this.state.context,
          mutationFnContext
        );
        await this.#mutationCache.config.onSettled?.(
          void 0,
          error,
          this.state.variables,
          this.state.context,
          this,
          mutationFnContext
        );
        await this.options.onSettled?.(
          void 0,
          error,
          variables,
          this.state.context,
          mutationFnContext
        );
        throw error;
      } finally {
        this.#dispatch({ type: "error", error });
      }
    } finally {
      this.#mutationCache.runNext(this);
    }
  }
  #dispatch(action) {
    const reducer = (state2) => {
      switch (action.type) {
        case "failed":
          return {
            ...state2,
            failureCount: action.failureCount,
            failureReason: action.error
          };
        case "pause":
          return {
            ...state2,
            isPaused: true
          };
        case "continue":
          return {
            ...state2,
            isPaused: false
          };
        case "pending":
          return {
            ...state2,
            context: action.context,
            data: void 0,
            failureCount: 0,
            failureReason: null,
            error: null,
            isPaused: action.isPaused,
            status: "pending",
            variables: action.variables,
            submittedAt: Date.now()
          };
        case "success":
          return {
            ...state2,
            data: action.data,
            failureCount: 0,
            failureReason: null,
            error: null,
            status: "success",
            isPaused: false
          };
        case "error":
          return {
            ...state2,
            data: void 0,
            error: action.error,
            failureCount: state2.failureCount + 1,
            failureReason: action.error,
            isPaused: false,
            status: "error"
          };
      }
    };
    this.state = reducer(this.state);
    notifyManager.batch(() => {
      this.#observers.forEach((observer) => {
        observer.onMutationUpdate(action);
      });
      this.#mutationCache.notify({
        mutation: this,
        type: "updated",
        action
      });
    });
  }
};
function getDefaultState() {
  return {
    context: void 0,
    data: void 0,
    error: null,
    failureCount: 0,
    failureReason: null,
    isPaused: false,
    status: "idle",
    variables: void 0,
    submittedAt: 0
  };
}
var MutationCache = class extends Subscribable {
  constructor(config = {}) {
    super();
    this.config = config;
    this.#mutations = /* @__PURE__ */ new Set();
    this.#scopes = /* @__PURE__ */ new Map();
    this.#mutationId = 0;
  }
  #mutations;
  #scopes;
  #mutationId;
  build(client, options, state2) {
    const mutation = new Mutation({
      client,
      mutationCache: this,
      mutationId: ++this.#mutationId,
      options: client.defaultMutationOptions(options),
      state: state2
    });
    this.add(mutation);
    return mutation;
  }
  add(mutation) {
    this.#mutations.add(mutation);
    const scope = scopeFor(mutation);
    if (typeof scope === "string") {
      const scopedMutations = this.#scopes.get(scope);
      if (scopedMutations) {
        scopedMutations.push(mutation);
      } else {
        this.#scopes.set(scope, [mutation]);
      }
    }
    this.notify({ type: "added", mutation });
  }
  remove(mutation) {
    if (this.#mutations.delete(mutation)) {
      const scope = scopeFor(mutation);
      if (typeof scope === "string") {
        const scopedMutations = this.#scopes.get(scope);
        if (scopedMutations) {
          if (scopedMutations.length > 1) {
            const index2 = scopedMutations.indexOf(mutation);
            if (index2 !== -1) {
              scopedMutations.splice(index2, 1);
            }
          } else if (scopedMutations[0] === mutation) {
            this.#scopes.delete(scope);
          }
        }
      }
    }
    this.notify({ type: "removed", mutation });
  }
  canRun(mutation) {
    const scope = scopeFor(mutation);
    if (typeof scope === "string") {
      const mutationsWithSameScope = this.#scopes.get(scope);
      const firstPendingMutation = mutationsWithSameScope?.find(
        (m) => m.state.status === "pending"
      );
      return !firstPendingMutation || firstPendingMutation === mutation;
    } else {
      return true;
    }
  }
  runNext(mutation) {
    const scope = scopeFor(mutation);
    if (typeof scope === "string") {
      const foundMutation = this.#scopes.get(scope)?.find((m) => m !== mutation && m.state.isPaused);
      return foundMutation?.continue() ?? Promise.resolve();
    } else {
      return Promise.resolve();
    }
  }
  clear() {
    notifyManager.batch(() => {
      this.#mutations.forEach((mutation) => {
        this.notify({ type: "removed", mutation });
      });
      this.#mutations.clear();
      this.#scopes.clear();
    });
  }
  getAll() {
    return Array.from(this.#mutations);
  }
  find(filters) {
    const defaultedFilters = { exact: true, ...filters };
    return this.getAll().find(
      (mutation) => matchMutation(defaultedFilters, mutation)
    );
  }
  findAll(filters = {}) {
    return this.getAll().filter((mutation) => matchMutation(filters, mutation));
  }
  notify(event) {
    notifyManager.batch(() => {
      this.listeners.forEach((listener) => {
        listener(event);
      });
    });
  }
  resumePausedMutations() {
    const pausedMutations = this.getAll().filter((x) => x.state.isPaused);
    return notifyManager.batch(
      () => Promise.all(
        pausedMutations.map((mutation) => mutation.continue().catch(noop))
      )
    );
  }
};
function scopeFor(mutation) {
  return mutation.options.scope?.id;
}
var QueryCache = class extends Subscribable {
  constructor(config = {}) {
    super();
    this.config = config;
    this.#queries = /* @__PURE__ */ new Map();
  }
  #queries;
  build(client, options, state2) {
    const queryKey = options.queryKey;
    const queryHash = options.queryHash ?? hashQueryKeyByOptions(queryKey, options);
    let query = this.get(queryHash);
    if (!query) {
      query = new Query({
        client,
        queryKey,
        queryHash,
        options: client.defaultQueryOptions(options),
        state: state2,
        defaultOptions: client.getQueryDefaults(queryKey)
      });
      this.add(query);
    }
    return query;
  }
  add(query) {
    if (!this.#queries.has(query.queryHash)) {
      this.#queries.set(query.queryHash, query);
      this.notify({
        type: "added",
        query
      });
    }
  }
  remove(query) {
    const queryInMap = this.#queries.get(query.queryHash);
    if (queryInMap) {
      query.destroy();
      if (queryInMap === query) {
        this.#queries.delete(query.queryHash);
      }
      this.notify({ type: "removed", query });
    }
  }
  clear() {
    notifyManager.batch(() => {
      this.getAll().forEach((query) => {
        this.remove(query);
      });
    });
  }
  get(queryHash) {
    return this.#queries.get(queryHash);
  }
  getAll() {
    return [...this.#queries.values()];
  }
  find(filters) {
    const defaultedFilters = { exact: true, ...filters };
    return this.getAll().find(
      (query) => matchQuery(defaultedFilters, query)
    );
  }
  findAll(filters = {}) {
    const queries = this.getAll();
    return Object.keys(filters).length > 0 ? queries.filter((query) => matchQuery(filters, query)) : queries;
  }
  notify(event) {
    notifyManager.batch(() => {
      this.listeners.forEach((listener) => {
        listener(event);
      });
    });
  }
  onFocus() {
    notifyManager.batch(() => {
      this.getAll().forEach((query) => {
        query.onFocus();
      });
    });
  }
  onOnline() {
    notifyManager.batch(() => {
      this.getAll().forEach((query) => {
        query.onOnline();
      });
    });
  }
};
var QueryClient = class {
  #queryCache;
  #mutationCache;
  #defaultOptions;
  #queryDefaults;
  #mutationDefaults;
  #mountCount;
  #unsubscribeFocus;
  #unsubscribeOnline;
  constructor(config = {}) {
    this.#queryCache = config.queryCache || new QueryCache();
    this.#mutationCache = config.mutationCache || new MutationCache();
    this.#defaultOptions = config.defaultOptions || {};
    this.#queryDefaults = /* @__PURE__ */ new Map();
    this.#mutationDefaults = /* @__PURE__ */ new Map();
    this.#mountCount = 0;
  }
  mount() {
    this.#mountCount++;
    if (this.#mountCount !== 1) return;
    this.#unsubscribeFocus = focusManager.subscribe(async (focused) => {
      if (focused) {
        await this.resumePausedMutations();
        this.#queryCache.onFocus();
      }
    });
    this.#unsubscribeOnline = onlineManager.subscribe(async (online) => {
      if (online) {
        await this.resumePausedMutations();
        this.#queryCache.onOnline();
      }
    });
  }
  unmount() {
    this.#mountCount--;
    if (this.#mountCount !== 0) return;
    this.#unsubscribeFocus?.();
    this.#unsubscribeFocus = void 0;
    this.#unsubscribeOnline?.();
    this.#unsubscribeOnline = void 0;
  }
  isFetching(filters) {
    return this.#queryCache.findAll({ ...filters, fetchStatus: "fetching" }).length;
  }
  isMutating(filters) {
    return this.#mutationCache.findAll({ ...filters, status: "pending" }).length;
  }
  /**
   * Imperative (non-reactive) way to retrieve data for a QueryKey.
   * Should only be used in callbacks or functions where reading the latest data is necessary, e.g. for optimistic updates.
   *
   * Hint: Do not use this function inside a component, because it won't receive updates.
   * Use `useQuery` to create a `QueryObserver` that subscribes to changes.
   */
  getQueryData(queryKey) {
    const options = this.defaultQueryOptions({ queryKey });
    return this.#queryCache.get(options.queryHash)?.state.data;
  }
  ensureQueryData(options) {
    const defaultedOptions = this.defaultQueryOptions(options);
    const query = this.#queryCache.build(this, defaultedOptions);
    const cachedData = query.state.data;
    if (cachedData === void 0) {
      return this.fetchQuery(options);
    }
    if (options.revalidateIfStale && query.isStaleByTime(resolveStaleTime(defaultedOptions.staleTime, query))) {
      void this.prefetchQuery(defaultedOptions);
    }
    return Promise.resolve(cachedData);
  }
  getQueriesData(filters) {
    return this.#queryCache.findAll(filters).map(({ queryKey, state: state2 }) => {
      const data = state2.data;
      return [queryKey, data];
    });
  }
  setQueryData(queryKey, updater, options) {
    const defaultedOptions = this.defaultQueryOptions({ queryKey });
    const query = this.#queryCache.get(
      defaultedOptions.queryHash
    );
    const prevData = query?.state.data;
    const data = functionalUpdate(updater, prevData);
    if (data === void 0) {
      return void 0;
    }
    return this.#queryCache.build(this, defaultedOptions).setData(data, { ...options, manual: true });
  }
  setQueriesData(filters, updater, options) {
    return notifyManager.batch(
      () => this.#queryCache.findAll(filters).map(({ queryKey }) => [
        queryKey,
        this.setQueryData(queryKey, updater, options)
      ])
    );
  }
  getQueryState(queryKey) {
    const options = this.defaultQueryOptions({ queryKey });
    return this.#queryCache.get(
      options.queryHash
    )?.state;
  }
  removeQueries(filters) {
    const queryCache = this.#queryCache;
    notifyManager.batch(() => {
      queryCache.findAll(filters).forEach((query) => {
        queryCache.remove(query);
      });
    });
  }
  resetQueries(filters, options) {
    const queryCache = this.#queryCache;
    return notifyManager.batch(() => {
      queryCache.findAll(filters).forEach((query) => {
        query.reset();
      });
      return this.refetchQueries(
        {
          type: "active",
          ...filters
        },
        options
      );
    });
  }
  cancelQueries(filters, cancelOptions = {}) {
    const defaultedCancelOptions = { revert: true, ...cancelOptions };
    const promises2 = notifyManager.batch(
      () => this.#queryCache.findAll(filters).map((query) => query.cancel(defaultedCancelOptions))
    );
    return Promise.all(promises2).then(noop).catch(noop);
  }
  invalidateQueries(filters, options = {}) {
    return notifyManager.batch(() => {
      this.#queryCache.findAll(filters).forEach((query) => {
        query.invalidate();
      });
      if (filters?.refetchType === "none") {
        return Promise.resolve();
      }
      return this.refetchQueries(
        {
          ...filters,
          type: filters?.refetchType ?? filters?.type ?? "active"
        },
        options
      );
    });
  }
  refetchQueries(filters, options = {}) {
    const fetchOptions = {
      ...options,
      cancelRefetch: options.cancelRefetch ?? true
    };
    const promises2 = notifyManager.batch(
      () => this.#queryCache.findAll(filters).filter((query) => !query.isDisabled() && !query.isStatic()).map((query) => {
        let promise = query.fetch(void 0, fetchOptions);
        if (!fetchOptions.throwOnError) {
          promise = promise.catch(noop);
        }
        return query.state.fetchStatus === "paused" ? Promise.resolve() : promise;
      })
    );
    return Promise.all(promises2).then(noop);
  }
  fetchQuery(options) {
    const defaultedOptions = this.defaultQueryOptions(options);
    if (defaultedOptions.retry === void 0) {
      defaultedOptions.retry = false;
    }
    const query = this.#queryCache.build(this, defaultedOptions);
    return query.isStaleByTime(
      resolveStaleTime(defaultedOptions.staleTime, query)
    ) ? query.fetch(defaultedOptions) : Promise.resolve(query.state.data);
  }
  prefetchQuery(options) {
    return this.fetchQuery(options).then(noop).catch(noop);
  }
  fetchInfiniteQuery(options) {
    options.behavior = infiniteQueryBehavior(options.pages);
    return this.fetchQuery(options);
  }
  prefetchInfiniteQuery(options) {
    return this.fetchInfiniteQuery(options).then(noop).catch(noop);
  }
  ensureInfiniteQueryData(options) {
    options.behavior = infiniteQueryBehavior(options.pages);
    return this.ensureQueryData(options);
  }
  resumePausedMutations() {
    if (onlineManager.isOnline()) {
      return this.#mutationCache.resumePausedMutations();
    }
    return Promise.resolve();
  }
  getQueryCache() {
    return this.#queryCache;
  }
  getMutationCache() {
    return this.#mutationCache;
  }
  getDefaultOptions() {
    return this.#defaultOptions;
  }
  setDefaultOptions(options) {
    this.#defaultOptions = options;
  }
  setQueryDefaults(queryKey, options) {
    this.#queryDefaults.set(hashKey(queryKey), {
      queryKey,
      defaultOptions: options
    });
  }
  getQueryDefaults(queryKey) {
    const defaults2 = [...this.#queryDefaults.values()];
    const result = {};
    defaults2.forEach((queryDefault) => {
      if (partialMatchKey(queryKey, queryDefault.queryKey)) {
        Object.assign(result, queryDefault.defaultOptions);
      }
    });
    return result;
  }
  setMutationDefaults(mutationKey, options) {
    this.#mutationDefaults.set(hashKey(mutationKey), {
      mutationKey,
      defaultOptions: options
    });
  }
  getMutationDefaults(mutationKey) {
    const defaults2 = [...this.#mutationDefaults.values()];
    const result = {};
    defaults2.forEach((queryDefault) => {
      if (partialMatchKey(mutationKey, queryDefault.mutationKey)) {
        Object.assign(result, queryDefault.defaultOptions);
      }
    });
    return result;
  }
  defaultQueryOptions(options) {
    if (options._defaulted) {
      return options;
    }
    const defaultedOptions = {
      ...this.#defaultOptions.queries,
      ...this.getQueryDefaults(options.queryKey),
      ...options,
      _defaulted: true
    };
    if (!defaultedOptions.queryHash) {
      defaultedOptions.queryHash = hashQueryKeyByOptions(
        defaultedOptions.queryKey,
        defaultedOptions
      );
    }
    if (defaultedOptions.refetchOnReconnect === void 0) {
      defaultedOptions.refetchOnReconnect = defaultedOptions.networkMode !== "always";
    }
    if (defaultedOptions.throwOnError === void 0) {
      defaultedOptions.throwOnError = !!defaultedOptions.suspense;
    }
    if (!defaultedOptions.networkMode && defaultedOptions.persister) {
      defaultedOptions.networkMode = "offlineFirst";
    }
    if (defaultedOptions.queryFn === skipToken) {
      defaultedOptions.enabled = false;
    }
    return defaultedOptions;
  }
  defaultMutationOptions(options) {
    if (options?._defaulted) {
      return options;
    }
    return {
      ...this.#defaultOptions.mutations,
      ...options?.mutationKey && this.getMutationDefaults(options.mutationKey),
      ...options,
      _defaulted: true
    };
  }
  clear() {
    this.#queryCache.clear();
    this.#mutationCache.clear();
  }
};
var QueryClientContext = reactExports.createContext(
  void 0
);
var useQueryClient = (queryClient) => {
  const client = reactExports.useContext(QueryClientContext);
  if (queryClient) {
    return queryClient;
  }
  if (!client) {
    throw new Error("No QueryClient set, use QueryClientProvider to set one");
  }
  return client;
};
var QueryClientProvider = ({
  client,
  children: children2
}) => {
  reactExports.useEffect(() => {
    client.mount();
    return () => {
      client.unmount();
    };
  }, [client]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientContext.Provider, { value: client, children: children2 });
};
function setupCoreRouterSsrQueryIntegration({
  router: router2,
  queryClient,
  handleRedirects = true
}) {
  const ogHydrate = router2.options.hydrate;
  const ogDehydrate = router2.options.dehydrate;
  if (router2.isServer) {
    const sentQueries = /* @__PURE__ */ new Set();
    const queryStream = createPushableStream();
    router2.options.dehydrate = async () => {
      router2.serverSsr.onRenderFinished(() => queryStream.close());
      const ogDehydrated = await ogDehydrate?.();
      const dehydratedRouter = {
        ...ogDehydrated,
        // prepare the stream for queries coming up during rendering
        queryStream: queryStream.stream
      };
      const dehydratedQueryClient = dehydrate(queryClient);
      if (dehydratedQueryClient.queries.length > 0) {
        dehydratedQueryClient.queries.forEach((query) => {
          sentQueries.add(query.queryHash);
        });
        dehydratedRouter.dehydratedQueryClient = dehydratedQueryClient;
      }
      return dehydratedRouter;
    };
    const ogClientOptions = queryClient.getDefaultOptions();
    queryClient.setDefaultOptions({
      ...ogClientOptions,
      dehydrate: {
        shouldDehydrateQuery: () => true,
        ...ogClientOptions.dehydrate
      }
    });
    queryClient.getQueryCache().subscribe((event) => {
      if (!router2.serverSsr?.isDehydrated()) {
        return;
      }
      if (sentQueries.has(event.query.queryHash)) {
        return;
      }
      if (!event.query.promise) {
        return;
      }
      if (queryStream.isClosed()) {
        console.warn(
          `tried to stream query ${event.query.queryHash} after stream was already closed`
        );
        return;
      }
      sentQueries.add(event.query.queryHash);
      queryStream.enqueue(
        dehydrate(queryClient, {
          shouldDehydrateQuery: (query) => {
            if (query.queryHash === event.query.queryHash) {
              return ogClientOptions.dehydrate?.shouldDehydrateQuery?.(query) ?? true;
            }
            return false;
          }
        })
      );
    });
  } else {
    router2.options.hydrate = async (dehydrated) => {
      await ogHydrate?.(dehydrated);
      if (dehydrated.dehydratedQueryClient) {
        hydrate(queryClient, dehydrated.dehydratedQueryClient);
      }
      const reader = dehydrated.queryStream.getReader();
      reader.read().then(async function handle({ done, value }) {
        hydrate(queryClient, value);
        if (done) {
          return;
        }
        const result = await reader.read();
        return handle(result);
      }).catch((err) => {
        console.error("Error reading query stream:", err);
      });
    };
    if (handleRedirects) {
      const ogMutationCacheConfig = queryClient.getMutationCache().config;
      queryClient.getMutationCache().config = {
        ...ogMutationCacheConfig,
        onError: (error, ...rest) => {
          if (isRedirect(error)) {
            error.options._fromLocation = router2.state.location;
            return router2.navigate(router2.resolveRedirect(error).options);
          }
          return ogMutationCacheConfig.onError?.(error, ...rest);
        }
      };
      const ogQueryCacheConfig = queryClient.getQueryCache().config;
      queryClient.getQueryCache().config = {
        ...ogQueryCacheConfig,
        onError: (error, ...rest) => {
          if (isRedirect(error)) {
            error.options._fromLocation = router2.state.location;
            return router2.navigate(router2.resolveRedirect(error).options);
          }
          return ogQueryCacheConfig.onError?.(error, ...rest);
        }
      };
    }
  }
}
function createPushableStream() {
  let controllerRef;
  const stream2 = new ReadableStream({
    start(controller) {
      controllerRef = controller;
    }
  });
  let _isClosed = false;
  return {
    stream: stream2,
    enqueue: (chunk) => controllerRef.enqueue(chunk),
    close: () => {
      controllerRef.close();
      _isClosed = true;
    },
    isClosed: () => _isClosed,
    error: (err) => controllerRef.error(err)
  };
}
function setupRouterSsrQueryIntegration(opts) {
  setupCoreRouterSsrQueryIntegration(opts);
  if (opts.wrapQueryClient === false) {
    return;
  }
  const OGWrap = opts.router.options.Wrap || reactExports.Fragment;
  opts.router.options.Wrap = ({ children: children2 }) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientProvider, { client: opts.queryClient, children: /* @__PURE__ */ jsxRuntimeExports.jsx(OGWrap, { children: children2 }) });
  };
}
function getContext() {
  const queryClient = new QueryClient();
  return {
    queryClient
  };
}
function Provider({
  children: children2,
  queryClient
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientProvider, { client: queryClient, children: children2 });
}
var initialState = {
  settings: {
    defaultOpen: false,
    hideUntilHover: false,
    position: "bottom-right",
    panelLocation: "bottom",
    openHotkey: ["Shift", "A"],
    requireUrlFlag: false,
    urlFlag: "tanstack-devtools",
    theme: typeof window !== "undefined" && typeof window.matchMedia !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light",
    triggerImage: "",
    triggerHidden: false
  }
};
var TanStackDevtoolsCore = class {
  #config = {
    ...initialState.settings
  };
  #plugins = [];
  #isMounted = false;
  #dispose;
  #Component;
  #eventBus;
  #eventBusConfig;
  #setPlugins;
  constructor(init) {
    this.#plugins = init.plugins || [];
    this.#eventBusConfig = init.eventBusConfig;
    this.#config = {
      ...this.#config,
      ...init.config
    };
  }
  mount(el) {
    return;
  }
  unmount() {
    if (!this.#isMounted) {
      throw new Error("Devtools is not mounted");
    }
    this.#eventBus?.stop();
    this.#dispose?.();
    this.#isMounted = false;
  }
  setConfig(config) {
    this.#config = {
      ...this.#config,
      ...config
    };
    if (config.plugins) {
      this.#plugins = config.plugins;
      if (this.#isMounted && this.#setPlugins) {
        this.#setPlugins(config.plugins);
      }
    }
  }
};
const convertRender = (Component, setComponents, e, theme) => {
  const element = typeof Component === "function" ? Component(e, theme) : Component;
  setComponents((prev) => ({
    ...prev,
    [e.getAttribute("id")]: element
  }));
};
const TanStackDevtools$1 = ({
  plugins,
  config,
  eventBusConfig
}) => {
  const devToolRef = reactExports.useRef(null);
  const [pluginContainers, setPluginContainers] = reactExports.useState({});
  const [titleContainers, setTitleContainers] = reactExports.useState({});
  const [PluginComponents, setPluginComponents] = reactExports.useState({});
  const [TitleComponents, setTitleComponents] = reactExports.useState({});
  const pluginsMap = reactExports.useMemo(
    () => plugins?.map((plugin) => {
      return {
        ...plugin,
        name: typeof plugin.name === "string" ? plugin.name : (e, theme) => {
          const id = e.getAttribute("id");
          const target = e.ownerDocument.getElementById(id);
          if (target) {
            setTitleContainers((prev) => ({
              ...prev,
              [id]: e
            }));
          }
          convertRender(
            plugin.name,
            setTitleComponents,
            e,
            theme
          );
        },
        render: (e, theme) => {
          const id = e.getAttribute("id");
          const target = e.ownerDocument.getElementById(id);
          if (target) {
            setPluginContainers((prev) => ({
              ...prev,
              [id]: e
            }));
          }
          convertRender(plugin.render, setPluginComponents, e, theme);
        }
      };
    }) ?? [],
    [plugins]
  );
  const [devtools] = reactExports.useState(
    () => new TanStackDevtoolsCore({
      config,
      eventBusConfig,
      plugins: pluginsMap
    })
  );
  reactExports.useEffect(() => {
    devtools.setConfig({
      plugins: pluginsMap
    });
  }, [devtools, pluginsMap]);
  reactExports.useEffect(() => {
    if (devToolRef.current) {
      devtools.mount(devToolRef.current);
    }
    return () => devtools.unmount();
  }, [devtools]);
  const hasPlugins = Object.values(pluginContainers).length > 0 && Object.values(PluginComponents).length > 0;
  const hasTitles = Object.values(titleContainers).length > 0 && Object.values(TitleComponents).length > 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "absolute" }, ref: devToolRef }),
    hasPlugins ? Object.entries(pluginContainers).map(
      ([key, pluginContainer]) => reactDomExports.createPortal(/* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: PluginComponents[key] }), pluginContainer)
    ) : null,
    hasTitles ? Object.entries(titleContainers).map(
      ([key, titleContainer]) => reactDomExports.createPortal(/* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: TitleComponents[key] }), titleContainer)
    ) : null
  ] });
};
const TanStackDevtools = TanStackDevtools$1;
const sharedConfig$1 = {
  context: void 0,
  registry: void 0,
  effects: void 0,
  done: false,
  getContextId() {
    return getContextId$1(this.context.count);
  },
  getNextContextId() {
    return getContextId$1(this.context.count++);
  }
};
function getContextId$1(count) {
  const num = String(count), len = num.length - 1;
  return sharedConfig$1.context.id + (len ? String.fromCharCode(96 + len) : "") + num;
}
function setHydrateContext$1(context) {
  sharedConfig$1.context = context;
}
const IS_DEV$1 = false;
const equalFn$1 = (a, b) => a === b;
const $PROXY$1 = Symbol("solid-proxy");
const SUPPORTS_PROXY$1 = typeof Proxy === "function";
const $TRACK$1 = Symbol("solid-track");
const signalOptions$1 = {
  equals: equalFn$1
};
let runEffects$1 = runQueue$1;
const STALE$1 = 1;
const PENDING$1 = 2;
const UNOWNED$1 = {
  owned: null,
  cleanups: null,
  context: null,
  owner: null
};
const NO_INIT$1 = {};
var Owner$1 = null;
let Transition$1 = null;
let ExternalSourceConfig$1 = null;
let Listener$1 = null;
let Updates$1 = null;
let Effects$1 = null;
let ExecCount$1 = 0;
function createRoot$1(fn, detachedOwner) {
  const listener = Listener$1, owner = Owner$1, unowned = fn.length === 0, current = detachedOwner === void 0 ? owner : detachedOwner, root = unowned ? UNOWNED$1 : {
    owned: null,
    cleanups: null,
    context: current ? current.context : null,
    owner: current
  }, updateFn = unowned ? fn : () => fn(() => untrack$1(() => cleanNode$1(root)));
  Owner$1 = root;
  Listener$1 = null;
  try {
    return runUpdates$1(updateFn, true);
  } finally {
    Listener$1 = listener;
    Owner$1 = owner;
  }
}
function createSignal$1(value, options) {
  options = options ? Object.assign({}, signalOptions$1, options) : signalOptions$1;
  const s = {
    value,
    observers: null,
    observerSlots: null,
    comparator: options.equals || void 0
  };
  const setter = (value2) => {
    if (typeof value2 === "function") {
      value2 = value2(s.value);
    }
    return writeSignal$1(s, value2);
  };
  return [readSignal$1.bind(s), setter];
}
function createComputed$1(fn, value, options) {
  const c = createComputation$1(fn, value, true, STALE$1);
  updateComputation$1(c);
}
function createRenderEffect$1(fn, value, options) {
  const c = createComputation$1(fn, value, false, STALE$1);
  updateComputation$1(c);
}
function createEffect$1(fn, value, options) {
  runEffects$1 = runUserEffects$1;
  const c = createComputation$1(fn, value, false, STALE$1);
  if (!options || !options.render) c.user = true;
  Effects$1 ? Effects$1.push(c) : updateComputation$1(c);
}
function createMemo$1(fn, value, options) {
  options = options ? Object.assign({}, signalOptions$1, options) : signalOptions$1;
  const c = createComputation$1(fn, value, true, 0);
  c.observers = null;
  c.observerSlots = null;
  c.comparator = options.equals || void 0;
  updateComputation$1(c);
  return readSignal$1.bind(c);
}
function isPromise$1(v) {
  return v && typeof v === "object" && "then" in v;
}
function createResource$1(pSource, pFetcher, pOptions) {
  let source;
  let fetcher;
  let options;
  {
    source = true;
    fetcher = pSource;
    options = {};
  }
  let pr = null, initP = NO_INIT$1, id = null, scheduled = false, resolved = "initialValue" in options, dynamic = typeof source === "function" && createMemo$1(source);
  const contexts = /* @__PURE__ */ new Set(), [value, setValue] = (options.storage || createSignal$1)(options.initialValue), [error, setError] = createSignal$1(void 0), [track, trigger] = createSignal$1(void 0, {
    equals: false
  }), [state2, setState] = createSignal$1(resolved ? "ready" : "unresolved");
  if (sharedConfig$1.context) {
    id = sharedConfig$1.getNextContextId();
    if (options.ssrLoadFrom === "initial") initP = options.initialValue;
    else if (sharedConfig$1.load && sharedConfig$1.has(id)) initP = sharedConfig$1.load(id);
  }
  function loadEnd(p, v, error2, key) {
    if (pr === p) {
      pr = null;
      key !== void 0 && (resolved = true);
      if ((p === initP || v === initP) && options.onHydrated) queueMicrotask(() => options.onHydrated(key, {
        value: v
      }));
      initP = NO_INIT$1;
      completeLoad(v, error2);
    }
    return v;
  }
  function completeLoad(v, err) {
    runUpdates$1(() => {
      if (err === void 0) setValue(() => v);
      setState(err !== void 0 ? "errored" : resolved ? "ready" : "unresolved");
      setError(err);
      for (const c of contexts.keys()) c.decrement();
      contexts.clear();
    }, false);
  }
  function read() {
    const c = SuspenseContext$1, v = value(), err = error();
    if (err !== void 0 && !pr) throw err;
    if (Listener$1 && !Listener$1.user && c) ;
    return v;
  }
  function load(refetching = true) {
    if (refetching !== false && scheduled) return;
    scheduled = false;
    const lookup = dynamic ? dynamic() : source;
    if (lookup == null || lookup === false) {
      loadEnd(pr, untrack$1(value));
      return;
    }
    let error2;
    const p = initP !== NO_INIT$1 ? initP : untrack$1(() => {
      try {
        return fetcher(lookup, {
          value: value(),
          refetching
        });
      } catch (fetcherError) {
        error2 = fetcherError;
      }
    });
    if (error2 !== void 0) {
      loadEnd(pr, void 0, castError$1(error2), lookup);
      return;
    } else if (!isPromise$1(p)) {
      loadEnd(pr, p, void 0, lookup);
      return p;
    }
    pr = p;
    if ("v" in p) {
      if (p.s === 1) loadEnd(pr, p.v, void 0, lookup);
      else loadEnd(pr, void 0, castError$1(p.v), lookup);
      return p;
    }
    scheduled = true;
    queueMicrotask(() => scheduled = false);
    runUpdates$1(() => {
      setState(resolved ? "refreshing" : "pending");
      trigger();
    }, false);
    return p.then((v) => loadEnd(p, v, void 0, lookup), (e) => loadEnd(p, void 0, castError$1(e), lookup));
  }
  Object.defineProperties(read, {
    state: {
      get: () => state2()
    },
    error: {
      get: () => error()
    },
    loading: {
      get() {
        const s = state2();
        return s === "pending" || s === "refreshing";
      }
    },
    latest: {
      get() {
        if (!resolved) return read();
        const err = error();
        if (err && !pr) throw err;
        return value();
      }
    }
  });
  let owner = Owner$1;
  if (dynamic) createComputed$1(() => (owner = Owner$1, load(false)));
  else load(false);
  return [read, {
    refetch: (info) => runWithOwner$1(owner, () => load(info)),
    mutate: setValue
  }];
}
function untrack$1(fn) {
  if (Listener$1 === null) return fn();
  const listener = Listener$1;
  Listener$1 = null;
  try {
    if (ExternalSourceConfig$1) ;
    return fn();
  } finally {
    Listener$1 = listener;
  }
}
function onCleanup$1(fn) {
  if (Owner$1 === null) ;
  else if (Owner$1.cleanups === null) Owner$1.cleanups = [fn];
  else Owner$1.cleanups.push(fn);
  return fn;
}
function runWithOwner$1(o, fn) {
  const prev = Owner$1;
  const prevListener = Listener$1;
  Owner$1 = o;
  Listener$1 = null;
  try {
    return runUpdates$1(fn, true);
  } catch (err) {
    handleError$1(err);
  } finally {
    Owner$1 = prev;
    Listener$1 = prevListener;
  }
}
const [transPending$1, setTransPending$1] = /* @__PURE__ */ createSignal$1(false);
function createContext$1(defaultValue, options) {
  const id = Symbol("context");
  return {
    id,
    Provider: createProvider$1(id),
    defaultValue
  };
}
function useContext$1(context) {
  let value;
  return Owner$1 && Owner$1.context && (value = Owner$1.context[context.id]) !== void 0 ? value : context.defaultValue;
}
function children$2(fn) {
  const children2 = createMemo$1(fn);
  const memo2 = createMemo$1(() => resolveChildren$1(children2()));
  memo2.toArray = () => {
    const c = memo2();
    return Array.isArray(c) ? c : c != null ? [c] : [];
  };
  return memo2;
}
let SuspenseContext$1;
function readSignal$1() {
  if (this.sources && this.state) {
    if (this.state === STALE$1) updateComputation$1(this);
    else {
      const updates = Updates$1;
      Updates$1 = null;
      runUpdates$1(() => lookUpstream$1(this), false);
      Updates$1 = updates;
    }
  }
  if (Listener$1) {
    const sSlot = this.observers ? this.observers.length : 0;
    if (!Listener$1.sources) {
      Listener$1.sources = [this];
      Listener$1.sourceSlots = [sSlot];
    } else {
      Listener$1.sources.push(this);
      Listener$1.sourceSlots.push(sSlot);
    }
    if (!this.observers) {
      this.observers = [Listener$1];
      this.observerSlots = [Listener$1.sources.length - 1];
    } else {
      this.observers.push(Listener$1);
      this.observerSlots.push(Listener$1.sources.length - 1);
    }
  }
  return this.value;
}
function writeSignal$1(node2, value, isComp) {
  let current = node2.value;
  if (!node2.comparator || !node2.comparator(current, value)) {
    node2.value = value;
    if (node2.observers && node2.observers.length) {
      runUpdates$1(() => {
        for (let i = 0; i < node2.observers.length; i += 1) {
          const o = node2.observers[i];
          const TransitionRunning = Transition$1 && Transition$1.running;
          if (TransitionRunning && Transition$1.disposed.has(o)) ;
          if (TransitionRunning ? !o.tState : !o.state) {
            if (o.pure) Updates$1.push(o);
            else Effects$1.push(o);
            if (o.observers) markDownstream$1(o);
          }
          if (!TransitionRunning) o.state = STALE$1;
        }
        if (Updates$1.length > 1e6) {
          Updates$1 = [];
          if (IS_DEV$1) ;
          throw new Error();
        }
      }, false);
    }
  }
  return value;
}
function updateComputation$1(node2) {
  if (!node2.fn) return;
  cleanNode$1(node2);
  const time = ExecCount$1;
  runComputation$1(node2, node2.value, time);
}
function runComputation$1(node2, value, time) {
  let nextValue;
  const owner = Owner$1, listener = Listener$1;
  Listener$1 = Owner$1 = node2;
  try {
    nextValue = node2.fn(value);
  } catch (err) {
    if (node2.pure) {
      {
        node2.state = STALE$1;
        node2.owned && node2.owned.forEach(cleanNode$1);
        node2.owned = null;
      }
    }
    node2.updatedAt = time + 1;
    return handleError$1(err);
  } finally {
    Listener$1 = listener;
    Owner$1 = owner;
  }
  if (!node2.updatedAt || node2.updatedAt <= time) {
    if (node2.updatedAt != null && "observers" in node2) {
      writeSignal$1(node2, nextValue);
    } else node2.value = nextValue;
    node2.updatedAt = time;
  }
}
function createComputation$1(fn, init, pure, state2 = STALE$1, options) {
  const c = {
    fn,
    state: state2,
    updatedAt: null,
    owned: null,
    sources: null,
    sourceSlots: null,
    cleanups: null,
    value: init,
    owner: Owner$1,
    context: Owner$1 ? Owner$1.context : null,
    pure
  };
  if (Owner$1 === null) ;
  else if (Owner$1 !== UNOWNED$1) {
    {
      if (!Owner$1.owned) Owner$1.owned = [c];
      else Owner$1.owned.push(c);
    }
  }
  return c;
}
function runTop$1(node2) {
  if (node2.state === 0) return;
  if (node2.state === PENDING$1) return lookUpstream$1(node2);
  if (node2.suspense && untrack$1(node2.suspense.inFallback)) return node2.suspense.effects.push(node2);
  const ancestors = [node2];
  while ((node2 = node2.owner) && (!node2.updatedAt || node2.updatedAt < ExecCount$1)) {
    if (node2.state) ancestors.push(node2);
  }
  for (let i = ancestors.length - 1; i >= 0; i--) {
    node2 = ancestors[i];
    if (node2.state === STALE$1) {
      updateComputation$1(node2);
    } else if (node2.state === PENDING$1) {
      const updates = Updates$1;
      Updates$1 = null;
      runUpdates$1(() => lookUpstream$1(node2, ancestors[0]), false);
      Updates$1 = updates;
    }
  }
}
function runUpdates$1(fn, init) {
  if (Updates$1) return fn();
  let wait = false;
  if (!init) Updates$1 = [];
  if (Effects$1) wait = true;
  else Effects$1 = [];
  ExecCount$1++;
  try {
    const res = fn();
    completeUpdates$1(wait);
    return res;
  } catch (err) {
    if (!wait) Effects$1 = null;
    Updates$1 = null;
    handleError$1(err);
  }
}
function completeUpdates$1(wait) {
  if (Updates$1) {
    runQueue$1(Updates$1);
    Updates$1 = null;
  }
  if (wait) return;
  const e = Effects$1;
  Effects$1 = null;
  if (e.length) runUpdates$1(() => runEffects$1(e), false);
}
function runQueue$1(queue) {
  for (let i = 0; i < queue.length; i++) runTop$1(queue[i]);
}
function runUserEffects$1(queue) {
  let i, userLength = 0;
  for (i = 0; i < queue.length; i++) {
    const e = queue[i];
    if (!e.user) runTop$1(e);
    else queue[userLength++] = e;
  }
  if (sharedConfig$1.context) {
    if (sharedConfig$1.count) {
      sharedConfig$1.effects || (sharedConfig$1.effects = []);
      sharedConfig$1.effects.push(...queue.slice(0, userLength));
      return;
    }
    setHydrateContext$1();
  }
  if (sharedConfig$1.effects && (sharedConfig$1.done || !sharedConfig$1.count)) {
    queue = [...sharedConfig$1.effects, ...queue];
    userLength += sharedConfig$1.effects.length;
    delete sharedConfig$1.effects;
  }
  for (i = 0; i < userLength; i++) runTop$1(queue[i]);
}
function lookUpstream$1(node2, ignore) {
  node2.state = 0;
  for (let i = 0; i < node2.sources.length; i += 1) {
    const source = node2.sources[i];
    if (source.sources) {
      const state2 = source.state;
      if (state2 === STALE$1) {
        if (source !== ignore && (!source.updatedAt || source.updatedAt < ExecCount$1)) runTop$1(source);
      } else if (state2 === PENDING$1) lookUpstream$1(source, ignore);
    }
  }
}
function markDownstream$1(node2) {
  for (let i = 0; i < node2.observers.length; i += 1) {
    const o = node2.observers[i];
    if (!o.state) {
      o.state = PENDING$1;
      if (o.pure) Updates$1.push(o);
      else Effects$1.push(o);
      o.observers && markDownstream$1(o);
    }
  }
}
function cleanNode$1(node2) {
  let i;
  if (node2.sources) {
    while (node2.sources.length) {
      const source = node2.sources.pop(), index2 = node2.sourceSlots.pop(), obs = source.observers;
      if (obs && obs.length) {
        const n = obs.pop(), s = source.observerSlots.pop();
        if (index2 < obs.length) {
          n.sourceSlots[s] = index2;
          obs[index2] = n;
          source.observerSlots[index2] = s;
        }
      }
    }
  }
  if (node2.tOwned) {
    for (i = node2.tOwned.length - 1; i >= 0; i--) cleanNode$1(node2.tOwned[i]);
    delete node2.tOwned;
  }
  if (node2.owned) {
    for (i = node2.owned.length - 1; i >= 0; i--) cleanNode$1(node2.owned[i]);
    node2.owned = null;
  }
  if (node2.cleanups) {
    for (i = node2.cleanups.length - 1; i >= 0; i--) node2.cleanups[i]();
    node2.cleanups = null;
  }
  node2.state = 0;
}
function castError$1(err) {
  if (err instanceof Error) return err;
  return new Error(typeof err === "string" ? err : "Unknown error", {
    cause: err
  });
}
function handleError$1(err, owner = Owner$1) {
  const error = castError$1(err);
  throw error;
}
function resolveChildren$1(children2) {
  if (typeof children2 === "function" && !children2.length) return resolveChildren$1(children2());
  if (Array.isArray(children2)) {
    const results = [];
    for (let i = 0; i < children2.length; i++) {
      const result = resolveChildren$1(children2[i]);
      Array.isArray(result) ? results.push.apply(results, result) : results.push(result);
    }
    return results;
  }
  return children2;
}
function createProvider$1(id, options) {
  return function provider(props) {
    let res;
    createRenderEffect$1(() => res = untrack$1(() => {
      Owner$1.context = {
        ...Owner$1.context,
        [id]: props.value
      };
      return children$2(() => props.children);
    }), void 0);
    return res;
  };
}
const FALLBACK$1 = Symbol("fallback");
function dispose$1(d) {
  for (let i = 0; i < d.length; i++) d[i]();
}
function mapArray$1(list, mapFn, options = {}) {
  let items = [], mapped = [], disposers = [], len = 0, indexes = mapFn.length > 1 ? [] : null;
  onCleanup$1(() => dispose$1(disposers));
  return () => {
    let newItems = list() || [], newLen = newItems.length, i, j;
    newItems[$TRACK$1];
    return untrack$1(() => {
      let newIndices, newIndicesNext, temp, tempdisposers, tempIndexes, start, end, newEnd, item;
      if (newLen === 0) {
        if (len !== 0) {
          dispose$1(disposers);
          disposers = [];
          items = [];
          mapped = [];
          len = 0;
          indexes && (indexes = []);
        }
        if (options.fallback) {
          items = [FALLBACK$1];
          mapped[0] = createRoot$1((disposer) => {
            disposers[0] = disposer;
            return options.fallback();
          });
          len = 1;
        }
      } else if (len === 0) {
        mapped = new Array(newLen);
        for (j = 0; j < newLen; j++) {
          items[j] = newItems[j];
          mapped[j] = createRoot$1(mapper);
        }
        len = newLen;
      } else {
        temp = new Array(newLen);
        tempdisposers = new Array(newLen);
        indexes && (tempIndexes = new Array(newLen));
        for (start = 0, end = Math.min(len, newLen); start < end && items[start] === newItems[start]; start++) ;
        for (end = len - 1, newEnd = newLen - 1; end >= start && newEnd >= start && items[end] === newItems[newEnd]; end--, newEnd--) {
          temp[newEnd] = mapped[end];
          tempdisposers[newEnd] = disposers[end];
          indexes && (tempIndexes[newEnd] = indexes[end]);
        }
        newIndices = /* @__PURE__ */ new Map();
        newIndicesNext = new Array(newEnd + 1);
        for (j = newEnd; j >= start; j--) {
          item = newItems[j];
          i = newIndices.get(item);
          newIndicesNext[j] = i === void 0 ? -1 : i;
          newIndices.set(item, j);
        }
        for (i = start; i <= end; i++) {
          item = items[i];
          j = newIndices.get(item);
          if (j !== void 0 && j !== -1) {
            temp[j] = mapped[i];
            tempdisposers[j] = disposers[i];
            indexes && (tempIndexes[j] = indexes[i]);
            j = newIndicesNext[j];
            newIndices.set(item, j);
          } else disposers[i]();
        }
        for (j = start; j < newLen; j++) {
          if (j in temp) {
            mapped[j] = temp[j];
            disposers[j] = tempdisposers[j];
            if (indexes) {
              indexes[j] = tempIndexes[j];
              indexes[j](j);
            }
          } else mapped[j] = createRoot$1(mapper);
        }
        mapped = mapped.slice(0, len = newLen);
        items = newItems.slice(0);
      }
      return mapped;
    });
    function mapper(disposer) {
      disposers[j] = disposer;
      if (indexes) {
        const [s, set] = createSignal$1(j);
        indexes[j] = set;
        return mapFn(newItems[j], s);
      }
      return mapFn(newItems[j]);
    }
  };
}
function createComponent$1(Comp, props) {
  return untrack$1(() => Comp(props || {}));
}
function trueFn$1() {
  return true;
}
const propTraps$1 = {
  get(_2, property, receiver) {
    if (property === $PROXY$1) return receiver;
    return _2.get(property);
  },
  has(_2, property) {
    if (property === $PROXY$1) return true;
    return _2.has(property);
  },
  set: trueFn$1,
  deleteProperty: trueFn$1,
  getOwnPropertyDescriptor(_2, property) {
    return {
      configurable: true,
      enumerable: true,
      get() {
        return _2.get(property);
      },
      set: trueFn$1,
      deleteProperty: trueFn$1
    };
  },
  ownKeys(_2) {
    return _2.keys();
  }
};
function resolveSource$1(s) {
  return !(s = typeof s === "function" ? s() : s) ? {} : s;
}
function resolveSources$1() {
  for (let i = 0, length = this.length; i < length; ++i) {
    const v = this[i]();
    if (v !== void 0) return v;
  }
}
function mergeProps$1(...sources) {
  let proxy = false;
  for (let i = 0; i < sources.length; i++) {
    const s = sources[i];
    proxy = proxy || !!s && $PROXY$1 in s;
    sources[i] = typeof s === "function" ? (proxy = true, createMemo$1(s)) : s;
  }
  if (SUPPORTS_PROXY$1 && proxy) {
    return new Proxy({
      get(property) {
        for (let i = sources.length - 1; i >= 0; i--) {
          const v = resolveSource$1(sources[i])[property];
          if (v !== void 0) return v;
        }
      },
      has(property) {
        for (let i = sources.length - 1; i >= 0; i--) {
          if (property in resolveSource$1(sources[i])) return true;
        }
        return false;
      },
      keys() {
        const keys = [];
        for (let i = 0; i < sources.length; i++) keys.push(...Object.keys(resolveSource$1(sources[i])));
        return [...new Set(keys)];
      }
    }, propTraps$1);
  }
  const sourcesMap = {};
  const defined = /* @__PURE__ */ Object.create(null);
  for (let i = sources.length - 1; i >= 0; i--) {
    const source = sources[i];
    if (!source) continue;
    const sourceKeys = Object.getOwnPropertyNames(source);
    for (let i2 = sourceKeys.length - 1; i2 >= 0; i2--) {
      const key = sourceKeys[i2];
      if (key === "__proto__" || key === "constructor") continue;
      const desc = Object.getOwnPropertyDescriptor(source, key);
      if (!defined[key]) {
        defined[key] = desc.get ? {
          enumerable: true,
          configurable: true,
          get: resolveSources$1.bind(sourcesMap[key] = [desc.get.bind(source)])
        } : desc.value !== void 0 ? desc : void 0;
      } else {
        const sources2 = sourcesMap[key];
        if (sources2) {
          if (desc.get) sources2.push(desc.get.bind(source));
          else if (desc.value !== void 0) sources2.push(() => desc.value);
        }
      }
    }
  }
  const target = {};
  const definedKeys = Object.keys(defined);
  for (let i = definedKeys.length - 1; i >= 0; i--) {
    const key = definedKeys[i], desc = defined[key];
    if (desc && desc.get) Object.defineProperty(target, key, desc);
    else target[key] = desc ? desc.value : void 0;
  }
  return target;
}
function splitProps$1(props, ...keys) {
  if (SUPPORTS_PROXY$1 && $PROXY$1 in props) {
    const blocked = new Set(keys.length > 1 ? keys.flat() : keys[0]);
    const res = keys.map((k) => {
      return new Proxy({
        get(property) {
          return k.includes(property) ? props[property] : void 0;
        },
        has(property) {
          return k.includes(property) && property in props;
        },
        keys() {
          return k.filter((property) => property in props);
        }
      }, propTraps$1);
    });
    res.push(new Proxy({
      get(property) {
        return blocked.has(property) ? void 0 : props[property];
      },
      has(property) {
        return blocked.has(property) ? false : property in props;
      },
      keys() {
        return Object.keys(props).filter((k) => !blocked.has(k));
      }
    }, propTraps$1));
    return res;
  }
  const otherObject = {};
  const objects = keys.map(() => ({}));
  for (const propName of Object.getOwnPropertyNames(props)) {
    const desc = Object.getOwnPropertyDescriptor(props, propName);
    const isDefaultDesc = !desc.get && !desc.set && desc.enumerable && desc.writable && desc.configurable;
    let blocked = false;
    let objectIndex = 0;
    for (const k of keys) {
      if (k.includes(propName)) {
        blocked = true;
        isDefaultDesc ? objects[objectIndex][propName] = desc.value : Object.defineProperty(objects[objectIndex], propName, desc);
      }
      ++objectIndex;
    }
    if (!blocked) {
      isDefaultDesc ? otherObject[propName] = desc.value : Object.defineProperty(otherObject, propName, desc);
    }
  }
  return [...objects, otherObject];
}
function lazy$1(fn) {
  let comp;
  let p;
  const wrap2 = (props) => {
    const ctx = sharedConfig$1.context;
    if (ctx) {
      const [s, set] = createSignal$1();
      sharedConfig$1.count || (sharedConfig$1.count = 0);
      sharedConfig$1.count++;
      (p || (p = fn())).then((mod) => {
        !sharedConfig$1.done && setHydrateContext$1(ctx);
        sharedConfig$1.count--;
        set(() => mod.default);
        setHydrateContext$1();
      });
      comp = s;
    } else if (!comp) {
      const [s] = createResource$1(() => (p || (p = fn())).then((mod) => mod.default));
      comp = s;
    }
    let Comp;
    return createMemo$1(() => (Comp = comp()) ? untrack$1(() => {
      if (IS_DEV$1) ;
      if (!ctx || sharedConfig$1.done) return Comp(props);
      const c = sharedConfig$1.context;
      setHydrateContext$1(ctx);
      const r = Comp(props);
      setHydrateContext$1(c);
      return r;
    }) : "");
  };
  wrap2.preload = () => p || ((p = fn()).then((mod) => comp = () => mod.default), p);
  return wrap2;
}
let counter$1 = 0;
function createUniqueId$1() {
  const ctx = sharedConfig$1.context;
  return ctx ? sharedConfig$1.getNextContextId() : `cl-${counter$1++}`;
}
const narrowedError$1 = (name) => `Stale read from <${name}>.`;
function For$1(props) {
  const fallback2 = "fallback" in props && {
    fallback: () => props.fallback
  };
  return createMemo$1(mapArray$1(() => props.each, props.children, fallback2 || void 0));
}
function Show$1(props) {
  const keyed = props.keyed;
  const conditionValue = createMemo$1(() => props.when, void 0, void 0);
  const condition = keyed ? conditionValue : createMemo$1(conditionValue, void 0, {
    equals: (a, b) => !a === !b
  });
  return createMemo$1(() => {
    const c = condition();
    if (c) {
      const child = props.children;
      const fn = typeof child === "function" && child.length > 0;
      return fn ? untrack$1(() => child(keyed ? c : () => {
        if (!untrack$1(condition)) throw narrowedError$1("Show");
        return conditionValue();
      })) : child;
    }
    return props.fallback;
  }, void 0, void 0);
}
function Switch$1(props) {
  const chs = children$2(() => props.children);
  const switchFunc = createMemo$1(() => {
    const ch = chs();
    const mps = Array.isArray(ch) ? ch : [ch];
    let func = () => void 0;
    for (let i = 0; i < mps.length; i++) {
      const index2 = i;
      const mp = mps[i];
      const prevFunc = func;
      const conditionValue = createMemo$1(() => prevFunc() ? void 0 : mp.when, void 0, void 0);
      const condition = mp.keyed ? conditionValue : createMemo$1(conditionValue, void 0, {
        equals: (a, b) => !a === !b
      });
      func = () => prevFunc() || (condition() ? [index2, conditionValue, mp] : void 0);
    }
    return func;
  });
  return createMemo$1(() => {
    const sel = switchFunc()();
    if (!sel) return props.fallback;
    const [index2, conditionValue, mp] = sel;
    const child = mp.children;
    const fn = typeof child === "function" && child.length > 0;
    return fn ? untrack$1(() => child(mp.keyed ? conditionValue() : () => {
      if (untrack$1(switchFunc)()?.[0] !== index2) throw narrowedError$1("Match");
      return conditionValue();
    })) : child;
  }, void 0, void 0);
}
function Match$1(props) {
  return props;
}
const booleans$1 = [
  "allowfullscreen",
  "async",
  "alpha",
  "autofocus",
  "autoplay",
  "checked",
  "controls",
  "default",
  "disabled",
  "formnovalidate",
  "hidden",
  "indeterminate",
  "inert",
  "ismap",
  "loop",
  "multiple",
  "muted",
  "nomodule",
  "novalidate",
  "open",
  "playsinline",
  "readonly",
  "required",
  "reversed",
  "seamless",
  "selected",
  "adauctionheaders",
  "browsingtopics",
  "credentialless",
  "defaultchecked",
  "defaultmuted",
  "defaultselected",
  "defer",
  "disablepictureinpicture",
  "disableremoteplayback",
  "preservespitch",
  "shadowrootclonable",
  "shadowrootcustomelementregistry",
  "shadowrootdelegatesfocus",
  "shadowrootserializable",
  "sharedstoragewritable"
];
const Properties$1 = /* @__PURE__ */ new Set([
  "className",
  "value",
  "readOnly",
  "noValidate",
  "formNoValidate",
  "isMap",
  "noModule",
  "playsInline",
  "adAuctionHeaders",
  "allowFullscreen",
  "browsingTopics",
  "defaultChecked",
  "defaultMuted",
  "defaultSelected",
  "disablePictureInPicture",
  "disableRemotePlayback",
  "preservesPitch",
  "shadowRootClonable",
  "shadowRootCustomElementRegistry",
  "shadowRootDelegatesFocus",
  "shadowRootSerializable",
  "sharedStorageWritable",
  ...booleans$1
]);
const ChildProperties$1 = /* @__PURE__ */ new Set(["innerHTML", "textContent", "innerText", "children"]);
const Aliases$1 = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(null), {
  className: "class",
  htmlFor: "for"
});
const PropAliases$1 = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(null), {
  class: "className",
  novalidate: {
    $: "noValidate",
    FORM: 1
  },
  formnovalidate: {
    $: "formNoValidate",
    BUTTON: 1,
    INPUT: 1
  },
  ismap: {
    $: "isMap",
    IMG: 1
  },
  nomodule: {
    $: "noModule",
    SCRIPT: 1
  },
  playsinline: {
    $: "playsInline",
    VIDEO: 1
  },
  readonly: {
    $: "readOnly",
    INPUT: 1,
    TEXTAREA: 1
  },
  adauctionheaders: {
    $: "adAuctionHeaders",
    IFRAME: 1
  },
  allowfullscreen: {
    $: "allowFullscreen",
    IFRAME: 1
  },
  browsingtopics: {
    $: "browsingTopics",
    IMG: 1
  },
  defaultchecked: {
    $: "defaultChecked",
    INPUT: 1
  },
  defaultmuted: {
    $: "defaultMuted",
    AUDIO: 1,
    VIDEO: 1
  },
  defaultselected: {
    $: "defaultSelected",
    OPTION: 1
  },
  disablepictureinpicture: {
    $: "disablePictureInPicture",
    VIDEO: 1
  },
  disableremoteplayback: {
    $: "disableRemotePlayback",
    AUDIO: 1,
    VIDEO: 1
  },
  preservespitch: {
    $: "preservesPitch",
    AUDIO: 1,
    VIDEO: 1
  },
  shadowrootclonable: {
    $: "shadowRootClonable",
    TEMPLATE: 1
  },
  shadowrootdelegatesfocus: {
    $: "shadowRootDelegatesFocus",
    TEMPLATE: 1
  },
  shadowrootserializable: {
    $: "shadowRootSerializable",
    TEMPLATE: 1
  },
  sharedstoragewritable: {
    $: "sharedStorageWritable",
    IFRAME: 1,
    IMG: 1
  }
});
function getPropAlias$1(prop, tagName) {
  const a = PropAliases$1[prop];
  return typeof a === "object" ? a[tagName] ? a["$"] : void 0 : a;
}
const DelegatedEvents$1 = /* @__PURE__ */ new Set(["beforeinput", "click", "dblclick", "contextmenu", "focusin", "focusout", "input", "keydown", "keyup", "mousedown", "mousemove", "mouseout", "mouseover", "mouseup", "pointerdown", "pointermove", "pointerout", "pointerover", "pointerup", "touchend", "touchmove", "touchstart"]);
const SVGElements$1 = /* @__PURE__ */ new Set([
  "altGlyph",
  "altGlyphDef",
  "altGlyphItem",
  "animate",
  "animateColor",
  "animateMotion",
  "animateTransform",
  "circle",
  "clipPath",
  "color-profile",
  "cursor",
  "defs",
  "desc",
  "ellipse",
  "feBlend",
  "feColorMatrix",
  "feComponentTransfer",
  "feComposite",
  "feConvolveMatrix",
  "feDiffuseLighting",
  "feDisplacementMap",
  "feDistantLight",
  "feDropShadow",
  "feFlood",
  "feFuncA",
  "feFuncB",
  "feFuncG",
  "feFuncR",
  "feGaussianBlur",
  "feImage",
  "feMerge",
  "feMergeNode",
  "feMorphology",
  "feOffset",
  "fePointLight",
  "feSpecularLighting",
  "feSpotLight",
  "feTile",
  "feTurbulence",
  "filter",
  "font",
  "font-face",
  "font-face-format",
  "font-face-name",
  "font-face-src",
  "font-face-uri",
  "foreignObject",
  "g",
  "glyph",
  "glyphRef",
  "hkern",
  "image",
  "line",
  "linearGradient",
  "marker",
  "mask",
  "metadata",
  "missing-glyph",
  "mpath",
  "path",
  "pattern",
  "polygon",
  "polyline",
  "radialGradient",
  "rect",
  "set",
  "stop",
  "svg",
  "switch",
  "symbol",
  "text",
  "textPath",
  "tref",
  "tspan",
  "use",
  "view",
  "vkern"
]);
const SVGNamespace$1 = {
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace"
};
const memo$1 = (fn) => createMemo$1(() => fn());
function reconcileArrays$1(parentNode, a, b) {
  let bLength = b.length, aEnd = a.length, bEnd = bLength, aStart = 0, bStart = 0, after = a[aEnd - 1].nextSibling, map2 = null;
  while (aStart < aEnd || bStart < bEnd) {
    if (a[aStart] === b[bStart]) {
      aStart++;
      bStart++;
      continue;
    }
    while (a[aEnd - 1] === b[bEnd - 1]) {
      aEnd--;
      bEnd--;
    }
    if (aEnd === aStart) {
      const node2 = bEnd < bLength ? bStart ? b[bStart - 1].nextSibling : b[bEnd - bStart] : after;
      while (bStart < bEnd) parentNode.insertBefore(b[bStart++], node2);
    } else if (bEnd === bStart) {
      while (aStart < aEnd) {
        if (!map2 || !map2.has(a[aStart])) a[aStart].remove();
        aStart++;
      }
    } else if (a[aStart] === b[bEnd - 1] && b[bStart] === a[aEnd - 1]) {
      const node2 = a[--aEnd].nextSibling;
      parentNode.insertBefore(b[bStart++], a[aStart++].nextSibling);
      parentNode.insertBefore(b[--bEnd], node2);
      a[aEnd] = b[bEnd];
    } else {
      if (!map2) {
        map2 = /* @__PURE__ */ new Map();
        let i = bStart;
        while (i < bEnd) map2.set(b[i], i++);
      }
      const index2 = map2.get(a[aStart]);
      if (index2 != null) {
        if (bStart < index2 && index2 < bEnd) {
          let i = aStart, sequence = 1, t;
          while (++i < aEnd && i < bEnd) {
            if ((t = map2.get(a[i])) == null || t !== index2 + sequence) break;
            sequence++;
          }
          if (sequence > index2 - bStart) {
            const node2 = a[aStart];
            while (bStart < index2) parentNode.insertBefore(b[bStart++], node2);
          } else parentNode.replaceChild(b[bStart++], a[aStart++]);
        } else aStart++;
      } else a[aStart++].remove();
    }
  }
}
const $$EVENTS$1 = "_$DX_DELEGATE";
function render$1(code, element, init, options = {}) {
  let disposer;
  createRoot$1((dispose2) => {
    disposer = dispose2;
    element === document ? code() : insert$1(element, code(), element.firstChild ? null : void 0, init);
  }, options.owner);
  return () => {
    disposer();
    element.textContent = "";
  };
}
function template$1(html, isImportNode, isSVG, isMathML) {
  let node2;
  const create = () => {
    const t = document.createElement("template");
    t.innerHTML = html;
    return t.content.firstChild;
  };
  const fn = () => (node2 || (node2 = create())).cloneNode(true);
  fn.cloneNode = fn;
  return fn;
}
function delegateEvents$1(eventNames, document2 = window.document) {
  const e = document2[$$EVENTS$1] || (document2[$$EVENTS$1] = /* @__PURE__ */ new Set());
  for (let i = 0, l = eventNames.length; i < l; i++) {
    const name = eventNames[i];
    if (!e.has(name)) {
      e.add(name);
      document2.addEventListener(name, eventHandler$1);
    }
  }
}
function setAttribute$1(node2, name, value) {
  if (isHydrating$1(node2)) return;
  if (value == null) node2.removeAttribute(name);
  else node2.setAttribute(name, value);
}
function setAttributeNS$1(node2, namespace, name, value) {
  if (isHydrating$1(node2)) return;
  if (value == null) node2.removeAttributeNS(namespace, name);
  else node2.setAttributeNS(namespace, name, value);
}
function setBoolAttribute$1(node2, name, value) {
  if (isHydrating$1(node2)) return;
  value ? node2.setAttribute(name, "") : node2.removeAttribute(name);
}
function className$1(node2, value) {
  if (isHydrating$1(node2)) return;
  if (value == null) node2.removeAttribute("class");
  else node2.className = value;
}
function addEventListener$1(node2, name, handler, delegate) {
  if (delegate) {
    if (Array.isArray(handler)) {
      node2[`$$${name}`] = handler[0];
      node2[`$$${name}Data`] = handler[1];
    } else node2[`$$${name}`] = handler;
  } else if (Array.isArray(handler)) {
    const handlerFn = handler[0];
    node2.addEventListener(name, handler[0] = (e) => handlerFn.call(node2, handler[1], e));
  } else node2.addEventListener(name, handler, typeof handler !== "function" && handler);
}
function classList$1(node2, value, prev = {}) {
  const classKeys = Object.keys(value || {}), prevKeys = Object.keys(prev);
  let i, len;
  for (i = 0, len = prevKeys.length; i < len; i++) {
    const key = prevKeys[i];
    if (!key || key === "undefined" || value[key]) continue;
    toggleClassKey$1(node2, key, false);
    delete prev[key];
  }
  for (i = 0, len = classKeys.length; i < len; i++) {
    const key = classKeys[i], classValue = !!value[key];
    if (!key || key === "undefined" || prev[key] === classValue || !classValue) continue;
    toggleClassKey$1(node2, key, true);
    prev[key] = classValue;
  }
  return prev;
}
function style$1(node2, value, prev) {
  if (!value) return prev ? setAttribute$1(node2, "style") : value;
  const nodeStyle = node2.style;
  if (typeof value === "string") return nodeStyle.cssText = value;
  typeof prev === "string" && (nodeStyle.cssText = prev = void 0);
  prev || (prev = {});
  value || (value = {});
  let v, s;
  for (s in prev) {
    value[s] == null && nodeStyle.removeProperty(s);
    delete prev[s];
  }
  for (s in value) {
    v = value[s];
    if (v !== prev[s]) {
      nodeStyle.setProperty(s, v);
      prev[s] = v;
    }
  }
  return prev;
}
function spread$1(node2, props = {}, isSVG, skipChildren) {
  const prevProps = {};
  if (!skipChildren) {
    createRenderEffect$1(() => prevProps.children = insertExpression$1(node2, props.children, prevProps.children));
  }
  createRenderEffect$1(() => typeof props.ref === "function" && use$1(props.ref, node2));
  createRenderEffect$1(() => assign$1(node2, props, isSVG, true, prevProps, true));
  return prevProps;
}
function use$1(fn, element, arg) {
  return untrack$1(() => fn(element, arg));
}
function insert$1(parent, accessor, marker, initial) {
  if (marker !== void 0 && !initial) initial = [];
  if (typeof accessor !== "function") return insertExpression$1(parent, accessor, initial, marker);
  createRenderEffect$1((current) => insertExpression$1(parent, accessor(), current, marker), initial);
}
function assign$1(node2, props, isSVG, skipChildren, prevProps = {}, skipRef = false) {
  props || (props = {});
  for (const prop in prevProps) {
    if (!(prop in props)) {
      if (prop === "children") continue;
      prevProps[prop] = assignProp$1(node2, prop, null, prevProps[prop], isSVG, skipRef, props);
    }
  }
  for (const prop in props) {
    if (prop === "children") {
      continue;
    }
    const value = props[prop];
    prevProps[prop] = assignProp$1(node2, prop, value, prevProps[prop], isSVG, skipRef, props);
  }
}
function getNextElement$1(template2) {
  let node2, key, hydrating = isHydrating$1();
  if (!hydrating || !(node2 = sharedConfig$1.registry.get(key = getHydrationKey$1()))) {
    return template2();
  }
  if (sharedConfig$1.completed) sharedConfig$1.completed.add(node2);
  sharedConfig$1.registry.delete(key);
  return node2;
}
function isHydrating$1(node2) {
  return !!sharedConfig$1.context && !sharedConfig$1.done && (!node2 || node2.isConnected);
}
function toPropertyName$1(name) {
  return name.toLowerCase().replace(/-([a-z])/g, (_2, w) => w.toUpperCase());
}
function toggleClassKey$1(node2, key, value) {
  const classNames = key.trim().split(/\s+/);
  for (let i = 0, nameLen = classNames.length; i < nameLen; i++) node2.classList.toggle(classNames[i], value);
}
function assignProp$1(node2, prop, value, prev, isSVG, skipRef, props) {
  let isCE, isProp, isChildProp, propAlias, forceProp;
  if (prop === "style") return style$1(node2, value, prev);
  if (prop === "classList") return classList$1(node2, value, prev);
  if (value === prev) return prev;
  if (prop === "ref") {
    if (!skipRef) value(node2);
  } else if (prop.slice(0, 3) === "on:") {
    const e = prop.slice(3);
    prev && node2.removeEventListener(e, prev, typeof prev !== "function" && prev);
    value && node2.addEventListener(e, value, typeof value !== "function" && value);
  } else if (prop.slice(0, 10) === "oncapture:") {
    const e = prop.slice(10);
    prev && node2.removeEventListener(e, prev, true);
    value && node2.addEventListener(e, value, true);
  } else if (prop.slice(0, 2) === "on") {
    const name = prop.slice(2).toLowerCase();
    const delegate = DelegatedEvents$1.has(name);
    if (!delegate && prev) {
      const h = Array.isArray(prev) ? prev[0] : prev;
      node2.removeEventListener(name, h);
    }
    if (delegate || value) {
      addEventListener$1(node2, name, value, delegate);
      delegate && delegateEvents$1([name]);
    }
  } else if (prop.slice(0, 5) === "attr:") {
    setAttribute$1(node2, prop.slice(5), value);
  } else if (prop.slice(0, 5) === "bool:") {
    setBoolAttribute$1(node2, prop.slice(5), value);
  } else if ((forceProp = prop.slice(0, 5) === "prop:") || (isChildProp = ChildProperties$1.has(prop)) || !isSVG && ((propAlias = getPropAlias$1(prop, node2.tagName)) || (isProp = Properties$1.has(prop))) || (isCE = node2.nodeName.includes("-") || "is" in props)) {
    if (forceProp) {
      prop = prop.slice(5);
      isProp = true;
    } else if (isHydrating$1(node2)) return value;
    if (prop === "class" || prop === "className") className$1(node2, value);
    else if (isCE && !isProp && !isChildProp) node2[toPropertyName$1(prop)] = value;
    else node2[propAlias || prop] = value;
  } else {
    const ns = isSVG && prop.indexOf(":") > -1 && SVGNamespace$1[prop.split(":")[0]];
    if (ns) setAttributeNS$1(node2, ns, prop, value);
    else setAttribute$1(node2, Aliases$1[prop] || prop, value);
  }
  return value;
}
function eventHandler$1(e) {
  if (sharedConfig$1.registry && sharedConfig$1.events) {
    if (sharedConfig$1.events.find(([el, ev]) => ev === e)) return;
  }
  let node2 = e.target;
  const key = `$$${e.type}`;
  const oriTarget = e.target;
  const oriCurrentTarget = e.currentTarget;
  const retarget = (value) => Object.defineProperty(e, "target", {
    configurable: true,
    value
  });
  const handleNode = () => {
    const handler = node2[key];
    if (handler && !node2.disabled) {
      const data = node2[`${key}Data`];
      data !== void 0 ? handler.call(node2, data, e) : handler.call(node2, e);
      if (e.cancelBubble) return;
    }
    node2.host && typeof node2.host !== "string" && !node2.host._$host && node2.contains(e.target) && retarget(node2.host);
    return true;
  };
  const walkUpTree = () => {
    while (handleNode() && (node2 = node2._$host || node2.parentNode || node2.host)) ;
  };
  Object.defineProperty(e, "currentTarget", {
    configurable: true,
    get() {
      return node2 || document;
    }
  });
  if (sharedConfig$1.registry && !sharedConfig$1.done) sharedConfig$1.done = _$HY.done = true;
  if (e.composedPath) {
    const path2 = e.composedPath();
    retarget(path2[0]);
    for (let i = 0; i < path2.length - 2; i++) {
      node2 = path2[i];
      if (!handleNode()) break;
      if (node2._$host) {
        node2 = node2._$host;
        walkUpTree();
        break;
      }
      if (node2.parentNode === oriCurrentTarget) {
        break;
      }
    }
  } else walkUpTree();
  retarget(oriTarget);
}
function insertExpression$1(parent, value, current, marker, unwrapArray) {
  const hydrating = isHydrating$1(parent);
  if (hydrating) {
    !current && (current = [...parent.childNodes]);
    let cleaned = [];
    for (let i = 0; i < current.length; i++) {
      const node2 = current[i];
      if (node2.nodeType === 8 && node2.data.slice(0, 2) === "!$") node2.remove();
      else cleaned.push(node2);
    }
    current = cleaned;
  }
  while (typeof current === "function") current = current();
  if (value === current) return current;
  const t = typeof value, multi = marker !== void 0;
  parent = multi && current[0] && current[0].parentNode || parent;
  if (t === "string" || t === "number") {
    if (hydrating) return current;
    if (t === "number") {
      value = value.toString();
      if (value === current) return current;
    }
    if (multi) {
      let node2 = current[0];
      if (node2 && node2.nodeType === 3) {
        node2.data !== value && (node2.data = value);
      } else node2 = document.createTextNode(value);
      current = cleanChildren$1(parent, current, marker, node2);
    } else {
      if (current !== "" && typeof current === "string") {
        current = parent.firstChild.data = value;
      } else current = parent.textContent = value;
    }
  } else if (value == null || t === "boolean") {
    if (hydrating) return current;
    current = cleanChildren$1(parent, current, marker);
  } else if (t === "function") {
    createRenderEffect$1(() => {
      let v = value();
      while (typeof v === "function") v = v();
      current = insertExpression$1(parent, v, current, marker);
    });
    return () => current;
  } else if (Array.isArray(value)) {
    const array = [];
    const currentArray = current && Array.isArray(current);
    if (normalizeIncomingArray$1(array, value, current, unwrapArray)) {
      createRenderEffect$1(() => current = insertExpression$1(parent, array, current, marker, true));
      return () => current;
    }
    if (hydrating) {
      if (!array.length) return current;
      if (marker === void 0) return current = [...parent.childNodes];
      let node2 = array[0];
      if (node2.parentNode !== parent) return current;
      const nodes = [node2];
      while ((node2 = node2.nextSibling) !== marker) nodes.push(node2);
      return current = nodes;
    }
    if (array.length === 0) {
      current = cleanChildren$1(parent, current, marker);
      if (multi) return current;
    } else if (currentArray) {
      if (current.length === 0) {
        appendNodes$1(parent, array, marker);
      } else reconcileArrays$1(parent, current, array);
    } else {
      current && cleanChildren$1(parent);
      appendNodes$1(parent, array);
    }
    current = array;
  } else if (value.nodeType) {
    if (hydrating && value.parentNode) return current = multi ? [value] : value;
    if (Array.isArray(current)) {
      if (multi) return current = cleanChildren$1(parent, current, marker, value);
      cleanChildren$1(parent, current, null, value);
    } else if (current == null || current === "" || !parent.firstChild) {
      parent.appendChild(value);
    } else parent.replaceChild(value, parent.firstChild);
    current = value;
  } else ;
  return current;
}
function normalizeIncomingArray$1(normalized, array, current, unwrap) {
  let dynamic = false;
  for (let i = 0, len = array.length; i < len; i++) {
    let item = array[i], prev = current && current[normalized.length], t;
    if (item == null || item === true || item === false) ;
    else if ((t = typeof item) === "object" && item.nodeType) {
      normalized.push(item);
    } else if (Array.isArray(item)) {
      dynamic = normalizeIncomingArray$1(normalized, item, prev) || dynamic;
    } else if (t === "function") {
      if (unwrap) {
        while (typeof item === "function") item = item();
        dynamic = normalizeIncomingArray$1(normalized, Array.isArray(item) ? item : [item], Array.isArray(prev) ? prev : [prev]) || dynamic;
      } else {
        normalized.push(item);
        dynamic = true;
      }
    } else {
      const value = String(item);
      if (prev && prev.nodeType === 3 && prev.data === value) normalized.push(prev);
      else normalized.push(document.createTextNode(value));
    }
  }
  return dynamic;
}
function appendNodes$1(parent, array, marker = null) {
  for (let i = 0, len = array.length; i < len; i++) parent.insertBefore(array[i], marker);
}
function cleanChildren$1(parent, current, marker, replacement) {
  if (marker === void 0) return parent.textContent = "";
  const node2 = replacement || document.createTextNode("");
  if (current.length) {
    let inserted = false;
    for (let i = current.length - 1; i >= 0; i--) {
      const el = current[i];
      if (node2 !== el) {
        const isParent = el.parentNode === parent;
        if (!inserted && !i) isParent ? parent.replaceChild(node2, el) : parent.insertBefore(node2, marker);
        else isParent && el.remove();
      } else inserted = true;
    }
  } else parent.insertBefore(node2, marker);
  return [node2];
}
function getHydrationKey$1() {
  return sharedConfig$1.getNextContextId();
}
const SVG_NAMESPACE$1 = "http://www.w3.org/2000/svg";
function createElement$1(tagName, isSVG = false, is = void 0) {
  return isSVG ? document.createElementNS(SVG_NAMESPACE$1, tagName) : document.createElement(tagName, {
    is
  });
}
function createDynamic$1(component, props) {
  const cached = createMemo$1(component);
  return createMemo$1(() => {
    const component2 = cached();
    switch (typeof component2) {
      case "function":
        return untrack$1(() => component2(props));
      case "string":
        const isSvg = SVGElements$1.has(component2);
        const el = sharedConfig$1.context ? getNextElement$1() : createElement$1(component2, isSvg, untrack$1(() => props.is));
        spread$1(el, props, isSvg);
        return el;
    }
  });
}
function Dynamic$1(props) {
  const [, others] = splitProps$1(props, ["component"]);
  return createDynamic$1(() => props.component, others);
}
const ShadowDomTargetContext = createContext$1(
  void 0
);
const DevtoolsOnCloseContext = createContext$1(void 0);
const useDevtoolsOnClose = () => {
  const context = useContext$1(DevtoolsOnCloseContext);
  if (!context) {
    throw new Error(
      "useDevtoolsOnClose must be used within a TanStackRouterDevtools component"
    );
  }
  return context;
};
class TanStackRouterDevtoolsCore {
  #router;
  #routerState;
  #position;
  #initialIsOpen;
  #shadowDOMTarget;
  #panelProps;
  #closeButtonProps;
  #toggleButtonProps;
  #containerElement;
  #isMounted = false;
  #Component;
  #dispose;
  constructor(config) {
    this.#router = createSignal$1(config.router);
    this.#routerState = createSignal$1(config.routerState);
    this.#position = config.position ?? "bottom-left";
    this.#initialIsOpen = config.initialIsOpen ?? false;
    this.#shadowDOMTarget = config.shadowDOMTarget;
    this.#panelProps = config.panelProps;
    this.#closeButtonProps = config.closeButtonProps;
    this.#toggleButtonProps = config.toggleButtonProps;
    this.#containerElement = config.containerElement;
  }
  mount(el) {
    if (this.#isMounted) {
      throw new Error("Devtools is already mounted");
    }
    const dispose2 = render$1(() => {
      const [router2] = this.#router;
      const [routerState] = this.#routerState;
      const position = this.#position;
      const initialIsOpen = this.#initialIsOpen;
      const shadowDOMTarget = this.#shadowDOMTarget;
      const panelProps = this.#panelProps;
      const closeButtonProps = this.#closeButtonProps;
      const toggleButtonProps = this.#toggleButtonProps;
      const containerElement = this.#containerElement;
      let Devtools;
      if (this.#Component) {
        Devtools = this.#Component;
      } else {
        Devtools = lazy$1(() => import("./FloatingTanStackRouterDevtools-DLsVEFsK-CNK6-5P3.js"));
        this.#Component = Devtools;
      }
      return createComponent$1(ShadowDomTargetContext.Provider, {
        value: shadowDOMTarget,
        get children() {
          return createComponent$1(Devtools, {
            position,
            initialIsOpen,
            router: router2,
            routerState,
            shadowDOMTarget,
            panelProps,
            closeButtonProps,
            toggleButtonProps,
            containerElement
          });
        }
      });
    }, el);
    this.#isMounted = true;
    this.#dispose = dispose2;
  }
  unmount() {
    if (!this.#isMounted) {
      throw new Error("Devtools is not mounted");
    }
    this.#dispose?.();
    this.#isMounted = false;
  }
  setRouter(router2) {
    this.#router[1](router2);
  }
  setRouterState(routerState) {
    this.#routerState[1](routerState);
  }
  setOptions(options) {
    if (options.position !== void 0) {
      this.#position = options.position;
    }
    if (options.initialIsOpen !== void 0) {
      this.#initialIsOpen = options.initialIsOpen;
    }
    if (options.shadowDOMTarget !== void 0) {
      this.#shadowDOMTarget = options.shadowDOMTarget;
    }
    if (options.containerElement !== void 0) {
      this.#containerElement = options.containerElement;
    }
  }
}
class TanStackRouterDevtoolsPanelCore {
  #router;
  #routerState;
  #style;
  #className;
  #shadowDOMTarget;
  #isMounted = false;
  #setIsOpen;
  #dispose;
  #Component;
  constructor(config) {
    const {
      router: router2,
      routerState,
      shadowDOMTarget,
      setIsOpen,
      style: style2,
      className: className2
    } = config;
    this.#router = createSignal$1(router2);
    this.#routerState = createSignal$1(routerState);
    this.#style = createSignal$1(style2);
    this.#className = createSignal$1(className2);
    this.#shadowDOMTarget = shadowDOMTarget;
    this.#setIsOpen = setIsOpen;
  }
  mount(el) {
    if (this.#isMounted) {
      throw new Error("Devtools is already mounted");
    }
    const dispose2 = render$1(() => {
      const [router2] = this.#router;
      const [routerState] = this.#routerState;
      const [style2] = this.#style;
      const [className2] = this.#className;
      const shadowDOMTarget = this.#shadowDOMTarget;
      const setIsOpen = this.#setIsOpen;
      let BaseTanStackRouterDevtoolsPanel;
      if (this.#Component) {
        BaseTanStackRouterDevtoolsPanel = this.#Component;
      } else {
        BaseTanStackRouterDevtoolsPanel = lazy$1(() => import("./BaseTanStackRouterDevtoolsPanel-DYX5cXun-CB4f9p6W.js").then((n) => n.c));
        this.#Component = BaseTanStackRouterDevtoolsPanel;
      }
      return createComponent$1(ShadowDomTargetContext.Provider, {
        value: shadowDOMTarget,
        get children() {
          return createComponent$1(DevtoolsOnCloseContext.Provider, {
            value: {
              onCloseClick: () => {
              }
            },
            get children() {
              return createComponent$1(BaseTanStackRouterDevtoolsPanel, {
                router: router2,
                routerState,
                shadowDOMTarget,
                setIsOpen,
                style: style2,
                className: className2
              });
            }
          });
        }
      });
    }, el);
    this.#isMounted = true;
    this.#dispose = dispose2;
  }
  unmount() {
    if (!this.#isMounted) {
      throw new Error("Devtools is not mounted");
    }
    this.#dispose?.();
    this.#isMounted = false;
  }
  setRouter(router2) {
    this.#router[1](router2);
  }
  setRouterState(routerState) {
    this.#routerState[1](routerState);
  }
  setStyle(style2) {
    this.#style[1](style2);
  }
  setClassName(className2) {
    this.#className[1](className2);
  }
  setOptions(options) {
    if (options.shadowDOMTarget !== void 0) {
      this.#shadowDOMTarget = options.shadowDOMTarget;
    }
    if (options.router !== void 0) {
      this.setRouter(options.router);
    }
    if (options.routerState !== void 0) {
      this.setRouterState(options.routerState);
    }
    if (options.style !== void 0) {
      this.setStyle(options.style);
    }
    if (options.className !== void 0) {
      this.setClassName(options.className);
    }
  }
}
function TanStackRouterDevtools(props) {
  const {
    initialIsOpen,
    panelProps,
    closeButtonProps,
    toggleButtonProps,
    position,
    containerElement,
    shadowDOMTarget,
    router: propsRouter
  } = props;
  const hookRouter = useRouter({ warn: false });
  const activeRouter = propsRouter ?? hookRouter;
  const activeRouterState = useRouterState({ router: activeRouter });
  const devToolRef = reactExports.useRef(null);
  const [devtools] = reactExports.useState(
    () => new TanStackRouterDevtoolsCore({
      initialIsOpen,
      panelProps,
      closeButtonProps,
      toggleButtonProps,
      position,
      containerElement,
      shadowDOMTarget,
      router: activeRouter,
      routerState: activeRouterState
    })
  );
  reactExports.useEffect(() => {
    devtools.setRouter(activeRouter);
  }, [devtools, activeRouter]);
  reactExports.useEffect(() => {
    devtools.setRouterState(activeRouterState);
  }, [devtools, activeRouterState]);
  reactExports.useEffect(() => {
    devtools.setOptions({
      initialIsOpen,
      panelProps,
      closeButtonProps,
      toggleButtonProps,
      position,
      containerElement,
      shadowDOMTarget
    });
  }, [
    devtools,
    initialIsOpen,
    panelProps,
    closeButtonProps,
    toggleButtonProps,
    position,
    containerElement,
    shadowDOMTarget
  ]);
  reactExports.useEffect(() => {
    if (devToolRef.current) {
      devtools.mount(devToolRef.current);
    }
    return () => {
      devtools.unmount();
    };
  }, [devtools]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Fragment, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: devToolRef }) });
}
const TanStackRouterDevtoolsPanel$1 = (props) => {
  const { router: propsRouter, ...rest } = props;
  const hookRouter = useRouter({ warn: false });
  const activeRouter = propsRouter ?? hookRouter;
  const activeRouterState = useRouterState({ router: activeRouter });
  const devToolRef = reactExports.useRef(null);
  const [devtools] = reactExports.useState(
    () => new TanStackRouterDevtoolsPanelCore({
      ...rest,
      router: activeRouter,
      routerState: activeRouterState
    })
  );
  reactExports.useEffect(() => {
    devtools.setRouter(activeRouter);
  }, [devtools, activeRouter]);
  reactExports.useEffect(() => {
    devtools.setRouterState(activeRouterState);
  }, [devtools, activeRouterState]);
  reactExports.useEffect(() => {
    devtools.setOptions({
      className: props.className,
      style: props.style,
      shadowDOMTarget: props.shadowDOMTarget
    });
  }, [devtools, props.className, props.style, props.shadowDOMTarget]);
  reactExports.useEffect(() => {
    if (devToolRef.current) {
      devtools.mount(devToolRef.current);
    }
    return () => {
      devtools.unmount();
    };
  }, [devtools]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: devToolRef }) });
};
process.env.NODE_ENV !== "development" ? function() {
  return null;
} : TanStackRouterDevtools;
const TanStackRouterDevtoolsPanel = process.env.NODE_ENV !== "development" ? function() {
  return null;
} : TanStackRouterDevtoolsPanel$1;
var sharedConfig = {
  context: void 0,
  registry: void 0,
  effects: void 0,
  done: false,
  getContextId() {
    return getContextId(this.context.count);
  },
  getNextContextId() {
    return getContextId(this.context.count++);
  }
};
function getContextId(count) {
  const num = String(count), len = num.length - 1;
  return sharedConfig.context.id + (len ? String.fromCharCode(96 + len) : "") + num;
}
function setHydrateContext(context) {
  sharedConfig.context = context;
}
var IS_DEV = false;
var equalFn = (a, b) => a === b;
var $PROXY = Symbol("solid-proxy");
var SUPPORTS_PROXY = typeof Proxy === "function";
var $TRACK = Symbol("solid-track");
var signalOptions = {
  equals: equalFn
};
var runEffects = runQueue;
var STALE = 1;
var PENDING = 2;
var UNOWNED = {
  owned: null,
  cleanups: null,
  context: null,
  owner: null
};
var NO_INIT = {};
var Owner = null;
var Transition = null;
var ExternalSourceConfig = null;
var Listener = null;
var Updates = null;
var Effects = null;
var ExecCount = 0;
function createRoot(fn, detachedOwner) {
  const listener = Listener, owner = Owner, unowned = fn.length === 0, current = detachedOwner === void 0 ? owner : detachedOwner, root = unowned ? UNOWNED : {
    owned: null,
    cleanups: null,
    context: current ? current.context : null,
    owner: current
  }, updateFn = unowned ? fn : () => fn(() => untrack(() => cleanNode(root)));
  Owner = root;
  Listener = null;
  try {
    return runUpdates(updateFn, true);
  } finally {
    Listener = listener;
    Owner = owner;
  }
}
function createSignal(value, options) {
  options = options ? Object.assign({}, signalOptions, options) : signalOptions;
  const s = {
    value,
    observers: null,
    observerSlots: null,
    comparator: options.equals || void 0
  };
  const setter = (value2) => {
    if (typeof value2 === "function") {
      value2 = value2(s.value);
    }
    return writeSignal(s, value2);
  };
  return [readSignal.bind(s), setter];
}
function createComputed(fn, value, options) {
  const c = createComputation(fn, value, true, STALE);
  updateComputation(c);
}
function createRenderEffect(fn, value, options) {
  const c = createComputation(fn, value, false, STALE);
  updateComputation(c);
}
function createEffect(fn, value, options) {
  runEffects = runUserEffects;
  const c = createComputation(fn, value, false, STALE);
  if (!options || !options.render) c.user = true;
  Effects ? Effects.push(c) : updateComputation(c);
}
function createMemo(fn, value, options) {
  options = options ? Object.assign({}, signalOptions, options) : signalOptions;
  const c = createComputation(fn, value, true, 0);
  c.observers = null;
  c.observerSlots = null;
  c.comparator = options.equals || void 0;
  updateComputation(c);
  return readSignal.bind(c);
}
function isPromise(v) {
  return v && typeof v === "object" && "then" in v;
}
function createResource(pSource, pFetcher, pOptions) {
  let source;
  let fetcher;
  let options;
  {
    source = true;
    fetcher = pSource;
    options = {};
  }
  let pr = null, initP = NO_INIT, id = null, scheduled = false, resolved = "initialValue" in options, dynamic = typeof source === "function" && createMemo(source);
  const contexts = /* @__PURE__ */ new Set(), [value, setValue] = (options.storage || createSignal)(options.initialValue), [error, setError] = createSignal(void 0), [track, trigger] = createSignal(void 0, {
    equals: false
  }), [state2, setState] = createSignal(resolved ? "ready" : "unresolved");
  if (sharedConfig.context) {
    id = sharedConfig.getNextContextId();
    if (options.ssrLoadFrom === "initial") initP = options.initialValue;
    else if (sharedConfig.load && sharedConfig.has(id)) initP = sharedConfig.load(id);
  }
  function loadEnd(p, v, error2, key) {
    if (pr === p) {
      pr = null;
      key !== void 0 && (resolved = true);
      if ((p === initP || v === initP) && options.onHydrated) queueMicrotask(() => options.onHydrated(key, {
        value: v
      }));
      initP = NO_INIT;
      completeLoad(v, error2);
    }
    return v;
  }
  function completeLoad(v, err) {
    runUpdates(() => {
      if (err === void 0) setValue(() => v);
      setState(err !== void 0 ? "errored" : resolved ? "ready" : "unresolved");
      setError(err);
      for (const c of contexts.keys()) c.decrement();
      contexts.clear();
    }, false);
  }
  function read() {
    const c = SuspenseContext, v = value(), err = error();
    if (err !== void 0 && !pr) throw err;
    if (Listener && !Listener.user && c) ;
    return v;
  }
  function load(refetching = true) {
    if (refetching !== false && scheduled) return;
    scheduled = false;
    const lookup = dynamic ? dynamic() : source;
    if (lookup == null || lookup === false) {
      loadEnd(pr, untrack(value));
      return;
    }
    let error2;
    const p = initP !== NO_INIT ? initP : untrack(() => {
      try {
        return fetcher(lookup, {
          value: value(),
          refetching
        });
      } catch (fetcherError) {
        error2 = fetcherError;
      }
    });
    if (error2 !== void 0) {
      loadEnd(pr, void 0, castError(error2), lookup);
      return;
    } else if (!isPromise(p)) {
      loadEnd(pr, p, void 0, lookup);
      return p;
    }
    pr = p;
    if ("v" in p) {
      if (p.s === 1) loadEnd(pr, p.v, void 0, lookup);
      else loadEnd(pr, void 0, castError(p.v), lookup);
      return p;
    }
    scheduled = true;
    queueMicrotask(() => scheduled = false);
    runUpdates(() => {
      setState(resolved ? "refreshing" : "pending");
      trigger();
    }, false);
    return p.then((v) => loadEnd(p, v, void 0, lookup), (e) => loadEnd(p, void 0, castError(e), lookup));
  }
  Object.defineProperties(read, {
    state: {
      get: () => state2()
    },
    error: {
      get: () => error()
    },
    loading: {
      get() {
        const s = state2();
        return s === "pending" || s === "refreshing";
      }
    },
    latest: {
      get() {
        if (!resolved) return read();
        const err = error();
        if (err && !pr) throw err;
        return value();
      }
    }
  });
  let owner = Owner;
  if (dynamic) createComputed(() => (owner = Owner, load(false)));
  else load(false);
  return [read, {
    refetch: (info) => runWithOwner(owner, () => load(info)),
    mutate: setValue
  }];
}
function batch(fn) {
  return runUpdates(fn, false);
}
function untrack(fn) {
  if (Listener === null) return fn();
  const listener = Listener;
  Listener = null;
  try {
    if (ExternalSourceConfig) ;
    return fn();
  } finally {
    Listener = listener;
  }
}
function on(deps, fn, options) {
  const isArray3 = Array.isArray(deps);
  let prevInput;
  let defer = options && options.defer;
  return (prevValue) => {
    let input;
    if (isArray3) {
      input = Array(deps.length);
      for (let i = 0; i < deps.length; i++) input[i] = deps[i]();
    } else input = deps();
    if (defer) {
      defer = false;
      return prevValue;
    }
    const result = untrack(() => fn(input, prevInput, prevValue));
    prevInput = input;
    return result;
  };
}
function onMount(fn) {
  createEffect(() => untrack(fn));
}
function onCleanup(fn) {
  if (Owner === null) ;
  else if (Owner.cleanups === null) Owner.cleanups = [fn];
  else Owner.cleanups.push(fn);
  return fn;
}
function getOwner() {
  return Owner;
}
function runWithOwner(o, fn) {
  const prev = Owner;
  const prevListener = Listener;
  Owner = o;
  Listener = null;
  try {
    return runUpdates(fn, true);
  } catch (err) {
    handleError(err);
  } finally {
    Owner = prev;
    Listener = prevListener;
  }
}
function startTransition(fn) {
  const l = Listener;
  const o = Owner;
  return Promise.resolve().then(() => {
    Listener = l;
    Owner = o;
    let t;
    runUpdates(fn, false);
    Listener = Owner = null;
    return t ? t.done : void 0;
  });
}
var [transPending, setTransPending] = /* @__PURE__ */ createSignal(false);
function useTransition() {
  return [transPending, startTransition];
}
function createContext(defaultValue, options) {
  const id = Symbol("context");
  return {
    id,
    Provider: createProvider(id),
    defaultValue
  };
}
function useContext(context) {
  let value;
  return Owner && Owner.context && (value = Owner.context[context.id]) !== void 0 ? value : context.defaultValue;
}
function children$1(fn) {
  const children2 = createMemo(fn);
  const memo2 = createMemo(() => resolveChildren(children2()));
  memo2.toArray = () => {
    const c = memo2();
    return Array.isArray(c) ? c : c != null ? [c] : [];
  };
  return memo2;
}
var SuspenseContext;
function readSignal() {
  if (this.sources && this.state) {
    if (this.state === STALE) updateComputation(this);
    else {
      const updates = Updates;
      Updates = null;
      runUpdates(() => lookUpstream(this), false);
      Updates = updates;
    }
  }
  if (Listener) {
    const sSlot = this.observers ? this.observers.length : 0;
    if (!Listener.sources) {
      Listener.sources = [this];
      Listener.sourceSlots = [sSlot];
    } else {
      Listener.sources.push(this);
      Listener.sourceSlots.push(sSlot);
    }
    if (!this.observers) {
      this.observers = [Listener];
      this.observerSlots = [Listener.sources.length - 1];
    } else {
      this.observers.push(Listener);
      this.observerSlots.push(Listener.sources.length - 1);
    }
  }
  return this.value;
}
function writeSignal(node2, value, isComp) {
  let current = node2.value;
  if (!node2.comparator || !node2.comparator(current, value)) {
    node2.value = value;
    if (node2.observers && node2.observers.length) {
      runUpdates(() => {
        for (let i = 0; i < node2.observers.length; i += 1) {
          const o = node2.observers[i];
          const TransitionRunning = Transition && Transition.running;
          if (TransitionRunning && Transition.disposed.has(o)) ;
          if (TransitionRunning ? !o.tState : !o.state) {
            if (o.pure) Updates.push(o);
            else Effects.push(o);
            if (o.observers) markDownstream(o);
          }
          if (!TransitionRunning) o.state = STALE;
        }
        if (Updates.length > 1e6) {
          Updates = [];
          if (IS_DEV) ;
          throw new Error();
        }
      }, false);
    }
  }
  return value;
}
function updateComputation(node2) {
  if (!node2.fn) return;
  cleanNode(node2);
  const time = ExecCount;
  runComputation(node2, node2.value, time);
}
function runComputation(node2, value, time) {
  let nextValue;
  const owner = Owner, listener = Listener;
  Listener = Owner = node2;
  try {
    nextValue = node2.fn(value);
  } catch (err) {
    if (node2.pure) {
      {
        node2.state = STALE;
        node2.owned && node2.owned.forEach(cleanNode);
        node2.owned = null;
      }
    }
    node2.updatedAt = time + 1;
    return handleError(err);
  } finally {
    Listener = listener;
    Owner = owner;
  }
  if (!node2.updatedAt || node2.updatedAt <= time) {
    if (node2.updatedAt != null && "observers" in node2) {
      writeSignal(node2, nextValue);
    } else node2.value = nextValue;
    node2.updatedAt = time;
  }
}
function createComputation(fn, init, pure, state2 = STALE, options) {
  const c = {
    fn,
    state: state2,
    updatedAt: null,
    owned: null,
    sources: null,
    sourceSlots: null,
    cleanups: null,
    value: init,
    owner: Owner,
    context: Owner ? Owner.context : null,
    pure
  };
  if (Owner === null) ;
  else if (Owner !== UNOWNED) {
    {
      if (!Owner.owned) Owner.owned = [c];
      else Owner.owned.push(c);
    }
  }
  return c;
}
function runTop(node2) {
  if (node2.state === 0) return;
  if (node2.state === PENDING) return lookUpstream(node2);
  if (node2.suspense && untrack(node2.suspense.inFallback)) return node2.suspense.effects.push(node2);
  const ancestors = [node2];
  while ((node2 = node2.owner) && (!node2.updatedAt || node2.updatedAt < ExecCount)) {
    if (node2.state) ancestors.push(node2);
  }
  for (let i = ancestors.length - 1; i >= 0; i--) {
    node2 = ancestors[i];
    if (node2.state === STALE) {
      updateComputation(node2);
    } else if (node2.state === PENDING) {
      const updates = Updates;
      Updates = null;
      runUpdates(() => lookUpstream(node2, ancestors[0]), false);
      Updates = updates;
    }
  }
}
function runUpdates(fn, init) {
  if (Updates) return fn();
  let wait = false;
  if (!init) Updates = [];
  if (Effects) wait = true;
  else Effects = [];
  ExecCount++;
  try {
    const res = fn();
    completeUpdates(wait);
    return res;
  } catch (err) {
    if (!wait) Effects = null;
    Updates = null;
    handleError(err);
  }
}
function completeUpdates(wait) {
  if (Updates) {
    runQueue(Updates);
    Updates = null;
  }
  if (wait) return;
  const e = Effects;
  Effects = null;
  if (e.length) runUpdates(() => runEffects(e), false);
}
function runQueue(queue) {
  for (let i = 0; i < queue.length; i++) runTop(queue[i]);
}
function runUserEffects(queue) {
  let i, userLength = 0;
  for (i = 0; i < queue.length; i++) {
    const e = queue[i];
    if (!e.user) runTop(e);
    else queue[userLength++] = e;
  }
  if (sharedConfig.context) {
    if (sharedConfig.count) {
      sharedConfig.effects || (sharedConfig.effects = []);
      sharedConfig.effects.push(...queue.slice(0, userLength));
      return;
    }
    setHydrateContext();
  }
  if (sharedConfig.effects && (sharedConfig.done || !sharedConfig.count)) {
    queue = [...sharedConfig.effects, ...queue];
    userLength += sharedConfig.effects.length;
    delete sharedConfig.effects;
  }
  for (i = 0; i < userLength; i++) runTop(queue[i]);
}
function lookUpstream(node2, ignore) {
  node2.state = 0;
  for (let i = 0; i < node2.sources.length; i += 1) {
    const source = node2.sources[i];
    if (source.sources) {
      const state2 = source.state;
      if (state2 === STALE) {
        if (source !== ignore && (!source.updatedAt || source.updatedAt < ExecCount)) runTop(source);
      } else if (state2 === PENDING) lookUpstream(source, ignore);
    }
  }
}
function markDownstream(node2) {
  for (let i = 0; i < node2.observers.length; i += 1) {
    const o = node2.observers[i];
    if (!o.state) {
      o.state = PENDING;
      if (o.pure) Updates.push(o);
      else Effects.push(o);
      o.observers && markDownstream(o);
    }
  }
}
function cleanNode(node2) {
  let i;
  if (node2.sources) {
    while (node2.sources.length) {
      const source = node2.sources.pop(), index2 = node2.sourceSlots.pop(), obs = source.observers;
      if (obs && obs.length) {
        const n = obs.pop(), s = source.observerSlots.pop();
        if (index2 < obs.length) {
          n.sourceSlots[s] = index2;
          obs[index2] = n;
          source.observerSlots[index2] = s;
        }
      }
    }
  }
  if (node2.tOwned) {
    for (i = node2.tOwned.length - 1; i >= 0; i--) cleanNode(node2.tOwned[i]);
    delete node2.tOwned;
  }
  if (node2.owned) {
    for (i = node2.owned.length - 1; i >= 0; i--) cleanNode(node2.owned[i]);
    node2.owned = null;
  }
  if (node2.cleanups) {
    for (i = node2.cleanups.length - 1; i >= 0; i--) node2.cleanups[i]();
    node2.cleanups = null;
  }
  node2.state = 0;
}
function castError(err) {
  if (err instanceof Error) return err;
  return new Error(typeof err === "string" ? err : "Unknown error", {
    cause: err
  });
}
function handleError(err, owner = Owner) {
  const error = castError(err);
  throw error;
}
function resolveChildren(children2) {
  if (typeof children2 === "function" && !children2.length) return resolveChildren(children2());
  if (Array.isArray(children2)) {
    const results = [];
    for (let i = 0; i < children2.length; i++) {
      const result = resolveChildren(children2[i]);
      Array.isArray(result) ? results.push.apply(results, result) : results.push(result);
    }
    return results;
  }
  return children2;
}
function createProvider(id, options) {
  return function provider(props) {
    let res;
    createRenderEffect(() => res = untrack(() => {
      Owner.context = {
        ...Owner.context,
        [id]: props.value
      };
      return children$1(() => props.children);
    }), void 0);
    return res;
  };
}
var FALLBACK = Symbol("fallback");
function dispose(d) {
  for (let i = 0; i < d.length; i++) d[i]();
}
function mapArray(list, mapFn, options = {}) {
  let items = [], mapped = [], disposers = [], len = 0, indexes = mapFn.length > 1 ? [] : null;
  onCleanup(() => dispose(disposers));
  return () => {
    let newItems = list() || [], newLen = newItems.length, i, j;
    newItems[$TRACK];
    return untrack(() => {
      let newIndices, newIndicesNext, temp, tempdisposers, tempIndexes, start, end, newEnd, item;
      if (newLen === 0) {
        if (len !== 0) {
          dispose(disposers);
          disposers = [];
          items = [];
          mapped = [];
          len = 0;
          indexes && (indexes = []);
        }
        if (options.fallback) {
          items = [FALLBACK];
          mapped[0] = createRoot((disposer) => {
            disposers[0] = disposer;
            return options.fallback();
          });
          len = 1;
        }
      } else if (len === 0) {
        mapped = new Array(newLen);
        for (j = 0; j < newLen; j++) {
          items[j] = newItems[j];
          mapped[j] = createRoot(mapper);
        }
        len = newLen;
      } else {
        temp = new Array(newLen);
        tempdisposers = new Array(newLen);
        indexes && (tempIndexes = new Array(newLen));
        for (start = 0, end = Math.min(len, newLen); start < end && items[start] === newItems[start]; start++) ;
        for (end = len - 1, newEnd = newLen - 1; end >= start && newEnd >= start && items[end] === newItems[newEnd]; end--, newEnd--) {
          temp[newEnd] = mapped[end];
          tempdisposers[newEnd] = disposers[end];
          indexes && (tempIndexes[newEnd] = indexes[end]);
        }
        newIndices = /* @__PURE__ */ new Map();
        newIndicesNext = new Array(newEnd + 1);
        for (j = newEnd; j >= start; j--) {
          item = newItems[j];
          i = newIndices.get(item);
          newIndicesNext[j] = i === void 0 ? -1 : i;
          newIndices.set(item, j);
        }
        for (i = start; i <= end; i++) {
          item = items[i];
          j = newIndices.get(item);
          if (j !== void 0 && j !== -1) {
            temp[j] = mapped[i];
            tempdisposers[j] = disposers[i];
            indexes && (tempIndexes[j] = indexes[i]);
            j = newIndicesNext[j];
            newIndices.set(item, j);
          } else disposers[i]();
        }
        for (j = start; j < newLen; j++) {
          if (j in temp) {
            mapped[j] = temp[j];
            disposers[j] = tempdisposers[j];
            if (indexes) {
              indexes[j] = tempIndexes[j];
              indexes[j](j);
            }
          } else mapped[j] = createRoot(mapper);
        }
        mapped = mapped.slice(0, len = newLen);
        items = newItems.slice(0);
      }
      return mapped;
    });
    function mapper(disposer) {
      disposers[j] = disposer;
      if (indexes) {
        const [s, set] = createSignal(j);
        indexes[j] = set;
        return mapFn(newItems[j], s);
      }
      return mapFn(newItems[j]);
    }
  };
}
function indexArray(list, mapFn, options = {}) {
  let items = [], mapped = [], disposers = [], signals = [], len = 0, i;
  onCleanup(() => dispose(disposers));
  return () => {
    const newItems = list() || [], newLen = newItems.length;
    newItems[$TRACK];
    return untrack(() => {
      if (newLen === 0) {
        if (len !== 0) {
          dispose(disposers);
          disposers = [];
          items = [];
          mapped = [];
          len = 0;
          signals = [];
        }
        if (options.fallback) {
          items = [FALLBACK];
          mapped[0] = createRoot((disposer) => {
            disposers[0] = disposer;
            return options.fallback();
          });
          len = 1;
        }
        return mapped;
      }
      if (items[0] === FALLBACK) {
        disposers[0]();
        disposers = [];
        items = [];
        mapped = [];
        len = 0;
      }
      for (i = 0; i < newLen; i++) {
        if (i < items.length && items[i] !== newItems[i]) {
          signals[i](() => newItems[i]);
        } else if (i >= items.length) {
          mapped[i] = createRoot(mapper);
        }
      }
      for (; i < items.length; i++) {
        disposers[i]();
      }
      len = signals.length = disposers.length = newLen;
      items = newItems.slice(0);
      return mapped = mapped.slice(0, len);
    });
    function mapper(disposer) {
      disposers[i] = disposer;
      const [s, set] = createSignal(newItems[i]);
      signals[i] = set;
      return mapFn(s, i);
    }
  };
}
function createComponent(Comp, props) {
  return untrack(() => Comp(props || {}));
}
function trueFn() {
  return true;
}
var propTraps = {
  get(_2, property, receiver) {
    if (property === $PROXY) return receiver;
    return _2.get(property);
  },
  has(_2, property) {
    if (property === $PROXY) return true;
    return _2.has(property);
  },
  set: trueFn,
  deleteProperty: trueFn,
  getOwnPropertyDescriptor(_2, property) {
    return {
      configurable: true,
      enumerable: true,
      get() {
        return _2.get(property);
      },
      set: trueFn,
      deleteProperty: trueFn
    };
  },
  ownKeys(_2) {
    return _2.keys();
  }
};
function resolveSource(s) {
  return !(s = typeof s === "function" ? s() : s) ? {} : s;
}
function resolveSources() {
  for (let i = 0, length = this.length; i < length; ++i) {
    const v = this[i]();
    if (v !== void 0) return v;
  }
}
function mergeProps(...sources) {
  let proxy = false;
  for (let i = 0; i < sources.length; i++) {
    const s = sources[i];
    proxy = proxy || !!s && $PROXY in s;
    sources[i] = typeof s === "function" ? (proxy = true, createMemo(s)) : s;
  }
  if (SUPPORTS_PROXY && proxy) {
    return new Proxy({
      get(property) {
        for (let i = sources.length - 1; i >= 0; i--) {
          const v = resolveSource(sources[i])[property];
          if (v !== void 0) return v;
        }
      },
      has(property) {
        for (let i = sources.length - 1; i >= 0; i--) {
          if (property in resolveSource(sources[i])) return true;
        }
        return false;
      },
      keys() {
        const keys = [];
        for (let i = 0; i < sources.length; i++) keys.push(...Object.keys(resolveSource(sources[i])));
        return [...new Set(keys)];
      }
    }, propTraps);
  }
  const sourcesMap = {};
  const defined = /* @__PURE__ */ Object.create(null);
  for (let i = sources.length - 1; i >= 0; i--) {
    const source = sources[i];
    if (!source) continue;
    const sourceKeys = Object.getOwnPropertyNames(source);
    for (let i2 = sourceKeys.length - 1; i2 >= 0; i2--) {
      const key = sourceKeys[i2];
      if (key === "__proto__" || key === "constructor") continue;
      const desc = Object.getOwnPropertyDescriptor(source, key);
      if (!defined[key]) {
        defined[key] = desc.get ? {
          enumerable: true,
          configurable: true,
          get: resolveSources.bind(sourcesMap[key] = [desc.get.bind(source)])
        } : desc.value !== void 0 ? desc : void 0;
      } else {
        const sources2 = sourcesMap[key];
        if (sources2) {
          if (desc.get) sources2.push(desc.get.bind(source));
          else if (desc.value !== void 0) sources2.push(() => desc.value);
        }
      }
    }
  }
  const target = {};
  const definedKeys = Object.keys(defined);
  for (let i = definedKeys.length - 1; i >= 0; i--) {
    const key = definedKeys[i], desc = defined[key];
    if (desc && desc.get) Object.defineProperty(target, key, desc);
    else target[key] = desc ? desc.value : void 0;
  }
  return target;
}
function splitProps(props, ...keys) {
  if (SUPPORTS_PROXY && $PROXY in props) {
    const blocked = new Set(keys.length > 1 ? keys.flat() : keys[0]);
    const res = keys.map((k) => {
      return new Proxy({
        get(property) {
          return k.includes(property) ? props[property] : void 0;
        },
        has(property) {
          return k.includes(property) && property in props;
        },
        keys() {
          return k.filter((property) => property in props);
        }
      }, propTraps);
    });
    res.push(new Proxy({
      get(property) {
        return blocked.has(property) ? void 0 : props[property];
      },
      has(property) {
        return blocked.has(property) ? false : property in props;
      },
      keys() {
        return Object.keys(props).filter((k) => !blocked.has(k));
      }
    }, propTraps));
    return res;
  }
  const otherObject = {};
  const objects = keys.map(() => ({}));
  for (const propName of Object.getOwnPropertyNames(props)) {
    const desc = Object.getOwnPropertyDescriptor(props, propName);
    const isDefaultDesc = !desc.get && !desc.set && desc.enumerable && desc.writable && desc.configurable;
    let blocked = false;
    let objectIndex = 0;
    for (const k of keys) {
      if (k.includes(propName)) {
        blocked = true;
        isDefaultDesc ? objects[objectIndex][propName] = desc.value : Object.defineProperty(objects[objectIndex], propName, desc);
      }
      ++objectIndex;
    }
    if (!blocked) {
      isDefaultDesc ? otherObject[propName] = desc.value : Object.defineProperty(otherObject, propName, desc);
    }
  }
  return [...objects, otherObject];
}
function lazy(fn) {
  let comp;
  let p;
  const wrap2 = (props) => {
    const ctx = sharedConfig.context;
    if (ctx) {
      const [s, set] = createSignal();
      sharedConfig.count || (sharedConfig.count = 0);
      sharedConfig.count++;
      (p || (p = fn())).then((mod) => {
        !sharedConfig.done && setHydrateContext(ctx);
        sharedConfig.count--;
        set(() => mod.default);
        setHydrateContext();
      });
      comp = s;
    } else if (!comp) {
      const [s] = createResource(() => (p || (p = fn())).then((mod) => mod.default));
      comp = s;
    }
    let Comp;
    return createMemo(() => (Comp = comp()) ? untrack(() => {
      if (IS_DEV) ;
      if (!ctx || sharedConfig.done) return Comp(props);
      const c = sharedConfig.context;
      setHydrateContext(ctx);
      const r = Comp(props);
      setHydrateContext(c);
      return r;
    }) : "");
  };
  wrap2.preload = () => p || ((p = fn()).then((mod) => comp = () => mod.default), p);
  return wrap2;
}
var counter = 0;
function createUniqueId() {
  const ctx = sharedConfig.context;
  return ctx ? sharedConfig.getNextContextId() : `cl-${counter++}`;
}
var narrowedError = (name) => `Stale read from <${name}>.`;
function For(props) {
  const fallback2 = "fallback" in props && {
    fallback: () => props.fallback
  };
  return createMemo(mapArray(() => props.each, props.children, fallback2 || void 0));
}
function Index(props) {
  const fallback2 = "fallback" in props && {
    fallback: () => props.fallback
  };
  return createMemo(indexArray(() => props.each, props.children, fallback2 || void 0));
}
function Show(props) {
  const keyed = props.keyed;
  const conditionValue = createMemo(() => props.when, void 0, void 0);
  const condition = keyed ? conditionValue : createMemo(conditionValue, void 0, {
    equals: (a, b) => !a === !b
  });
  return createMemo(() => {
    const c = condition();
    if (c) {
      const child = props.children;
      const fn = typeof child === "function" && child.length > 0;
      return fn ? untrack(() => child(keyed ? c : () => {
        if (!untrack(condition)) throw narrowedError("Show");
        return conditionValue();
      })) : child;
    }
    return props.fallback;
  }, void 0, void 0);
}
function Switch(props) {
  const chs = children$1(() => props.children);
  const switchFunc = createMemo(() => {
    const ch = chs();
    const mps = Array.isArray(ch) ? ch : [ch];
    let func = () => void 0;
    for (let i = 0; i < mps.length; i++) {
      const index2 = i;
      const mp = mps[i];
      const prevFunc = func;
      const conditionValue = createMemo(() => prevFunc() ? void 0 : mp.when, void 0, void 0);
      const condition = mp.keyed ? conditionValue : createMemo(conditionValue, void 0, {
        equals: (a, b) => !a === !b
      });
      func = () => prevFunc() || (condition() ? [index2, conditionValue, mp] : void 0);
    }
    return func;
  });
  return createMemo(() => {
    const sel = switchFunc()();
    if (!sel) return props.fallback;
    const [index2, conditionValue, mp] = sel;
    const child = mp.children;
    const fn = typeof child === "function" && child.length > 0;
    return fn ? untrack(() => child(mp.keyed ? conditionValue() : () => {
      if (untrack(switchFunc)()?.[0] !== index2) throw narrowedError("Match");
      return conditionValue();
    })) : child;
  }, void 0, void 0);
}
function Match(props) {
  return props;
}
var booleans = ["allowfullscreen", "async", "autofocus", "autoplay", "checked", "controls", "default", "disabled", "formnovalidate", "hidden", "indeterminate", "inert", "ismap", "loop", "multiple", "muted", "nomodule", "novalidate", "open", "playsinline", "readonly", "required", "reversed", "seamless", "selected"];
var Properties = /* @__PURE__ */ new Set(["className", "value", "readOnly", "noValidate", "formNoValidate", "isMap", "noModule", "playsInline", ...booleans]);
var ChildProperties = /* @__PURE__ */ new Set(["innerHTML", "textContent", "innerText", "children"]);
var Aliases = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(null), {
  className: "class",
  htmlFor: "for"
});
var PropAliases = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(null), {
  class: "className",
  novalidate: {
    $: "noValidate",
    FORM: 1
  },
  formnovalidate: {
    $: "formNoValidate",
    BUTTON: 1,
    INPUT: 1
  },
  ismap: {
    $: "isMap",
    IMG: 1
  },
  nomodule: {
    $: "noModule",
    SCRIPT: 1
  },
  playsinline: {
    $: "playsInline",
    VIDEO: 1
  },
  readonly: {
    $: "readOnly",
    INPUT: 1,
    TEXTAREA: 1
  }
});
function getPropAlias(prop, tagName) {
  const a = PropAliases[prop];
  return typeof a === "object" ? a[tagName] ? a["$"] : void 0 : a;
}
var DelegatedEvents = /* @__PURE__ */ new Set(["beforeinput", "click", "dblclick", "contextmenu", "focusin", "focusout", "input", "keydown", "keyup", "mousedown", "mousemove", "mouseout", "mouseover", "mouseup", "pointerdown", "pointermove", "pointerout", "pointerover", "pointerup", "touchend", "touchmove", "touchstart"]);
var SVGElements = /* @__PURE__ */ new Set([
  "altGlyph",
  "altGlyphDef",
  "altGlyphItem",
  "animate",
  "animateColor",
  "animateMotion",
  "animateTransform",
  "circle",
  "clipPath",
  "color-profile",
  "cursor",
  "defs",
  "desc",
  "ellipse",
  "feBlend",
  "feColorMatrix",
  "feComponentTransfer",
  "feComposite",
  "feConvolveMatrix",
  "feDiffuseLighting",
  "feDisplacementMap",
  "feDistantLight",
  "feDropShadow",
  "feFlood",
  "feFuncA",
  "feFuncB",
  "feFuncG",
  "feFuncR",
  "feGaussianBlur",
  "feImage",
  "feMerge",
  "feMergeNode",
  "feMorphology",
  "feOffset",
  "fePointLight",
  "feSpecularLighting",
  "feSpotLight",
  "feTile",
  "feTurbulence",
  "filter",
  "font",
  "font-face",
  "font-face-format",
  "font-face-name",
  "font-face-src",
  "font-face-uri",
  "foreignObject",
  "g",
  "glyph",
  "glyphRef",
  "hkern",
  "image",
  "line",
  "linearGradient",
  "marker",
  "mask",
  "metadata",
  "missing-glyph",
  "mpath",
  "path",
  "pattern",
  "polygon",
  "polyline",
  "radialGradient",
  "rect",
  "set",
  "stop",
  "svg",
  "switch",
  "symbol",
  "text",
  "textPath",
  "tref",
  "tspan",
  "use",
  "view",
  "vkern"
]);
var SVGNamespace = {
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace"
};
var memo = (fn) => createMemo(() => fn());
function reconcileArrays(parentNode, a, b) {
  let bLength = b.length, aEnd = a.length, bEnd = bLength, aStart = 0, bStart = 0, after = a[aEnd - 1].nextSibling, map2 = null;
  while (aStart < aEnd || bStart < bEnd) {
    if (a[aStart] === b[bStart]) {
      aStart++;
      bStart++;
      continue;
    }
    while (a[aEnd - 1] === b[bEnd - 1]) {
      aEnd--;
      bEnd--;
    }
    if (aEnd === aStart) {
      const node2 = bEnd < bLength ? bStart ? b[bStart - 1].nextSibling : b[bEnd - bStart] : after;
      while (bStart < bEnd) parentNode.insertBefore(b[bStart++], node2);
    } else if (bEnd === bStart) {
      while (aStart < aEnd) {
        if (!map2 || !map2.has(a[aStart])) a[aStart].remove();
        aStart++;
      }
    } else if (a[aStart] === b[bEnd - 1] && b[bStart] === a[aEnd - 1]) {
      const node2 = a[--aEnd].nextSibling;
      parentNode.insertBefore(b[bStart++], a[aStart++].nextSibling);
      parentNode.insertBefore(b[--bEnd], node2);
      a[aEnd] = b[bEnd];
    } else {
      if (!map2) {
        map2 = /* @__PURE__ */ new Map();
        let i = bStart;
        while (i < bEnd) map2.set(b[i], i++);
      }
      const index2 = map2.get(a[aStart]);
      if (index2 != null) {
        if (bStart < index2 && index2 < bEnd) {
          let i = aStart, sequence = 1, t;
          while (++i < aEnd && i < bEnd) {
            if ((t = map2.get(a[i])) == null || t !== index2 + sequence) break;
            sequence++;
          }
          if (sequence > index2 - bStart) {
            const node2 = a[aStart];
            while (bStart < index2) parentNode.insertBefore(b[bStart++], node2);
          } else parentNode.replaceChild(b[bStart++], a[aStart++]);
        } else aStart++;
      } else a[aStart++].remove();
    }
  }
}
var $$EVENTS = "_$DX_DELEGATE";
function render(code, element, init, options = {}) {
  let disposer;
  createRoot((dispose2) => {
    disposer = dispose2;
    element === document ? code() : insert(element, code(), element.firstChild ? null : void 0, init);
  }, options.owner);
  return () => {
    disposer();
    element.textContent = "";
  };
}
function template(html, isImportNode, isSVG, isMathML) {
  let node2;
  const create = () => {
    const t = document.createElement("template");
    t.innerHTML = html;
    return t.content.firstChild;
  };
  const fn = () => (node2 || (node2 = create())).cloneNode(true);
  fn.cloneNode = fn;
  return fn;
}
function delegateEvents(eventNames, document2 = window.document) {
  const e = document2[$$EVENTS] || (document2[$$EVENTS] = /* @__PURE__ */ new Set());
  for (let i = 0, l = eventNames.length; i < l; i++) {
    const name = eventNames[i];
    if (!e.has(name)) {
      e.add(name);
      document2.addEventListener(name, eventHandler);
    }
  }
}
function clearDelegatedEvents(document2 = window.document) {
  if (document2[$$EVENTS]) {
    for (let name of document2[$$EVENTS].keys()) document2.removeEventListener(name, eventHandler);
    delete document2[$$EVENTS];
  }
}
function setAttribute(node2, name, value) {
  if (isHydrating(node2)) return;
  if (value == null) node2.removeAttribute(name);
  else node2.setAttribute(name, value);
}
function setAttributeNS(node2, namespace, name, value) {
  if (isHydrating(node2)) return;
  if (value == null) node2.removeAttributeNS(namespace, name);
  else node2.setAttributeNS(namespace, name, value);
}
function setBoolAttribute(node2, name, value) {
  if (isHydrating(node2)) return;
  value ? node2.setAttribute(name, "") : node2.removeAttribute(name);
}
function className(node2, value) {
  if (isHydrating(node2)) return;
  if (value == null) node2.removeAttribute("class");
  else node2.className = value;
}
function addEventListener(node2, name, handler, delegate) {
  if (delegate) {
    if (Array.isArray(handler)) {
      node2[`$$${name}`] = handler[0];
      node2[`$$${name}Data`] = handler[1];
    } else node2[`$$${name}`] = handler;
  } else if (Array.isArray(handler)) {
    const handlerFn = handler[0];
    node2.addEventListener(name, handler[0] = (e) => handlerFn.call(node2, handler[1], e));
  } else node2.addEventListener(name, handler, typeof handler !== "function" && handler);
}
function classList(node2, value, prev = {}) {
  const classKeys = Object.keys(value || {}), prevKeys = Object.keys(prev);
  let i, len;
  for (i = 0, len = prevKeys.length; i < len; i++) {
    const key = prevKeys[i];
    if (!key || key === "undefined" || value[key]) continue;
    toggleClassKey(node2, key, false);
    delete prev[key];
  }
  for (i = 0, len = classKeys.length; i < len; i++) {
    const key = classKeys[i], classValue = !!value[key];
    if (!key || key === "undefined" || prev[key] === classValue || !classValue) continue;
    toggleClassKey(node2, key, true);
    prev[key] = classValue;
  }
  return prev;
}
function style(node2, value, prev) {
  if (!value) return prev ? setAttribute(node2, "style") : value;
  const nodeStyle = node2.style;
  if (typeof value === "string") return nodeStyle.cssText = value;
  typeof prev === "string" && (nodeStyle.cssText = prev = void 0);
  prev || (prev = {});
  value || (value = {});
  let v, s;
  for (s in prev) {
    value[s] == null && nodeStyle.removeProperty(s);
    delete prev[s];
  }
  for (s in value) {
    v = value[s];
    if (v !== prev[s]) {
      nodeStyle.setProperty(s, v);
      prev[s] = v;
    }
  }
  return prev;
}
function spread(node2, props = {}, isSVG, skipChildren) {
  const prevProps = {};
  if (!skipChildren) {
    createRenderEffect(() => prevProps.children = insertExpression(node2, props.children, prevProps.children));
  }
  createRenderEffect(() => typeof props.ref === "function" && use(props.ref, node2));
  createRenderEffect(() => assign(node2, props, isSVG, true, prevProps, true));
  return prevProps;
}
function use(fn, element, arg) {
  return untrack(() => fn(element, arg));
}
function insert(parent, accessor, marker, initial) {
  if (marker !== void 0 && !initial) initial = [];
  if (typeof accessor !== "function") return insertExpression(parent, accessor, initial, marker);
  createRenderEffect((current) => insertExpression(parent, accessor(), current, marker), initial);
}
function assign(node2, props, isSVG, skipChildren, prevProps = {}, skipRef = false) {
  props || (props = {});
  for (const prop in prevProps) {
    if (!(prop in props)) {
      if (prop === "children") continue;
      prevProps[prop] = assignProp(node2, prop, null, prevProps[prop], isSVG, skipRef, props);
    }
  }
  for (const prop in props) {
    if (prop === "children") {
      continue;
    }
    const value = props[prop];
    prevProps[prop] = assignProp(node2, prop, value, prevProps[prop], isSVG, skipRef, props);
  }
}
function getNextElement(template2) {
  let node2, key, hydrating = isHydrating();
  if (!hydrating || !(node2 = sharedConfig.registry.get(key = getHydrationKey()))) {
    return template2();
  }
  if (sharedConfig.completed) sharedConfig.completed.add(node2);
  sharedConfig.registry.delete(key);
  return node2;
}
function isHydrating(node2) {
  return !!sharedConfig.context && !sharedConfig.done && (!node2 || node2.isConnected);
}
function toPropertyName(name) {
  return name.toLowerCase().replace(/-([a-z])/g, (_2, w) => w.toUpperCase());
}
function toggleClassKey(node2, key, value) {
  const classNames = key.trim().split(/\s+/);
  for (let i = 0, nameLen = classNames.length; i < nameLen; i++) node2.classList.toggle(classNames[i], value);
}
function assignProp(node2, prop, value, prev, isSVG, skipRef, props) {
  let isCE, isProp, isChildProp, propAlias, forceProp;
  if (prop === "style") return style(node2, value, prev);
  if (prop === "classList") return classList(node2, value, prev);
  if (value === prev) return prev;
  if (prop === "ref") {
    if (!skipRef) value(node2);
  } else if (prop.slice(0, 3) === "on:") {
    const e = prop.slice(3);
    prev && node2.removeEventListener(e, prev, typeof prev !== "function" && prev);
    value && node2.addEventListener(e, value, typeof value !== "function" && value);
  } else if (prop.slice(0, 10) === "oncapture:") {
    const e = prop.slice(10);
    prev && node2.removeEventListener(e, prev, true);
    value && node2.addEventListener(e, value, true);
  } else if (prop.slice(0, 2) === "on") {
    const name = prop.slice(2).toLowerCase();
    const delegate = DelegatedEvents.has(name);
    if (!delegate && prev) {
      const h = Array.isArray(prev) ? prev[0] : prev;
      node2.removeEventListener(name, h);
    }
    if (delegate || value) {
      addEventListener(node2, name, value, delegate);
      delegate && delegateEvents([name]);
    }
  } else if (prop.slice(0, 5) === "attr:") {
    setAttribute(node2, prop.slice(5), value);
  } else if (prop.slice(0, 5) === "bool:") {
    setBoolAttribute(node2, prop.slice(5), value);
  } else if ((forceProp = prop.slice(0, 5) === "prop:") || (isChildProp = ChildProperties.has(prop)) || !isSVG && ((propAlias = getPropAlias(prop, node2.tagName)) || (isProp = Properties.has(prop))) || (isCE = node2.nodeName.includes("-") || "is" in props)) {
    if (forceProp) {
      prop = prop.slice(5);
      isProp = true;
    } else if (isHydrating(node2)) return value;
    if (prop === "class" || prop === "className") className(node2, value);
    else if (isCE && !isProp && !isChildProp) node2[toPropertyName(prop)] = value;
    else node2[propAlias || prop] = value;
  } else {
    const ns = isSVG && prop.indexOf(":") > -1 && SVGNamespace[prop.split(":")[0]];
    if (ns) setAttributeNS(node2, ns, prop, value);
    else setAttribute(node2, Aliases[prop] || prop, value);
  }
  return value;
}
function eventHandler(e) {
  if (sharedConfig.registry && sharedConfig.events) {
    if (sharedConfig.events.find(([el, ev]) => ev === e)) return;
  }
  let node2 = e.target;
  const key = `$$${e.type}`;
  const oriTarget = e.target;
  const oriCurrentTarget = e.currentTarget;
  const retarget = (value) => Object.defineProperty(e, "target", {
    configurable: true,
    value
  });
  const handleNode = () => {
    const handler = node2[key];
    if (handler && !node2.disabled) {
      const data = node2[`${key}Data`];
      data !== void 0 ? handler.call(node2, data, e) : handler.call(node2, e);
      if (e.cancelBubble) return;
    }
    node2.host && typeof node2.host !== "string" && !node2.host._$host && node2.contains(e.target) && retarget(node2.host);
    return true;
  };
  const walkUpTree = () => {
    while (handleNode() && (node2 = node2._$host || node2.parentNode || node2.host)) ;
  };
  Object.defineProperty(e, "currentTarget", {
    configurable: true,
    get() {
      return node2 || document;
    }
  });
  if (sharedConfig.registry && !sharedConfig.done) sharedConfig.done = _$HY.done = true;
  if (e.composedPath) {
    const path2 = e.composedPath();
    retarget(path2[0]);
    for (let i = 0; i < path2.length - 2; i++) {
      node2 = path2[i];
      if (!handleNode()) break;
      if (node2._$host) {
        node2 = node2._$host;
        walkUpTree();
        break;
      }
      if (node2.parentNode === oriCurrentTarget) {
        break;
      }
    }
  } else walkUpTree();
  retarget(oriTarget);
}
function insertExpression(parent, value, current, marker, unwrapArray) {
  const hydrating = isHydrating(parent);
  if (hydrating) {
    !current && (current = [...parent.childNodes]);
    let cleaned = [];
    for (let i = 0; i < current.length; i++) {
      const node2 = current[i];
      if (node2.nodeType === 8 && node2.data.slice(0, 2) === "!$") node2.remove();
      else cleaned.push(node2);
    }
    current = cleaned;
  }
  while (typeof current === "function") current = current();
  if (value === current) return current;
  const t = typeof value, multi = marker !== void 0;
  parent = multi && current[0] && current[0].parentNode || parent;
  if (t === "string" || t === "number") {
    if (hydrating) return current;
    if (t === "number") {
      value = value.toString();
      if (value === current) return current;
    }
    if (multi) {
      let node2 = current[0];
      if (node2 && node2.nodeType === 3) {
        node2.data !== value && (node2.data = value);
      } else node2 = document.createTextNode(value);
      current = cleanChildren(parent, current, marker, node2);
    } else {
      if (current !== "" && typeof current === "string") {
        current = parent.firstChild.data = value;
      } else current = parent.textContent = value;
    }
  } else if (value == null || t === "boolean") {
    if (hydrating) return current;
    current = cleanChildren(parent, current, marker);
  } else if (t === "function") {
    createRenderEffect(() => {
      let v = value();
      while (typeof v === "function") v = v();
      current = insertExpression(parent, v, current, marker);
    });
    return () => current;
  } else if (Array.isArray(value)) {
    const array = [];
    const currentArray = current && Array.isArray(current);
    if (normalizeIncomingArray(array, value, current, unwrapArray)) {
      createRenderEffect(() => current = insertExpression(parent, array, current, marker, true));
      return () => current;
    }
    if (hydrating) {
      if (!array.length) return current;
      if (marker === void 0) return current = [...parent.childNodes];
      let node2 = array[0];
      if (node2.parentNode !== parent) return current;
      const nodes = [node2];
      while ((node2 = node2.nextSibling) !== marker) nodes.push(node2);
      return current = nodes;
    }
    if (array.length === 0) {
      current = cleanChildren(parent, current, marker);
      if (multi) return current;
    } else if (currentArray) {
      if (current.length === 0) {
        appendNodes(parent, array, marker);
      } else reconcileArrays(parent, current, array);
    } else {
      current && cleanChildren(parent);
      appendNodes(parent, array);
    }
    current = array;
  } else if (value.nodeType) {
    if (hydrating && value.parentNode) return current = multi ? [value] : value;
    if (Array.isArray(current)) {
      if (multi) return current = cleanChildren(parent, current, marker, value);
      cleanChildren(parent, current, null, value);
    } else if (current == null || current === "" || !parent.firstChild) {
      parent.appendChild(value);
    } else parent.replaceChild(value, parent.firstChild);
    current = value;
  } else ;
  return current;
}
function normalizeIncomingArray(normalized, array, current, unwrap) {
  let dynamic = false;
  for (let i = 0, len = array.length; i < len; i++) {
    let item = array[i], prev = current && current[normalized.length], t;
    if (item == null || item === true || item === false) ;
    else if ((t = typeof item) === "object" && item.nodeType) {
      normalized.push(item);
    } else if (Array.isArray(item)) {
      dynamic = normalizeIncomingArray(normalized, item, prev) || dynamic;
    } else if (t === "function") {
      if (unwrap) {
        while (typeof item === "function") item = item();
        dynamic = normalizeIncomingArray(normalized, Array.isArray(item) ? item : [item], Array.isArray(prev) ? prev : [prev]) || dynamic;
      } else {
        normalized.push(item);
        dynamic = true;
      }
    } else {
      const value = String(item);
      if (prev && prev.nodeType === 3 && prev.data === value) normalized.push(prev);
      else normalized.push(document.createTextNode(value));
    }
  }
  return dynamic;
}
function appendNodes(parent, array, marker = null) {
  for (let i = 0, len = array.length; i < len; i++) parent.insertBefore(array[i], marker);
}
function cleanChildren(parent, current, marker, replacement) {
  if (marker === void 0) return parent.textContent = "";
  const node2 = replacement || document.createTextNode("");
  if (current.length) {
    let inserted = false;
    for (let i = current.length - 1; i >= 0; i--) {
      const el = current[i];
      if (node2 !== el) {
        const isParent = el.parentNode === parent;
        if (!inserted && !i) isParent ? parent.replaceChild(node2, el) : parent.insertBefore(node2, marker);
        else isParent && el.remove();
      } else inserted = true;
    }
  } else parent.insertBefore(node2, marker);
  return [node2];
}
function getHydrationKey() {
  return sharedConfig.getNextContextId();
}
var SVG_NAMESPACE = "http://www.w3.org/2000/svg";
function createElement(tagName, isSVG = false) {
  return isSVG ? document.createElementNS(SVG_NAMESPACE, tagName) : document.createElement(tagName);
}
function Portal(props) {
  const {
    useShadow
  } = props, marker = document.createTextNode(""), mount = () => props.mount || document.body, owner = getOwner();
  let content;
  let hydrating = !!sharedConfig.context;
  createEffect(() => {
    if (hydrating) getOwner().user = hydrating = false;
    content || (content = runWithOwner(owner, () => createMemo(() => props.children)));
    const el = mount();
    if (el instanceof HTMLHeadElement) {
      const [clean, setClean] = createSignal(false);
      const cleanup = () => setClean(true);
      createRoot((dispose2) => insert(el, () => !clean() ? content() : dispose2(), null));
      onCleanup(cleanup);
    } else {
      const container = createElement(props.isSVG ? "g" : "div", props.isSVG), renderRoot = useShadow && container.attachShadow ? container.attachShadow({
        mode: "open"
      }) : container;
      Object.defineProperty(container, "_$host", {
        get() {
          return marker.parentNode;
        },
        configurable: true
      });
      insert(renderRoot, content);
      el.appendChild(container);
      props.ref && props.ref(container);
      onCleanup(() => el.removeChild(container));
    }
  }, void 0, {
    render: !hydrating
  });
  return marker;
}
function createDynamic(component, props) {
  const cached = createMemo(component);
  return createMemo(() => {
    const component2 = cached();
    switch (typeof component2) {
      case "function":
        return untrack(() => component2(props));
      case "string":
        const isSvg = SVGElements.has(component2);
        const el = sharedConfig.context ? getNextElement() : createElement(component2, isSvg);
        spread(el, props, isSvg);
        return el;
    }
  });
}
function Dynamic(props) {
  const [, others] = splitProps(props, ["component"]);
  return createDynamic(() => props.component, others);
}
var DoubleIndexedKV = class {
  constructor() {
    this.keyToValue = /* @__PURE__ */ new Map();
    this.valueToKey = /* @__PURE__ */ new Map();
  }
  set(key, value) {
    this.keyToValue.set(key, value);
    this.valueToKey.set(value, key);
  }
  getByKey(key) {
    return this.keyToValue.get(key);
  }
  getByValue(value) {
    return this.valueToKey.get(value);
  }
  clear() {
    this.keyToValue.clear();
    this.valueToKey.clear();
  }
};
var Registry = class {
  constructor(generateIdentifier) {
    this.generateIdentifier = generateIdentifier;
    this.kv = new DoubleIndexedKV();
  }
  register(value, identifier) {
    if (this.kv.getByValue(value)) {
      return;
    }
    if (!identifier) {
      identifier = this.generateIdentifier(value);
    }
    this.kv.set(identifier, value);
  }
  clear() {
    this.kv.clear();
  }
  getIdentifier(value) {
    return this.kv.getByValue(value);
  }
  getValue(identifier) {
    return this.kv.getByKey(identifier);
  }
};
var ClassRegistry = class extends Registry {
  constructor() {
    super((c) => c.name);
    this.classToAllowedProps = /* @__PURE__ */ new Map();
  }
  register(value, options) {
    if (typeof options === "object") {
      if (options.allowProps) {
        this.classToAllowedProps.set(value, options.allowProps);
      }
      super.register(value, options.identifier);
    } else {
      super.register(value, options);
    }
  }
  getAllowedProps(value) {
    return this.classToAllowedProps.get(value);
  }
};
function valuesOfObj(record) {
  if ("values" in Object) {
    return Object.values(record);
  }
  const values = [];
  for (const key in record) {
    if (record.hasOwnProperty(key)) {
      values.push(record[key]);
    }
  }
  return values;
}
function find(record, predicate) {
  const values = valuesOfObj(record);
  if ("find" in values) {
    return values.find(predicate);
  }
  const valuesNotNever = values;
  for (let i = 0; i < valuesNotNever.length; i++) {
    const value = valuesNotNever[i];
    if (predicate(value)) {
      return value;
    }
  }
  return void 0;
}
function forEach(record, run) {
  Object.entries(record).forEach(([key, value]) => run(value, key));
}
function includes(arr, value) {
  return arr.indexOf(value) !== -1;
}
function findArr(record, predicate) {
  for (let i = 0; i < record.length; i++) {
    const value = record[i];
    if (predicate(value)) {
      return value;
    }
  }
  return void 0;
}
var CustomTransformerRegistry = class {
  constructor() {
    this.transfomers = {};
  }
  register(transformer) {
    this.transfomers[transformer.name] = transformer;
  }
  findApplicable(v) {
    return find(this.transfomers, (transformer) => transformer.isApplicable(v));
  }
  findByName(name) {
    return this.transfomers[name];
  }
};
var getType = (payload) => Object.prototype.toString.call(payload).slice(8, -1);
var isUndefined = (payload) => typeof payload === "undefined";
var isNull = (payload) => payload === null;
var isPlainObject$1 = (payload) => {
  if (typeof payload !== "object" || payload === null)
    return false;
  if (payload === Object.prototype)
    return false;
  if (Object.getPrototypeOf(payload) === null)
    return true;
  return Object.getPrototypeOf(payload) === Object.prototype;
};
var isEmptyObject$1 = (payload) => isPlainObject$1(payload) && Object.keys(payload).length === 0;
var isArray = (payload) => Array.isArray(payload);
var isString$1 = (payload) => typeof payload === "string";
var isNumber$1 = (payload) => typeof payload === "number" && !isNaN(payload);
var isBoolean$1 = (payload) => typeof payload === "boolean";
var isRegExp = (payload) => payload instanceof RegExp;
var isMap = (payload) => payload instanceof Map;
var isSet = (payload) => payload instanceof Set;
var isSymbol = (payload) => getType(payload) === "Symbol";
var isDate = (payload) => payload instanceof Date && !isNaN(payload.valueOf());
var isError = (payload) => payload instanceof Error;
var isNaNValue = (payload) => typeof payload === "number" && isNaN(payload);
var isPrimitive = (payload) => isBoolean$1(payload) || isNull(payload) || isUndefined(payload) || isNumber$1(payload) || isString$1(payload) || isSymbol(payload);
var isBigint = (payload) => typeof payload === "bigint";
var isInfinite = (payload) => payload === Infinity || payload === -Infinity;
var isTypedArray = (payload) => ArrayBuffer.isView(payload) && !(payload instanceof DataView);
var isURL = (payload) => payload instanceof URL;
var escapeKey = (key) => key.replace(/\./g, "\\.");
var stringifyPath = (path2) => path2.map(String).map(escapeKey).join(".");
var parsePath = (string) => {
  const result = [];
  let segment = "";
  for (let i = 0; i < string.length; i++) {
    let char = string.charAt(i);
    const isEscapedDot = char === "\\" && string.charAt(i + 1) === ".";
    if (isEscapedDot) {
      segment += ".";
      i++;
      continue;
    }
    const isEndOfSegment = char === ".";
    if (isEndOfSegment) {
      result.push(segment);
      segment = "";
      continue;
    }
    segment += char;
  }
  const lastSegment = segment;
  result.push(lastSegment);
  return result;
};
function simpleTransformation(isApplicable, annotation, transform, untransform) {
  return {
    isApplicable,
    annotation,
    transform,
    untransform
  };
}
var simpleRules = [
  simpleTransformation(isUndefined, "undefined", () => null, () => void 0),
  simpleTransformation(isBigint, "bigint", (v) => v.toString(), (v) => {
    if (typeof BigInt !== "undefined") {
      return BigInt(v);
    }
    return v;
  }),
  simpleTransformation(isDate, "Date", (v) => v.toISOString(), (v) => new Date(v)),
  simpleTransformation(isError, "Error", (v, superJson) => {
    const baseError = {
      name: v.name,
      message: v.message
    };
    superJson.allowedErrorProps.forEach((prop) => {
      baseError[prop] = v[prop];
    });
    return baseError;
  }, (v, superJson) => {
    const e = new Error(v.message);
    e.name = v.name;
    e.stack = v.stack;
    superJson.allowedErrorProps.forEach((prop) => {
      e[prop] = v[prop];
    });
    return e;
  }),
  simpleTransformation(isRegExp, "regexp", (v) => "" + v, (regex) => {
    const body = regex.slice(1, regex.lastIndexOf("/"));
    const flags = regex.slice(regex.lastIndexOf("/") + 1);
    return new RegExp(body, flags);
  }),
  simpleTransformation(
    isSet,
    "set",
    // (sets only exist in es6+)
    // eslint-disable-next-line es5/no-es6-methods
    (v) => [...v.values()],
    (v) => new Set(v)
  ),
  simpleTransformation(isMap, "map", (v) => [...v.entries()], (v) => new Map(v)),
  simpleTransformation((v) => isNaNValue(v) || isInfinite(v), "number", (v) => {
    if (isNaNValue(v)) {
      return "NaN";
    }
    if (v > 0) {
      return "Infinity";
    } else {
      return "-Infinity";
    }
  }, Number),
  simpleTransformation((v) => v === 0 && 1 / v === -Infinity, "number", () => {
    return "-0";
  }, Number),
  simpleTransformation(isURL, "URL", (v) => v.toString(), (v) => new URL(v))
];
function compositeTransformation(isApplicable, annotation, transform, untransform) {
  return {
    isApplicable,
    annotation,
    transform,
    untransform
  };
}
var symbolRule = compositeTransformation((s, superJson) => {
  if (isSymbol(s)) {
    const isRegistered = !!superJson.symbolRegistry.getIdentifier(s);
    return isRegistered;
  }
  return false;
}, (s, superJson) => {
  const identifier = superJson.symbolRegistry.getIdentifier(s);
  return ["symbol", identifier];
}, (v) => v.description, (_2, a, superJson) => {
  const value = superJson.symbolRegistry.getValue(a[1]);
  if (!value) {
    throw new Error("Trying to deserialize unknown symbol");
  }
  return value;
});
var constructorToName = [
  Int8Array,
  Uint8Array,
  Int16Array,
  Uint16Array,
  Int32Array,
  Uint32Array,
  Float32Array,
  Float64Array,
  Uint8ClampedArray
].reduce((obj, ctor) => {
  obj[ctor.name] = ctor;
  return obj;
}, {});
var typedArrayRule = compositeTransformation(isTypedArray, (v) => ["typed-array", v.constructor.name], (v) => [...v], (v, a) => {
  const ctor = constructorToName[a[1]];
  if (!ctor) {
    throw new Error("Trying to deserialize unknown typed array");
  }
  return new ctor(v);
});
function isInstanceOfRegisteredClass(potentialClass, superJson) {
  if (potentialClass?.constructor) {
    const isRegistered = !!superJson.classRegistry.getIdentifier(potentialClass.constructor);
    return isRegistered;
  }
  return false;
}
var classRule = compositeTransformation(isInstanceOfRegisteredClass, (clazz, superJson) => {
  const identifier = superJson.classRegistry.getIdentifier(clazz.constructor);
  return ["class", identifier];
}, (clazz, superJson) => {
  const allowedProps = superJson.classRegistry.getAllowedProps(clazz.constructor);
  if (!allowedProps) {
    return { ...clazz };
  }
  const result = {};
  allowedProps.forEach((prop) => {
    result[prop] = clazz[prop];
  });
  return result;
}, (v, a, superJson) => {
  const clazz = superJson.classRegistry.getValue(a[1]);
  if (!clazz) {
    throw new Error(`Trying to deserialize unknown class '${a[1]}' - check https://github.com/blitz-js/superjson/issues/116#issuecomment-773996564`);
  }
  return Object.assign(Object.create(clazz.prototype), v);
});
var customRule = compositeTransformation((value, superJson) => {
  return !!superJson.customTransformerRegistry.findApplicable(value);
}, (value, superJson) => {
  const transformer = superJson.customTransformerRegistry.findApplicable(value);
  return ["custom", transformer.name];
}, (value, superJson) => {
  const transformer = superJson.customTransformerRegistry.findApplicable(value);
  return transformer.serialize(value);
}, (v, a, superJson) => {
  const transformer = superJson.customTransformerRegistry.findByName(a[1]);
  if (!transformer) {
    throw new Error("Trying to deserialize unknown custom value");
  }
  return transformer.deserialize(v);
});
var compositeRules = [classRule, symbolRule, customRule, typedArrayRule];
var transformValue = (value, superJson) => {
  const applicableCompositeRule = findArr(compositeRules, (rule) => rule.isApplicable(value, superJson));
  if (applicableCompositeRule) {
    return {
      value: applicableCompositeRule.transform(value, superJson),
      type: applicableCompositeRule.annotation(value, superJson)
    };
  }
  const applicableSimpleRule = findArr(simpleRules, (rule) => rule.isApplicable(value, superJson));
  if (applicableSimpleRule) {
    return {
      value: applicableSimpleRule.transform(value, superJson),
      type: applicableSimpleRule.annotation
    };
  }
  return void 0;
};
var simpleRulesByAnnotation = {};
simpleRules.forEach((rule) => {
  simpleRulesByAnnotation[rule.annotation] = rule;
});
var untransformValue = (json, type, superJson) => {
  if (isArray(type)) {
    switch (type[0]) {
      case "symbol":
        return symbolRule.untransform(json, type, superJson);
      case "class":
        return classRule.untransform(json, type, superJson);
      case "custom":
        return customRule.untransform(json, type, superJson);
      case "typed-array":
        return typedArrayRule.untransform(json, type, superJson);
      default:
        throw new Error("Unknown transformation: " + type);
    }
  } else {
    const transformation = simpleRulesByAnnotation[type];
    if (!transformation) {
      throw new Error("Unknown transformation: " + type);
    }
    return transformation.untransform(json, superJson);
  }
};
var getNthKey = (value, n) => {
  if (n > value.size)
    throw new Error("index out of bounds");
  const keys = value.keys();
  while (n > 0) {
    keys.next();
    n--;
  }
  return keys.next().value;
};
function validatePath(path2) {
  if (includes(path2, "__proto__")) {
    throw new Error("__proto__ is not allowed as a property");
  }
  if (includes(path2, "prototype")) {
    throw new Error("prototype is not allowed as a property");
  }
  if (includes(path2, "constructor")) {
    throw new Error("constructor is not allowed as a property");
  }
}
var getDeep = (object, path2) => {
  validatePath(path2);
  for (let i = 0; i < path2.length; i++) {
    const key = path2[i];
    if (isSet(object)) {
      object = getNthKey(object, +key);
    } else if (isMap(object)) {
      const row = +key;
      const type = +path2[++i] === 0 ? "key" : "value";
      const keyOfRow = getNthKey(object, row);
      switch (type) {
        case "key":
          object = keyOfRow;
          break;
        case "value":
          object = object.get(keyOfRow);
          break;
      }
    } else {
      object = object[key];
    }
  }
  return object;
};
var setDeep = (object, path2, mapper) => {
  validatePath(path2);
  if (path2.length === 0) {
    return mapper(object);
  }
  let parent = object;
  for (let i = 0; i < path2.length - 1; i++) {
    const key = path2[i];
    if (isArray(parent)) {
      const index2 = +key;
      parent = parent[index2];
    } else if (isPlainObject$1(parent)) {
      parent = parent[key];
    } else if (isSet(parent)) {
      const row = +key;
      parent = getNthKey(parent, row);
    } else if (isMap(parent)) {
      const isEnd = i === path2.length - 2;
      if (isEnd) {
        break;
      }
      const row = +key;
      const type = +path2[++i] === 0 ? "key" : "value";
      const keyOfRow = getNthKey(parent, row);
      switch (type) {
        case "key":
          parent = keyOfRow;
          break;
        case "value":
          parent = parent.get(keyOfRow);
          break;
      }
    }
  }
  const lastKey = path2[path2.length - 1];
  if (isArray(parent)) {
    parent[+lastKey] = mapper(parent[+lastKey]);
  } else if (isPlainObject$1(parent)) {
    parent[lastKey] = mapper(parent[lastKey]);
  }
  if (isSet(parent)) {
    const oldValue = getNthKey(parent, +lastKey);
    const newValue = mapper(oldValue);
    if (oldValue !== newValue) {
      parent.delete(oldValue);
      parent.add(newValue);
    }
  }
  if (isMap(parent)) {
    const row = +path2[path2.length - 2];
    const keyToRow = getNthKey(parent, row);
    const type = +lastKey === 0 ? "key" : "value";
    switch (type) {
      case "key": {
        const newKey = mapper(keyToRow);
        parent.set(newKey, parent.get(keyToRow));
        if (newKey !== keyToRow) {
          parent.delete(keyToRow);
        }
        break;
      }
      case "value": {
        parent.set(keyToRow, mapper(parent.get(keyToRow)));
        break;
      }
    }
  }
  return object;
};
function traverse(tree, walker2, origin = []) {
  if (!tree) {
    return;
  }
  if (!isArray(tree)) {
    forEach(tree, (subtree, key) => traverse(subtree, walker2, [...origin, ...parsePath(key)]));
    return;
  }
  const [nodeValue, children2] = tree;
  if (children2) {
    forEach(children2, (child, key) => {
      traverse(child, walker2, [...origin, ...parsePath(key)]);
    });
  }
  walker2(nodeValue, origin);
}
function applyValueAnnotations(plain, annotations, superJson) {
  traverse(annotations, (type, path2) => {
    plain = setDeep(plain, path2, (v) => untransformValue(v, type, superJson));
  });
  return plain;
}
function applyReferentialEqualityAnnotations(plain, annotations) {
  function apply(identicalPaths, path2) {
    const object = getDeep(plain, parsePath(path2));
    identicalPaths.map(parsePath).forEach((identicalObjectPath) => {
      plain = setDeep(plain, identicalObjectPath, () => object);
    });
  }
  if (isArray(annotations)) {
    const [root, other] = annotations;
    root.forEach((identicalPath) => {
      plain = setDeep(plain, parsePath(identicalPath), () => plain);
    });
    if (other) {
      forEach(other, apply);
    }
  } else {
    forEach(annotations, apply);
  }
  return plain;
}
var isDeep = (object, superJson) => isPlainObject$1(object) || isArray(object) || isMap(object) || isSet(object) || isInstanceOfRegisteredClass(object, superJson);
function addIdentity(object, path2, identities) {
  const existingSet = identities.get(object);
  if (existingSet) {
    existingSet.push(path2);
  } else {
    identities.set(object, [path2]);
  }
}
function generateReferentialEqualityAnnotations(identitites, dedupe) {
  const result = {};
  let rootEqualityPaths = void 0;
  identitites.forEach((paths) => {
    if (paths.length <= 1) {
      return;
    }
    if (!dedupe) {
      paths = paths.map((path2) => path2.map(String)).sort((a, b) => a.length - b.length);
    }
    const [representativePath, ...identicalPaths] = paths;
    if (representativePath.length === 0) {
      rootEqualityPaths = identicalPaths.map(stringifyPath);
    } else {
      result[stringifyPath(representativePath)] = identicalPaths.map(stringifyPath);
    }
  });
  if (rootEqualityPaths) {
    if (isEmptyObject$1(result)) {
      return [rootEqualityPaths];
    } else {
      return [rootEqualityPaths, result];
    }
  } else {
    return isEmptyObject$1(result) ? void 0 : result;
  }
}
var walker = (object, identities, superJson, dedupe, path2 = [], objectsInThisPath = [], seenObjects = /* @__PURE__ */ new Map()) => {
  const primitive = isPrimitive(object);
  if (!primitive) {
    addIdentity(object, path2, identities);
    const seen = seenObjects.get(object);
    if (seen) {
      return dedupe ? {
        transformedValue: null
      } : seen;
    }
  }
  if (!isDeep(object, superJson)) {
    const transformed2 = transformValue(object, superJson);
    const result2 = transformed2 ? {
      transformedValue: transformed2.value,
      annotations: [transformed2.type]
    } : {
      transformedValue: object
    };
    if (!primitive) {
      seenObjects.set(object, result2);
    }
    return result2;
  }
  if (includes(objectsInThisPath, object)) {
    return {
      transformedValue: null
    };
  }
  const transformationResult = transformValue(object, superJson);
  const transformed = transformationResult?.value ?? object;
  const transformedValue = isArray(transformed) ? [] : {};
  const innerAnnotations = {};
  forEach(transformed, (value, index2) => {
    if (index2 === "__proto__" || index2 === "constructor" || index2 === "prototype") {
      throw new Error(`Detected property ${index2}. This is a prototype pollution risk, please remove it from your object.`);
    }
    const recursiveResult = walker(value, identities, superJson, dedupe, [...path2, index2], [...objectsInThisPath, object], seenObjects);
    transformedValue[index2] = recursiveResult.transformedValue;
    if (isArray(recursiveResult.annotations)) {
      innerAnnotations[index2] = recursiveResult.annotations;
    } else if (isPlainObject$1(recursiveResult.annotations)) {
      forEach(recursiveResult.annotations, (tree, key) => {
        innerAnnotations[escapeKey(index2) + "." + key] = tree;
      });
    }
  });
  const result = isEmptyObject$1(innerAnnotations) ? {
    transformedValue,
    annotations: !!transformationResult ? [transformationResult.type] : void 0
  } : {
    transformedValue,
    annotations: !!transformationResult ? [transformationResult.type, innerAnnotations] : innerAnnotations
  };
  if (!primitive) {
    seenObjects.set(object, result);
  }
  return result;
};
function getType2(payload) {
  return Object.prototype.toString.call(payload).slice(8, -1);
}
function isArray2(payload) {
  return getType2(payload) === "Array";
}
function isPlainObject2(payload) {
  if (getType2(payload) !== "Object")
    return false;
  const prototype = Object.getPrototypeOf(payload);
  return !!prototype && prototype.constructor === Object && prototype === Object.prototype;
}
function assignProp2(carry, key, newVal, originalObject, includeNonenumerable) {
  const propType = {}.propertyIsEnumerable.call(originalObject, key) ? "enumerable" : "nonenumerable";
  if (propType === "enumerable")
    carry[key] = newVal;
  if (includeNonenumerable && propType === "nonenumerable") {
    Object.defineProperty(carry, key, {
      value: newVal,
      enumerable: false,
      writable: true,
      configurable: true
    });
  }
}
function copy(target, options = {}) {
  if (isArray2(target)) {
    return target.map((item) => copy(item, options));
  }
  if (!isPlainObject2(target)) {
    return target;
  }
  const props = Object.getOwnPropertyNames(target);
  const symbols = Object.getOwnPropertySymbols(target);
  return [...props, ...symbols].reduce((carry, key) => {
    if (isArray2(options.props) && !options.props.includes(key)) {
      return carry;
    }
    const val = target[key];
    const newVal = copy(val, options);
    assignProp2(carry, key, newVal, target, options.nonenumerable);
    return carry;
  }, {});
}
var SuperJSON = class {
  /**
   * @param dedupeReferentialEqualities  If true, SuperJSON will make sure only one instance of referentially equal objects are serialized and the rest are replaced with `null`.
   */
  constructor({ dedupe = false } = {}) {
    this.classRegistry = new ClassRegistry();
    this.symbolRegistry = new Registry((s) => s.description ?? "");
    this.customTransformerRegistry = new CustomTransformerRegistry();
    this.allowedErrorProps = [];
    this.dedupe = dedupe;
  }
  serialize(object) {
    const identities = /* @__PURE__ */ new Map();
    const output = walker(object, identities, this, this.dedupe);
    const res = {
      json: output.transformedValue
    };
    if (output.annotations) {
      res.meta = {
        ...res.meta,
        values: output.annotations
      };
    }
    const equalityAnnotations = generateReferentialEqualityAnnotations(identities, this.dedupe);
    if (equalityAnnotations) {
      res.meta = {
        ...res.meta,
        referentialEqualities: equalityAnnotations
      };
    }
    return res;
  }
  deserialize(payload) {
    const { json, meta } = payload;
    let result = copy(json);
    if (meta?.values) {
      result = applyValueAnnotations(result, meta.values, this);
    }
    if (meta?.referentialEqualities) {
      result = applyReferentialEqualityAnnotations(result, meta.referentialEqualities);
    }
    return result;
  }
  stringify(object) {
    return JSON.stringify(this.serialize(object));
  }
  parse(string) {
    return this.deserialize(JSON.parse(string));
  }
  registerClass(v, options) {
    this.classRegistry.register(v, options);
  }
  registerSymbol(v, identifier) {
    this.symbolRegistry.register(v, identifier);
  }
  registerCustom(transformer, name) {
    this.customTransformerRegistry.register({
      name,
      ...transformer
    });
  }
  allowErrorProps(...props) {
    this.allowedErrorProps.push(...props);
  }
};
SuperJSON.defaultInstance = new SuperJSON();
SuperJSON.serialize = SuperJSON.defaultInstance.serialize.bind(SuperJSON.defaultInstance);
SuperJSON.deserialize = SuperJSON.defaultInstance.deserialize.bind(SuperJSON.defaultInstance);
SuperJSON.stringify = SuperJSON.defaultInstance.stringify.bind(SuperJSON.defaultInstance);
SuperJSON.parse = SuperJSON.defaultInstance.parse.bind(SuperJSON.defaultInstance);
SuperJSON.registerClass = SuperJSON.defaultInstance.registerClass.bind(SuperJSON.defaultInstance);
SuperJSON.registerSymbol = SuperJSON.defaultInstance.registerSymbol.bind(SuperJSON.defaultInstance);
SuperJSON.registerCustom = SuperJSON.defaultInstance.registerCustom.bind(SuperJSON.defaultInstance);
SuperJSON.allowErrorProps = SuperJSON.defaultInstance.allowErrorProps.bind(SuperJSON.defaultInstance);
var serialize = SuperJSON.serialize;
var stringify = SuperJSON.stringify;
function getQueryStatusLabel(query) {
  return query.state.fetchStatus === "fetching" ? "fetching" : !query.getObserversCount() ? "inactive" : query.state.fetchStatus === "paused" ? "paused" : query.isStale() ? "stale" : "fresh";
}
function getSidedProp(prop, side) {
  return `${prop}${side.charAt(0).toUpperCase() + side.slice(1)}`;
}
function getQueryStatusColor({
  queryState,
  observerCount,
  isStale
}) {
  return queryState.fetchStatus === "fetching" ? "blue" : !observerCount ? "gray" : queryState.fetchStatus === "paused" ? "purple" : isStale ? "yellow" : "green";
}
function getMutationStatusColor({
  status,
  isPaused
}) {
  return isPaused ? "purple" : status === "error" ? "red" : status === "pending" ? "yellow" : status === "success" ? "green" : "gray";
}
function getQueryStatusColorByLabel(label) {
  return label === "fresh" ? "green" : label === "stale" ? "yellow" : label === "paused" ? "purple" : label === "inactive" ? "gray" : "blue";
}
var displayValue = (value, beautify = false) => {
  const {
    json
  } = serialize(value);
  return JSON.stringify(json, null, beautify ? 2 : void 0);
};
var getStatusRank = (q) => q.state.fetchStatus !== "idle" ? 0 : !q.getObserversCount() ? 3 : q.isStale() ? 2 : 1;
var queryHashSort = (a, b) => a.queryHash.localeCompare(b.queryHash);
var dateSort = (a, b) => a.state.dataUpdatedAt < b.state.dataUpdatedAt ? 1 : -1;
var statusAndDateSort = (a, b) => {
  if (getStatusRank(a) === getStatusRank(b)) {
    return dateSort(a, b);
  }
  return getStatusRank(a) > getStatusRank(b) ? 1 : -1;
};
var sortFns = {
  status: statusAndDateSort,
  "query hash": queryHashSort,
  "last updated": dateSort
};
var getMutationStatusRank = (m) => m.state.isPaused ? 0 : m.state.status === "error" ? 2 : m.state.status === "pending" ? 1 : 3;
var mutationDateSort = (a, b) => a.state.submittedAt < b.state.submittedAt ? 1 : -1;
var mutationStatusSort = (a, b) => {
  if (getMutationStatusRank(a) === getMutationStatusRank(b)) {
    return mutationDateSort(a, b);
  }
  return getMutationStatusRank(a) > getMutationStatusRank(b) ? 1 : -1;
};
var mutationSortFns = {
  status: mutationStatusSort,
  "last updated": mutationDateSort
};
var convertRemToPixels = (rem) => {
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
};
var getPreferredColorScheme = () => {
  const [colorScheme, setColorScheme] = createSignal("dark");
  onMount(() => {
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    setColorScheme(query.matches ? "dark" : "light");
    const listener = (e) => {
      setColorScheme(e.matches ? "dark" : "light");
    };
    query.addEventListener("change", listener);
    onCleanup(() => query.removeEventListener("change", listener));
  });
  return colorScheme;
};
var updateNestedDataByPath = (oldData, updatePath, value) => {
  if (updatePath.length === 0) {
    return value;
  }
  if (oldData instanceof Map) {
    const newData = new Map(oldData);
    if (updatePath.length === 1) {
      newData.set(updatePath[0], value);
      return newData;
    }
    const [head, ...tail] = updatePath;
    newData.set(head, updateNestedDataByPath(newData.get(head), tail, value));
    return newData;
  }
  if (oldData instanceof Set) {
    const setAsArray = updateNestedDataByPath(Array.from(oldData), updatePath, value);
    return new Set(setAsArray);
  }
  if (Array.isArray(oldData)) {
    const newData = [...oldData];
    if (updatePath.length === 1) {
      newData[updatePath[0]] = value;
      return newData;
    }
    const [head, ...tail] = updatePath;
    newData[head] = updateNestedDataByPath(newData[head], tail, value);
    return newData;
  }
  if (oldData instanceof Object) {
    const newData = {
      ...oldData
    };
    if (updatePath.length === 1) {
      newData[updatePath[0]] = value;
      return newData;
    }
    const [head, ...tail] = updatePath;
    newData[head] = updateNestedDataByPath(newData[head], tail, value);
    return newData;
  }
  return oldData;
};
var deleteNestedDataByPath = (oldData, deletePath) => {
  if (oldData instanceof Map) {
    const newData = new Map(oldData);
    if (deletePath.length === 1) {
      newData.delete(deletePath[0]);
      return newData;
    }
    const [head, ...tail] = deletePath;
    newData.set(head, deleteNestedDataByPath(newData.get(head), tail));
    return newData;
  }
  if (oldData instanceof Set) {
    const setAsArray = deleteNestedDataByPath(Array.from(oldData), deletePath);
    return new Set(setAsArray);
  }
  if (Array.isArray(oldData)) {
    const newData = [...oldData];
    if (deletePath.length === 1) {
      return newData.filter((_2, idx) => idx.toString() !== deletePath[0]);
    }
    const [head, ...tail] = deletePath;
    newData[head] = deleteNestedDataByPath(newData[head], tail);
    return newData;
  }
  if (oldData instanceof Object) {
    const newData = {
      ...oldData
    };
    if (deletePath.length === 1) {
      delete newData[deletePath[0]];
      return newData;
    }
    const [head, ...tail] = deletePath;
    newData[head] = deleteNestedDataByPath(newData[head], tail);
    return newData;
  }
  return oldData;
};
var setupStyleSheet = (nonce, target) => {
  if (!nonce) return;
  const styleExists = document.querySelector("#_goober") || target?.querySelector("#_goober");
  if (styleExists) return;
  const styleTag = document.createElement("style");
  const textNode = document.createTextNode("");
  styleTag.appendChild(textNode);
  styleTag.id = "_goober";
  styleTag.setAttribute("nonce", nonce);
  if (target) {
    target.appendChild(styleTag);
  } else {
    document.head.appendChild(styleTag);
  }
};
var TanstackQueryDevtools = class {
  #client;
  #onlineManager;
  #queryFlavor;
  #version;
  #isMounted = false;
  #styleNonce;
  #shadowDOMTarget;
  #buttonPosition;
  #position;
  #initialIsOpen;
  #errorTypes;
  #hideDisabledQueries;
  #Component;
  #dispose;
  constructor(config) {
    const {
      client,
      queryFlavor,
      version,
      onlineManager: onlineManager2,
      buttonPosition,
      position,
      initialIsOpen,
      errorTypes,
      styleNonce,
      shadowDOMTarget,
      hideDisabledQueries
    } = config;
    this.#client = createSignal(client);
    this.#queryFlavor = queryFlavor;
    this.#version = version;
    this.#onlineManager = onlineManager2;
    this.#styleNonce = styleNonce;
    this.#shadowDOMTarget = shadowDOMTarget;
    this.#buttonPosition = createSignal(buttonPosition);
    this.#position = createSignal(position);
    this.#initialIsOpen = createSignal(initialIsOpen);
    this.#errorTypes = createSignal(errorTypes);
    this.#hideDisabledQueries = createSignal(hideDisabledQueries);
  }
  setButtonPosition(position) {
    this.#buttonPosition[1](position);
  }
  setPosition(position) {
    this.#position[1](position);
  }
  setInitialIsOpen(isOpen) {
    this.#initialIsOpen[1](isOpen);
  }
  setErrorTypes(errorTypes) {
    this.#errorTypes[1](errorTypes);
  }
  setClient(client) {
    this.#client[1](client);
  }
  mount(el) {
    if (this.#isMounted) {
      throw new Error("Devtools is already mounted");
    }
    const dispose2 = render(() => {
      const _self$ = this;
      const [btnPosition] = this.#buttonPosition;
      const [pos] = this.#position;
      const [isOpen] = this.#initialIsOpen;
      const [errors2] = this.#errorTypes;
      const [hideDisabledQueries] = this.#hideDisabledQueries;
      const [queryClient] = this.#client;
      let Devtools;
      if (this.#Component) {
        Devtools = this.#Component;
      } else {
        Devtools = lazy(() => import("./NCMVHL6D-DdU_rz1h.js"));
        this.#Component = Devtools;
      }
      setupStyleSheet(this.#styleNonce, this.#shadowDOMTarget);
      return createComponent(Devtools, mergeProps({
        get queryFlavor() {
          return _self$.#queryFlavor;
        },
        get version() {
          return _self$.#version;
        },
        get onlineManager() {
          return _self$.#onlineManager;
        },
        get shadowDOMTarget() {
          return _self$.#shadowDOMTarget;
        }
      }, {
        get client() {
          return queryClient();
        },
        get buttonPosition() {
          return btnPosition();
        },
        get position() {
          return pos();
        },
        get initialIsOpen() {
          return isOpen();
        },
        get errorTypes() {
          return errors2();
        },
        get hideDisabledQueries() {
          return hideDisabledQueries();
        }
      }));
    }, el);
    this.#isMounted = true;
    this.#dispose = dispose2;
  }
  unmount() {
    if (!this.#isMounted) {
      throw new Error("Devtools is not mounted");
    }
    this.#dispose?.();
    this.#isMounted = false;
  }
};
var TanstackQueryDevtoolsPanel = class {
  #client;
  #onlineManager;
  #queryFlavor;
  #version;
  #isMounted = false;
  #styleNonce;
  #shadowDOMTarget;
  #buttonPosition;
  #position;
  #initialIsOpen;
  #errorTypes;
  #hideDisabledQueries;
  #onClose;
  #Component;
  #dispose;
  constructor(config) {
    const {
      client,
      queryFlavor,
      version,
      onlineManager: onlineManager2,
      buttonPosition,
      position,
      initialIsOpen,
      errorTypes,
      styleNonce,
      shadowDOMTarget,
      onClose,
      hideDisabledQueries
    } = config;
    this.#client = createSignal(client);
    this.#queryFlavor = queryFlavor;
    this.#version = version;
    this.#onlineManager = onlineManager2;
    this.#styleNonce = styleNonce;
    this.#shadowDOMTarget = shadowDOMTarget;
    this.#buttonPosition = createSignal(buttonPosition);
    this.#position = createSignal(position);
    this.#initialIsOpen = createSignal(initialIsOpen);
    this.#errorTypes = createSignal(errorTypes);
    this.#hideDisabledQueries = createSignal(hideDisabledQueries);
    this.#onClose = createSignal(onClose);
  }
  setButtonPosition(position) {
    this.#buttonPosition[1](position);
  }
  setPosition(position) {
    this.#position[1](position);
  }
  setInitialIsOpen(isOpen) {
    this.#initialIsOpen[1](isOpen);
  }
  setErrorTypes(errorTypes) {
    this.#errorTypes[1](errorTypes);
  }
  setClient(client) {
    this.#client[1](client);
  }
  setOnClose(onClose) {
    this.#onClose[1](() => onClose);
  }
  mount(el) {
    if (this.#isMounted) {
      throw new Error("Devtools is already mounted");
    }
    const dispose2 = render(() => {
      const _self$ = this;
      const [btnPosition] = this.#buttonPosition;
      const [pos] = this.#position;
      const [isOpen] = this.#initialIsOpen;
      const [errors2] = this.#errorTypes;
      const [hideDisabledQueries] = this.#hideDisabledQueries;
      const [queryClient] = this.#client;
      const [onClose] = this.#onClose;
      let Devtools;
      if (this.#Component) {
        Devtools = this.#Component;
      } else {
        Devtools = lazy(() => import("./2AITGKQY-sEhHdF0k.js"));
        this.#Component = Devtools;
      }
      setupStyleSheet(this.#styleNonce, this.#shadowDOMTarget);
      return createComponent(Devtools, mergeProps({
        get queryFlavor() {
          return _self$.#queryFlavor;
        },
        get version() {
          return _self$.#version;
        },
        get onlineManager() {
          return _self$.#onlineManager;
        },
        get shadowDOMTarget() {
          return _self$.#shadowDOMTarget;
        }
      }, {
        get client() {
          return queryClient();
        },
        get buttonPosition() {
          return btnPosition();
        },
        get position() {
          return pos();
        },
        get initialIsOpen() {
          return isOpen();
        },
        get errorTypes() {
          return errors2();
        },
        get hideDisabledQueries() {
          return hideDisabledQueries();
        },
        get onClose() {
          return onClose();
        }
      }));
    }, el);
    this.#isMounted = true;
    this.#dispose = dispose2;
  }
  unmount() {
    if (!this.#isMounted) {
      throw new Error("Devtools is not mounted");
    }
    this.#dispose?.();
    this.#isMounted = false;
  }
};
function ReactQueryDevtools(props) {
  const queryClient = useQueryClient(props.client);
  const ref = reactExports.useRef(null);
  const {
    buttonPosition,
    position,
    initialIsOpen,
    errorTypes,
    styleNonce,
    shadowDOMTarget,
    hideDisabledQueries
  } = props;
  const [devtools] = reactExports.useState(
    new TanstackQueryDevtools({
      client: queryClient,
      queryFlavor: "React Query",
      version: "5",
      onlineManager,
      buttonPosition,
      position,
      initialIsOpen,
      errorTypes,
      styleNonce,
      shadowDOMTarget,
      hideDisabledQueries
    })
  );
  reactExports.useEffect(() => {
    devtools.setClient(queryClient);
  }, [queryClient, devtools]);
  reactExports.useEffect(() => {
    if (buttonPosition) {
      devtools.setButtonPosition(buttonPosition);
    }
  }, [buttonPosition, devtools]);
  reactExports.useEffect(() => {
    if (position) {
      devtools.setPosition(position);
    }
  }, [position, devtools]);
  reactExports.useEffect(() => {
    devtools.setInitialIsOpen(initialIsOpen || false);
  }, [initialIsOpen, devtools]);
  reactExports.useEffect(() => {
    devtools.setErrorTypes(errorTypes || []);
  }, [errorTypes, devtools]);
  reactExports.useEffect(() => {
    if (ref.current) {
      devtools.mount(ref.current);
    }
    return () => {
      devtools.unmount();
    };
  }, [devtools]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { dir: "ltr", className: "tsqd-parent-container", ref });
}
function ReactQueryDevtoolsPanel(props) {
  const queryClient = useQueryClient(props.client);
  const ref = reactExports.useRef(null);
  const { errorTypes, styleNonce, shadowDOMTarget, hideDisabledQueries } = props;
  const [devtools] = reactExports.useState(
    new TanstackQueryDevtoolsPanel({
      client: queryClient,
      queryFlavor: "React Query",
      version: "5",
      onlineManager,
      buttonPosition: "bottom-left",
      position: "bottom",
      initialIsOpen: true,
      errorTypes,
      styleNonce,
      shadowDOMTarget,
      onClose: props.onClose,
      hideDisabledQueries
    })
  );
  reactExports.useEffect(() => {
    devtools.setClient(queryClient);
  }, [queryClient, devtools]);
  reactExports.useEffect(() => {
    devtools.setOnClose(props.onClose ?? (() => {
    }));
  }, [props.onClose, devtools]);
  reactExports.useEffect(() => {
    devtools.setErrorTypes(errorTypes || []);
  }, [errorTypes, devtools]);
  reactExports.useEffect(() => {
    if (ref.current) {
      devtools.mount(ref.current);
    }
    return () => {
      devtools.unmount();
    };
  }, [devtools]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      style: { height: "500px", ...props.style },
      className: "tsqd-parent-container",
      ref
    }
  );
}
process.env.NODE_ENV !== "development" ? function() {
  return null;
} : ReactQueryDevtools;
var ReactQueryDevtoolsPanel2 = process.env.NODE_ENV !== "development" ? function() {
  return null;
} : ReactQueryDevtoolsPanel;
const TanStackQueryDevtools = {
  name: "Tanstack Query",
  render: /* @__PURE__ */ jsxRuntimeExports.jsx(ReactQueryDevtoolsPanel2, {})
};
const appCss = "/assets/styles-BygGJOWk.css";
const Route$5 = createRootRouteWithContext()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8"
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      },
      {
        title: "TanStack Start Starter"
      }
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss
      }
    ]
  }),
  shellComponent: RootDocument
});
function RootDocument({ children: children2 }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", suppressHydrationWarning: true, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("body", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(ThemeProvider, { children: [
      children2,
      /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        TanStackDevtools,
        {
          config: {
            position: "bottom-right"
          },
          plugins: [
            {
              name: "Tanstack Router",
              render: /* @__PURE__ */ jsxRuntimeExports.jsx(TanStackRouterDevtoolsPanel, {})
            },
            TanStackQueryDevtools
          ]
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] }) })
  ] });
}
const SubText = () => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("h6", { className: "text-center text-foreground text-xl tracking-tight", children: "League of Legends" });
};
const Route$4 = createFileRoute("/")({ component: Home });
function Home() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex min-h-screen flex-col items-center justify-center bg-[url('/background-1.webp')] bg-center bg-cover", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex w-full animate-pulse2 flex-col items-center justify-center gap-4 bg-black py-16", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(MainText, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SubText, {})
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Search, {})
  ] }) });
}
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
const Route$3 = createFileRoute("/$region/$username/")({
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
  component: RouteComponent$1,
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
function RouteComponent$1() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col ", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "sticky top-0 z-30 grid grid-cols-3 w-screen justify-between bg-primary-foreground px-1 md:px-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(MainTitleLink, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Profile, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-4 right-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeSelector, {}) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Client$1, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "flex flex-col items-center gap-4 p-2 text-sm opacity-50", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(FooterLinks, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(RiotGamesDisclaimer, {})
    ] })
  ] });
}
function Client$1() {
  const {
    username,
    region,
    rawUsername,
    rawRegion,
    summonerData,
    profileIconUrl,
    error
  } = Route$3.useLoaderData();
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
var xml2js$1 = {};
var defaults = {};
var hasRequiredDefaults;
function requireDefaults() {
  if (hasRequiredDefaults) return defaults;
  hasRequiredDefaults = 1;
  (function() {
    defaults.defaults = {
      "0.1": {
        explicitCharkey: false,
        trim: true,
        normalize: true,
        normalizeTags: false,
        attrkey: "@",
        charkey: "#",
        explicitArray: false,
        ignoreAttrs: false,
        mergeAttrs: false,
        explicitRoot: false,
        validator: null,
        xmlns: false,
        explicitChildren: false,
        childkey: "@@",
        charsAsChildren: false,
        includeWhiteChars: false,
        async: false,
        strict: true,
        attrNameProcessors: null,
        attrValueProcessors: null,
        tagNameProcessors: null,
        valueProcessors: null,
        emptyTag: ""
      },
      "0.2": {
        explicitCharkey: false,
        trim: false,
        normalize: false,
        normalizeTags: false,
        attrkey: "$",
        charkey: "_",
        explicitArray: true,
        ignoreAttrs: false,
        mergeAttrs: false,
        explicitRoot: true,
        validator: null,
        xmlns: false,
        explicitChildren: false,
        preserveChildrenOrder: false,
        childkey: "$$",
        charsAsChildren: false,
        includeWhiteChars: false,
        async: false,
        strict: true,
        attrNameProcessors: null,
        attrValueProcessors: null,
        tagNameProcessors: null,
        valueProcessors: null,
        rootName: "root",
        xmldec: {
          "version": "1.0",
          "encoding": "UTF-8",
          "standalone": true
        },
        doctype: null,
        renderOpts: {
          "pretty": true,
          "indent": "  ",
          "newline": "\n"
        },
        headless: false,
        chunkSize: 1e4,
        emptyTag: "",
        cdata: false
      }
    };
  }).call(defaults);
  return defaults;
}
var builder = {};
var lib$1 = {};
var Utility = {};
var hasRequiredUtility;
function requireUtility() {
  if (hasRequiredUtility) return Utility;
  hasRequiredUtility = 1;
  (function() {
    var assign2, getValue, isArray3, isEmpty2, isFunction2, isObject2, isPlainObject3, slice = [].slice, hasProp = {}.hasOwnProperty;
    assign2 = function() {
      var i, key, len, source, sources, target;
      target = arguments[0], sources = 2 <= arguments.length ? slice.call(arguments, 1) : [];
      if (isFunction2(Object.assign)) {
        Object.assign.apply(null, arguments);
      } else {
        for (i = 0, len = sources.length; i < len; i++) {
          source = sources[i];
          if (source != null) {
            for (key in source) {
              if (!hasProp.call(source, key)) continue;
              target[key] = source[key];
            }
          }
        }
      }
      return target;
    };
    isFunction2 = function(val) {
      return !!val && Object.prototype.toString.call(val) === "[object Function]";
    };
    isObject2 = function(val) {
      var ref;
      return !!val && ((ref = typeof val) === "function" || ref === "object");
    };
    isArray3 = function(val) {
      if (isFunction2(Array.isArray)) {
        return Array.isArray(val);
      } else {
        return Object.prototype.toString.call(val) === "[object Array]";
      }
    };
    isEmpty2 = function(val) {
      var key;
      if (isArray3(val)) {
        return !val.length;
      } else {
        for (key in val) {
          if (!hasProp.call(val, key)) continue;
          return false;
        }
        return true;
      }
    };
    isPlainObject3 = function(val) {
      var ctor, proto;
      return isObject2(val) && (proto = Object.getPrototypeOf(val)) && (ctor = proto.constructor) && typeof ctor === "function" && ctor instanceof ctor && Function.prototype.toString.call(ctor) === Function.prototype.toString.call(Object);
    };
    getValue = function(obj) {
      if (isFunction2(obj.valueOf)) {
        return obj.valueOf();
      } else {
        return obj;
      }
    };
    Utility.assign = assign2;
    Utility.isFunction = isFunction2;
    Utility.isObject = isObject2;
    Utility.isArray = isArray3;
    Utility.isEmpty = isEmpty2;
    Utility.isPlainObject = isPlainObject3;
    Utility.getValue = getValue;
  }).call(Utility);
  return Utility;
}
var XMLDOMImplementation$1 = { exports: {} };
var XMLDOMImplementation = XMLDOMImplementation$1.exports;
var hasRequiredXMLDOMImplementation;
function requireXMLDOMImplementation() {
  if (hasRequiredXMLDOMImplementation) return XMLDOMImplementation$1.exports;
  hasRequiredXMLDOMImplementation = 1;
  (function() {
    XMLDOMImplementation$1.exports = (function() {
      function XMLDOMImplementation2() {
      }
      XMLDOMImplementation2.prototype.hasFeature = function(feature, version) {
        return true;
      };
      XMLDOMImplementation2.prototype.createDocumentType = function(qualifiedName, publicId, systemId) {
        throw new Error("This DOM method is not implemented.");
      };
      XMLDOMImplementation2.prototype.createDocument = function(namespaceURI, qualifiedName, doctype) {
        throw new Error("This DOM method is not implemented.");
      };
      XMLDOMImplementation2.prototype.createHTMLDocument = function(title) {
        throw new Error("This DOM method is not implemented.");
      };
      XMLDOMImplementation2.prototype.getFeature = function(feature, version) {
        throw new Error("This DOM method is not implemented.");
      };
      return XMLDOMImplementation2;
    })();
  }).call(XMLDOMImplementation);
  return XMLDOMImplementation$1.exports;
}
var XMLDocument$1 = { exports: {} };
var XMLDOMConfiguration$1 = { exports: {} };
var XMLDOMErrorHandler$1 = { exports: {} };
var XMLDOMErrorHandler = XMLDOMErrorHandler$1.exports;
var hasRequiredXMLDOMErrorHandler;
function requireXMLDOMErrorHandler() {
  if (hasRequiredXMLDOMErrorHandler) return XMLDOMErrorHandler$1.exports;
  hasRequiredXMLDOMErrorHandler = 1;
  (function() {
    XMLDOMErrorHandler$1.exports = (function() {
      function XMLDOMErrorHandler2() {
      }
      XMLDOMErrorHandler2.prototype.handleError = function(error) {
        throw new Error(error);
      };
      return XMLDOMErrorHandler2;
    })();
  }).call(XMLDOMErrorHandler);
  return XMLDOMErrorHandler$1.exports;
}
var XMLDOMStringList$1 = { exports: {} };
var XMLDOMStringList = XMLDOMStringList$1.exports;
var hasRequiredXMLDOMStringList;
function requireXMLDOMStringList() {
  if (hasRequiredXMLDOMStringList) return XMLDOMStringList$1.exports;
  hasRequiredXMLDOMStringList = 1;
  (function() {
    XMLDOMStringList$1.exports = (function() {
      function XMLDOMStringList2(arr) {
        this.arr = arr || [];
      }
      Object.defineProperty(XMLDOMStringList2.prototype, "length", {
        get: function() {
          return this.arr.length;
        }
      });
      XMLDOMStringList2.prototype.item = function(index2) {
        return this.arr[index2] || null;
      };
      XMLDOMStringList2.prototype.contains = function(str) {
        return this.arr.indexOf(str) !== -1;
      };
      return XMLDOMStringList2;
    })();
  }).call(XMLDOMStringList);
  return XMLDOMStringList$1.exports;
}
var XMLDOMConfiguration = XMLDOMConfiguration$1.exports;
var hasRequiredXMLDOMConfiguration;
function requireXMLDOMConfiguration() {
  if (hasRequiredXMLDOMConfiguration) return XMLDOMConfiguration$1.exports;
  hasRequiredXMLDOMConfiguration = 1;
  (function() {
    var XMLDOMErrorHandler2, XMLDOMStringList2;
    XMLDOMErrorHandler2 = requireXMLDOMErrorHandler();
    XMLDOMStringList2 = requireXMLDOMStringList();
    XMLDOMConfiguration$1.exports = (function() {
      function XMLDOMConfiguration2() {
        this.defaultParams = {
          "canonical-form": false,
          "cdata-sections": false,
          "comments": false,
          "datatype-normalization": false,
          "element-content-whitespace": true,
          "entities": true,
          "error-handler": new XMLDOMErrorHandler2(),
          "infoset": true,
          "validate-if-schema": false,
          "namespaces": true,
          "namespace-declarations": true,
          "normalize-characters": false,
          "schema-location": "",
          "schema-type": "",
          "split-cdata-sections": true,
          "validate": false,
          "well-formed": true
        };
        this.params = Object.create(this.defaultParams);
      }
      Object.defineProperty(XMLDOMConfiguration2.prototype, "parameterNames", {
        get: function() {
          return new XMLDOMStringList2(Object.keys(this.defaultParams));
        }
      });
      XMLDOMConfiguration2.prototype.getParameter = function(name) {
        if (this.params.hasOwnProperty(name)) {
          return this.params[name];
        } else {
          return null;
        }
      };
      XMLDOMConfiguration2.prototype.canSetParameter = function(name, value) {
        return true;
      };
      XMLDOMConfiguration2.prototype.setParameter = function(name, value) {
        if (value != null) {
          return this.params[name] = value;
        } else {
          return delete this.params[name];
        }
      };
      return XMLDOMConfiguration2;
    })();
  }).call(XMLDOMConfiguration);
  return XMLDOMConfiguration$1.exports;
}
var XMLNode$1 = { exports: {} };
var XMLElement$1 = { exports: {} };
var NodeType$1 = { exports: {} };
var NodeType = NodeType$1.exports;
var hasRequiredNodeType;
function requireNodeType() {
  if (hasRequiredNodeType) return NodeType$1.exports;
  hasRequiredNodeType = 1;
  (function() {
    NodeType$1.exports = {
      Element: 1,
      Attribute: 2,
      Text: 3,
      CData: 4,
      EntityReference: 5,
      EntityDeclaration: 6,
      ProcessingInstruction: 7,
      Comment: 8,
      Document: 9,
      DocType: 10,
      DocumentFragment: 11,
      NotationDeclaration: 12,
      Declaration: 201,
      Raw: 202,
      AttributeDeclaration: 203,
      ElementDeclaration: 204,
      Dummy: 205
    };
  }).call(NodeType);
  return NodeType$1.exports;
}
var XMLAttribute$1 = { exports: {} };
var XMLAttribute = XMLAttribute$1.exports;
var hasRequiredXMLAttribute;
function requireXMLAttribute() {
  if (hasRequiredXMLAttribute) return XMLAttribute$1.exports;
  hasRequiredXMLAttribute = 1;
  (function() {
    var NodeType2;
    NodeType2 = requireNodeType();
    requireXMLNode();
    XMLAttribute$1.exports = (function() {
      function XMLAttribute2(parent, name, value) {
        this.parent = parent;
        if (this.parent) {
          this.options = this.parent.options;
          this.stringify = this.parent.stringify;
        }
        if (name == null) {
          throw new Error("Missing attribute name. " + this.debugInfo(name));
        }
        this.name = this.stringify.name(name);
        this.value = this.stringify.attValue(value);
        this.type = NodeType2.Attribute;
        this.isId = false;
        this.schemaTypeInfo = null;
      }
      Object.defineProperty(XMLAttribute2.prototype, "nodeType", {
        get: function() {
          return this.type;
        }
      });
      Object.defineProperty(XMLAttribute2.prototype, "ownerElement", {
        get: function() {
          return this.parent;
        }
      });
      Object.defineProperty(XMLAttribute2.prototype, "textContent", {
        get: function() {
          return this.value;
        },
        set: function(value) {
          return this.value = value || "";
        }
      });
      Object.defineProperty(XMLAttribute2.prototype, "namespaceURI", {
        get: function() {
          return "";
        }
      });
      Object.defineProperty(XMLAttribute2.prototype, "prefix", {
        get: function() {
          return "";
        }
      });
      Object.defineProperty(XMLAttribute2.prototype, "localName", {
        get: function() {
          return this.name;
        }
      });
      Object.defineProperty(XMLAttribute2.prototype, "specified", {
        get: function() {
          return true;
        }
      });
      XMLAttribute2.prototype.clone = function() {
        return Object.create(this);
      };
      XMLAttribute2.prototype.toString = function(options) {
        return this.options.writer.attribute(this, this.options.writer.filterOptions(options));
      };
      XMLAttribute2.prototype.debugInfo = function(name) {
        name = name || this.name;
        if (name == null) {
          return "parent: <" + this.parent.name + ">";
        } else {
          return "attribute: {" + name + "}, parent: <" + this.parent.name + ">";
        }
      };
      XMLAttribute2.prototype.isEqualNode = function(node2) {
        if (node2.namespaceURI !== this.namespaceURI) {
          return false;
        }
        if (node2.prefix !== this.prefix) {
          return false;
        }
        if (node2.localName !== this.localName) {
          return false;
        }
        if (node2.value !== this.value) {
          return false;
        }
        return true;
      };
      return XMLAttribute2;
    })();
  }).call(XMLAttribute);
  return XMLAttribute$1.exports;
}
var XMLNamedNodeMap$1 = { exports: {} };
var XMLNamedNodeMap = XMLNamedNodeMap$1.exports;
var hasRequiredXMLNamedNodeMap;
function requireXMLNamedNodeMap() {
  if (hasRequiredXMLNamedNodeMap) return XMLNamedNodeMap$1.exports;
  hasRequiredXMLNamedNodeMap = 1;
  (function() {
    XMLNamedNodeMap$1.exports = (function() {
      function XMLNamedNodeMap2(nodes) {
        this.nodes = nodes;
      }
      Object.defineProperty(XMLNamedNodeMap2.prototype, "length", {
        get: function() {
          return Object.keys(this.nodes).length || 0;
        }
      });
      XMLNamedNodeMap2.prototype.clone = function() {
        return this.nodes = null;
      };
      XMLNamedNodeMap2.prototype.getNamedItem = function(name) {
        return this.nodes[name];
      };
      XMLNamedNodeMap2.prototype.setNamedItem = function(node2) {
        var oldNode;
        oldNode = this.nodes[node2.nodeName];
        this.nodes[node2.nodeName] = node2;
        return oldNode || null;
      };
      XMLNamedNodeMap2.prototype.removeNamedItem = function(name) {
        var oldNode;
        oldNode = this.nodes[name];
        delete this.nodes[name];
        return oldNode || null;
      };
      XMLNamedNodeMap2.prototype.item = function(index2) {
        return this.nodes[Object.keys(this.nodes)[index2]] || null;
      };
      XMLNamedNodeMap2.prototype.getNamedItemNS = function(namespaceURI, localName) {
        throw new Error("This DOM method is not implemented.");
      };
      XMLNamedNodeMap2.prototype.setNamedItemNS = function(node2) {
        throw new Error("This DOM method is not implemented.");
      };
      XMLNamedNodeMap2.prototype.removeNamedItemNS = function(namespaceURI, localName) {
        throw new Error("This DOM method is not implemented.");
      };
      return XMLNamedNodeMap2;
    })();
  }).call(XMLNamedNodeMap);
  return XMLNamedNodeMap$1.exports;
}
var XMLElement = XMLElement$1.exports;
var hasRequiredXMLElement;
function requireXMLElement() {
  if (hasRequiredXMLElement) return XMLElement$1.exports;
  hasRequiredXMLElement = 1;
  (function() {
    var NodeType2, XMLAttribute2, XMLNamedNodeMap2, XMLNode2, getValue, isFunction2, isObject2, ref, extend = function(child, parent) {
      for (var key in parent) {
        if (hasProp.call(parent, key)) child[key] = parent[key];
      }
      function ctor() {
        this.constructor = child;
      }
      ctor.prototype = parent.prototype;
      child.prototype = new ctor();
      child.__super__ = parent.prototype;
      return child;
    }, hasProp = {}.hasOwnProperty;
    ref = requireUtility(), isObject2 = ref.isObject, isFunction2 = ref.isFunction, getValue = ref.getValue;
    XMLNode2 = requireXMLNode();
    NodeType2 = requireNodeType();
    XMLAttribute2 = requireXMLAttribute();
    XMLNamedNodeMap2 = requireXMLNamedNodeMap();
    XMLElement$1.exports = (function(superClass) {
      extend(XMLElement2, superClass);
      function XMLElement2(parent, name, attributes) {
        var child, j, len, ref1;
        XMLElement2.__super__.constructor.call(this, parent);
        if (name == null) {
          throw new Error("Missing element name. " + this.debugInfo());
        }
        this.name = this.stringify.name(name);
        this.type = NodeType2.Element;
        this.attribs = {};
        this.schemaTypeInfo = null;
        if (attributes != null) {
          this.attribute(attributes);
        }
        if (parent.type === NodeType2.Document) {
          this.isRoot = true;
          this.documentObject = parent;
          parent.rootObject = this;
          if (parent.children) {
            ref1 = parent.children;
            for (j = 0, len = ref1.length; j < len; j++) {
              child = ref1[j];
              if (child.type === NodeType2.DocType) {
                child.name = this.name;
                break;
              }
            }
          }
        }
      }
      Object.defineProperty(XMLElement2.prototype, "tagName", {
        get: function() {
          return this.name;
        }
      });
      Object.defineProperty(XMLElement2.prototype, "namespaceURI", {
        get: function() {
          return "";
        }
      });
      Object.defineProperty(XMLElement2.prototype, "prefix", {
        get: function() {
          return "";
        }
      });
      Object.defineProperty(XMLElement2.prototype, "localName", {
        get: function() {
          return this.name;
        }
      });
      Object.defineProperty(XMLElement2.prototype, "id", {
        get: function() {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        }
      });
      Object.defineProperty(XMLElement2.prototype, "className", {
        get: function() {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        }
      });
      Object.defineProperty(XMLElement2.prototype, "classList", {
        get: function() {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        }
      });
      Object.defineProperty(XMLElement2.prototype, "attributes", {
        get: function() {
          if (!this.attributeMap || !this.attributeMap.nodes) {
            this.attributeMap = new XMLNamedNodeMap2(this.attribs);
          }
          return this.attributeMap;
        }
      });
      XMLElement2.prototype.clone = function() {
        var att, attName, clonedSelf, ref1;
        clonedSelf = Object.create(this);
        if (clonedSelf.isRoot) {
          clonedSelf.documentObject = null;
        }
        clonedSelf.attribs = {};
        ref1 = this.attribs;
        for (attName in ref1) {
          if (!hasProp.call(ref1, attName)) continue;
          att = ref1[attName];
          clonedSelf.attribs[attName] = att.clone();
        }
        clonedSelf.children = [];
        this.children.forEach(function(child) {
          var clonedChild;
          clonedChild = child.clone();
          clonedChild.parent = clonedSelf;
          return clonedSelf.children.push(clonedChild);
        });
        return clonedSelf;
      };
      XMLElement2.prototype.attribute = function(name, value) {
        var attName, attValue;
        if (name != null) {
          name = getValue(name);
        }
        if (isObject2(name)) {
          for (attName in name) {
            if (!hasProp.call(name, attName)) continue;
            attValue = name[attName];
            this.attribute(attName, attValue);
          }
        } else {
          if (isFunction2(value)) {
            value = value.apply();
          }
          if (this.options.keepNullAttributes && value == null) {
            this.attribs[name] = new XMLAttribute2(this, name, "");
          } else if (value != null) {
            this.attribs[name] = new XMLAttribute2(this, name, value);
          }
        }
        return this;
      };
      XMLElement2.prototype.removeAttribute = function(name) {
        var attName, j, len;
        if (name == null) {
          throw new Error("Missing attribute name. " + this.debugInfo());
        }
        name = getValue(name);
        if (Array.isArray(name)) {
          for (j = 0, len = name.length; j < len; j++) {
            attName = name[j];
            delete this.attribs[attName];
          }
        } else {
          delete this.attribs[name];
        }
        return this;
      };
      XMLElement2.prototype.toString = function(options) {
        return this.options.writer.element(this, this.options.writer.filterOptions(options));
      };
      XMLElement2.prototype.att = function(name, value) {
        return this.attribute(name, value);
      };
      XMLElement2.prototype.a = function(name, value) {
        return this.attribute(name, value);
      };
      XMLElement2.prototype.getAttribute = function(name) {
        if (this.attribs.hasOwnProperty(name)) {
          return this.attribs[name].value;
        } else {
          return null;
        }
      };
      XMLElement2.prototype.setAttribute = function(name, value) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      };
      XMLElement2.prototype.getAttributeNode = function(name) {
        if (this.attribs.hasOwnProperty(name)) {
          return this.attribs[name];
        } else {
          return null;
        }
      };
      XMLElement2.prototype.setAttributeNode = function(newAttr) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      };
      XMLElement2.prototype.removeAttributeNode = function(oldAttr) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      };
      XMLElement2.prototype.getElementsByTagName = function(name) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      };
      XMLElement2.prototype.getAttributeNS = function(namespaceURI, localName) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      };
      XMLElement2.prototype.setAttributeNS = function(namespaceURI, qualifiedName, value) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      };
      XMLElement2.prototype.removeAttributeNS = function(namespaceURI, localName) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      };
      XMLElement2.prototype.getAttributeNodeNS = function(namespaceURI, localName) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      };
      XMLElement2.prototype.setAttributeNodeNS = function(newAttr) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      };
      XMLElement2.prototype.getElementsByTagNameNS = function(namespaceURI, localName) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      };
      XMLElement2.prototype.hasAttribute = function(name) {
        return this.attribs.hasOwnProperty(name);
      };
      XMLElement2.prototype.hasAttributeNS = function(namespaceURI, localName) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      };
      XMLElement2.prototype.setIdAttribute = function(name, isId) {
        if (this.attribs.hasOwnProperty(name)) {
          return this.attribs[name].isId;
        } else {
          return isId;
        }
      };
      XMLElement2.prototype.setIdAttributeNS = function(namespaceURI, localName, isId) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      };
      XMLElement2.prototype.setIdAttributeNode = function(idAttr, isId) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      };
      XMLElement2.prototype.getElementsByTagName = function(tagname) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      };
      XMLElement2.prototype.getElementsByTagNameNS = function(namespaceURI, localName) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      };
      XMLElement2.prototype.getElementsByClassName = function(classNames) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      };
      XMLElement2.prototype.isEqualNode = function(node2) {
        var i, j, ref1;
        if (!XMLElement2.__super__.isEqualNode.apply(this, arguments).isEqualNode(node2)) {
          return false;
        }
        if (node2.namespaceURI !== this.namespaceURI) {
          return false;
        }
        if (node2.prefix !== this.prefix) {
          return false;
        }
        if (node2.localName !== this.localName) {
          return false;
        }
        if (node2.attribs.length !== this.attribs.length) {
          return false;
        }
        for (i = j = 0, ref1 = this.attribs.length - 1; 0 <= ref1 ? j <= ref1 : j >= ref1; i = 0 <= ref1 ? ++j : --j) {
          if (!this.attribs[i].isEqualNode(node2.attribs[i])) {
            return false;
          }
        }
        return true;
      };
      return XMLElement2;
    })(XMLNode2);
  }).call(XMLElement);
  return XMLElement$1.exports;
}
var XMLCData$1 = { exports: {} };
var XMLCharacterData$1 = { exports: {} };
var XMLCharacterData = XMLCharacterData$1.exports;
var hasRequiredXMLCharacterData;
function requireXMLCharacterData() {
  if (hasRequiredXMLCharacterData) return XMLCharacterData$1.exports;
  hasRequiredXMLCharacterData = 1;
  (function() {
    var XMLNode2, extend = function(child, parent) {
      for (var key in parent) {
        if (hasProp.call(parent, key)) child[key] = parent[key];
      }
      function ctor() {
        this.constructor = child;
      }
      ctor.prototype = parent.prototype;
      child.prototype = new ctor();
      child.__super__ = parent.prototype;
      return child;
    }, hasProp = {}.hasOwnProperty;
    XMLNode2 = requireXMLNode();
    XMLCharacterData$1.exports = (function(superClass) {
      extend(XMLCharacterData2, superClass);
      function XMLCharacterData2(parent) {
        XMLCharacterData2.__super__.constructor.call(this, parent);
        this.value = "";
      }
      Object.defineProperty(XMLCharacterData2.prototype, "data", {
        get: function() {
          return this.value;
        },
        set: function(value) {
          return this.value = value || "";
        }
      });
      Object.defineProperty(XMLCharacterData2.prototype, "length", {
        get: function() {
          return this.value.length;
        }
      });
      Object.defineProperty(XMLCharacterData2.prototype, "textContent", {
        get: function() {
          return this.value;
        },
        set: function(value) {
          return this.value = value || "";
        }
      });
      XMLCharacterData2.prototype.clone = function() {
        return Object.create(this);
      };
      XMLCharacterData2.prototype.substringData = function(offset, count) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      };
      XMLCharacterData2.prototype.appendData = function(arg) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      };
      XMLCharacterData2.prototype.insertData = function(offset, arg) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      };
      XMLCharacterData2.prototype.deleteData = function(offset, count) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      };
      XMLCharacterData2.prototype.replaceData = function(offset, count, arg) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      };
      XMLCharacterData2.prototype.isEqualNode = function(node2) {
        if (!XMLCharacterData2.__super__.isEqualNode.apply(this, arguments).isEqualNode(node2)) {
          return false;
        }
        if (node2.data !== this.data) {
          return false;
        }
        return true;
      };
      return XMLCharacterData2;
    })(XMLNode2);
  }).call(XMLCharacterData);
  return XMLCharacterData$1.exports;
}
var XMLCData = XMLCData$1.exports;
var hasRequiredXMLCData;
function requireXMLCData() {
  if (hasRequiredXMLCData) return XMLCData$1.exports;
  hasRequiredXMLCData = 1;
  (function() {
    var NodeType2, XMLCharacterData2, extend = function(child, parent) {
      for (var key in parent) {
        if (hasProp.call(parent, key)) child[key] = parent[key];
      }
      function ctor() {
        this.constructor = child;
      }
      ctor.prototype = parent.prototype;
      child.prototype = new ctor();
      child.__super__ = parent.prototype;
      return child;
    }, hasProp = {}.hasOwnProperty;
    NodeType2 = requireNodeType();
    XMLCharacterData2 = requireXMLCharacterData();
    XMLCData$1.exports = (function(superClass) {
      extend(XMLCData2, superClass);
      function XMLCData2(parent, text) {
        XMLCData2.__super__.constructor.call(this, parent);
        if (text == null) {
          throw new Error("Missing CDATA text. " + this.debugInfo());
        }
        this.name = "#cdata-section";
        this.type = NodeType2.CData;
        this.value = this.stringify.cdata(text);
      }
      XMLCData2.prototype.clone = function() {
        return Object.create(this);
      };
      XMLCData2.prototype.toString = function(options) {
        return this.options.writer.cdata(this, this.options.writer.filterOptions(options));
      };
      return XMLCData2;
    })(XMLCharacterData2);
  }).call(XMLCData);
  return XMLCData$1.exports;
}
var XMLComment$1 = { exports: {} };
var XMLComment = XMLComment$1.exports;
var hasRequiredXMLComment;
function requireXMLComment() {
  if (hasRequiredXMLComment) return XMLComment$1.exports;
  hasRequiredXMLComment = 1;
  (function() {
    var NodeType2, XMLCharacterData2, extend = function(child, parent) {
      for (var key in parent) {
        if (hasProp.call(parent, key)) child[key] = parent[key];
      }
      function ctor() {
        this.constructor = child;
      }
      ctor.prototype = parent.prototype;
      child.prototype = new ctor();
      child.__super__ = parent.prototype;
      return child;
    }, hasProp = {}.hasOwnProperty;
    NodeType2 = requireNodeType();
    XMLCharacterData2 = requireXMLCharacterData();
    XMLComment$1.exports = (function(superClass) {
      extend(XMLComment2, superClass);
      function XMLComment2(parent, text) {
        XMLComment2.__super__.constructor.call(this, parent);
        if (text == null) {
          throw new Error("Missing comment text. " + this.debugInfo());
        }
        this.name = "#comment";
        this.type = NodeType2.Comment;
        this.value = this.stringify.comment(text);
      }
      XMLComment2.prototype.clone = function() {
        return Object.create(this);
      };
      XMLComment2.prototype.toString = function(options) {
        return this.options.writer.comment(this, this.options.writer.filterOptions(options));
      };
      return XMLComment2;
    })(XMLCharacterData2);
  }).call(XMLComment);
  return XMLComment$1.exports;
}
var XMLDeclaration$1 = { exports: {} };
var XMLDeclaration = XMLDeclaration$1.exports;
var hasRequiredXMLDeclaration;
function requireXMLDeclaration() {
  if (hasRequiredXMLDeclaration) return XMLDeclaration$1.exports;
  hasRequiredXMLDeclaration = 1;
  (function() {
    var NodeType2, XMLNode2, isObject2, extend = function(child, parent) {
      for (var key in parent) {
        if (hasProp.call(parent, key)) child[key] = parent[key];
      }
      function ctor() {
        this.constructor = child;
      }
      ctor.prototype = parent.prototype;
      child.prototype = new ctor();
      child.__super__ = parent.prototype;
      return child;
    }, hasProp = {}.hasOwnProperty;
    isObject2 = requireUtility().isObject;
    XMLNode2 = requireXMLNode();
    NodeType2 = requireNodeType();
    XMLDeclaration$1.exports = (function(superClass) {
      extend(XMLDeclaration2, superClass);
      function XMLDeclaration2(parent, version, encoding, standalone) {
        var ref;
        XMLDeclaration2.__super__.constructor.call(this, parent);
        if (isObject2(version)) {
          ref = version, version = ref.version, encoding = ref.encoding, standalone = ref.standalone;
        }
        if (!version) {
          version = "1.0";
        }
        this.type = NodeType2.Declaration;
        this.version = this.stringify.xmlVersion(version);
        if (encoding != null) {
          this.encoding = this.stringify.xmlEncoding(encoding);
        }
        if (standalone != null) {
          this.standalone = this.stringify.xmlStandalone(standalone);
        }
      }
      XMLDeclaration2.prototype.toString = function(options) {
        return this.options.writer.declaration(this, this.options.writer.filterOptions(options));
      };
      return XMLDeclaration2;
    })(XMLNode2);
  }).call(XMLDeclaration);
  return XMLDeclaration$1.exports;
}
var XMLDocType$1 = { exports: {} };
var XMLDTDAttList$1 = { exports: {} };
var XMLDTDAttList = XMLDTDAttList$1.exports;
var hasRequiredXMLDTDAttList;
function requireXMLDTDAttList() {
  if (hasRequiredXMLDTDAttList) return XMLDTDAttList$1.exports;
  hasRequiredXMLDTDAttList = 1;
  (function() {
    var NodeType2, XMLNode2, extend = function(child, parent) {
      for (var key in parent) {
        if (hasProp.call(parent, key)) child[key] = parent[key];
      }
      function ctor() {
        this.constructor = child;
      }
      ctor.prototype = parent.prototype;
      child.prototype = new ctor();
      child.__super__ = parent.prototype;
      return child;
    }, hasProp = {}.hasOwnProperty;
    XMLNode2 = requireXMLNode();
    NodeType2 = requireNodeType();
    XMLDTDAttList$1.exports = (function(superClass) {
      extend(XMLDTDAttList2, superClass);
      function XMLDTDAttList2(parent, elementName, attributeName, attributeType, defaultValueType, defaultValue) {
        XMLDTDAttList2.__super__.constructor.call(this, parent);
        if (elementName == null) {
          throw new Error("Missing DTD element name. " + this.debugInfo());
        }
        if (attributeName == null) {
          throw new Error("Missing DTD attribute name. " + this.debugInfo(elementName));
        }
        if (!attributeType) {
          throw new Error("Missing DTD attribute type. " + this.debugInfo(elementName));
        }
        if (!defaultValueType) {
          throw new Error("Missing DTD attribute default. " + this.debugInfo(elementName));
        }
        if (defaultValueType.indexOf("#") !== 0) {
          defaultValueType = "#" + defaultValueType;
        }
        if (!defaultValueType.match(/^(#REQUIRED|#IMPLIED|#FIXED|#DEFAULT)$/)) {
          throw new Error("Invalid default value type; expected: #REQUIRED, #IMPLIED, #FIXED or #DEFAULT. " + this.debugInfo(elementName));
        }
        if (defaultValue && !defaultValueType.match(/^(#FIXED|#DEFAULT)$/)) {
          throw new Error("Default value only applies to #FIXED or #DEFAULT. " + this.debugInfo(elementName));
        }
        this.elementName = this.stringify.name(elementName);
        this.type = NodeType2.AttributeDeclaration;
        this.attributeName = this.stringify.name(attributeName);
        this.attributeType = this.stringify.dtdAttType(attributeType);
        if (defaultValue) {
          this.defaultValue = this.stringify.dtdAttDefault(defaultValue);
        }
        this.defaultValueType = defaultValueType;
      }
      XMLDTDAttList2.prototype.toString = function(options) {
        return this.options.writer.dtdAttList(this, this.options.writer.filterOptions(options));
      };
      return XMLDTDAttList2;
    })(XMLNode2);
  }).call(XMLDTDAttList);
  return XMLDTDAttList$1.exports;
}
var XMLDTDEntity$1 = { exports: {} };
var XMLDTDEntity = XMLDTDEntity$1.exports;
var hasRequiredXMLDTDEntity;
function requireXMLDTDEntity() {
  if (hasRequiredXMLDTDEntity) return XMLDTDEntity$1.exports;
  hasRequiredXMLDTDEntity = 1;
  (function() {
    var NodeType2, XMLNode2, isObject2, extend = function(child, parent) {
      for (var key in parent) {
        if (hasProp.call(parent, key)) child[key] = parent[key];
      }
      function ctor() {
        this.constructor = child;
      }
      ctor.prototype = parent.prototype;
      child.prototype = new ctor();
      child.__super__ = parent.prototype;
      return child;
    }, hasProp = {}.hasOwnProperty;
    isObject2 = requireUtility().isObject;
    XMLNode2 = requireXMLNode();
    NodeType2 = requireNodeType();
    XMLDTDEntity$1.exports = (function(superClass) {
      extend(XMLDTDEntity2, superClass);
      function XMLDTDEntity2(parent, pe, name, value) {
        XMLDTDEntity2.__super__.constructor.call(this, parent);
        if (name == null) {
          throw new Error("Missing DTD entity name. " + this.debugInfo(name));
        }
        if (value == null) {
          throw new Error("Missing DTD entity value. " + this.debugInfo(name));
        }
        this.pe = !!pe;
        this.name = this.stringify.name(name);
        this.type = NodeType2.EntityDeclaration;
        if (!isObject2(value)) {
          this.value = this.stringify.dtdEntityValue(value);
          this.internal = true;
        } else {
          if (!value.pubID && !value.sysID) {
            throw new Error("Public and/or system identifiers are required for an external entity. " + this.debugInfo(name));
          }
          if (value.pubID && !value.sysID) {
            throw new Error("System identifier is required for a public external entity. " + this.debugInfo(name));
          }
          this.internal = false;
          if (value.pubID != null) {
            this.pubID = this.stringify.dtdPubID(value.pubID);
          }
          if (value.sysID != null) {
            this.sysID = this.stringify.dtdSysID(value.sysID);
          }
          if (value.nData != null) {
            this.nData = this.stringify.dtdNData(value.nData);
          }
          if (this.pe && this.nData) {
            throw new Error("Notation declaration is not allowed in a parameter entity. " + this.debugInfo(name));
          }
        }
      }
      Object.defineProperty(XMLDTDEntity2.prototype, "publicId", {
        get: function() {
          return this.pubID;
        }
      });
      Object.defineProperty(XMLDTDEntity2.prototype, "systemId", {
        get: function() {
          return this.sysID;
        }
      });
      Object.defineProperty(XMLDTDEntity2.prototype, "notationName", {
        get: function() {
          return this.nData || null;
        }
      });
      Object.defineProperty(XMLDTDEntity2.prototype, "inputEncoding", {
        get: function() {
          return null;
        }
      });
      Object.defineProperty(XMLDTDEntity2.prototype, "xmlEncoding", {
        get: function() {
          return null;
        }
      });
      Object.defineProperty(XMLDTDEntity2.prototype, "xmlVersion", {
        get: function() {
          return null;
        }
      });
      XMLDTDEntity2.prototype.toString = function(options) {
        return this.options.writer.dtdEntity(this, this.options.writer.filterOptions(options));
      };
      return XMLDTDEntity2;
    })(XMLNode2);
  }).call(XMLDTDEntity);
  return XMLDTDEntity$1.exports;
}
var XMLDTDElement$1 = { exports: {} };
var XMLDTDElement = XMLDTDElement$1.exports;
var hasRequiredXMLDTDElement;
function requireXMLDTDElement() {
  if (hasRequiredXMLDTDElement) return XMLDTDElement$1.exports;
  hasRequiredXMLDTDElement = 1;
  (function() {
    var NodeType2, XMLNode2, extend = function(child, parent) {
      for (var key in parent) {
        if (hasProp.call(parent, key)) child[key] = parent[key];
      }
      function ctor() {
        this.constructor = child;
      }
      ctor.prototype = parent.prototype;
      child.prototype = new ctor();
      child.__super__ = parent.prototype;
      return child;
    }, hasProp = {}.hasOwnProperty;
    XMLNode2 = requireXMLNode();
    NodeType2 = requireNodeType();
    XMLDTDElement$1.exports = (function(superClass) {
      extend(XMLDTDElement2, superClass);
      function XMLDTDElement2(parent, name, value) {
        XMLDTDElement2.__super__.constructor.call(this, parent);
        if (name == null) {
          throw new Error("Missing DTD element name. " + this.debugInfo());
        }
        if (!value) {
          value = "(#PCDATA)";
        }
        if (Array.isArray(value)) {
          value = "(" + value.join(",") + ")";
        }
        this.name = this.stringify.name(name);
        this.type = NodeType2.ElementDeclaration;
        this.value = this.stringify.dtdElementValue(value);
      }
      XMLDTDElement2.prototype.toString = function(options) {
        return this.options.writer.dtdElement(this, this.options.writer.filterOptions(options));
      };
      return XMLDTDElement2;
    })(XMLNode2);
  }).call(XMLDTDElement);
  return XMLDTDElement$1.exports;
}
var XMLDTDNotation$1 = { exports: {} };
var XMLDTDNotation = XMLDTDNotation$1.exports;
var hasRequiredXMLDTDNotation;
function requireXMLDTDNotation() {
  if (hasRequiredXMLDTDNotation) return XMLDTDNotation$1.exports;
  hasRequiredXMLDTDNotation = 1;
  (function() {
    var NodeType2, XMLNode2, extend = function(child, parent) {
      for (var key in parent) {
        if (hasProp.call(parent, key)) child[key] = parent[key];
      }
      function ctor() {
        this.constructor = child;
      }
      ctor.prototype = parent.prototype;
      child.prototype = new ctor();
      child.__super__ = parent.prototype;
      return child;
    }, hasProp = {}.hasOwnProperty;
    XMLNode2 = requireXMLNode();
    NodeType2 = requireNodeType();
    XMLDTDNotation$1.exports = (function(superClass) {
      extend(XMLDTDNotation2, superClass);
      function XMLDTDNotation2(parent, name, value) {
        XMLDTDNotation2.__super__.constructor.call(this, parent);
        if (name == null) {
          throw new Error("Missing DTD notation name. " + this.debugInfo(name));
        }
        if (!value.pubID && !value.sysID) {
          throw new Error("Public or system identifiers are required for an external entity. " + this.debugInfo(name));
        }
        this.name = this.stringify.name(name);
        this.type = NodeType2.NotationDeclaration;
        if (value.pubID != null) {
          this.pubID = this.stringify.dtdPubID(value.pubID);
        }
        if (value.sysID != null) {
          this.sysID = this.stringify.dtdSysID(value.sysID);
        }
      }
      Object.defineProperty(XMLDTDNotation2.prototype, "publicId", {
        get: function() {
          return this.pubID;
        }
      });
      Object.defineProperty(XMLDTDNotation2.prototype, "systemId", {
        get: function() {
          return this.sysID;
        }
      });
      XMLDTDNotation2.prototype.toString = function(options) {
        return this.options.writer.dtdNotation(this, this.options.writer.filterOptions(options));
      };
      return XMLDTDNotation2;
    })(XMLNode2);
  }).call(XMLDTDNotation);
  return XMLDTDNotation$1.exports;
}
var XMLDocType = XMLDocType$1.exports;
var hasRequiredXMLDocType;
function requireXMLDocType() {
  if (hasRequiredXMLDocType) return XMLDocType$1.exports;
  hasRequiredXMLDocType = 1;
  (function() {
    var NodeType2, XMLDTDAttList2, XMLDTDElement2, XMLDTDEntity2, XMLDTDNotation2, XMLNamedNodeMap2, XMLNode2, isObject2, extend = function(child, parent) {
      for (var key in parent) {
        if (hasProp.call(parent, key)) child[key] = parent[key];
      }
      function ctor() {
        this.constructor = child;
      }
      ctor.prototype = parent.prototype;
      child.prototype = new ctor();
      child.__super__ = parent.prototype;
      return child;
    }, hasProp = {}.hasOwnProperty;
    isObject2 = requireUtility().isObject;
    XMLNode2 = requireXMLNode();
    NodeType2 = requireNodeType();
    XMLDTDAttList2 = requireXMLDTDAttList();
    XMLDTDEntity2 = requireXMLDTDEntity();
    XMLDTDElement2 = requireXMLDTDElement();
    XMLDTDNotation2 = requireXMLDTDNotation();
    XMLNamedNodeMap2 = requireXMLNamedNodeMap();
    XMLDocType$1.exports = (function(superClass) {
      extend(XMLDocType2, superClass);
      function XMLDocType2(parent, pubID, sysID) {
        var child, i, len, ref, ref1, ref2;
        XMLDocType2.__super__.constructor.call(this, parent);
        this.type = NodeType2.DocType;
        if (parent.children) {
          ref = parent.children;
          for (i = 0, len = ref.length; i < len; i++) {
            child = ref[i];
            if (child.type === NodeType2.Element) {
              this.name = child.name;
              break;
            }
          }
        }
        this.documentObject = parent;
        if (isObject2(pubID)) {
          ref1 = pubID, pubID = ref1.pubID, sysID = ref1.sysID;
        }
        if (sysID == null) {
          ref2 = [pubID, sysID], sysID = ref2[0], pubID = ref2[1];
        }
        if (pubID != null) {
          this.pubID = this.stringify.dtdPubID(pubID);
        }
        if (sysID != null) {
          this.sysID = this.stringify.dtdSysID(sysID);
        }
      }
      Object.defineProperty(XMLDocType2.prototype, "entities", {
        get: function() {
          var child, i, len, nodes, ref;
          nodes = {};
          ref = this.children;
          for (i = 0, len = ref.length; i < len; i++) {
            child = ref[i];
            if (child.type === NodeType2.EntityDeclaration && !child.pe) {
              nodes[child.name] = child;
            }
          }
          return new XMLNamedNodeMap2(nodes);
        }
      });
      Object.defineProperty(XMLDocType2.prototype, "notations", {
        get: function() {
          var child, i, len, nodes, ref;
          nodes = {};
          ref = this.children;
          for (i = 0, len = ref.length; i < len; i++) {
            child = ref[i];
            if (child.type === NodeType2.NotationDeclaration) {
              nodes[child.name] = child;
            }
          }
          return new XMLNamedNodeMap2(nodes);
        }
      });
      Object.defineProperty(XMLDocType2.prototype, "publicId", {
        get: function() {
          return this.pubID;
        }
      });
      Object.defineProperty(XMLDocType2.prototype, "systemId", {
        get: function() {
          return this.sysID;
        }
      });
      Object.defineProperty(XMLDocType2.prototype, "internalSubset", {
        get: function() {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        }
      });
      XMLDocType2.prototype.element = function(name, value) {
        var child;
        child = new XMLDTDElement2(this, name, value);
        this.children.push(child);
        return this;
      };
      XMLDocType2.prototype.attList = function(elementName, attributeName, attributeType, defaultValueType, defaultValue) {
        var child;
        child = new XMLDTDAttList2(this, elementName, attributeName, attributeType, defaultValueType, defaultValue);
        this.children.push(child);
        return this;
      };
      XMLDocType2.prototype.entity = function(name, value) {
        var child;
        child = new XMLDTDEntity2(this, false, name, value);
        this.children.push(child);
        return this;
      };
      XMLDocType2.prototype.pEntity = function(name, value) {
        var child;
        child = new XMLDTDEntity2(this, true, name, value);
        this.children.push(child);
        return this;
      };
      XMLDocType2.prototype.notation = function(name, value) {
        var child;
        child = new XMLDTDNotation2(this, name, value);
        this.children.push(child);
        return this;
      };
      XMLDocType2.prototype.toString = function(options) {
        return this.options.writer.docType(this, this.options.writer.filterOptions(options));
      };
      XMLDocType2.prototype.ele = function(name, value) {
        return this.element(name, value);
      };
      XMLDocType2.prototype.att = function(elementName, attributeName, attributeType, defaultValueType, defaultValue) {
        return this.attList(elementName, attributeName, attributeType, defaultValueType, defaultValue);
      };
      XMLDocType2.prototype.ent = function(name, value) {
        return this.entity(name, value);
      };
      XMLDocType2.prototype.pent = function(name, value) {
        return this.pEntity(name, value);
      };
      XMLDocType2.prototype.not = function(name, value) {
        return this.notation(name, value);
      };
      XMLDocType2.prototype.up = function() {
        return this.root() || this.documentObject;
      };
      XMLDocType2.prototype.isEqualNode = function(node2) {
        if (!XMLDocType2.__super__.isEqualNode.apply(this, arguments).isEqualNode(node2)) {
          return false;
        }
        if (node2.name !== this.name) {
          return false;
        }
        if (node2.publicId !== this.publicId) {
          return false;
        }
        if (node2.systemId !== this.systemId) {
          return false;
        }
        return true;
      };
      return XMLDocType2;
    })(XMLNode2);
  }).call(XMLDocType);
  return XMLDocType$1.exports;
}
var XMLRaw$1 = { exports: {} };
var XMLRaw = XMLRaw$1.exports;
var hasRequiredXMLRaw;
function requireXMLRaw() {
  if (hasRequiredXMLRaw) return XMLRaw$1.exports;
  hasRequiredXMLRaw = 1;
  (function() {
    var NodeType2, XMLNode2, extend = function(child, parent) {
      for (var key in parent) {
        if (hasProp.call(parent, key)) child[key] = parent[key];
      }
      function ctor() {
        this.constructor = child;
      }
      ctor.prototype = parent.prototype;
      child.prototype = new ctor();
      child.__super__ = parent.prototype;
      return child;
    }, hasProp = {}.hasOwnProperty;
    NodeType2 = requireNodeType();
    XMLNode2 = requireXMLNode();
    XMLRaw$1.exports = (function(superClass) {
      extend(XMLRaw2, superClass);
      function XMLRaw2(parent, text) {
        XMLRaw2.__super__.constructor.call(this, parent);
        if (text == null) {
          throw new Error("Missing raw text. " + this.debugInfo());
        }
        this.type = NodeType2.Raw;
        this.value = this.stringify.raw(text);
      }
      XMLRaw2.prototype.clone = function() {
        return Object.create(this);
      };
      XMLRaw2.prototype.toString = function(options) {
        return this.options.writer.raw(this, this.options.writer.filterOptions(options));
      };
      return XMLRaw2;
    })(XMLNode2);
  }).call(XMLRaw);
  return XMLRaw$1.exports;
}
var XMLText$1 = { exports: {} };
var XMLText = XMLText$1.exports;
var hasRequiredXMLText;
function requireXMLText() {
  if (hasRequiredXMLText) return XMLText$1.exports;
  hasRequiredXMLText = 1;
  (function() {
    var NodeType2, XMLCharacterData2, extend = function(child, parent) {
      for (var key in parent) {
        if (hasProp.call(parent, key)) child[key] = parent[key];
      }
      function ctor() {
        this.constructor = child;
      }
      ctor.prototype = parent.prototype;
      child.prototype = new ctor();
      child.__super__ = parent.prototype;
      return child;
    }, hasProp = {}.hasOwnProperty;
    NodeType2 = requireNodeType();
    XMLCharacterData2 = requireXMLCharacterData();
    XMLText$1.exports = (function(superClass) {
      extend(XMLText2, superClass);
      function XMLText2(parent, text) {
        XMLText2.__super__.constructor.call(this, parent);
        if (text == null) {
          throw new Error("Missing element text. " + this.debugInfo());
        }
        this.name = "#text";
        this.type = NodeType2.Text;
        this.value = this.stringify.text(text);
      }
      Object.defineProperty(XMLText2.prototype, "isElementContentWhitespace", {
        get: function() {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        }
      });
      Object.defineProperty(XMLText2.prototype, "wholeText", {
        get: function() {
          var next, prev, str;
          str = "";
          prev = this.previousSibling;
          while (prev) {
            str = prev.data + str;
            prev = prev.previousSibling;
          }
          str += this.data;
          next = this.nextSibling;
          while (next) {
            str = str + next.data;
            next = next.nextSibling;
          }
          return str;
        }
      });
      XMLText2.prototype.clone = function() {
        return Object.create(this);
      };
      XMLText2.prototype.toString = function(options) {
        return this.options.writer.text(this, this.options.writer.filterOptions(options));
      };
      XMLText2.prototype.splitText = function(offset) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      };
      XMLText2.prototype.replaceWholeText = function(content) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      };
      return XMLText2;
    })(XMLCharacterData2);
  }).call(XMLText);
  return XMLText$1.exports;
}
var XMLProcessingInstruction$1 = { exports: {} };
var XMLProcessingInstruction = XMLProcessingInstruction$1.exports;
var hasRequiredXMLProcessingInstruction;
function requireXMLProcessingInstruction() {
  if (hasRequiredXMLProcessingInstruction) return XMLProcessingInstruction$1.exports;
  hasRequiredXMLProcessingInstruction = 1;
  (function() {
    var NodeType2, XMLCharacterData2, extend = function(child, parent) {
      for (var key in parent) {
        if (hasProp.call(parent, key)) child[key] = parent[key];
      }
      function ctor() {
        this.constructor = child;
      }
      ctor.prototype = parent.prototype;
      child.prototype = new ctor();
      child.__super__ = parent.prototype;
      return child;
    }, hasProp = {}.hasOwnProperty;
    NodeType2 = requireNodeType();
    XMLCharacterData2 = requireXMLCharacterData();
    XMLProcessingInstruction$1.exports = (function(superClass) {
      extend(XMLProcessingInstruction2, superClass);
      function XMLProcessingInstruction2(parent, target, value) {
        XMLProcessingInstruction2.__super__.constructor.call(this, parent);
        if (target == null) {
          throw new Error("Missing instruction target. " + this.debugInfo());
        }
        this.type = NodeType2.ProcessingInstruction;
        this.target = this.stringify.insTarget(target);
        this.name = this.target;
        if (value) {
          this.value = this.stringify.insValue(value);
        }
      }
      XMLProcessingInstruction2.prototype.clone = function() {
        return Object.create(this);
      };
      XMLProcessingInstruction2.prototype.toString = function(options) {
        return this.options.writer.processingInstruction(this, this.options.writer.filterOptions(options));
      };
      XMLProcessingInstruction2.prototype.isEqualNode = function(node2) {
        if (!XMLProcessingInstruction2.__super__.isEqualNode.apply(this, arguments).isEqualNode(node2)) {
          return false;
        }
        if (node2.target !== this.target) {
          return false;
        }
        return true;
      };
      return XMLProcessingInstruction2;
    })(XMLCharacterData2);
  }).call(XMLProcessingInstruction);
  return XMLProcessingInstruction$1.exports;
}
var XMLDummy$1 = { exports: {} };
var XMLDummy = XMLDummy$1.exports;
var hasRequiredXMLDummy;
function requireXMLDummy() {
  if (hasRequiredXMLDummy) return XMLDummy$1.exports;
  hasRequiredXMLDummy = 1;
  (function() {
    var NodeType2, XMLNode2, extend = function(child, parent) {
      for (var key in parent) {
        if (hasProp.call(parent, key)) child[key] = parent[key];
      }
      function ctor() {
        this.constructor = child;
      }
      ctor.prototype = parent.prototype;
      child.prototype = new ctor();
      child.__super__ = parent.prototype;
      return child;
    }, hasProp = {}.hasOwnProperty;
    XMLNode2 = requireXMLNode();
    NodeType2 = requireNodeType();
    XMLDummy$1.exports = (function(superClass) {
      extend(XMLDummy2, superClass);
      function XMLDummy2(parent) {
        XMLDummy2.__super__.constructor.call(this, parent);
        this.type = NodeType2.Dummy;
      }
      XMLDummy2.prototype.clone = function() {
        return Object.create(this);
      };
      XMLDummy2.prototype.toString = function(options) {
        return "";
      };
      return XMLDummy2;
    })(XMLNode2);
  }).call(XMLDummy);
  return XMLDummy$1.exports;
}
var XMLNodeList$1 = { exports: {} };
var XMLNodeList = XMLNodeList$1.exports;
var hasRequiredXMLNodeList;
function requireXMLNodeList() {
  if (hasRequiredXMLNodeList) return XMLNodeList$1.exports;
  hasRequiredXMLNodeList = 1;
  (function() {
    XMLNodeList$1.exports = (function() {
      function XMLNodeList2(nodes) {
        this.nodes = nodes;
      }
      Object.defineProperty(XMLNodeList2.prototype, "length", {
        get: function() {
          return this.nodes.length || 0;
        }
      });
      XMLNodeList2.prototype.clone = function() {
        return this.nodes = null;
      };
      XMLNodeList2.prototype.item = function(index2) {
        return this.nodes[index2] || null;
      };
      return XMLNodeList2;
    })();
  }).call(XMLNodeList);
  return XMLNodeList$1.exports;
}
var DocumentPosition$1 = { exports: {} };
var DocumentPosition = DocumentPosition$1.exports;
var hasRequiredDocumentPosition;
function requireDocumentPosition() {
  if (hasRequiredDocumentPosition) return DocumentPosition$1.exports;
  hasRequiredDocumentPosition = 1;
  (function() {
    DocumentPosition$1.exports = {
      Disconnected: 1,
      Preceding: 2,
      Following: 4,
      Contains: 8,
      ContainedBy: 16,
      ImplementationSpecific: 32
    };
  }).call(DocumentPosition);
  return DocumentPosition$1.exports;
}
var XMLNode = XMLNode$1.exports;
var hasRequiredXMLNode;
function requireXMLNode() {
  if (hasRequiredXMLNode) return XMLNode$1.exports;
  hasRequiredXMLNode = 1;
  (function() {
    var DocumentPosition2, NodeType2, XMLCData2, XMLComment2, XMLDeclaration2, XMLDocType2, XMLDummy2, XMLElement2, XMLNodeList2, XMLProcessingInstruction2, XMLRaw2, XMLText2, getValue, isEmpty2, isFunction2, isObject2, ref1, hasProp = {}.hasOwnProperty;
    ref1 = requireUtility(), isObject2 = ref1.isObject, isFunction2 = ref1.isFunction, isEmpty2 = ref1.isEmpty, getValue = ref1.getValue;
    XMLElement2 = null;
    XMLCData2 = null;
    XMLComment2 = null;
    XMLDeclaration2 = null;
    XMLDocType2 = null;
    XMLRaw2 = null;
    XMLText2 = null;
    XMLProcessingInstruction2 = null;
    XMLDummy2 = null;
    NodeType2 = null;
    XMLNodeList2 = null;
    DocumentPosition2 = null;
    XMLNode$1.exports = (function() {
      function XMLNode2(parent1) {
        this.parent = parent1;
        if (this.parent) {
          this.options = this.parent.options;
          this.stringify = this.parent.stringify;
        }
        this.value = null;
        this.children = [];
        this.baseURI = null;
        if (!XMLElement2) {
          XMLElement2 = requireXMLElement();
          XMLCData2 = requireXMLCData();
          XMLComment2 = requireXMLComment();
          XMLDeclaration2 = requireXMLDeclaration();
          XMLDocType2 = requireXMLDocType();
          XMLRaw2 = requireXMLRaw();
          XMLText2 = requireXMLText();
          XMLProcessingInstruction2 = requireXMLProcessingInstruction();
          XMLDummy2 = requireXMLDummy();
          NodeType2 = requireNodeType();
          XMLNodeList2 = requireXMLNodeList();
          requireXMLNamedNodeMap();
          DocumentPosition2 = requireDocumentPosition();
        }
      }
      Object.defineProperty(XMLNode2.prototype, "nodeName", {
        get: function() {
          return this.name;
        }
      });
      Object.defineProperty(XMLNode2.prototype, "nodeType", {
        get: function() {
          return this.type;
        }
      });
      Object.defineProperty(XMLNode2.prototype, "nodeValue", {
        get: function() {
          return this.value;
        }
      });
      Object.defineProperty(XMLNode2.prototype, "parentNode", {
        get: function() {
          return this.parent;
        }
      });
      Object.defineProperty(XMLNode2.prototype, "childNodes", {
        get: function() {
          if (!this.childNodeList || !this.childNodeList.nodes) {
            this.childNodeList = new XMLNodeList2(this.children);
          }
          return this.childNodeList;
        }
      });
      Object.defineProperty(XMLNode2.prototype, "firstChild", {
        get: function() {
          return this.children[0] || null;
        }
      });
      Object.defineProperty(XMLNode2.prototype, "lastChild", {
        get: function() {
          return this.children[this.children.length - 1] || null;
        }
      });
      Object.defineProperty(XMLNode2.prototype, "previousSibling", {
        get: function() {
          var i;
          i = this.parent.children.indexOf(this);
          return this.parent.children[i - 1] || null;
        }
      });
      Object.defineProperty(XMLNode2.prototype, "nextSibling", {
        get: function() {
          var i;
          i = this.parent.children.indexOf(this);
          return this.parent.children[i + 1] || null;
        }
      });
      Object.defineProperty(XMLNode2.prototype, "ownerDocument", {
        get: function() {
          return this.document() || null;
        }
      });
      Object.defineProperty(XMLNode2.prototype, "textContent", {
        get: function() {
          var child, j, len, ref2, str;
          if (this.nodeType === NodeType2.Element || this.nodeType === NodeType2.DocumentFragment) {
            str = "";
            ref2 = this.children;
            for (j = 0, len = ref2.length; j < len; j++) {
              child = ref2[j];
              if (child.textContent) {
                str += child.textContent;
              }
            }
            return str;
          } else {
            return null;
          }
        },
        set: function(value) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        }
      });
      XMLNode2.prototype.setParent = function(parent) {
        var child, j, len, ref2, results;
        this.parent = parent;
        if (parent) {
          this.options = parent.options;
          this.stringify = parent.stringify;
        }
        ref2 = this.children;
        results = [];
        for (j = 0, len = ref2.length; j < len; j++) {
          child = ref2[j];
          results.push(child.setParent(this));
        }
        return results;
      };
      XMLNode2.prototype.element = function(name, attributes, text) {
        var childNode, item, j, k, key, lastChild, len, len1, ref2, ref3, val;
        lastChild = null;
        if (attributes === null && text == null) {
          ref2 = [{}, null], attributes = ref2[0], text = ref2[1];
        }
        if (attributes == null) {
          attributes = {};
        }
        attributes = getValue(attributes);
        if (!isObject2(attributes)) {
          ref3 = [attributes, text], text = ref3[0], attributes = ref3[1];
        }
        if (name != null) {
          name = getValue(name);
        }
        if (Array.isArray(name)) {
          for (j = 0, len = name.length; j < len; j++) {
            item = name[j];
            lastChild = this.element(item);
          }
        } else if (isFunction2(name)) {
          lastChild = this.element(name.apply());
        } else if (isObject2(name)) {
          for (key in name) {
            if (!hasProp.call(name, key)) continue;
            val = name[key];
            if (isFunction2(val)) {
              val = val.apply();
            }
            if (!this.options.ignoreDecorators && this.stringify.convertAttKey && key.indexOf(this.stringify.convertAttKey) === 0) {
              lastChild = this.attribute(key.substr(this.stringify.convertAttKey.length), val);
            } else if (!this.options.separateArrayItems && Array.isArray(val) && isEmpty2(val)) {
              lastChild = this.dummy();
            } else if (isObject2(val) && isEmpty2(val)) {
              lastChild = this.element(key);
            } else if (!this.options.keepNullNodes && val == null) {
              lastChild = this.dummy();
            } else if (!this.options.separateArrayItems && Array.isArray(val)) {
              for (k = 0, len1 = val.length; k < len1; k++) {
                item = val[k];
                childNode = {};
                childNode[key] = item;
                lastChild = this.element(childNode);
              }
            } else if (isObject2(val)) {
              if (!this.options.ignoreDecorators && this.stringify.convertTextKey && key.indexOf(this.stringify.convertTextKey) === 0) {
                lastChild = this.element(val);
              } else {
                lastChild = this.element(key);
                lastChild.element(val);
              }
            } else {
              lastChild = this.element(key, val);
            }
          }
        } else if (!this.options.keepNullNodes && text === null) {
          lastChild = this.dummy();
        } else {
          if (!this.options.ignoreDecorators && this.stringify.convertTextKey && name.indexOf(this.stringify.convertTextKey) === 0) {
            lastChild = this.text(text);
          } else if (!this.options.ignoreDecorators && this.stringify.convertCDataKey && name.indexOf(this.stringify.convertCDataKey) === 0) {
            lastChild = this.cdata(text);
          } else if (!this.options.ignoreDecorators && this.stringify.convertCommentKey && name.indexOf(this.stringify.convertCommentKey) === 0) {
            lastChild = this.comment(text);
          } else if (!this.options.ignoreDecorators && this.stringify.convertRawKey && name.indexOf(this.stringify.convertRawKey) === 0) {
            lastChild = this.raw(text);
          } else if (!this.options.ignoreDecorators && this.stringify.convertPIKey && name.indexOf(this.stringify.convertPIKey) === 0) {
            lastChild = this.instruction(name.substr(this.stringify.convertPIKey.length), text);
          } else {
            lastChild = this.node(name, attributes, text);
          }
        }
        if (lastChild == null) {
          throw new Error("Could not create any elements with: " + name + ". " + this.debugInfo());
        }
        return lastChild;
      };
      XMLNode2.prototype.insertBefore = function(name, attributes, text) {
        var child, i, newChild, refChild, removed;
        if (name != null ? name.type : void 0) {
          newChild = name;
          refChild = attributes;
          newChild.setParent(this);
          if (refChild) {
            i = children.indexOf(refChild);
            removed = children.splice(i);
            children.push(newChild);
            Array.prototype.push.apply(children, removed);
          } else {
            children.push(newChild);
          }
          return newChild;
        } else {
          if (this.isRoot) {
            throw new Error("Cannot insert elements at root level. " + this.debugInfo(name));
          }
          i = this.parent.children.indexOf(this);
          removed = this.parent.children.splice(i);
          child = this.parent.element(name, attributes, text);
          Array.prototype.push.apply(this.parent.children, removed);
          return child;
        }
      };
      XMLNode2.prototype.insertAfter = function(name, attributes, text) {
        var child, i, removed;
        if (this.isRoot) {
          throw new Error("Cannot insert elements at root level. " + this.debugInfo(name));
        }
        i = this.parent.children.indexOf(this);
        removed = this.parent.children.splice(i + 1);
        child = this.parent.element(name, attributes, text);
        Array.prototype.push.apply(this.parent.children, removed);
        return child;
      };
      XMLNode2.prototype.remove = function() {
        var i;
        if (this.isRoot) {
          throw new Error("Cannot remove the root element. " + this.debugInfo());
        }
        i = this.parent.children.indexOf(this);
        [].splice.apply(this.parent.children, [i, i - i + 1].concat([]));
        return this.parent;
      };
      XMLNode2.prototype.node = function(name, attributes, text) {
        var child, ref2;
        if (name != null) {
          name = getValue(name);
        }
        attributes || (attributes = {});
        attributes = getValue(attributes);
        if (!isObject2(attributes)) {
          ref2 = [attributes, text], text = ref2[0], attributes = ref2[1];
        }
        child = new XMLElement2(this, name, attributes);
        if (text != null) {
          child.text(text);
        }
        this.children.push(child);
        return child;
      };
      XMLNode2.prototype.text = function(value) {
        var child;
        if (isObject2(value)) {
          this.element(value);
        }
        child = new XMLText2(this, value);
        this.children.push(child);
        return this;
      };
      XMLNode2.prototype.cdata = function(value) {
        var child;
        child = new XMLCData2(this, value);
        this.children.push(child);
        return this;
      };
      XMLNode2.prototype.comment = function(value) {
        var child;
        child = new XMLComment2(this, value);
        this.children.push(child);
        return this;
      };
      XMLNode2.prototype.commentBefore = function(value) {
        var i, removed;
        i = this.parent.children.indexOf(this);
        removed = this.parent.children.splice(i);
        this.parent.comment(value);
        Array.prototype.push.apply(this.parent.children, removed);
        return this;
      };
      XMLNode2.prototype.commentAfter = function(value) {
        var i, removed;
        i = this.parent.children.indexOf(this);
        removed = this.parent.children.splice(i + 1);
        this.parent.comment(value);
        Array.prototype.push.apply(this.parent.children, removed);
        return this;
      };
      XMLNode2.prototype.raw = function(value) {
        var child;
        child = new XMLRaw2(this, value);
        this.children.push(child);
        return this;
      };
      XMLNode2.prototype.dummy = function() {
        var child;
        child = new XMLDummy2(this);
        return child;
      };
      XMLNode2.prototype.instruction = function(target, value) {
        var insTarget, insValue, instruction, j, len;
        if (target != null) {
          target = getValue(target);
        }
        if (value != null) {
          value = getValue(value);
        }
        if (Array.isArray(target)) {
          for (j = 0, len = target.length; j < len; j++) {
            insTarget = target[j];
            this.instruction(insTarget);
          }
        } else if (isObject2(target)) {
          for (insTarget in target) {
            if (!hasProp.call(target, insTarget)) continue;
            insValue = target[insTarget];
            this.instruction(insTarget, insValue);
          }
        } else {
          if (isFunction2(value)) {
            value = value.apply();
          }
          instruction = new XMLProcessingInstruction2(this, target, value);
          this.children.push(instruction);
        }
        return this;
      };
      XMLNode2.prototype.instructionBefore = function(target, value) {
        var i, removed;
        i = this.parent.children.indexOf(this);
        removed = this.parent.children.splice(i);
        this.parent.instruction(target, value);
        Array.prototype.push.apply(this.parent.children, removed);
        return this;
      };
      XMLNode2.prototype.instructionAfter = function(target, value) {
        var i, removed;
        i = this.parent.children.indexOf(this);
        removed = this.parent.children.splice(i + 1);
        this.parent.instruction(target, value);
        Array.prototype.push.apply(this.parent.children, removed);
        return this;
      };
      XMLNode2.prototype.declaration = function(version, encoding, standalone) {
        var doc, xmldec;
        doc = this.document();
        xmldec = new XMLDeclaration2(doc, version, encoding, standalone);
        if (doc.children.length === 0) {
          doc.children.unshift(xmldec);
        } else if (doc.children[0].type === NodeType2.Declaration) {
          doc.children[0] = xmldec;
        } else {
          doc.children.unshift(xmldec);
        }
        return doc.root() || doc;
      };
      XMLNode2.prototype.dtd = function(pubID, sysID) {
        var child, doc, doctype, i, j, k, len, len1, ref2, ref3;
        doc = this.document();
        doctype = new XMLDocType2(doc, pubID, sysID);
        ref2 = doc.children;
        for (i = j = 0, len = ref2.length; j < len; i = ++j) {
          child = ref2[i];
          if (child.type === NodeType2.DocType) {
            doc.children[i] = doctype;
            return doctype;
          }
        }
        ref3 = doc.children;
        for (i = k = 0, len1 = ref3.length; k < len1; i = ++k) {
          child = ref3[i];
          if (child.isRoot) {
            doc.children.splice(i, 0, doctype);
            return doctype;
          }
        }
        doc.children.push(doctype);
        return doctype;
      };
      XMLNode2.prototype.up = function() {
        if (this.isRoot) {
          throw new Error("The root node has no parent. Use doc() if you need to get the document object.");
        }
        return this.parent;
      };
      XMLNode2.prototype.root = function() {
        var node2;
        node2 = this;
        while (node2) {
          if (node2.type === NodeType2.Document) {
            return node2.rootObject;
          } else if (node2.isRoot) {
            return node2;
          } else {
            node2 = node2.parent;
          }
        }
      };
      XMLNode2.prototype.document = function() {
        var node2;
        node2 = this;
        while (node2) {
          if (node2.type === NodeType2.Document) {
            return node2;
          } else {
            node2 = node2.parent;
          }
        }
      };
      XMLNode2.prototype.end = function(options) {
        return this.document().end(options);
      };
      XMLNode2.prototype.prev = function() {
        var i;
        i = this.parent.children.indexOf(this);
        if (i < 1) {
          throw new Error("Already at the first node. " + this.debugInfo());
        }
        return this.parent.children[i - 1];
      };
      XMLNode2.prototype.next = function() {
        var i;
        i = this.parent.children.indexOf(this);
        if (i === -1 || i === this.parent.children.length - 1) {
          throw new Error("Already at the last node. " + this.debugInfo());
        }
        return this.parent.children[i + 1];
      };
      XMLNode2.prototype.importDocument = function(doc) {
        var clonedRoot;
        clonedRoot = doc.root().clone();
        clonedRoot.parent = this;
        clonedRoot.isRoot = false;
        this.children.push(clonedRoot);
        return this;
      };
      XMLNode2.prototype.debugInfo = function(name) {
        var ref2, ref3;
        name = name || this.name;
        if (name == null && !((ref2 = this.parent) != null ? ref2.name : void 0)) {
          return "";
        } else if (name == null) {
          return "parent: <" + this.parent.name + ">";
        } else if (!((ref3 = this.parent) != null ? ref3.name : void 0)) {
          return "node: <" + name + ">";
        } else {
          return "node: <" + name + ">, parent: <" + this.parent.name + ">";
        }
      };
      XMLNode2.prototype.ele = function(name, attributes, text) {
        return this.element(name, attributes, text);
      };
      XMLNode2.prototype.nod = function(name, attributes, text) {
        return this.node(name, attributes, text);
      };
      XMLNode2.prototype.txt = function(value) {
        return this.text(value);
      };
      XMLNode2.prototype.dat = function(value) {
        return this.cdata(value);
      };
      XMLNode2.prototype.com = function(value) {
        return this.comment(value);
      };
      XMLNode2.prototype.ins = function(target, value) {
        return this.instruction(target, value);
      };
      XMLNode2.prototype.doc = function() {
        return this.document();
      };
      XMLNode2.prototype.dec = function(version, encoding, standalone) {
        return this.declaration(version, encoding, standalone);
      };
      XMLNode2.prototype.e = function(name, attributes, text) {
        return this.element(name, attributes, text);
      };
      XMLNode2.prototype.n = function(name, attributes, text) {
        return this.node(name, attributes, text);
      };
      XMLNode2.prototype.t = function(value) {
        return this.text(value);
      };
      XMLNode2.prototype.d = function(value) {
        return this.cdata(value);
      };
      XMLNode2.prototype.c = function(value) {
        return this.comment(value);
      };
      XMLNode2.prototype.r = function(value) {
        return this.raw(value);
      };
      XMLNode2.prototype.i = function(target, value) {
        return this.instruction(target, value);
      };
      XMLNode2.prototype.u = function() {
        return this.up();
      };
      XMLNode2.prototype.importXMLBuilder = function(doc) {
        return this.importDocument(doc);
      };
      XMLNode2.prototype.replaceChild = function(newChild, oldChild) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      };
      XMLNode2.prototype.removeChild = function(oldChild) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      };
      XMLNode2.prototype.appendChild = function(newChild) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      };
      XMLNode2.prototype.hasChildNodes = function() {
        return this.children.length !== 0;
      };
      XMLNode2.prototype.cloneNode = function(deep) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      };
      XMLNode2.prototype.normalize = function() {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      };
      XMLNode2.prototype.isSupported = function(feature, version) {
        return true;
      };
      XMLNode2.prototype.hasAttributes = function() {
        return this.attribs.length !== 0;
      };
      XMLNode2.prototype.compareDocumentPosition = function(other) {
        var ref, res;
        ref = this;
        if (ref === other) {
          return 0;
        } else if (this.document() !== other.document()) {
          res = DocumentPosition2.Disconnected | DocumentPosition2.ImplementationSpecific;
          if (Math.random() < 0.5) {
            res |= DocumentPosition2.Preceding;
          } else {
            res |= DocumentPosition2.Following;
          }
          return res;
        } else if (ref.isAncestor(other)) {
          return DocumentPosition2.Contains | DocumentPosition2.Preceding;
        } else if (ref.isDescendant(other)) {
          return DocumentPosition2.Contains | DocumentPosition2.Following;
        } else if (ref.isPreceding(other)) {
          return DocumentPosition2.Preceding;
        } else {
          return DocumentPosition2.Following;
        }
      };
      XMLNode2.prototype.isSameNode = function(other) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      };
      XMLNode2.prototype.lookupPrefix = function(namespaceURI) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      };
      XMLNode2.prototype.isDefaultNamespace = function(namespaceURI) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      };
      XMLNode2.prototype.lookupNamespaceURI = function(prefix) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      };
      XMLNode2.prototype.isEqualNode = function(node2) {
        var i, j, ref2;
        if (node2.nodeType !== this.nodeType) {
          return false;
        }
        if (node2.children.length !== this.children.length) {
          return false;
        }
        for (i = j = 0, ref2 = this.children.length - 1; 0 <= ref2 ? j <= ref2 : j >= ref2; i = 0 <= ref2 ? ++j : --j) {
          if (!this.children[i].isEqualNode(node2.children[i])) {
            return false;
          }
        }
        return true;
      };
      XMLNode2.prototype.getFeature = function(feature, version) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      };
      XMLNode2.prototype.setUserData = function(key, data, handler) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      };
      XMLNode2.prototype.getUserData = function(key) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      };
      XMLNode2.prototype.contains = function(other) {
        if (!other) {
          return false;
        }
        return other === this || this.isDescendant(other);
      };
      XMLNode2.prototype.isDescendant = function(node2) {
        var child, isDescendantChild, j, len, ref2;
        ref2 = this.children;
        for (j = 0, len = ref2.length; j < len; j++) {
          child = ref2[j];
          if (node2 === child) {
            return true;
          }
          isDescendantChild = child.isDescendant(node2);
          if (isDescendantChild) {
            return true;
          }
        }
        return false;
      };
      XMLNode2.prototype.isAncestor = function(node2) {
        return node2.isDescendant(this);
      };
      XMLNode2.prototype.isPreceding = function(node2) {
        var nodePos, thisPos;
        nodePos = this.treePosition(node2);
        thisPos = this.treePosition(this);
        if (nodePos === -1 || thisPos === -1) {
          return false;
        } else {
          return nodePos < thisPos;
        }
      };
      XMLNode2.prototype.isFollowing = function(node2) {
        var nodePos, thisPos;
        nodePos = this.treePosition(node2);
        thisPos = this.treePosition(this);
        if (nodePos === -1 || thisPos === -1) {
          return false;
        } else {
          return nodePos > thisPos;
        }
      };
      XMLNode2.prototype.treePosition = function(node2) {
        var found, pos;
        pos = 0;
        found = false;
        this.foreachTreeNode(this.document(), function(childNode) {
          pos++;
          if (!found && childNode === node2) {
            return found = true;
          }
        });
        if (found) {
          return pos;
        } else {
          return -1;
        }
      };
      XMLNode2.prototype.foreachTreeNode = function(node2, func) {
        var child, j, len, ref2, res;
        node2 || (node2 = this.document());
        ref2 = node2.children;
        for (j = 0, len = ref2.length; j < len; j++) {
          child = ref2[j];
          if (res = func(child)) {
            return res;
          } else {
            res = this.foreachTreeNode(child, func);
            if (res) {
              return res;
            }
          }
        }
      };
      return XMLNode2;
    })();
  }).call(XMLNode);
  return XMLNode$1.exports;
}
var XMLStringifier$1 = { exports: {} };
var XMLStringifier = XMLStringifier$1.exports;
var hasRequiredXMLStringifier;
function requireXMLStringifier() {
  if (hasRequiredXMLStringifier) return XMLStringifier$1.exports;
  hasRequiredXMLStringifier = 1;
  (function() {
    var bind = function(fn, me) {
      return function() {
        return fn.apply(me, arguments);
      };
    }, hasProp = {}.hasOwnProperty;
    XMLStringifier$1.exports = (function() {
      function XMLStringifier2(options) {
        this.assertLegalName = bind(this.assertLegalName, this);
        this.assertLegalChar = bind(this.assertLegalChar, this);
        var key, ref, value;
        options || (options = {});
        this.options = options;
        if (!this.options.version) {
          this.options.version = "1.0";
        }
        ref = options.stringify || {};
        for (key in ref) {
          if (!hasProp.call(ref, key)) continue;
          value = ref[key];
          this[key] = value;
        }
      }
      XMLStringifier2.prototype.name = function(val) {
        if (this.options.noValidation) {
          return val;
        }
        return this.assertLegalName("" + val || "");
      };
      XMLStringifier2.prototype.text = function(val) {
        if (this.options.noValidation) {
          return val;
        }
        return this.assertLegalChar(this.textEscape("" + val || ""));
      };
      XMLStringifier2.prototype.cdata = function(val) {
        if (this.options.noValidation) {
          return val;
        }
        val = "" + val || "";
        val = val.replace("]]>", "]]]]><![CDATA[>");
        return this.assertLegalChar(val);
      };
      XMLStringifier2.prototype.comment = function(val) {
        if (this.options.noValidation) {
          return val;
        }
        val = "" + val || "";
        if (val.match(/--/)) {
          throw new Error("Comment text cannot contain double-hypen: " + val);
        }
        return this.assertLegalChar(val);
      };
      XMLStringifier2.prototype.raw = function(val) {
        if (this.options.noValidation) {
          return val;
        }
        return "" + val || "";
      };
      XMLStringifier2.prototype.attValue = function(val) {
        if (this.options.noValidation) {
          return val;
        }
        return this.assertLegalChar(this.attEscape(val = "" + val || ""));
      };
      XMLStringifier2.prototype.insTarget = function(val) {
        if (this.options.noValidation) {
          return val;
        }
        return this.assertLegalChar("" + val || "");
      };
      XMLStringifier2.prototype.insValue = function(val) {
        if (this.options.noValidation) {
          return val;
        }
        val = "" + val || "";
        if (val.match(/\?>/)) {
          throw new Error("Invalid processing instruction value: " + val);
        }
        return this.assertLegalChar(val);
      };
      XMLStringifier2.prototype.xmlVersion = function(val) {
        if (this.options.noValidation) {
          return val;
        }
        val = "" + val || "";
        if (!val.match(/1\.[0-9]+/)) {
          throw new Error("Invalid version number: " + val);
        }
        return val;
      };
      XMLStringifier2.prototype.xmlEncoding = function(val) {
        if (this.options.noValidation) {
          return val;
        }
        val = "" + val || "";
        if (!val.match(/^[A-Za-z](?:[A-Za-z0-9._-])*$/)) {
          throw new Error("Invalid encoding: " + val);
        }
        return this.assertLegalChar(val);
      };
      XMLStringifier2.prototype.xmlStandalone = function(val) {
        if (this.options.noValidation) {
          return val;
        }
        if (val) {
          return "yes";
        } else {
          return "no";
        }
      };
      XMLStringifier2.prototype.dtdPubID = function(val) {
        if (this.options.noValidation) {
          return val;
        }
        return this.assertLegalChar("" + val || "");
      };
      XMLStringifier2.prototype.dtdSysID = function(val) {
        if (this.options.noValidation) {
          return val;
        }
        return this.assertLegalChar("" + val || "");
      };
      XMLStringifier2.prototype.dtdElementValue = function(val) {
        if (this.options.noValidation) {
          return val;
        }
        return this.assertLegalChar("" + val || "");
      };
      XMLStringifier2.prototype.dtdAttType = function(val) {
        if (this.options.noValidation) {
          return val;
        }
        return this.assertLegalChar("" + val || "");
      };
      XMLStringifier2.prototype.dtdAttDefault = function(val) {
        if (this.options.noValidation) {
          return val;
        }
        return this.assertLegalChar("" + val || "");
      };
      XMLStringifier2.prototype.dtdEntityValue = function(val) {
        if (this.options.noValidation) {
          return val;
        }
        return this.assertLegalChar("" + val || "");
      };
      XMLStringifier2.prototype.dtdNData = function(val) {
        if (this.options.noValidation) {
          return val;
        }
        return this.assertLegalChar("" + val || "");
      };
      XMLStringifier2.prototype.convertAttKey = "@";
      XMLStringifier2.prototype.convertPIKey = "?";
      XMLStringifier2.prototype.convertTextKey = "#text";
      XMLStringifier2.prototype.convertCDataKey = "#cdata";
      XMLStringifier2.prototype.convertCommentKey = "#comment";
      XMLStringifier2.prototype.convertRawKey = "#raw";
      XMLStringifier2.prototype.assertLegalChar = function(str) {
        var regex, res;
        if (this.options.noValidation) {
          return str;
        }
        regex = "";
        if (this.options.version === "1.0") {
          regex = /[\0-\x08\x0B\f\x0E-\x1F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
          if (res = str.match(regex)) {
            throw new Error("Invalid character in string: " + str + " at index " + res.index);
          }
        } else if (this.options.version === "1.1") {
          regex = /[\0\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
          if (res = str.match(regex)) {
            throw new Error("Invalid character in string: " + str + " at index " + res.index);
          }
        }
        return str;
      };
      XMLStringifier2.prototype.assertLegalName = function(str) {
        var regex;
        if (this.options.noValidation) {
          return str;
        }
        this.assertLegalChar(str);
        regex = /^([:A-Z_a-z\xC0-\xD6\xD8-\xF6\xF8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])([\x2D\.0-:A-Z_a-z\xB7\xC0-\xD6\xD8-\xF6\xF8-\u037D\u037F-\u1FFF\u200C\u200D\u203F\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])*$/;
        if (!str.match(regex)) {
          throw new Error("Invalid character in name");
        }
        return str;
      };
      XMLStringifier2.prototype.textEscape = function(str) {
        var ampregex;
        if (this.options.noValidation) {
          return str;
        }
        ampregex = this.options.noDoubleEncoding ? /(?!&\S+;)&/g : /&/g;
        return str.replace(ampregex, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\r/g, "&#xD;");
      };
      XMLStringifier2.prototype.attEscape = function(str) {
        var ampregex;
        if (this.options.noValidation) {
          return str;
        }
        ampregex = this.options.noDoubleEncoding ? /(?!&\S+;)&/g : /&/g;
        return str.replace(ampregex, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;").replace(/\t/g, "&#x9;").replace(/\n/g, "&#xA;").replace(/\r/g, "&#xD;");
      };
      return XMLStringifier2;
    })();
  }).call(XMLStringifier);
  return XMLStringifier$1.exports;
}
var XMLStringWriter$1 = { exports: {} };
var XMLWriterBase$1 = { exports: {} };
var WriterState$1 = { exports: {} };
var WriterState = WriterState$1.exports;
var hasRequiredWriterState;
function requireWriterState() {
  if (hasRequiredWriterState) return WriterState$1.exports;
  hasRequiredWriterState = 1;
  (function() {
    WriterState$1.exports = {
      None: 0,
      OpenTag: 1,
      InsideTag: 2,
      CloseTag: 3
    };
  }).call(WriterState);
  return WriterState$1.exports;
}
var XMLWriterBase = XMLWriterBase$1.exports;
var hasRequiredXMLWriterBase;
function requireXMLWriterBase() {
  if (hasRequiredXMLWriterBase) return XMLWriterBase$1.exports;
  hasRequiredXMLWriterBase = 1;
  (function() {
    var NodeType2, WriterState2, assign2, hasProp = {}.hasOwnProperty;
    assign2 = requireUtility().assign;
    NodeType2 = requireNodeType();
    requireXMLDeclaration();
    requireXMLDocType();
    requireXMLCData();
    requireXMLComment();
    requireXMLElement();
    requireXMLRaw();
    requireXMLText();
    requireXMLProcessingInstruction();
    requireXMLDummy();
    requireXMLDTDAttList();
    requireXMLDTDElement();
    requireXMLDTDEntity();
    requireXMLDTDNotation();
    WriterState2 = requireWriterState();
    XMLWriterBase$1.exports = (function() {
      function XMLWriterBase2(options) {
        var key, ref, value;
        options || (options = {});
        this.options = options;
        ref = options.writer || {};
        for (key in ref) {
          if (!hasProp.call(ref, key)) continue;
          value = ref[key];
          this["_" + key] = this[key];
          this[key] = value;
        }
      }
      XMLWriterBase2.prototype.filterOptions = function(options) {
        var filteredOptions, ref, ref1, ref2, ref3, ref4, ref5, ref6;
        options || (options = {});
        options = assign2({}, this.options, options);
        filteredOptions = {
          writer: this
        };
        filteredOptions.pretty = options.pretty || false;
        filteredOptions.allowEmpty = options.allowEmpty || false;
        filteredOptions.indent = (ref = options.indent) != null ? ref : "  ";
        filteredOptions.newline = (ref1 = options.newline) != null ? ref1 : "\n";
        filteredOptions.offset = (ref2 = options.offset) != null ? ref2 : 0;
        filteredOptions.dontPrettyTextNodes = (ref3 = (ref4 = options.dontPrettyTextNodes) != null ? ref4 : options.dontprettytextnodes) != null ? ref3 : 0;
        filteredOptions.spaceBeforeSlash = (ref5 = (ref6 = options.spaceBeforeSlash) != null ? ref6 : options.spacebeforeslash) != null ? ref5 : "";
        if (filteredOptions.spaceBeforeSlash === true) {
          filteredOptions.spaceBeforeSlash = " ";
        }
        filteredOptions.suppressPrettyCount = 0;
        filteredOptions.user = {};
        filteredOptions.state = WriterState2.None;
        return filteredOptions;
      };
      XMLWriterBase2.prototype.indent = function(node2, options, level) {
        var indentLevel;
        if (!options.pretty || options.suppressPrettyCount) {
          return "";
        } else if (options.pretty) {
          indentLevel = (level || 0) + options.offset + 1;
          if (indentLevel > 0) {
            return new Array(indentLevel).join(options.indent);
          }
        }
        return "";
      };
      XMLWriterBase2.prototype.endline = function(node2, options, level) {
        if (!options.pretty || options.suppressPrettyCount) {
          return "";
        } else {
          return options.newline;
        }
      };
      XMLWriterBase2.prototype.attribute = function(att, options, level) {
        var r;
        this.openAttribute(att, options, level);
        r = " " + att.name + '="' + att.value + '"';
        this.closeAttribute(att, options, level);
        return r;
      };
      XMLWriterBase2.prototype.cdata = function(node2, options, level) {
        var r;
        this.openNode(node2, options, level);
        options.state = WriterState2.OpenTag;
        r = this.indent(node2, options, level) + "<![CDATA[";
        options.state = WriterState2.InsideTag;
        r += node2.value;
        options.state = WriterState2.CloseTag;
        r += "]]>" + this.endline(node2, options, level);
        options.state = WriterState2.None;
        this.closeNode(node2, options, level);
        return r;
      };
      XMLWriterBase2.prototype.comment = function(node2, options, level) {
        var r;
        this.openNode(node2, options, level);
        options.state = WriterState2.OpenTag;
        r = this.indent(node2, options, level) + "<!-- ";
        options.state = WriterState2.InsideTag;
        r += node2.value;
        options.state = WriterState2.CloseTag;
        r += " -->" + this.endline(node2, options, level);
        options.state = WriterState2.None;
        this.closeNode(node2, options, level);
        return r;
      };
      XMLWriterBase2.prototype.declaration = function(node2, options, level) {
        var r;
        this.openNode(node2, options, level);
        options.state = WriterState2.OpenTag;
        r = this.indent(node2, options, level) + "<?xml";
        options.state = WriterState2.InsideTag;
        r += ' version="' + node2.version + '"';
        if (node2.encoding != null) {
          r += ' encoding="' + node2.encoding + '"';
        }
        if (node2.standalone != null) {
          r += ' standalone="' + node2.standalone + '"';
        }
        options.state = WriterState2.CloseTag;
        r += options.spaceBeforeSlash + "?>";
        r += this.endline(node2, options, level);
        options.state = WriterState2.None;
        this.closeNode(node2, options, level);
        return r;
      };
      XMLWriterBase2.prototype.docType = function(node2, options, level) {
        var child, i, len, r, ref;
        level || (level = 0);
        this.openNode(node2, options, level);
        options.state = WriterState2.OpenTag;
        r = this.indent(node2, options, level);
        r += "<!DOCTYPE " + node2.root().name;
        if (node2.pubID && node2.sysID) {
          r += ' PUBLIC "' + node2.pubID + '" "' + node2.sysID + '"';
        } else if (node2.sysID) {
          r += ' SYSTEM "' + node2.sysID + '"';
        }
        if (node2.children.length > 0) {
          r += " [";
          r += this.endline(node2, options, level);
          options.state = WriterState2.InsideTag;
          ref = node2.children;
          for (i = 0, len = ref.length; i < len; i++) {
            child = ref[i];
            r += this.writeChildNode(child, options, level + 1);
          }
          options.state = WriterState2.CloseTag;
          r += "]";
        }
        options.state = WriterState2.CloseTag;
        r += options.spaceBeforeSlash + ">";
        r += this.endline(node2, options, level);
        options.state = WriterState2.None;
        this.closeNode(node2, options, level);
        return r;
      };
      XMLWriterBase2.prototype.element = function(node2, options, level) {
        var att, child, childNodeCount, firstChildNode, i, j, len, len1, name, prettySuppressed, r, ref, ref1, ref2;
        level || (level = 0);
        prettySuppressed = false;
        r = "";
        this.openNode(node2, options, level);
        options.state = WriterState2.OpenTag;
        r += this.indent(node2, options, level) + "<" + node2.name;
        ref = node2.attribs;
        for (name in ref) {
          if (!hasProp.call(ref, name)) continue;
          att = ref[name];
          r += this.attribute(att, options, level);
        }
        childNodeCount = node2.children.length;
        firstChildNode = childNodeCount === 0 ? null : node2.children[0];
        if (childNodeCount === 0 || node2.children.every(function(e) {
          return (e.type === NodeType2.Text || e.type === NodeType2.Raw) && e.value === "";
        })) {
          if (options.allowEmpty) {
            r += ">";
            options.state = WriterState2.CloseTag;
            r += "</" + node2.name + ">" + this.endline(node2, options, level);
          } else {
            options.state = WriterState2.CloseTag;
            r += options.spaceBeforeSlash + "/>" + this.endline(node2, options, level);
          }
        } else if (options.pretty && childNodeCount === 1 && (firstChildNode.type === NodeType2.Text || firstChildNode.type === NodeType2.Raw) && firstChildNode.value != null) {
          r += ">";
          options.state = WriterState2.InsideTag;
          options.suppressPrettyCount++;
          prettySuppressed = true;
          r += this.writeChildNode(firstChildNode, options, level + 1);
          options.suppressPrettyCount--;
          prettySuppressed = false;
          options.state = WriterState2.CloseTag;
          r += "</" + node2.name + ">" + this.endline(node2, options, level);
        } else {
          if (options.dontPrettyTextNodes) {
            ref1 = node2.children;
            for (i = 0, len = ref1.length; i < len; i++) {
              child = ref1[i];
              if ((child.type === NodeType2.Text || child.type === NodeType2.Raw) && child.value != null) {
                options.suppressPrettyCount++;
                prettySuppressed = true;
                break;
              }
            }
          }
          r += ">" + this.endline(node2, options, level);
          options.state = WriterState2.InsideTag;
          ref2 = node2.children;
          for (j = 0, len1 = ref2.length; j < len1; j++) {
            child = ref2[j];
            r += this.writeChildNode(child, options, level + 1);
          }
          options.state = WriterState2.CloseTag;
          r += this.indent(node2, options, level) + "</" + node2.name + ">";
          if (prettySuppressed) {
            options.suppressPrettyCount--;
          }
          r += this.endline(node2, options, level);
          options.state = WriterState2.None;
        }
        this.closeNode(node2, options, level);
        return r;
      };
      XMLWriterBase2.prototype.writeChildNode = function(node2, options, level) {
        switch (node2.type) {
          case NodeType2.CData:
            return this.cdata(node2, options, level);
          case NodeType2.Comment:
            return this.comment(node2, options, level);
          case NodeType2.Element:
            return this.element(node2, options, level);
          case NodeType2.Raw:
            return this.raw(node2, options, level);
          case NodeType2.Text:
            return this.text(node2, options, level);
          case NodeType2.ProcessingInstruction:
            return this.processingInstruction(node2, options, level);
          case NodeType2.Dummy:
            return "";
          case NodeType2.Declaration:
            return this.declaration(node2, options, level);
          case NodeType2.DocType:
            return this.docType(node2, options, level);
          case NodeType2.AttributeDeclaration:
            return this.dtdAttList(node2, options, level);
          case NodeType2.ElementDeclaration:
            return this.dtdElement(node2, options, level);
          case NodeType2.EntityDeclaration:
            return this.dtdEntity(node2, options, level);
          case NodeType2.NotationDeclaration:
            return this.dtdNotation(node2, options, level);
          default:
            throw new Error("Unknown XML node type: " + node2.constructor.name);
        }
      };
      XMLWriterBase2.prototype.processingInstruction = function(node2, options, level) {
        var r;
        this.openNode(node2, options, level);
        options.state = WriterState2.OpenTag;
        r = this.indent(node2, options, level) + "<?";
        options.state = WriterState2.InsideTag;
        r += node2.target;
        if (node2.value) {
          r += " " + node2.value;
        }
        options.state = WriterState2.CloseTag;
        r += options.spaceBeforeSlash + "?>";
        r += this.endline(node2, options, level);
        options.state = WriterState2.None;
        this.closeNode(node2, options, level);
        return r;
      };
      XMLWriterBase2.prototype.raw = function(node2, options, level) {
        var r;
        this.openNode(node2, options, level);
        options.state = WriterState2.OpenTag;
        r = this.indent(node2, options, level);
        options.state = WriterState2.InsideTag;
        r += node2.value;
        options.state = WriterState2.CloseTag;
        r += this.endline(node2, options, level);
        options.state = WriterState2.None;
        this.closeNode(node2, options, level);
        return r;
      };
      XMLWriterBase2.prototype.text = function(node2, options, level) {
        var r;
        this.openNode(node2, options, level);
        options.state = WriterState2.OpenTag;
        r = this.indent(node2, options, level);
        options.state = WriterState2.InsideTag;
        r += node2.value;
        options.state = WriterState2.CloseTag;
        r += this.endline(node2, options, level);
        options.state = WriterState2.None;
        this.closeNode(node2, options, level);
        return r;
      };
      XMLWriterBase2.prototype.dtdAttList = function(node2, options, level) {
        var r;
        this.openNode(node2, options, level);
        options.state = WriterState2.OpenTag;
        r = this.indent(node2, options, level) + "<!ATTLIST";
        options.state = WriterState2.InsideTag;
        r += " " + node2.elementName + " " + node2.attributeName + " " + node2.attributeType;
        if (node2.defaultValueType !== "#DEFAULT") {
          r += " " + node2.defaultValueType;
        }
        if (node2.defaultValue) {
          r += ' "' + node2.defaultValue + '"';
        }
        options.state = WriterState2.CloseTag;
        r += options.spaceBeforeSlash + ">" + this.endline(node2, options, level);
        options.state = WriterState2.None;
        this.closeNode(node2, options, level);
        return r;
      };
      XMLWriterBase2.prototype.dtdElement = function(node2, options, level) {
        var r;
        this.openNode(node2, options, level);
        options.state = WriterState2.OpenTag;
        r = this.indent(node2, options, level) + "<!ELEMENT";
        options.state = WriterState2.InsideTag;
        r += " " + node2.name + " " + node2.value;
        options.state = WriterState2.CloseTag;
        r += options.spaceBeforeSlash + ">" + this.endline(node2, options, level);
        options.state = WriterState2.None;
        this.closeNode(node2, options, level);
        return r;
      };
      XMLWriterBase2.prototype.dtdEntity = function(node2, options, level) {
        var r;
        this.openNode(node2, options, level);
        options.state = WriterState2.OpenTag;
        r = this.indent(node2, options, level) + "<!ENTITY";
        options.state = WriterState2.InsideTag;
        if (node2.pe) {
          r += " %";
        }
        r += " " + node2.name;
        if (node2.value) {
          r += ' "' + node2.value + '"';
        } else {
          if (node2.pubID && node2.sysID) {
            r += ' PUBLIC "' + node2.pubID + '" "' + node2.sysID + '"';
          } else if (node2.sysID) {
            r += ' SYSTEM "' + node2.sysID + '"';
          }
          if (node2.nData) {
            r += " NDATA " + node2.nData;
          }
        }
        options.state = WriterState2.CloseTag;
        r += options.spaceBeforeSlash + ">" + this.endline(node2, options, level);
        options.state = WriterState2.None;
        this.closeNode(node2, options, level);
        return r;
      };
      XMLWriterBase2.prototype.dtdNotation = function(node2, options, level) {
        var r;
        this.openNode(node2, options, level);
        options.state = WriterState2.OpenTag;
        r = this.indent(node2, options, level) + "<!NOTATION";
        options.state = WriterState2.InsideTag;
        r += " " + node2.name;
        if (node2.pubID && node2.sysID) {
          r += ' PUBLIC "' + node2.pubID + '" "' + node2.sysID + '"';
        } else if (node2.pubID) {
          r += ' PUBLIC "' + node2.pubID + '"';
        } else if (node2.sysID) {
          r += ' SYSTEM "' + node2.sysID + '"';
        }
        options.state = WriterState2.CloseTag;
        r += options.spaceBeforeSlash + ">" + this.endline(node2, options, level);
        options.state = WriterState2.None;
        this.closeNode(node2, options, level);
        return r;
      };
      XMLWriterBase2.prototype.openNode = function(node2, options, level) {
      };
      XMLWriterBase2.prototype.closeNode = function(node2, options, level) {
      };
      XMLWriterBase2.prototype.openAttribute = function(att, options, level) {
      };
      XMLWriterBase2.prototype.closeAttribute = function(att, options, level) {
      };
      return XMLWriterBase2;
    })();
  }).call(XMLWriterBase);
  return XMLWriterBase$1.exports;
}
var XMLStringWriter = XMLStringWriter$1.exports;
var hasRequiredXMLStringWriter;
function requireXMLStringWriter() {
  if (hasRequiredXMLStringWriter) return XMLStringWriter$1.exports;
  hasRequiredXMLStringWriter = 1;
  (function() {
    var XMLWriterBase2, extend = function(child, parent) {
      for (var key in parent) {
        if (hasProp.call(parent, key)) child[key] = parent[key];
      }
      function ctor() {
        this.constructor = child;
      }
      ctor.prototype = parent.prototype;
      child.prototype = new ctor();
      child.__super__ = parent.prototype;
      return child;
    }, hasProp = {}.hasOwnProperty;
    XMLWriterBase2 = requireXMLWriterBase();
    XMLStringWriter$1.exports = (function(superClass) {
      extend(XMLStringWriter2, superClass);
      function XMLStringWriter2(options) {
        XMLStringWriter2.__super__.constructor.call(this, options);
      }
      XMLStringWriter2.prototype.document = function(doc, options) {
        var child, i, len, r, ref;
        options = this.filterOptions(options);
        r = "";
        ref = doc.children;
        for (i = 0, len = ref.length; i < len; i++) {
          child = ref[i];
          r += this.writeChildNode(child, options, 0);
        }
        if (options.pretty && r.slice(-options.newline.length) === options.newline) {
          r = r.slice(0, -options.newline.length);
        }
        return r;
      };
      return XMLStringWriter2;
    })(XMLWriterBase2);
  }).call(XMLStringWriter);
  return XMLStringWriter$1.exports;
}
var XMLDocument = XMLDocument$1.exports;
var hasRequiredXMLDocument;
function requireXMLDocument() {
  if (hasRequiredXMLDocument) return XMLDocument$1.exports;
  hasRequiredXMLDocument = 1;
  (function() {
    var NodeType2, XMLDOMConfiguration2, XMLDOMImplementation2, XMLNode2, XMLStringWriter2, XMLStringifier2, isPlainObject3, extend = function(child, parent) {
      for (var key in parent) {
        if (hasProp.call(parent, key)) child[key] = parent[key];
      }
      function ctor() {
        this.constructor = child;
      }
      ctor.prototype = parent.prototype;
      child.prototype = new ctor();
      child.__super__ = parent.prototype;
      return child;
    }, hasProp = {}.hasOwnProperty;
    isPlainObject3 = requireUtility().isPlainObject;
    XMLDOMImplementation2 = requireXMLDOMImplementation();
    XMLDOMConfiguration2 = requireXMLDOMConfiguration();
    XMLNode2 = requireXMLNode();
    NodeType2 = requireNodeType();
    XMLStringifier2 = requireXMLStringifier();
    XMLStringWriter2 = requireXMLStringWriter();
    XMLDocument$1.exports = (function(superClass) {
      extend(XMLDocument2, superClass);
      function XMLDocument2(options) {
        XMLDocument2.__super__.constructor.call(this, null);
        this.name = "#document";
        this.type = NodeType2.Document;
        this.documentURI = null;
        this.domConfig = new XMLDOMConfiguration2();
        options || (options = {});
        if (!options.writer) {
          options.writer = new XMLStringWriter2();
        }
        this.options = options;
        this.stringify = new XMLStringifier2(options);
      }
      Object.defineProperty(XMLDocument2.prototype, "implementation", {
        value: new XMLDOMImplementation2()
      });
      Object.defineProperty(XMLDocument2.prototype, "doctype", {
        get: function() {
          var child, i, len, ref;
          ref = this.children;
          for (i = 0, len = ref.length; i < len; i++) {
            child = ref[i];
            if (child.type === NodeType2.DocType) {
              return child;
            }
          }
          return null;
        }
      });
      Object.defineProperty(XMLDocument2.prototype, "documentElement", {
        get: function() {
          return this.rootObject || null;
        }
      });
      Object.defineProperty(XMLDocument2.prototype, "inputEncoding", {
        get: function() {
          return null;
        }
      });
      Object.defineProperty(XMLDocument2.prototype, "strictErrorChecking", {
        get: function() {
          return false;
        }
      });
      Object.defineProperty(XMLDocument2.prototype, "xmlEncoding", {
        get: function() {
          if (this.children.length !== 0 && this.children[0].type === NodeType2.Declaration) {
            return this.children[0].encoding;
          } else {
            return null;
          }
        }
      });
      Object.defineProperty(XMLDocument2.prototype, "xmlStandalone", {
        get: function() {
          if (this.children.length !== 0 && this.children[0].type === NodeType2.Declaration) {
            return this.children[0].standalone === "yes";
          } else {
            return false;
          }
        }
      });
      Object.defineProperty(XMLDocument2.prototype, "xmlVersion", {
        get: function() {
          if (this.children.length !== 0 && this.children[0].type === NodeType2.Declaration) {
            return this.children[0].version;
          } else {
            return "1.0";
          }
        }
      });
      Object.defineProperty(XMLDocument2.prototype, "URL", {
        get: function() {
          return this.documentURI;
        }
      });
      Object.defineProperty(XMLDocument2.prototype, "origin", {
        get: function() {
          return null;
        }
      });
      Object.defineProperty(XMLDocument2.prototype, "compatMode", {
        get: function() {
          return null;
        }
      });
      Object.defineProperty(XMLDocument2.prototype, "characterSet", {
        get: function() {
          return null;
        }
      });
      Object.defineProperty(XMLDocument2.prototype, "contentType", {
        get: function() {
          return null;
        }
      });
      XMLDocument2.prototype.end = function(writer) {
        var writerOptions;
        writerOptions = {};
        if (!writer) {
          writer = this.options.writer;
        } else if (isPlainObject3(writer)) {
          writerOptions = writer;
          writer = this.options.writer;
        }
        return writer.document(this, writer.filterOptions(writerOptions));
      };
      XMLDocument2.prototype.toString = function(options) {
        return this.options.writer.document(this, this.options.writer.filterOptions(options));
      };
      XMLDocument2.prototype.createElement = function(tagName) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      };
      XMLDocument2.prototype.createDocumentFragment = function() {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      };
      XMLDocument2.prototype.createTextNode = function(data) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      };
      XMLDocument2.prototype.createComment = function(data) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      };
      XMLDocument2.prototype.createCDATASection = function(data) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      };
      XMLDocument2.prototype.createProcessingInstruction = function(target, data) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      };
      XMLDocument2.prototype.createAttribute = function(name) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      };
      XMLDocument2.prototype.createEntityReference = function(name) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      };
      XMLDocument2.prototype.getElementsByTagName = function(tagname) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      };
      XMLDocument2.prototype.importNode = function(importedNode, deep) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      };
      XMLDocument2.prototype.createElementNS = function(namespaceURI, qualifiedName) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      };
      XMLDocument2.prototype.createAttributeNS = function(namespaceURI, qualifiedName) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      };
      XMLDocument2.prototype.getElementsByTagNameNS = function(namespaceURI, localName) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      };
      XMLDocument2.prototype.getElementById = function(elementId) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      };
      XMLDocument2.prototype.adoptNode = function(source) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      };
      XMLDocument2.prototype.normalizeDocument = function() {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      };
      XMLDocument2.prototype.renameNode = function(node2, namespaceURI, qualifiedName) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      };
      XMLDocument2.prototype.getElementsByClassName = function(classNames) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      };
      XMLDocument2.prototype.createEvent = function(eventInterface) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      };
      XMLDocument2.prototype.createRange = function() {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      };
      XMLDocument2.prototype.createNodeIterator = function(root, whatToShow, filter2) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      };
      XMLDocument2.prototype.createTreeWalker = function(root, whatToShow, filter2) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      };
      return XMLDocument2;
    })(XMLNode2);
  }).call(XMLDocument);
  return XMLDocument$1.exports;
}
var XMLDocumentCB$1 = { exports: {} };
var XMLDocumentCB = XMLDocumentCB$1.exports;
var hasRequiredXMLDocumentCB;
function requireXMLDocumentCB() {
  if (hasRequiredXMLDocumentCB) return XMLDocumentCB$1.exports;
  hasRequiredXMLDocumentCB = 1;
  (function() {
    var NodeType2, WriterState2, XMLAttribute2, XMLCData2, XMLComment2, XMLDTDAttList2, XMLDTDElement2, XMLDTDEntity2, XMLDTDNotation2, XMLDeclaration2, XMLDocType2, XMLDocument2, XMLElement2, XMLProcessingInstruction2, XMLRaw2, XMLStringWriter2, XMLStringifier2, XMLText2, getValue, isFunction2, isObject2, isPlainObject3, ref, hasProp = {}.hasOwnProperty;
    ref = requireUtility(), isObject2 = ref.isObject, isFunction2 = ref.isFunction, isPlainObject3 = ref.isPlainObject, getValue = ref.getValue;
    NodeType2 = requireNodeType();
    XMLDocument2 = requireXMLDocument();
    XMLElement2 = requireXMLElement();
    XMLCData2 = requireXMLCData();
    XMLComment2 = requireXMLComment();
    XMLRaw2 = requireXMLRaw();
    XMLText2 = requireXMLText();
    XMLProcessingInstruction2 = requireXMLProcessingInstruction();
    XMLDeclaration2 = requireXMLDeclaration();
    XMLDocType2 = requireXMLDocType();
    XMLDTDAttList2 = requireXMLDTDAttList();
    XMLDTDEntity2 = requireXMLDTDEntity();
    XMLDTDElement2 = requireXMLDTDElement();
    XMLDTDNotation2 = requireXMLDTDNotation();
    XMLAttribute2 = requireXMLAttribute();
    XMLStringifier2 = requireXMLStringifier();
    XMLStringWriter2 = requireXMLStringWriter();
    WriterState2 = requireWriterState();
    XMLDocumentCB$1.exports = (function() {
      function XMLDocumentCB2(options, onData, onEnd) {
        var writerOptions;
        this.name = "?xml";
        this.type = NodeType2.Document;
        options || (options = {});
        writerOptions = {};
        if (!options.writer) {
          options.writer = new XMLStringWriter2();
        } else if (isPlainObject3(options.writer)) {
          writerOptions = options.writer;
          options.writer = new XMLStringWriter2();
        }
        this.options = options;
        this.writer = options.writer;
        this.writerOptions = this.writer.filterOptions(writerOptions);
        this.stringify = new XMLStringifier2(options);
        this.onDataCallback = onData || function() {
        };
        this.onEndCallback = onEnd || function() {
        };
        this.currentNode = null;
        this.currentLevel = -1;
        this.openTags = {};
        this.documentStarted = false;
        this.documentCompleted = false;
        this.root = null;
      }
      XMLDocumentCB2.prototype.createChildNode = function(node2) {
        var att, attName, attributes, child, i, len, ref1, ref2;
        switch (node2.type) {
          case NodeType2.CData:
            this.cdata(node2.value);
            break;
          case NodeType2.Comment:
            this.comment(node2.value);
            break;
          case NodeType2.Element:
            attributes = {};
            ref1 = node2.attribs;
            for (attName in ref1) {
              if (!hasProp.call(ref1, attName)) continue;
              att = ref1[attName];
              attributes[attName] = att.value;
            }
            this.node(node2.name, attributes);
            break;
          case NodeType2.Dummy:
            this.dummy();
            break;
          case NodeType2.Raw:
            this.raw(node2.value);
            break;
          case NodeType2.Text:
            this.text(node2.value);
            break;
          case NodeType2.ProcessingInstruction:
            this.instruction(node2.target, node2.value);
            break;
          default:
            throw new Error("This XML node type is not supported in a JS object: " + node2.constructor.name);
        }
        ref2 = node2.children;
        for (i = 0, len = ref2.length; i < len; i++) {
          child = ref2[i];
          this.createChildNode(child);
          if (child.type === NodeType2.Element) {
            this.up();
          }
        }
        return this;
      };
      XMLDocumentCB2.prototype.dummy = function() {
        return this;
      };
      XMLDocumentCB2.prototype.node = function(name, attributes, text) {
        var ref1;
        if (name == null) {
          throw new Error("Missing node name.");
        }
        if (this.root && this.currentLevel === -1) {
          throw new Error("Document can only have one root node. " + this.debugInfo(name));
        }
        this.openCurrent();
        name = getValue(name);
        if (attributes == null) {
          attributes = {};
        }
        attributes = getValue(attributes);
        if (!isObject2(attributes)) {
          ref1 = [attributes, text], text = ref1[0], attributes = ref1[1];
        }
        this.currentNode = new XMLElement2(this, name, attributes);
        this.currentNode.children = false;
        this.currentLevel++;
        this.openTags[this.currentLevel] = this.currentNode;
        if (text != null) {
          this.text(text);
        }
        return this;
      };
      XMLDocumentCB2.prototype.element = function(name, attributes, text) {
        var child, i, len, oldValidationFlag, ref1, root;
        if (this.currentNode && this.currentNode.type === NodeType2.DocType) {
          this.dtdElement.apply(this, arguments);
        } else {
          if (Array.isArray(name) || isObject2(name) || isFunction2(name)) {
            oldValidationFlag = this.options.noValidation;
            this.options.noValidation = true;
            root = new XMLDocument2(this.options).element("TEMP_ROOT");
            root.element(name);
            this.options.noValidation = oldValidationFlag;
            ref1 = root.children;
            for (i = 0, len = ref1.length; i < len; i++) {
              child = ref1[i];
              this.createChildNode(child);
              if (child.type === NodeType2.Element) {
                this.up();
              }
            }
          } else {
            this.node(name, attributes, text);
          }
        }
        return this;
      };
      XMLDocumentCB2.prototype.attribute = function(name, value) {
        var attName, attValue;
        if (!this.currentNode || this.currentNode.children) {
          throw new Error("att() can only be used immediately after an ele() call in callback mode. " + this.debugInfo(name));
        }
        if (name != null) {
          name = getValue(name);
        }
        if (isObject2(name)) {
          for (attName in name) {
            if (!hasProp.call(name, attName)) continue;
            attValue = name[attName];
            this.attribute(attName, attValue);
          }
        } else {
          if (isFunction2(value)) {
            value = value.apply();
          }
          if (this.options.keepNullAttributes && value == null) {
            this.currentNode.attribs[name] = new XMLAttribute2(this, name, "");
          } else if (value != null) {
            this.currentNode.attribs[name] = new XMLAttribute2(this, name, value);
          }
        }
        return this;
      };
      XMLDocumentCB2.prototype.text = function(value) {
        var node2;
        this.openCurrent();
        node2 = new XMLText2(this, value);
        this.onData(this.writer.text(node2, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
        return this;
      };
      XMLDocumentCB2.prototype.cdata = function(value) {
        var node2;
        this.openCurrent();
        node2 = new XMLCData2(this, value);
        this.onData(this.writer.cdata(node2, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
        return this;
      };
      XMLDocumentCB2.prototype.comment = function(value) {
        var node2;
        this.openCurrent();
        node2 = new XMLComment2(this, value);
        this.onData(this.writer.comment(node2, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
        return this;
      };
      XMLDocumentCB2.prototype.raw = function(value) {
        var node2;
        this.openCurrent();
        node2 = new XMLRaw2(this, value);
        this.onData(this.writer.raw(node2, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
        return this;
      };
      XMLDocumentCB2.prototype.instruction = function(target, value) {
        var i, insTarget, insValue, len, node2;
        this.openCurrent();
        if (target != null) {
          target = getValue(target);
        }
        if (value != null) {
          value = getValue(value);
        }
        if (Array.isArray(target)) {
          for (i = 0, len = target.length; i < len; i++) {
            insTarget = target[i];
            this.instruction(insTarget);
          }
        } else if (isObject2(target)) {
          for (insTarget in target) {
            if (!hasProp.call(target, insTarget)) continue;
            insValue = target[insTarget];
            this.instruction(insTarget, insValue);
          }
        } else {
          if (isFunction2(value)) {
            value = value.apply();
          }
          node2 = new XMLProcessingInstruction2(this, target, value);
          this.onData(this.writer.processingInstruction(node2, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
        }
        return this;
      };
      XMLDocumentCB2.prototype.declaration = function(version, encoding, standalone) {
        var node2;
        this.openCurrent();
        if (this.documentStarted) {
          throw new Error("declaration() must be the first node.");
        }
        node2 = new XMLDeclaration2(this, version, encoding, standalone);
        this.onData(this.writer.declaration(node2, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
        return this;
      };
      XMLDocumentCB2.prototype.doctype = function(root, pubID, sysID) {
        this.openCurrent();
        if (root == null) {
          throw new Error("Missing root node name.");
        }
        if (this.root) {
          throw new Error("dtd() must come before the root node.");
        }
        this.currentNode = new XMLDocType2(this, pubID, sysID);
        this.currentNode.rootNodeName = root;
        this.currentNode.children = false;
        this.currentLevel++;
        this.openTags[this.currentLevel] = this.currentNode;
        return this;
      };
      XMLDocumentCB2.prototype.dtdElement = function(name, value) {
        var node2;
        this.openCurrent();
        node2 = new XMLDTDElement2(this, name, value);
        this.onData(this.writer.dtdElement(node2, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
        return this;
      };
      XMLDocumentCB2.prototype.attList = function(elementName, attributeName, attributeType, defaultValueType, defaultValue) {
        var node2;
        this.openCurrent();
        node2 = new XMLDTDAttList2(this, elementName, attributeName, attributeType, defaultValueType, defaultValue);
        this.onData(this.writer.dtdAttList(node2, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
        return this;
      };
      XMLDocumentCB2.prototype.entity = function(name, value) {
        var node2;
        this.openCurrent();
        node2 = new XMLDTDEntity2(this, false, name, value);
        this.onData(this.writer.dtdEntity(node2, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
        return this;
      };
      XMLDocumentCB2.prototype.pEntity = function(name, value) {
        var node2;
        this.openCurrent();
        node2 = new XMLDTDEntity2(this, true, name, value);
        this.onData(this.writer.dtdEntity(node2, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
        return this;
      };
      XMLDocumentCB2.prototype.notation = function(name, value) {
        var node2;
        this.openCurrent();
        node2 = new XMLDTDNotation2(this, name, value);
        this.onData(this.writer.dtdNotation(node2, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
        return this;
      };
      XMLDocumentCB2.prototype.up = function() {
        if (this.currentLevel < 0) {
          throw new Error("The document node has no parent.");
        }
        if (this.currentNode) {
          if (this.currentNode.children) {
            this.closeNode(this.currentNode);
          } else {
            this.openNode(this.currentNode);
          }
          this.currentNode = null;
        } else {
          this.closeNode(this.openTags[this.currentLevel]);
        }
        delete this.openTags[this.currentLevel];
        this.currentLevel--;
        return this;
      };
      XMLDocumentCB2.prototype.end = function() {
        while (this.currentLevel >= 0) {
          this.up();
        }
        return this.onEnd();
      };
      XMLDocumentCB2.prototype.openCurrent = function() {
        if (this.currentNode) {
          this.currentNode.children = true;
          return this.openNode(this.currentNode);
        }
      };
      XMLDocumentCB2.prototype.openNode = function(node2) {
        var att, chunk, name, ref1;
        if (!node2.isOpen) {
          if (!this.root && this.currentLevel === 0 && node2.type === NodeType2.Element) {
            this.root = node2;
          }
          chunk = "";
          if (node2.type === NodeType2.Element) {
            this.writerOptions.state = WriterState2.OpenTag;
            chunk = this.writer.indent(node2, this.writerOptions, this.currentLevel) + "<" + node2.name;
            ref1 = node2.attribs;
            for (name in ref1) {
              if (!hasProp.call(ref1, name)) continue;
              att = ref1[name];
              chunk += this.writer.attribute(att, this.writerOptions, this.currentLevel);
            }
            chunk += (node2.children ? ">" : "/>") + this.writer.endline(node2, this.writerOptions, this.currentLevel);
            this.writerOptions.state = WriterState2.InsideTag;
          } else {
            this.writerOptions.state = WriterState2.OpenTag;
            chunk = this.writer.indent(node2, this.writerOptions, this.currentLevel) + "<!DOCTYPE " + node2.rootNodeName;
            if (node2.pubID && node2.sysID) {
              chunk += ' PUBLIC "' + node2.pubID + '" "' + node2.sysID + '"';
            } else if (node2.sysID) {
              chunk += ' SYSTEM "' + node2.sysID + '"';
            }
            if (node2.children) {
              chunk += " [";
              this.writerOptions.state = WriterState2.InsideTag;
            } else {
              this.writerOptions.state = WriterState2.CloseTag;
              chunk += ">";
            }
            chunk += this.writer.endline(node2, this.writerOptions, this.currentLevel);
          }
          this.onData(chunk, this.currentLevel);
          return node2.isOpen = true;
        }
      };
      XMLDocumentCB2.prototype.closeNode = function(node2) {
        var chunk;
        if (!node2.isClosed) {
          chunk = "";
          this.writerOptions.state = WriterState2.CloseTag;
          if (node2.type === NodeType2.Element) {
            chunk = this.writer.indent(node2, this.writerOptions, this.currentLevel) + "</" + node2.name + ">" + this.writer.endline(node2, this.writerOptions, this.currentLevel);
          } else {
            chunk = this.writer.indent(node2, this.writerOptions, this.currentLevel) + "]>" + this.writer.endline(node2, this.writerOptions, this.currentLevel);
          }
          this.writerOptions.state = WriterState2.None;
          this.onData(chunk, this.currentLevel);
          return node2.isClosed = true;
        }
      };
      XMLDocumentCB2.prototype.onData = function(chunk, level) {
        this.documentStarted = true;
        return this.onDataCallback(chunk, level + 1);
      };
      XMLDocumentCB2.prototype.onEnd = function() {
        this.documentCompleted = true;
        return this.onEndCallback();
      };
      XMLDocumentCB2.prototype.debugInfo = function(name) {
        if (name == null) {
          return "";
        } else {
          return "node: <" + name + ">";
        }
      };
      XMLDocumentCB2.prototype.ele = function() {
        return this.element.apply(this, arguments);
      };
      XMLDocumentCB2.prototype.nod = function(name, attributes, text) {
        return this.node(name, attributes, text);
      };
      XMLDocumentCB2.prototype.txt = function(value) {
        return this.text(value);
      };
      XMLDocumentCB2.prototype.dat = function(value) {
        return this.cdata(value);
      };
      XMLDocumentCB2.prototype.com = function(value) {
        return this.comment(value);
      };
      XMLDocumentCB2.prototype.ins = function(target, value) {
        return this.instruction(target, value);
      };
      XMLDocumentCB2.prototype.dec = function(version, encoding, standalone) {
        return this.declaration(version, encoding, standalone);
      };
      XMLDocumentCB2.prototype.dtd = function(root, pubID, sysID) {
        return this.doctype(root, pubID, sysID);
      };
      XMLDocumentCB2.prototype.e = function(name, attributes, text) {
        return this.element(name, attributes, text);
      };
      XMLDocumentCB2.prototype.n = function(name, attributes, text) {
        return this.node(name, attributes, text);
      };
      XMLDocumentCB2.prototype.t = function(value) {
        return this.text(value);
      };
      XMLDocumentCB2.prototype.d = function(value) {
        return this.cdata(value);
      };
      XMLDocumentCB2.prototype.c = function(value) {
        return this.comment(value);
      };
      XMLDocumentCB2.prototype.r = function(value) {
        return this.raw(value);
      };
      XMLDocumentCB2.prototype.i = function(target, value) {
        return this.instruction(target, value);
      };
      XMLDocumentCB2.prototype.att = function() {
        if (this.currentNode && this.currentNode.type === NodeType2.DocType) {
          return this.attList.apply(this, arguments);
        } else {
          return this.attribute.apply(this, arguments);
        }
      };
      XMLDocumentCB2.prototype.a = function() {
        if (this.currentNode && this.currentNode.type === NodeType2.DocType) {
          return this.attList.apply(this, arguments);
        } else {
          return this.attribute.apply(this, arguments);
        }
      };
      XMLDocumentCB2.prototype.ent = function(name, value) {
        return this.entity(name, value);
      };
      XMLDocumentCB2.prototype.pent = function(name, value) {
        return this.pEntity(name, value);
      };
      XMLDocumentCB2.prototype.not = function(name, value) {
        return this.notation(name, value);
      };
      return XMLDocumentCB2;
    })();
  }).call(XMLDocumentCB);
  return XMLDocumentCB$1.exports;
}
var XMLStreamWriter$1 = { exports: {} };
var XMLStreamWriter = XMLStreamWriter$1.exports;
var hasRequiredXMLStreamWriter;
function requireXMLStreamWriter() {
  if (hasRequiredXMLStreamWriter) return XMLStreamWriter$1.exports;
  hasRequiredXMLStreamWriter = 1;
  (function() {
    var NodeType2, WriterState2, XMLWriterBase2, extend = function(child, parent) {
      for (var key in parent) {
        if (hasProp.call(parent, key)) child[key] = parent[key];
      }
      function ctor() {
        this.constructor = child;
      }
      ctor.prototype = parent.prototype;
      child.prototype = new ctor();
      child.__super__ = parent.prototype;
      return child;
    }, hasProp = {}.hasOwnProperty;
    NodeType2 = requireNodeType();
    XMLWriterBase2 = requireXMLWriterBase();
    WriterState2 = requireWriterState();
    XMLStreamWriter$1.exports = (function(superClass) {
      extend(XMLStreamWriter2, superClass);
      function XMLStreamWriter2(stream2, options) {
        this.stream = stream2;
        XMLStreamWriter2.__super__.constructor.call(this, options);
      }
      XMLStreamWriter2.prototype.endline = function(node2, options, level) {
        if (node2.isLastRootNode && options.state === WriterState2.CloseTag) {
          return "";
        } else {
          return XMLStreamWriter2.__super__.endline.call(this, node2, options, level);
        }
      };
      XMLStreamWriter2.prototype.document = function(doc, options) {
        var child, i, j, k, len, len1, ref, ref1, results;
        ref = doc.children;
        for (i = j = 0, len = ref.length; j < len; i = ++j) {
          child = ref[i];
          child.isLastRootNode = i === doc.children.length - 1;
        }
        options = this.filterOptions(options);
        ref1 = doc.children;
        results = [];
        for (k = 0, len1 = ref1.length; k < len1; k++) {
          child = ref1[k];
          results.push(this.writeChildNode(child, options, 0));
        }
        return results;
      };
      XMLStreamWriter2.prototype.attribute = function(att, options, level) {
        return this.stream.write(XMLStreamWriter2.__super__.attribute.call(this, att, options, level));
      };
      XMLStreamWriter2.prototype.cdata = function(node2, options, level) {
        return this.stream.write(XMLStreamWriter2.__super__.cdata.call(this, node2, options, level));
      };
      XMLStreamWriter2.prototype.comment = function(node2, options, level) {
        return this.stream.write(XMLStreamWriter2.__super__.comment.call(this, node2, options, level));
      };
      XMLStreamWriter2.prototype.declaration = function(node2, options, level) {
        return this.stream.write(XMLStreamWriter2.__super__.declaration.call(this, node2, options, level));
      };
      XMLStreamWriter2.prototype.docType = function(node2, options, level) {
        var child, j, len, ref;
        level || (level = 0);
        this.openNode(node2, options, level);
        options.state = WriterState2.OpenTag;
        this.stream.write(this.indent(node2, options, level));
        this.stream.write("<!DOCTYPE " + node2.root().name);
        if (node2.pubID && node2.sysID) {
          this.stream.write(' PUBLIC "' + node2.pubID + '" "' + node2.sysID + '"');
        } else if (node2.sysID) {
          this.stream.write(' SYSTEM "' + node2.sysID + '"');
        }
        if (node2.children.length > 0) {
          this.stream.write(" [");
          this.stream.write(this.endline(node2, options, level));
          options.state = WriterState2.InsideTag;
          ref = node2.children;
          for (j = 0, len = ref.length; j < len; j++) {
            child = ref[j];
            this.writeChildNode(child, options, level + 1);
          }
          options.state = WriterState2.CloseTag;
          this.stream.write("]");
        }
        options.state = WriterState2.CloseTag;
        this.stream.write(options.spaceBeforeSlash + ">");
        this.stream.write(this.endline(node2, options, level));
        options.state = WriterState2.None;
        return this.closeNode(node2, options, level);
      };
      XMLStreamWriter2.prototype.element = function(node2, options, level) {
        var att, child, childNodeCount, firstChildNode, j, len, name, ref, ref1;
        level || (level = 0);
        this.openNode(node2, options, level);
        options.state = WriterState2.OpenTag;
        this.stream.write(this.indent(node2, options, level) + "<" + node2.name);
        ref = node2.attribs;
        for (name in ref) {
          if (!hasProp.call(ref, name)) continue;
          att = ref[name];
          this.attribute(att, options, level);
        }
        childNodeCount = node2.children.length;
        firstChildNode = childNodeCount === 0 ? null : node2.children[0];
        if (childNodeCount === 0 || node2.children.every(function(e) {
          return (e.type === NodeType2.Text || e.type === NodeType2.Raw) && e.value === "";
        })) {
          if (options.allowEmpty) {
            this.stream.write(">");
            options.state = WriterState2.CloseTag;
            this.stream.write("</" + node2.name + ">");
          } else {
            options.state = WriterState2.CloseTag;
            this.stream.write(options.spaceBeforeSlash + "/>");
          }
        } else if (options.pretty && childNodeCount === 1 && (firstChildNode.type === NodeType2.Text || firstChildNode.type === NodeType2.Raw) && firstChildNode.value != null) {
          this.stream.write(">");
          options.state = WriterState2.InsideTag;
          options.suppressPrettyCount++;
          this.writeChildNode(firstChildNode, options, level + 1);
          options.suppressPrettyCount--;
          options.state = WriterState2.CloseTag;
          this.stream.write("</" + node2.name + ">");
        } else {
          this.stream.write(">" + this.endline(node2, options, level));
          options.state = WriterState2.InsideTag;
          ref1 = node2.children;
          for (j = 0, len = ref1.length; j < len; j++) {
            child = ref1[j];
            this.writeChildNode(child, options, level + 1);
          }
          options.state = WriterState2.CloseTag;
          this.stream.write(this.indent(node2, options, level) + "</" + node2.name + ">");
        }
        this.stream.write(this.endline(node2, options, level));
        options.state = WriterState2.None;
        return this.closeNode(node2, options, level);
      };
      XMLStreamWriter2.prototype.processingInstruction = function(node2, options, level) {
        return this.stream.write(XMLStreamWriter2.__super__.processingInstruction.call(this, node2, options, level));
      };
      XMLStreamWriter2.prototype.raw = function(node2, options, level) {
        return this.stream.write(XMLStreamWriter2.__super__.raw.call(this, node2, options, level));
      };
      XMLStreamWriter2.prototype.text = function(node2, options, level) {
        return this.stream.write(XMLStreamWriter2.__super__.text.call(this, node2, options, level));
      };
      XMLStreamWriter2.prototype.dtdAttList = function(node2, options, level) {
        return this.stream.write(XMLStreamWriter2.__super__.dtdAttList.call(this, node2, options, level));
      };
      XMLStreamWriter2.prototype.dtdElement = function(node2, options, level) {
        return this.stream.write(XMLStreamWriter2.__super__.dtdElement.call(this, node2, options, level));
      };
      XMLStreamWriter2.prototype.dtdEntity = function(node2, options, level) {
        return this.stream.write(XMLStreamWriter2.__super__.dtdEntity.call(this, node2, options, level));
      };
      XMLStreamWriter2.prototype.dtdNotation = function(node2, options, level) {
        return this.stream.write(XMLStreamWriter2.__super__.dtdNotation.call(this, node2, options, level));
      };
      return XMLStreamWriter2;
    })(XMLWriterBase2);
  }).call(XMLStreamWriter);
  return XMLStreamWriter$1.exports;
}
var hasRequiredLib$1;
function requireLib$1() {
  if (hasRequiredLib$1) return lib$1;
  hasRequiredLib$1 = 1;
  (function() {
    var NodeType2, WriterState2, XMLDOMImplementation2, XMLDocument2, XMLDocumentCB2, XMLStreamWriter2, XMLStringWriter2, assign2, isFunction2, ref;
    ref = requireUtility(), assign2 = ref.assign, isFunction2 = ref.isFunction;
    XMLDOMImplementation2 = requireXMLDOMImplementation();
    XMLDocument2 = requireXMLDocument();
    XMLDocumentCB2 = requireXMLDocumentCB();
    XMLStringWriter2 = requireXMLStringWriter();
    XMLStreamWriter2 = requireXMLStreamWriter();
    NodeType2 = requireNodeType();
    WriterState2 = requireWriterState();
    lib$1.create = function(name, xmldec, doctype, options) {
      var doc, root;
      if (name == null) {
        throw new Error("Root element needs a name.");
      }
      options = assign2({}, xmldec, doctype, options);
      doc = new XMLDocument2(options);
      root = doc.element(name);
      if (!options.headless) {
        doc.declaration(options);
        if (options.pubID != null || options.sysID != null) {
          doc.dtd(options);
        }
      }
      return root;
    };
    lib$1.begin = function(options, onData, onEnd) {
      var ref1;
      if (isFunction2(options)) {
        ref1 = [options, onData], onData = ref1[0], onEnd = ref1[1];
        options = {};
      }
      if (onData) {
        return new XMLDocumentCB2(options, onData, onEnd);
      } else {
        return new XMLDocument2(options);
      }
    };
    lib$1.stringWriter = function(options) {
      return new XMLStringWriter2(options);
    };
    lib$1.streamWriter = function(stream2, options) {
      return new XMLStreamWriter2(stream2, options);
    };
    lib$1.implementation = new XMLDOMImplementation2();
    lib$1.nodeType = NodeType2;
    lib$1.writerState = WriterState2;
  }).call(lib$1);
  return lib$1;
}
var hasRequiredBuilder;
function requireBuilder() {
  if (hasRequiredBuilder) return builder;
  hasRequiredBuilder = 1;
  (function() {
    var builder$1, defaults2, escapeCDATA, requiresCDATA, wrapCDATA, hasProp = {}.hasOwnProperty;
    builder$1 = requireLib$1();
    defaults2 = requireDefaults().defaults;
    requiresCDATA = function(entry) {
      return typeof entry === "string" && (entry.indexOf("&") >= 0 || entry.indexOf(">") >= 0 || entry.indexOf("<") >= 0);
    };
    wrapCDATA = function(entry) {
      return "<![CDATA[" + escapeCDATA(entry) + "]]>";
    };
    escapeCDATA = function(entry) {
      return entry.replace("]]>", "]]]]><![CDATA[>");
    };
    builder.Builder = (function() {
      function Builder(opts) {
        var key, ref, value;
        this.options = {};
        ref = defaults2["0.2"];
        for (key in ref) {
          if (!hasProp.call(ref, key)) continue;
          value = ref[key];
          this.options[key] = value;
        }
        for (key in opts) {
          if (!hasProp.call(opts, key)) continue;
          value = opts[key];
          this.options[key] = value;
        }
      }
      Builder.prototype.buildObject = function(rootObj) {
        var attrkey, charkey, render2, rootElement, rootName;
        attrkey = this.options.attrkey;
        charkey = this.options.charkey;
        if (Object.keys(rootObj).length === 1 && this.options.rootName === defaults2["0.2"].rootName) {
          rootName = Object.keys(rootObj)[0];
          rootObj = rootObj[rootName];
        } else {
          rootName = this.options.rootName;
        }
        render2 = /* @__PURE__ */ (function(_this) {
          return function(element, obj) {
            var attr, child, entry, index2, key, value;
            if (typeof obj !== "object") {
              if (_this.options.cdata && requiresCDATA(obj)) {
                element.raw(wrapCDATA(obj));
              } else {
                element.txt(obj);
              }
            } else if (Array.isArray(obj)) {
              for (index2 in obj) {
                if (!hasProp.call(obj, index2)) continue;
                child = obj[index2];
                for (key in child) {
                  entry = child[key];
                  element = render2(element.ele(key), entry).up();
                }
              }
            } else {
              for (key in obj) {
                if (!hasProp.call(obj, key)) continue;
                child = obj[key];
                if (key === attrkey) {
                  if (typeof child === "object") {
                    for (attr in child) {
                      value = child[attr];
                      element = element.att(attr, value);
                    }
                  }
                } else if (key === charkey) {
                  if (_this.options.cdata && requiresCDATA(child)) {
                    element = element.raw(wrapCDATA(child));
                  } else {
                    element = element.txt(child);
                  }
                } else if (Array.isArray(child)) {
                  for (index2 in child) {
                    if (!hasProp.call(child, index2)) continue;
                    entry = child[index2];
                    if (typeof entry === "string") {
                      if (_this.options.cdata && requiresCDATA(entry)) {
                        element = element.ele(key).raw(wrapCDATA(entry)).up();
                      } else {
                        element = element.ele(key, entry).up();
                      }
                    } else {
                      element = render2(element.ele(key), entry).up();
                    }
                  }
                } else if (typeof child === "object") {
                  element = render2(element.ele(key), child).up();
                } else {
                  if (typeof child === "string" && _this.options.cdata && requiresCDATA(child)) {
                    element = element.ele(key).raw(wrapCDATA(child)).up();
                  } else {
                    if (child == null) {
                      child = "";
                    }
                    element = element.ele(key, child.toString()).up();
                  }
                }
              }
            }
            return element;
          };
        })(this);
        rootElement = builder$1.create(rootName, this.options.xmldec, this.options.doctype, {
          headless: this.options.headless,
          allowSurrogateChars: this.options.allowSurrogateChars
        });
        return render2(rootElement, rootObj).end(this.options.renderOpts);
      };
      return Builder;
    })();
  }).call(builder);
  return builder;
}
var parser = {};
var sax = {};
var hasRequiredSax;
function requireSax() {
  if (hasRequiredSax) return sax;
  hasRequiredSax = 1;
  (function(exports) {
    (function(sax2) {
      sax2.parser = function(strict, opt) {
        return new SAXParser(strict, opt);
      };
      sax2.SAXParser = SAXParser;
      sax2.SAXStream = SAXStream;
      sax2.createStream = createStream;
      sax2.MAX_BUFFER_LENGTH = 64 * 1024;
      var buffers = [
        "comment",
        "sgmlDecl",
        "textNode",
        "tagName",
        "doctype",
        "procInstName",
        "procInstBody",
        "entity",
        "attribName",
        "attribValue",
        "cdata",
        "script"
      ];
      sax2.EVENTS = [
        "text",
        "processinginstruction",
        "sgmldeclaration",
        "doctype",
        "comment",
        "opentagstart",
        "attribute",
        "opentag",
        "closetag",
        "opencdata",
        "cdata",
        "closecdata",
        "error",
        "end",
        "ready",
        "script",
        "opennamespace",
        "closenamespace"
      ];
      function SAXParser(strict, opt) {
        if (!(this instanceof SAXParser)) {
          return new SAXParser(strict, opt);
        }
        var parser2 = this;
        clearBuffers(parser2);
        parser2.q = parser2.c = "";
        parser2.bufferCheckPosition = sax2.MAX_BUFFER_LENGTH;
        parser2.opt = opt || {};
        parser2.opt.lowercase = parser2.opt.lowercase || parser2.opt.lowercasetags;
        parser2.looseCase = parser2.opt.lowercase ? "toLowerCase" : "toUpperCase";
        parser2.tags = [];
        parser2.closed = parser2.closedRoot = parser2.sawRoot = false;
        parser2.tag = parser2.error = null;
        parser2.strict = !!strict;
        parser2.noscript = !!(strict || parser2.opt.noscript);
        parser2.state = S.BEGIN;
        parser2.strictEntities = parser2.opt.strictEntities;
        parser2.ENTITIES = parser2.strictEntities ? Object.create(sax2.XML_ENTITIES) : Object.create(sax2.ENTITIES);
        parser2.attribList = [];
        if (parser2.opt.xmlns) {
          parser2.ns = Object.create(rootNS);
        }
        if (parser2.opt.unquotedAttributeValues === void 0) {
          parser2.opt.unquotedAttributeValues = !strict;
        }
        parser2.trackPosition = parser2.opt.position !== false;
        if (parser2.trackPosition) {
          parser2.position = parser2.line = parser2.column = 0;
        }
        emit(parser2, "onready");
      }
      if (!Object.create) {
        Object.create = function(o) {
          function F() {
          }
          F.prototype = o;
          var newf = new F();
          return newf;
        };
      }
      if (!Object.keys) {
        Object.keys = function(o) {
          var a = [];
          for (var i in o) if (o.hasOwnProperty(i)) a.push(i);
          return a;
        };
      }
      function checkBufferLength(parser2) {
        var maxAllowed = Math.max(sax2.MAX_BUFFER_LENGTH, 10);
        var maxActual = 0;
        for (var i = 0, l = buffers.length; i < l; i++) {
          var len = parser2[buffers[i]].length;
          if (len > maxAllowed) {
            switch (buffers[i]) {
              case "textNode":
                closeText(parser2);
                break;
              case "cdata":
                emitNode(parser2, "oncdata", parser2.cdata);
                parser2.cdata = "";
                break;
              case "script":
                emitNode(parser2, "onscript", parser2.script);
                parser2.script = "";
                break;
              default:
                error(parser2, "Max buffer length exceeded: " + buffers[i]);
            }
          }
          maxActual = Math.max(maxActual, len);
        }
        var m = sax2.MAX_BUFFER_LENGTH - maxActual;
        parser2.bufferCheckPosition = m + parser2.position;
      }
      function clearBuffers(parser2) {
        for (var i = 0, l = buffers.length; i < l; i++) {
          parser2[buffers[i]] = "";
        }
      }
      function flushBuffers(parser2) {
        closeText(parser2);
        if (parser2.cdata !== "") {
          emitNode(parser2, "oncdata", parser2.cdata);
          parser2.cdata = "";
        }
        if (parser2.script !== "") {
          emitNode(parser2, "onscript", parser2.script);
          parser2.script = "";
        }
      }
      SAXParser.prototype = {
        end: function() {
          end(this);
        },
        write,
        resume: function() {
          this.error = null;
          return this;
        },
        close: function() {
          return this.write(null);
        },
        flush: function() {
          flushBuffers(this);
        }
      };
      var Stream;
      try {
        Stream = require("stream").Stream;
      } catch (ex) {
        Stream = function() {
        };
      }
      if (!Stream) Stream = function() {
      };
      var streamWraps = sax2.EVENTS.filter(function(ev) {
        return ev !== "error" && ev !== "end";
      });
      function createStream(strict, opt) {
        return new SAXStream(strict, opt);
      }
      function SAXStream(strict, opt) {
        if (!(this instanceof SAXStream)) {
          return new SAXStream(strict, opt);
        }
        Stream.apply(this);
        this._parser = new SAXParser(strict, opt);
        this.writable = true;
        this.readable = true;
        var me = this;
        this._parser.onend = function() {
          me.emit("end");
        };
        this._parser.onerror = function(er) {
          me.emit("error", er);
          me._parser.error = null;
        };
        this._decoder = null;
        streamWraps.forEach(function(ev) {
          Object.defineProperty(me, "on" + ev, {
            get: function() {
              return me._parser["on" + ev];
            },
            set: function(h) {
              if (!h) {
                me.removeAllListeners(ev);
                me._parser["on" + ev] = h;
                return h;
              }
              me.on(ev, h);
            },
            enumerable: true,
            configurable: false
          });
        });
      }
      SAXStream.prototype = Object.create(Stream.prototype, {
        constructor: {
          value: SAXStream
        }
      });
      SAXStream.prototype.write = function(data) {
        if (typeof Buffer === "function" && typeof Buffer.isBuffer === "function" && Buffer.isBuffer(data)) {
          if (!this._decoder) {
            var SD = require$$1$1.StringDecoder;
            this._decoder = new SD("utf8");
          }
          data = this._decoder.write(data);
        }
        this._parser.write(data.toString());
        this.emit("data", data);
        return true;
      };
      SAXStream.prototype.end = function(chunk) {
        if (chunk && chunk.length) {
          this.write(chunk);
        }
        this._parser.end();
        return true;
      };
      SAXStream.prototype.on = function(ev, handler) {
        var me = this;
        if (!me._parser["on" + ev] && streamWraps.indexOf(ev) !== -1) {
          me._parser["on" + ev] = function() {
            var args = arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments);
            args.splice(0, 0, ev);
            me.emit.apply(me, args);
          };
        }
        return Stream.prototype.on.call(me, ev, handler);
      };
      var CDATA = "[CDATA[";
      var DOCTYPE = "DOCTYPE";
      var XML_NAMESPACE = "http://www.w3.org/XML/1998/namespace";
      var XMLNS_NAMESPACE = "http://www.w3.org/2000/xmlns/";
      var rootNS = { xml: XML_NAMESPACE, xmlns: XMLNS_NAMESPACE };
      var nameStart = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/;
      var nameBody = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/;
      var entityStart = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/;
      var entityBody = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/;
      function isWhitespace(c) {
        return c === " " || c === "\n" || c === "\r" || c === "	";
      }
      function isQuote(c) {
        return c === '"' || c === "'";
      }
      function isAttribEnd(c) {
        return c === ">" || isWhitespace(c);
      }
      function isMatch(regex, c) {
        return regex.test(c);
      }
      function notMatch(regex, c) {
        return !isMatch(regex, c);
      }
      var S = 0;
      sax2.STATE = {
        BEGIN: S++,
        // leading byte order mark or whitespace
        BEGIN_WHITESPACE: S++,
        // leading whitespace
        TEXT: S++,
        // general stuff
        TEXT_ENTITY: S++,
        // &amp and such.
        OPEN_WAKA: S++,
        // <
        SGML_DECL: S++,
        // <!BLARG
        SGML_DECL_QUOTED: S++,
        // <!BLARG foo "bar
        DOCTYPE: S++,
        // <!DOCTYPE
        DOCTYPE_QUOTED: S++,
        // <!DOCTYPE "//blah
        DOCTYPE_DTD: S++,
        // <!DOCTYPE "//blah" [ ...
        DOCTYPE_DTD_QUOTED: S++,
        // <!DOCTYPE "//blah" [ "foo
        COMMENT_STARTING: S++,
        // <!-
        COMMENT: S++,
        // <!--
        COMMENT_ENDING: S++,
        // <!-- blah -
        COMMENT_ENDED: S++,
        // <!-- blah --
        CDATA: S++,
        // <![CDATA[ something
        CDATA_ENDING: S++,
        // ]
        CDATA_ENDING_2: S++,
        // ]]
        PROC_INST: S++,
        // <?hi
        PROC_INST_BODY: S++,
        // <?hi there
        PROC_INST_ENDING: S++,
        // <?hi "there" ?
        OPEN_TAG: S++,
        // <strong
        OPEN_TAG_SLASH: S++,
        // <strong /
        ATTRIB: S++,
        // <a
        ATTRIB_NAME: S++,
        // <a foo
        ATTRIB_NAME_SAW_WHITE: S++,
        // <a foo _
        ATTRIB_VALUE: S++,
        // <a foo=
        ATTRIB_VALUE_QUOTED: S++,
        // <a foo="bar
        ATTRIB_VALUE_CLOSED: S++,
        // <a foo="bar"
        ATTRIB_VALUE_UNQUOTED: S++,
        // <a foo=bar
        ATTRIB_VALUE_ENTITY_Q: S++,
        // <foo bar="&quot;"
        ATTRIB_VALUE_ENTITY_U: S++,
        // <foo bar=&quot
        CLOSE_TAG: S++,
        // </a
        CLOSE_TAG_SAW_WHITE: S++,
        // </a   >
        SCRIPT: S++,
        // <script> ...
        SCRIPT_ENDING: S++
        // <script> ... <
      };
      sax2.XML_ENTITIES = {
        "amp": "&",
        "gt": ">",
        "lt": "<",
        "quot": '"',
        "apos": "'"
      };
      sax2.ENTITIES = {
        "amp": "&",
        "gt": ">",
        "lt": "<",
        "quot": '"',
        "apos": "'",
        "AElig": 198,
        "Aacute": 193,
        "Acirc": 194,
        "Agrave": 192,
        "Aring": 197,
        "Atilde": 195,
        "Auml": 196,
        "Ccedil": 199,
        "ETH": 208,
        "Eacute": 201,
        "Ecirc": 202,
        "Egrave": 200,
        "Euml": 203,
        "Iacute": 205,
        "Icirc": 206,
        "Igrave": 204,
        "Iuml": 207,
        "Ntilde": 209,
        "Oacute": 211,
        "Ocirc": 212,
        "Ograve": 210,
        "Oslash": 216,
        "Otilde": 213,
        "Ouml": 214,
        "THORN": 222,
        "Uacute": 218,
        "Ucirc": 219,
        "Ugrave": 217,
        "Uuml": 220,
        "Yacute": 221,
        "aacute": 225,
        "acirc": 226,
        "aelig": 230,
        "agrave": 224,
        "aring": 229,
        "atilde": 227,
        "auml": 228,
        "ccedil": 231,
        "eacute": 233,
        "ecirc": 234,
        "egrave": 232,
        "eth": 240,
        "euml": 235,
        "iacute": 237,
        "icirc": 238,
        "igrave": 236,
        "iuml": 239,
        "ntilde": 241,
        "oacute": 243,
        "ocirc": 244,
        "ograve": 242,
        "oslash": 248,
        "otilde": 245,
        "ouml": 246,
        "szlig": 223,
        "thorn": 254,
        "uacute": 250,
        "ucirc": 251,
        "ugrave": 249,
        "uuml": 252,
        "yacute": 253,
        "yuml": 255,
        "copy": 169,
        "reg": 174,
        "nbsp": 160,
        "iexcl": 161,
        "cent": 162,
        "pound": 163,
        "curren": 164,
        "yen": 165,
        "brvbar": 166,
        "sect": 167,
        "uml": 168,
        "ordf": 170,
        "laquo": 171,
        "not": 172,
        "shy": 173,
        "macr": 175,
        "deg": 176,
        "plusmn": 177,
        "sup1": 185,
        "sup2": 178,
        "sup3": 179,
        "acute": 180,
        "micro": 181,
        "para": 182,
        "middot": 183,
        "cedil": 184,
        "ordm": 186,
        "raquo": 187,
        "frac14": 188,
        "frac12": 189,
        "frac34": 190,
        "iquest": 191,
        "times": 215,
        "divide": 247,
        "OElig": 338,
        "oelig": 339,
        "Scaron": 352,
        "scaron": 353,
        "Yuml": 376,
        "fnof": 402,
        "circ": 710,
        "tilde": 732,
        "Alpha": 913,
        "Beta": 914,
        "Gamma": 915,
        "Delta": 916,
        "Epsilon": 917,
        "Zeta": 918,
        "Eta": 919,
        "Theta": 920,
        "Iota": 921,
        "Kappa": 922,
        "Lambda": 923,
        "Mu": 924,
        "Nu": 925,
        "Xi": 926,
        "Omicron": 927,
        "Pi": 928,
        "Rho": 929,
        "Sigma": 931,
        "Tau": 932,
        "Upsilon": 933,
        "Phi": 934,
        "Chi": 935,
        "Psi": 936,
        "Omega": 937,
        "alpha": 945,
        "beta": 946,
        "gamma": 947,
        "delta": 948,
        "epsilon": 949,
        "zeta": 950,
        "eta": 951,
        "theta": 952,
        "iota": 953,
        "kappa": 954,
        "lambda": 955,
        "mu": 956,
        "nu": 957,
        "xi": 958,
        "omicron": 959,
        "pi": 960,
        "rho": 961,
        "sigmaf": 962,
        "sigma": 963,
        "tau": 964,
        "upsilon": 965,
        "phi": 966,
        "chi": 967,
        "psi": 968,
        "omega": 969,
        "thetasym": 977,
        "upsih": 978,
        "piv": 982,
        "ensp": 8194,
        "emsp": 8195,
        "thinsp": 8201,
        "zwnj": 8204,
        "zwj": 8205,
        "lrm": 8206,
        "rlm": 8207,
        "ndash": 8211,
        "mdash": 8212,
        "lsquo": 8216,
        "rsquo": 8217,
        "sbquo": 8218,
        "ldquo": 8220,
        "rdquo": 8221,
        "bdquo": 8222,
        "dagger": 8224,
        "Dagger": 8225,
        "bull": 8226,
        "hellip": 8230,
        "permil": 8240,
        "prime": 8242,
        "Prime": 8243,
        "lsaquo": 8249,
        "rsaquo": 8250,
        "oline": 8254,
        "frasl": 8260,
        "euro": 8364,
        "image": 8465,
        "weierp": 8472,
        "real": 8476,
        "trade": 8482,
        "alefsym": 8501,
        "larr": 8592,
        "uarr": 8593,
        "rarr": 8594,
        "darr": 8595,
        "harr": 8596,
        "crarr": 8629,
        "lArr": 8656,
        "uArr": 8657,
        "rArr": 8658,
        "dArr": 8659,
        "hArr": 8660,
        "forall": 8704,
        "part": 8706,
        "exist": 8707,
        "empty": 8709,
        "nabla": 8711,
        "isin": 8712,
        "notin": 8713,
        "ni": 8715,
        "prod": 8719,
        "sum": 8721,
        "minus": 8722,
        "lowast": 8727,
        "radic": 8730,
        "prop": 8733,
        "infin": 8734,
        "ang": 8736,
        "and": 8743,
        "or": 8744,
        "cap": 8745,
        "cup": 8746,
        "int": 8747,
        "there4": 8756,
        "sim": 8764,
        "cong": 8773,
        "asymp": 8776,
        "ne": 8800,
        "equiv": 8801,
        "le": 8804,
        "ge": 8805,
        "sub": 8834,
        "sup": 8835,
        "nsub": 8836,
        "sube": 8838,
        "supe": 8839,
        "oplus": 8853,
        "otimes": 8855,
        "perp": 8869,
        "sdot": 8901,
        "lceil": 8968,
        "rceil": 8969,
        "lfloor": 8970,
        "rfloor": 8971,
        "lang": 9001,
        "rang": 9002,
        "loz": 9674,
        "spades": 9824,
        "clubs": 9827,
        "hearts": 9829,
        "diams": 9830
      };
      Object.keys(sax2.ENTITIES).forEach(function(key) {
        var e = sax2.ENTITIES[key];
        var s2 = typeof e === "number" ? String.fromCharCode(e) : e;
        sax2.ENTITIES[key] = s2;
      });
      for (var s in sax2.STATE) {
        sax2.STATE[sax2.STATE[s]] = s;
      }
      S = sax2.STATE;
      function emit(parser2, event, data) {
        parser2[event] && parser2[event](data);
      }
      function emitNode(parser2, nodeType, data) {
        if (parser2.textNode) closeText(parser2);
        emit(parser2, nodeType, data);
      }
      function closeText(parser2) {
        parser2.textNode = textopts(parser2.opt, parser2.textNode);
        if (parser2.textNode) emit(parser2, "ontext", parser2.textNode);
        parser2.textNode = "";
      }
      function textopts(opt, text) {
        if (opt.trim) text = text.trim();
        if (opt.normalize) text = text.replace(/\s+/g, " ");
        return text;
      }
      function error(parser2, er) {
        closeText(parser2);
        if (parser2.trackPosition) {
          er += "\nLine: " + parser2.line + "\nColumn: " + parser2.column + "\nChar: " + parser2.c;
        }
        er = new Error(er);
        parser2.error = er;
        emit(parser2, "onerror", er);
        return parser2;
      }
      function end(parser2) {
        if (parser2.sawRoot && !parser2.closedRoot) strictFail(parser2, "Unclosed root tag");
        if (parser2.state !== S.BEGIN && parser2.state !== S.BEGIN_WHITESPACE && parser2.state !== S.TEXT) {
          error(parser2, "Unexpected end");
        }
        closeText(parser2);
        parser2.c = "";
        parser2.closed = true;
        emit(parser2, "onend");
        SAXParser.call(parser2, parser2.strict, parser2.opt);
        return parser2;
      }
      function strictFail(parser2, message) {
        if (typeof parser2 !== "object" || !(parser2 instanceof SAXParser)) {
          throw new Error("bad call to strictFail");
        }
        if (parser2.strict) {
          error(parser2, message);
        }
      }
      function newTag(parser2) {
        if (!parser2.strict) parser2.tagName = parser2.tagName[parser2.looseCase]();
        var parent = parser2.tags[parser2.tags.length - 1] || parser2;
        var tag = parser2.tag = { name: parser2.tagName, attributes: {} };
        if (parser2.opt.xmlns) {
          tag.ns = parent.ns;
        }
        parser2.attribList.length = 0;
        emitNode(parser2, "onopentagstart", tag);
      }
      function qname(name, attribute) {
        var i = name.indexOf(":");
        var qualName = i < 0 ? ["", name] : name.split(":");
        var prefix = qualName[0];
        var local = qualName[1];
        if (attribute && name === "xmlns") {
          prefix = "xmlns";
          local = "";
        }
        return { prefix, local };
      }
      function attrib(parser2) {
        if (!parser2.strict) {
          parser2.attribName = parser2.attribName[parser2.looseCase]();
        }
        if (parser2.attribList.indexOf(parser2.attribName) !== -1 || parser2.tag.attributes.hasOwnProperty(parser2.attribName)) {
          parser2.attribName = parser2.attribValue = "";
          return;
        }
        if (parser2.opt.xmlns) {
          var qn = qname(parser2.attribName, true);
          var prefix = qn.prefix;
          var local = qn.local;
          if (prefix === "xmlns") {
            if (local === "xml" && parser2.attribValue !== XML_NAMESPACE) {
              strictFail(
                parser2,
                "xml: prefix must be bound to " + XML_NAMESPACE + "\nActual: " + parser2.attribValue
              );
            } else if (local === "xmlns" && parser2.attribValue !== XMLNS_NAMESPACE) {
              strictFail(
                parser2,
                "xmlns: prefix must be bound to " + XMLNS_NAMESPACE + "\nActual: " + parser2.attribValue
              );
            } else {
              var tag = parser2.tag;
              var parent = parser2.tags[parser2.tags.length - 1] || parser2;
              if (tag.ns === parent.ns) {
                tag.ns = Object.create(parent.ns);
              }
              tag.ns[local] = parser2.attribValue;
            }
          }
          parser2.attribList.push([parser2.attribName, parser2.attribValue]);
        } else {
          parser2.tag.attributes[parser2.attribName] = parser2.attribValue;
          emitNode(parser2, "onattribute", {
            name: parser2.attribName,
            value: parser2.attribValue
          });
        }
        parser2.attribName = parser2.attribValue = "";
      }
      function openTag(parser2, selfClosing) {
        if (parser2.opt.xmlns) {
          var tag = parser2.tag;
          var qn = qname(parser2.tagName);
          tag.prefix = qn.prefix;
          tag.local = qn.local;
          tag.uri = tag.ns[qn.prefix] || "";
          if (tag.prefix && !tag.uri) {
            strictFail(parser2, "Unbound namespace prefix: " + JSON.stringify(parser2.tagName));
            tag.uri = qn.prefix;
          }
          var parent = parser2.tags[parser2.tags.length - 1] || parser2;
          if (tag.ns && parent.ns !== tag.ns) {
            Object.keys(tag.ns).forEach(function(p) {
              emitNode(parser2, "onopennamespace", {
                prefix: p,
                uri: tag.ns[p]
              });
            });
          }
          for (var i = 0, l = parser2.attribList.length; i < l; i++) {
            var nv = parser2.attribList[i];
            var name = nv[0];
            var value = nv[1];
            var qualName = qname(name, true);
            var prefix = qualName.prefix;
            var local = qualName.local;
            var uri = prefix === "" ? "" : tag.ns[prefix] || "";
            var a = {
              name,
              value,
              prefix,
              local,
              uri
            };
            if (prefix && prefix !== "xmlns" && !uri) {
              strictFail(parser2, "Unbound namespace prefix: " + JSON.stringify(prefix));
              a.uri = prefix;
            }
            parser2.tag.attributes[name] = a;
            emitNode(parser2, "onattribute", a);
          }
          parser2.attribList.length = 0;
        }
        parser2.tag.isSelfClosing = !!selfClosing;
        parser2.sawRoot = true;
        parser2.tags.push(parser2.tag);
        emitNode(parser2, "onopentag", parser2.tag);
        if (!selfClosing) {
          if (!parser2.noscript && parser2.tagName.toLowerCase() === "script") {
            parser2.state = S.SCRIPT;
          } else {
            parser2.state = S.TEXT;
          }
          parser2.tag = null;
          parser2.tagName = "";
        }
        parser2.attribName = parser2.attribValue = "";
        parser2.attribList.length = 0;
      }
      function closeTag(parser2) {
        if (!parser2.tagName) {
          strictFail(parser2, "Weird empty close tag.");
          parser2.textNode += "</>";
          parser2.state = S.TEXT;
          return;
        }
        if (parser2.script) {
          if (parser2.tagName !== "script") {
            parser2.script += "</" + parser2.tagName + ">";
            parser2.tagName = "";
            parser2.state = S.SCRIPT;
            return;
          }
          emitNode(parser2, "onscript", parser2.script);
          parser2.script = "";
        }
        var t = parser2.tags.length;
        var tagName = parser2.tagName;
        if (!parser2.strict) {
          tagName = tagName[parser2.looseCase]();
        }
        var closeTo = tagName;
        while (t--) {
          var close = parser2.tags[t];
          if (close.name !== closeTo) {
            strictFail(parser2, "Unexpected close tag");
          } else {
            break;
          }
        }
        if (t < 0) {
          strictFail(parser2, "Unmatched closing tag: " + parser2.tagName);
          parser2.textNode += "</" + parser2.tagName + ">";
          parser2.state = S.TEXT;
          return;
        }
        parser2.tagName = tagName;
        var s2 = parser2.tags.length;
        while (s2-- > t) {
          var tag = parser2.tag = parser2.tags.pop();
          parser2.tagName = parser2.tag.name;
          emitNode(parser2, "onclosetag", parser2.tagName);
          var x = {};
          for (var i in tag.ns) {
            x[i] = tag.ns[i];
          }
          var parent = parser2.tags[parser2.tags.length - 1] || parser2;
          if (parser2.opt.xmlns && tag.ns !== parent.ns) {
            Object.keys(tag.ns).forEach(function(p) {
              var n = tag.ns[p];
              emitNode(parser2, "onclosenamespace", { prefix: p, uri: n });
            });
          }
        }
        if (t === 0) parser2.closedRoot = true;
        parser2.tagName = parser2.attribValue = parser2.attribName = "";
        parser2.attribList.length = 0;
        parser2.state = S.TEXT;
      }
      function parseEntity(parser2) {
        var entity = parser2.entity;
        var entityLC = entity.toLowerCase();
        var num;
        var numStr = "";
        if (parser2.ENTITIES[entity]) {
          return parser2.ENTITIES[entity];
        }
        if (parser2.ENTITIES[entityLC]) {
          return parser2.ENTITIES[entityLC];
        }
        entity = entityLC;
        if (entity.charAt(0) === "#") {
          if (entity.charAt(1) === "x") {
            entity = entity.slice(2);
            num = parseInt(entity, 16);
            numStr = num.toString(16);
          } else {
            entity = entity.slice(1);
            num = parseInt(entity, 10);
            numStr = num.toString(10);
          }
        }
        entity = entity.replace(/^0+/, "");
        if (isNaN(num) || numStr.toLowerCase() !== entity) {
          strictFail(parser2, "Invalid character entity");
          return "&" + parser2.entity + ";";
        }
        return String.fromCodePoint(num);
      }
      function beginWhiteSpace(parser2, c) {
        if (c === "<") {
          parser2.state = S.OPEN_WAKA;
          parser2.startTagPosition = parser2.position;
        } else if (!isWhitespace(c)) {
          strictFail(parser2, "Non-whitespace before first tag.");
          parser2.textNode = c;
          parser2.state = S.TEXT;
        }
      }
      function charAt(chunk, i) {
        var result = "";
        if (i < chunk.length) {
          result = chunk.charAt(i);
        }
        return result;
      }
      function write(chunk) {
        var parser2 = this;
        if (this.error) {
          throw this.error;
        }
        if (parser2.closed) {
          return error(
            parser2,
            "Cannot write after close. Assign an onready handler."
          );
        }
        if (chunk === null) {
          return end(parser2);
        }
        if (typeof chunk === "object") {
          chunk = chunk.toString();
        }
        var i = 0;
        var c = "";
        while (true) {
          c = charAt(chunk, i++);
          parser2.c = c;
          if (!c) {
            break;
          }
          if (parser2.trackPosition) {
            parser2.position++;
            if (c === "\n") {
              parser2.line++;
              parser2.column = 0;
            } else {
              parser2.column++;
            }
          }
          switch (parser2.state) {
            case S.BEGIN:
              parser2.state = S.BEGIN_WHITESPACE;
              if (c === "\uFEFF") {
                continue;
              }
              beginWhiteSpace(parser2, c);
              continue;
            case S.BEGIN_WHITESPACE:
              beginWhiteSpace(parser2, c);
              continue;
            case S.TEXT:
              if (parser2.sawRoot && !parser2.closedRoot) {
                var starti = i - 1;
                while (c && c !== "<" && c !== "&") {
                  c = charAt(chunk, i++);
                  if (c && parser2.trackPosition) {
                    parser2.position++;
                    if (c === "\n") {
                      parser2.line++;
                      parser2.column = 0;
                    } else {
                      parser2.column++;
                    }
                  }
                }
                parser2.textNode += chunk.substring(starti, i - 1);
              }
              if (c === "<" && !(parser2.sawRoot && parser2.closedRoot && !parser2.strict)) {
                parser2.state = S.OPEN_WAKA;
                parser2.startTagPosition = parser2.position;
              } else {
                if (!isWhitespace(c) && (!parser2.sawRoot || parser2.closedRoot)) {
                  strictFail(parser2, "Text data outside of root node.");
                }
                if (c === "&") {
                  parser2.state = S.TEXT_ENTITY;
                } else {
                  parser2.textNode += c;
                }
              }
              continue;
            case S.SCRIPT:
              if (c === "<") {
                parser2.state = S.SCRIPT_ENDING;
              } else {
                parser2.script += c;
              }
              continue;
            case S.SCRIPT_ENDING:
              if (c === "/") {
                parser2.state = S.CLOSE_TAG;
              } else {
                parser2.script += "<" + c;
                parser2.state = S.SCRIPT;
              }
              continue;
            case S.OPEN_WAKA:
              if (c === "!") {
                parser2.state = S.SGML_DECL;
                parser2.sgmlDecl = "";
              } else if (isWhitespace(c)) ;
              else if (isMatch(nameStart, c)) {
                parser2.state = S.OPEN_TAG;
                parser2.tagName = c;
              } else if (c === "/") {
                parser2.state = S.CLOSE_TAG;
                parser2.tagName = "";
              } else if (c === "?") {
                parser2.state = S.PROC_INST;
                parser2.procInstName = parser2.procInstBody = "";
              } else {
                strictFail(parser2, "Unencoded <");
                if (parser2.startTagPosition + 1 < parser2.position) {
                  var pad = parser2.position - parser2.startTagPosition;
                  c = new Array(pad).join(" ") + c;
                }
                parser2.textNode += "<" + c;
                parser2.state = S.TEXT;
              }
              continue;
            case S.SGML_DECL:
              if (parser2.sgmlDecl + c === "--") {
                parser2.state = S.COMMENT;
                parser2.comment = "";
                parser2.sgmlDecl = "";
                continue;
              }
              if (parser2.doctype && parser2.doctype !== true && parser2.sgmlDecl) {
                parser2.state = S.DOCTYPE_DTD;
                parser2.doctype += "<!" + parser2.sgmlDecl + c;
                parser2.sgmlDecl = "";
              } else if ((parser2.sgmlDecl + c).toUpperCase() === CDATA) {
                emitNode(parser2, "onopencdata");
                parser2.state = S.CDATA;
                parser2.sgmlDecl = "";
                parser2.cdata = "";
              } else if ((parser2.sgmlDecl + c).toUpperCase() === DOCTYPE) {
                parser2.state = S.DOCTYPE;
                if (parser2.doctype || parser2.sawRoot) {
                  strictFail(
                    parser2,
                    "Inappropriately located doctype declaration"
                  );
                }
                parser2.doctype = "";
                parser2.sgmlDecl = "";
              } else if (c === ">") {
                emitNode(parser2, "onsgmldeclaration", parser2.sgmlDecl);
                parser2.sgmlDecl = "";
                parser2.state = S.TEXT;
              } else if (isQuote(c)) {
                parser2.state = S.SGML_DECL_QUOTED;
                parser2.sgmlDecl += c;
              } else {
                parser2.sgmlDecl += c;
              }
              continue;
            case S.SGML_DECL_QUOTED:
              if (c === parser2.q) {
                parser2.state = S.SGML_DECL;
                parser2.q = "";
              }
              parser2.sgmlDecl += c;
              continue;
            case S.DOCTYPE:
              if (c === ">") {
                parser2.state = S.TEXT;
                emitNode(parser2, "ondoctype", parser2.doctype);
                parser2.doctype = true;
              } else {
                parser2.doctype += c;
                if (c === "[") {
                  parser2.state = S.DOCTYPE_DTD;
                } else if (isQuote(c)) {
                  parser2.state = S.DOCTYPE_QUOTED;
                  parser2.q = c;
                }
              }
              continue;
            case S.DOCTYPE_QUOTED:
              parser2.doctype += c;
              if (c === parser2.q) {
                parser2.q = "";
                parser2.state = S.DOCTYPE;
              }
              continue;
            case S.DOCTYPE_DTD:
              if (c === "]") {
                parser2.doctype += c;
                parser2.state = S.DOCTYPE;
              } else if (c === "<") {
                parser2.state = S.OPEN_WAKA;
                parser2.startTagPosition = parser2.position;
              } else if (isQuote(c)) {
                parser2.doctype += c;
                parser2.state = S.DOCTYPE_DTD_QUOTED;
                parser2.q = c;
              } else {
                parser2.doctype += c;
              }
              continue;
            case S.DOCTYPE_DTD_QUOTED:
              parser2.doctype += c;
              if (c === parser2.q) {
                parser2.state = S.DOCTYPE_DTD;
                parser2.q = "";
              }
              continue;
            case S.COMMENT:
              if (c === "-") {
                parser2.state = S.COMMENT_ENDING;
              } else {
                parser2.comment += c;
              }
              continue;
            case S.COMMENT_ENDING:
              if (c === "-") {
                parser2.state = S.COMMENT_ENDED;
                parser2.comment = textopts(parser2.opt, parser2.comment);
                if (parser2.comment) {
                  emitNode(parser2, "oncomment", parser2.comment);
                }
                parser2.comment = "";
              } else {
                parser2.comment += "-" + c;
                parser2.state = S.COMMENT;
              }
              continue;
            case S.COMMENT_ENDED:
              if (c !== ">") {
                strictFail(parser2, "Malformed comment");
                parser2.comment += "--" + c;
                parser2.state = S.COMMENT;
              } else if (parser2.doctype && parser2.doctype !== true) {
                parser2.state = S.DOCTYPE_DTD;
              } else {
                parser2.state = S.TEXT;
              }
              continue;
            case S.CDATA:
              if (c === "]") {
                parser2.state = S.CDATA_ENDING;
              } else {
                parser2.cdata += c;
              }
              continue;
            case S.CDATA_ENDING:
              if (c === "]") {
                parser2.state = S.CDATA_ENDING_2;
              } else {
                parser2.cdata += "]" + c;
                parser2.state = S.CDATA;
              }
              continue;
            case S.CDATA_ENDING_2:
              if (c === ">") {
                if (parser2.cdata) {
                  emitNode(parser2, "oncdata", parser2.cdata);
                }
                emitNode(parser2, "onclosecdata");
                parser2.cdata = "";
                parser2.state = S.TEXT;
              } else if (c === "]") {
                parser2.cdata += "]";
              } else {
                parser2.cdata += "]]" + c;
                parser2.state = S.CDATA;
              }
              continue;
            case S.PROC_INST:
              if (c === "?") {
                parser2.state = S.PROC_INST_ENDING;
              } else if (isWhitespace(c)) {
                parser2.state = S.PROC_INST_BODY;
              } else {
                parser2.procInstName += c;
              }
              continue;
            case S.PROC_INST_BODY:
              if (!parser2.procInstBody && isWhitespace(c)) {
                continue;
              } else if (c === "?") {
                parser2.state = S.PROC_INST_ENDING;
              } else {
                parser2.procInstBody += c;
              }
              continue;
            case S.PROC_INST_ENDING:
              if (c === ">") {
                emitNode(parser2, "onprocessinginstruction", {
                  name: parser2.procInstName,
                  body: parser2.procInstBody
                });
                parser2.procInstName = parser2.procInstBody = "";
                parser2.state = S.TEXT;
              } else {
                parser2.procInstBody += "?" + c;
                parser2.state = S.PROC_INST_BODY;
              }
              continue;
            case S.OPEN_TAG:
              if (isMatch(nameBody, c)) {
                parser2.tagName += c;
              } else {
                newTag(parser2);
                if (c === ">") {
                  openTag(parser2);
                } else if (c === "/") {
                  parser2.state = S.OPEN_TAG_SLASH;
                } else {
                  if (!isWhitespace(c)) {
                    strictFail(parser2, "Invalid character in tag name");
                  }
                  parser2.state = S.ATTRIB;
                }
              }
              continue;
            case S.OPEN_TAG_SLASH:
              if (c === ">") {
                openTag(parser2, true);
                closeTag(parser2);
              } else {
                strictFail(parser2, "Forward-slash in opening tag not followed by >");
                parser2.state = S.ATTRIB;
              }
              continue;
            case S.ATTRIB:
              if (isWhitespace(c)) {
                continue;
              } else if (c === ">") {
                openTag(parser2);
              } else if (c === "/") {
                parser2.state = S.OPEN_TAG_SLASH;
              } else if (isMatch(nameStart, c)) {
                parser2.attribName = c;
                parser2.attribValue = "";
                parser2.state = S.ATTRIB_NAME;
              } else {
                strictFail(parser2, "Invalid attribute name");
              }
              continue;
            case S.ATTRIB_NAME:
              if (c === "=") {
                parser2.state = S.ATTRIB_VALUE;
              } else if (c === ">") {
                strictFail(parser2, "Attribute without value");
                parser2.attribValue = parser2.attribName;
                attrib(parser2);
                openTag(parser2);
              } else if (isWhitespace(c)) {
                parser2.state = S.ATTRIB_NAME_SAW_WHITE;
              } else if (isMatch(nameBody, c)) {
                parser2.attribName += c;
              } else {
                strictFail(parser2, "Invalid attribute name");
              }
              continue;
            case S.ATTRIB_NAME_SAW_WHITE:
              if (c === "=") {
                parser2.state = S.ATTRIB_VALUE;
              } else if (isWhitespace(c)) {
                continue;
              } else {
                strictFail(parser2, "Attribute without value");
                parser2.tag.attributes[parser2.attribName] = "";
                parser2.attribValue = "";
                emitNode(parser2, "onattribute", {
                  name: parser2.attribName,
                  value: ""
                });
                parser2.attribName = "";
                if (c === ">") {
                  openTag(parser2);
                } else if (isMatch(nameStart, c)) {
                  parser2.attribName = c;
                  parser2.state = S.ATTRIB_NAME;
                } else {
                  strictFail(parser2, "Invalid attribute name");
                  parser2.state = S.ATTRIB;
                }
              }
              continue;
            case S.ATTRIB_VALUE:
              if (isWhitespace(c)) {
                continue;
              } else if (isQuote(c)) {
                parser2.q = c;
                parser2.state = S.ATTRIB_VALUE_QUOTED;
              } else {
                if (!parser2.opt.unquotedAttributeValues) {
                  error(parser2, "Unquoted attribute value");
                }
                parser2.state = S.ATTRIB_VALUE_UNQUOTED;
                parser2.attribValue = c;
              }
              continue;
            case S.ATTRIB_VALUE_QUOTED:
              if (c !== parser2.q) {
                if (c === "&") {
                  parser2.state = S.ATTRIB_VALUE_ENTITY_Q;
                } else {
                  parser2.attribValue += c;
                }
                continue;
              }
              attrib(parser2);
              parser2.q = "";
              parser2.state = S.ATTRIB_VALUE_CLOSED;
              continue;
            case S.ATTRIB_VALUE_CLOSED:
              if (isWhitespace(c)) {
                parser2.state = S.ATTRIB;
              } else if (c === ">") {
                openTag(parser2);
              } else if (c === "/") {
                parser2.state = S.OPEN_TAG_SLASH;
              } else if (isMatch(nameStart, c)) {
                strictFail(parser2, "No whitespace between attributes");
                parser2.attribName = c;
                parser2.attribValue = "";
                parser2.state = S.ATTRIB_NAME;
              } else {
                strictFail(parser2, "Invalid attribute name");
              }
              continue;
            case S.ATTRIB_VALUE_UNQUOTED:
              if (!isAttribEnd(c)) {
                if (c === "&") {
                  parser2.state = S.ATTRIB_VALUE_ENTITY_U;
                } else {
                  parser2.attribValue += c;
                }
                continue;
              }
              attrib(parser2);
              if (c === ">") {
                openTag(parser2);
              } else {
                parser2.state = S.ATTRIB;
              }
              continue;
            case S.CLOSE_TAG:
              if (!parser2.tagName) {
                if (isWhitespace(c)) {
                  continue;
                } else if (notMatch(nameStart, c)) {
                  if (parser2.script) {
                    parser2.script += "</" + c;
                    parser2.state = S.SCRIPT;
                  } else {
                    strictFail(parser2, "Invalid tagname in closing tag.");
                  }
                } else {
                  parser2.tagName = c;
                }
              } else if (c === ">") {
                closeTag(parser2);
              } else if (isMatch(nameBody, c)) {
                parser2.tagName += c;
              } else if (parser2.script) {
                parser2.script += "</" + parser2.tagName;
                parser2.tagName = "";
                parser2.state = S.SCRIPT;
              } else {
                if (!isWhitespace(c)) {
                  strictFail(parser2, "Invalid tagname in closing tag");
                }
                parser2.state = S.CLOSE_TAG_SAW_WHITE;
              }
              continue;
            case S.CLOSE_TAG_SAW_WHITE:
              if (isWhitespace(c)) {
                continue;
              }
              if (c === ">") {
                closeTag(parser2);
              } else {
                strictFail(parser2, "Invalid characters in closing tag");
              }
              continue;
            case S.TEXT_ENTITY:
            case S.ATTRIB_VALUE_ENTITY_Q:
            case S.ATTRIB_VALUE_ENTITY_U:
              var returnState;
              var buffer;
              switch (parser2.state) {
                case S.TEXT_ENTITY:
                  returnState = S.TEXT;
                  buffer = "textNode";
                  break;
                case S.ATTRIB_VALUE_ENTITY_Q:
                  returnState = S.ATTRIB_VALUE_QUOTED;
                  buffer = "attribValue";
                  break;
                case S.ATTRIB_VALUE_ENTITY_U:
                  returnState = S.ATTRIB_VALUE_UNQUOTED;
                  buffer = "attribValue";
                  break;
              }
              if (c === ";") {
                var parsedEntity = parseEntity(parser2);
                if (parser2.opt.unparsedEntities && !Object.values(sax2.XML_ENTITIES).includes(parsedEntity)) {
                  parser2.entity = "";
                  parser2.state = returnState;
                  parser2.write(parsedEntity);
                } else {
                  parser2[buffer] += parsedEntity;
                  parser2.entity = "";
                  parser2.state = returnState;
                }
              } else if (isMatch(parser2.entity.length ? entityBody : entityStart, c)) {
                parser2.entity += c;
              } else {
                strictFail(parser2, "Invalid character in entity name");
                parser2[buffer] += "&" + parser2.entity + c;
                parser2.entity = "";
                parser2.state = returnState;
              }
              continue;
            default: {
              throw new Error(parser2, "Unknown state: " + parser2.state);
            }
          }
        }
        if (parser2.position >= parser2.bufferCheckPosition) {
          checkBufferLength(parser2);
        }
        return parser2;
      }
      /*! http://mths.be/fromcodepoint v0.1.0 by @mathias */
      if (!String.fromCodePoint) {
        (function() {
          var stringFromCharCode = String.fromCharCode;
          var floor = Math.floor;
          var fromCodePoint = function() {
            var MAX_SIZE = 16384;
            var codeUnits = [];
            var highSurrogate;
            var lowSurrogate;
            var index2 = -1;
            var length = arguments.length;
            if (!length) {
              return "";
            }
            var result = "";
            while (++index2 < length) {
              var codePoint = Number(arguments[index2]);
              if (!isFinite(codePoint) || // `NaN`, `+Infinity`, or `-Infinity`
              codePoint < 0 || // not a valid Unicode code point
              codePoint > 1114111 || // not a valid Unicode code point
              floor(codePoint) !== codePoint) {
                throw RangeError("Invalid code point: " + codePoint);
              }
              if (codePoint <= 65535) {
                codeUnits.push(codePoint);
              } else {
                codePoint -= 65536;
                highSurrogate = (codePoint >> 10) + 55296;
                lowSurrogate = codePoint % 1024 + 56320;
                codeUnits.push(highSurrogate, lowSurrogate);
              }
              if (index2 + 1 === length || codeUnits.length > MAX_SIZE) {
                result += stringFromCharCode.apply(null, codeUnits);
                codeUnits.length = 0;
              }
            }
            return result;
          };
          if (Object.defineProperty) {
            Object.defineProperty(String, "fromCodePoint", {
              value: fromCodePoint,
              configurable: true,
              writable: true
            });
          } else {
            String.fromCodePoint = fromCodePoint;
          }
        })();
      }
    })(exports);
  })(sax);
  return sax;
}
var bom = {};
var hasRequiredBom;
function requireBom() {
  if (hasRequiredBom) return bom;
  hasRequiredBom = 1;
  (function() {
    bom.stripBOM = function(str) {
      if (str[0] === "\uFEFF") {
        return str.substring(1);
      } else {
        return str;
      }
    };
  }).call(bom);
  return bom;
}
var processors = {};
var hasRequiredProcessors;
function requireProcessors() {
  if (hasRequiredProcessors) return processors;
  hasRequiredProcessors = 1;
  (function() {
    var prefixMatch;
    prefixMatch = new RegExp(/(?!xmlns)^.*:/);
    processors.normalize = function(str) {
      return str.toLowerCase();
    };
    processors.firstCharLowerCase = function(str) {
      return str.charAt(0).toLowerCase() + str.slice(1);
    };
    processors.stripPrefix = function(str) {
      return str.replace(prefixMatch, "");
    };
    processors.parseNumbers = function(str) {
      if (!isNaN(str)) {
        str = str % 1 === 0 ? parseInt(str, 10) : parseFloat(str);
      }
      return str;
    };
    processors.parseBooleans = function(str) {
      if (/^(?:true|false)$/i.test(str)) {
        str = str.toLowerCase() === "true";
      }
      return str;
    };
  }).call(processors);
  return processors;
}
var hasRequiredParser$1;
function requireParser$1() {
  if (hasRequiredParser$1) return parser;
  hasRequiredParser$1 = 1;
  (function(exports) {
    (function() {
      var bom2, defaults2, defineProperty, events, isEmpty2, processItem, processors2, sax2, setImmediate2, bind = function(fn, me) {
        return function() {
          return fn.apply(me, arguments);
        };
      }, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key)) child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      sax2 = requireSax();
      events = require$$0;
      bom2 = requireBom();
      processors2 = requireProcessors();
      setImmediate2 = require$$4.setImmediate;
      defaults2 = requireDefaults().defaults;
      isEmpty2 = function(thing) {
        return typeof thing === "object" && thing != null && Object.keys(thing).length === 0;
      };
      processItem = function(processors3, item, key) {
        var i, len, process2;
        for (i = 0, len = processors3.length; i < len; i++) {
          process2 = processors3[i];
          item = process2(item, key);
        }
        return item;
      };
      defineProperty = function(obj, key, value) {
        var descriptor;
        descriptor = /* @__PURE__ */ Object.create(null);
        descriptor.value = value;
        descriptor.writable = true;
        descriptor.enumerable = true;
        descriptor.configurable = true;
        return Object.defineProperty(obj, key, descriptor);
      };
      exports.Parser = (function(superClass) {
        extend(Parser2, superClass);
        function Parser2(opts) {
          this.parseStringPromise = bind(this.parseStringPromise, this);
          this.parseString = bind(this.parseString, this);
          this.reset = bind(this.reset, this);
          this.assignOrPush = bind(this.assignOrPush, this);
          this.processAsync = bind(this.processAsync, this);
          var key, ref, value;
          if (!(this instanceof exports.Parser)) {
            return new exports.Parser(opts);
          }
          this.options = {};
          ref = defaults2["0.2"];
          for (key in ref) {
            if (!hasProp.call(ref, key)) continue;
            value = ref[key];
            this.options[key] = value;
          }
          for (key in opts) {
            if (!hasProp.call(opts, key)) continue;
            value = opts[key];
            this.options[key] = value;
          }
          if (this.options.xmlns) {
            this.options.xmlnskey = this.options.attrkey + "ns";
          }
          if (this.options.normalizeTags) {
            if (!this.options.tagNameProcessors) {
              this.options.tagNameProcessors = [];
            }
            this.options.tagNameProcessors.unshift(processors2.normalize);
          }
          this.reset();
        }
        Parser2.prototype.processAsync = function() {
          var chunk, err;
          try {
            if (this.remaining.length <= this.options.chunkSize) {
              chunk = this.remaining;
              this.remaining = "";
              this.saxParser = this.saxParser.write(chunk);
              return this.saxParser.close();
            } else {
              chunk = this.remaining.substr(0, this.options.chunkSize);
              this.remaining = this.remaining.substr(this.options.chunkSize, this.remaining.length);
              this.saxParser = this.saxParser.write(chunk);
              return setImmediate2(this.processAsync);
            }
          } catch (error1) {
            err = error1;
            if (!this.saxParser.errThrown) {
              this.saxParser.errThrown = true;
              return this.emit(err);
            }
          }
        };
        Parser2.prototype.assignOrPush = function(obj, key, newValue) {
          if (!(key in obj)) {
            if (!this.options.explicitArray) {
              return defineProperty(obj, key, newValue);
            } else {
              return defineProperty(obj, key, [newValue]);
            }
          } else {
            if (!(obj[key] instanceof Array)) {
              defineProperty(obj, key, [obj[key]]);
            }
            return obj[key].push(newValue);
          }
        };
        Parser2.prototype.reset = function() {
          var attrkey, charkey, ontext, stack;
          this.removeAllListeners();
          this.saxParser = sax2.parser(this.options.strict, {
            trim: false,
            normalize: false,
            xmlns: this.options.xmlns
          });
          this.saxParser.errThrown = false;
          this.saxParser.onerror = /* @__PURE__ */ (function(_this) {
            return function(error) {
              _this.saxParser.resume();
              if (!_this.saxParser.errThrown) {
                _this.saxParser.errThrown = true;
                return _this.emit("error", error);
              }
            };
          })(this);
          this.saxParser.onend = /* @__PURE__ */ (function(_this) {
            return function() {
              if (!_this.saxParser.ended) {
                _this.saxParser.ended = true;
                return _this.emit("end", _this.resultObject);
              }
            };
          })(this);
          this.saxParser.ended = false;
          this.EXPLICIT_CHARKEY = this.options.explicitCharkey;
          this.resultObject = null;
          stack = [];
          attrkey = this.options.attrkey;
          charkey = this.options.charkey;
          this.saxParser.onopentag = /* @__PURE__ */ (function(_this) {
            return function(node2) {
              var key, newValue, obj, processedKey, ref;
              obj = {};
              obj[charkey] = "";
              if (!_this.options.ignoreAttrs) {
                ref = node2.attributes;
                for (key in ref) {
                  if (!hasProp.call(ref, key)) continue;
                  if (!(attrkey in obj) && !_this.options.mergeAttrs) {
                    obj[attrkey] = {};
                  }
                  newValue = _this.options.attrValueProcessors ? processItem(_this.options.attrValueProcessors, node2.attributes[key], key) : node2.attributes[key];
                  processedKey = _this.options.attrNameProcessors ? processItem(_this.options.attrNameProcessors, key) : key;
                  if (_this.options.mergeAttrs) {
                    _this.assignOrPush(obj, processedKey, newValue);
                  } else {
                    defineProperty(obj[attrkey], processedKey, newValue);
                  }
                }
              }
              obj["#name"] = _this.options.tagNameProcessors ? processItem(_this.options.tagNameProcessors, node2.name) : node2.name;
              if (_this.options.xmlns) {
                obj[_this.options.xmlnskey] = {
                  uri: node2.uri,
                  local: node2.local
                };
              }
              return stack.push(obj);
            };
          })(this);
          this.saxParser.onclosetag = /* @__PURE__ */ (function(_this) {
            return function() {
              var cdata, emptyStr, key, node2, nodeName, obj, objClone, old, s, xpath;
              obj = stack.pop();
              nodeName = obj["#name"];
              if (!_this.options.explicitChildren || !_this.options.preserveChildrenOrder) {
                delete obj["#name"];
              }
              if (obj.cdata === true) {
                cdata = obj.cdata;
                delete obj.cdata;
              }
              s = stack[stack.length - 1];
              if (obj[charkey].match(/^\s*$/) && !cdata) {
                emptyStr = obj[charkey];
                delete obj[charkey];
              } else {
                if (_this.options.trim) {
                  obj[charkey] = obj[charkey].trim();
                }
                if (_this.options.normalize) {
                  obj[charkey] = obj[charkey].replace(/\s{2,}/g, " ").trim();
                }
                obj[charkey] = _this.options.valueProcessors ? processItem(_this.options.valueProcessors, obj[charkey], nodeName) : obj[charkey];
                if (Object.keys(obj).length === 1 && charkey in obj && !_this.EXPLICIT_CHARKEY) {
                  obj = obj[charkey];
                }
              }
              if (isEmpty2(obj)) {
                if (typeof _this.options.emptyTag === "function") {
                  obj = _this.options.emptyTag();
                } else {
                  obj = _this.options.emptyTag !== "" ? _this.options.emptyTag : emptyStr;
                }
              }
              if (_this.options.validator != null) {
                xpath = "/" + (function() {
                  var i, len, results;
                  results = [];
                  for (i = 0, len = stack.length; i < len; i++) {
                    node2 = stack[i];
                    results.push(node2["#name"]);
                  }
                  return results;
                })().concat(nodeName).join("/");
                (function() {
                  var err;
                  try {
                    return obj = _this.options.validator(xpath, s && s[nodeName], obj);
                  } catch (error1) {
                    err = error1;
                    return _this.emit("error", err);
                  }
                })();
              }
              if (_this.options.explicitChildren && !_this.options.mergeAttrs && typeof obj === "object") {
                if (!_this.options.preserveChildrenOrder) {
                  node2 = {};
                  if (_this.options.attrkey in obj) {
                    node2[_this.options.attrkey] = obj[_this.options.attrkey];
                    delete obj[_this.options.attrkey];
                  }
                  if (!_this.options.charsAsChildren && _this.options.charkey in obj) {
                    node2[_this.options.charkey] = obj[_this.options.charkey];
                    delete obj[_this.options.charkey];
                  }
                  if (Object.getOwnPropertyNames(obj).length > 0) {
                    node2[_this.options.childkey] = obj;
                  }
                  obj = node2;
                } else if (s) {
                  s[_this.options.childkey] = s[_this.options.childkey] || [];
                  objClone = {};
                  for (key in obj) {
                    if (!hasProp.call(obj, key)) continue;
                    defineProperty(objClone, key, obj[key]);
                  }
                  s[_this.options.childkey].push(objClone);
                  delete obj["#name"];
                  if (Object.keys(obj).length === 1 && charkey in obj && !_this.EXPLICIT_CHARKEY) {
                    obj = obj[charkey];
                  }
                }
              }
              if (stack.length > 0) {
                return _this.assignOrPush(s, nodeName, obj);
              } else {
                if (_this.options.explicitRoot) {
                  old = obj;
                  obj = {};
                  defineProperty(obj, nodeName, old);
                }
                _this.resultObject = obj;
                _this.saxParser.ended = true;
                return _this.emit("end", _this.resultObject);
              }
            };
          })(this);
          ontext = /* @__PURE__ */ (function(_this) {
            return function(text) {
              var charChild, s;
              s = stack[stack.length - 1];
              if (s) {
                s[charkey] += text;
                if (_this.options.explicitChildren && _this.options.preserveChildrenOrder && _this.options.charsAsChildren && (_this.options.includeWhiteChars || text.replace(/\\n/g, "").trim() !== "")) {
                  s[_this.options.childkey] = s[_this.options.childkey] || [];
                  charChild = {
                    "#name": "__text__"
                  };
                  charChild[charkey] = text;
                  if (_this.options.normalize) {
                    charChild[charkey] = charChild[charkey].replace(/\s{2,}/g, " ").trim();
                  }
                  s[_this.options.childkey].push(charChild);
                }
                return s;
              }
            };
          })(this);
          this.saxParser.ontext = ontext;
          return this.saxParser.oncdata = /* @__PURE__ */ (function(_this) {
            return function(text) {
              var s;
              s = ontext(text);
              if (s) {
                return s.cdata = true;
              }
            };
          })();
        };
        Parser2.prototype.parseString = function(str, cb) {
          var err;
          if (cb != null && typeof cb === "function") {
            this.on("end", function(result) {
              this.reset();
              return cb(null, result);
            });
            this.on("error", function(err2) {
              this.reset();
              return cb(err2);
            });
          }
          try {
            str = str.toString();
            if (str.trim() === "") {
              this.emit("end", null);
              return true;
            }
            str = bom2.stripBOM(str);
            if (this.options.async) {
              this.remaining = str;
              setImmediate2(this.processAsync);
              return this.saxParser;
            }
            return this.saxParser.write(str).close();
          } catch (error1) {
            err = error1;
            if (!(this.saxParser.errThrown || this.saxParser.ended)) {
              this.emit("error", err);
              return this.saxParser.errThrown = true;
            } else if (this.saxParser.ended) {
              throw err;
            }
          }
        };
        Parser2.prototype.parseStringPromise = function(str) {
          return new Promise(/* @__PURE__ */ (function(_this) {
            return function(resolve, reject2) {
              return _this.parseString(str, function(err, value) {
                if (err) {
                  return reject2(err);
                } else {
                  return resolve(value);
                }
              });
            };
          })(this));
        };
        return Parser2;
      })(events);
      exports.parseString = function(str, a, b) {
        var cb, options, parser2;
        if (b != null) {
          if (typeof b === "function") {
            cb = b;
          }
          if (typeof a === "object") {
            options = a;
          }
        } else {
          if (typeof a === "function") {
            cb = a;
          }
          options = {};
        }
        parser2 = new exports.Parser(options);
        return parser2.parseString(str, cb);
      };
      exports.parseStringPromise = function(str, a) {
        var options, parser2;
        if (typeof a === "object") {
          options = a;
        }
        parser2 = new exports.Parser(options);
        return parser2.parseStringPromise(str);
      };
    }).call(parser);
  })(parser);
  return parser;
}
var hasRequiredXml2js;
function requireXml2js() {
  if (hasRequiredXml2js) return xml2js$1;
  hasRequiredXml2js = 1;
  (function() {
    var builder2, defaults2, parser2, processors2, extend = function(child, parent) {
      for (var key in parent) {
        if (hasProp.call(parent, key)) child[key] = parent[key];
      }
      function ctor() {
        this.constructor = child;
      }
      ctor.prototype = parent.prototype;
      child.prototype = new ctor();
      child.__super__ = parent.prototype;
      return child;
    }, hasProp = {}.hasOwnProperty;
    defaults2 = requireDefaults();
    builder2 = requireBuilder();
    parser2 = requireParser$1();
    processors2 = requireProcessors();
    xml2js$1.defaults = defaults2.defaults;
    xml2js$1.processors = processors2;
    xml2js$1.ValidationError = (function(superClass) {
      extend(ValidationError, superClass);
      function ValidationError(message) {
        this.message = message;
      }
      return ValidationError;
    })(Error);
    xml2js$1.Builder = builder2.Builder;
    xml2js$1.Parser = parser2.Parser;
    xml2js$1.parseString = parser2.parseString;
    xml2js$1.parseStringPromise = parser2.parseStringPromise;
  }).call(xml2js$1);
  return xml2js$1;
}
var xml2jsExports = requireXml2js();
const xml2js = /* @__PURE__ */ getDefaultExportFromCjs$1(xml2jsExports);
class ExtendableError extends Error {
  constructor(message, opt) {
    super(message, opt);
    this.name = this.constructor.name;
  }
}
class AnonymousRequestError extends ExtendableError {
}
class InvalidArgumentError extends ExtendableError {
}
class InvalidEndpointError extends ExtendableError {
}
class InvalidBucketNameError extends ExtendableError {
}
class InvalidObjectNameError extends ExtendableError {
}
class AccessKeyRequiredError extends ExtendableError {
}
class SecretKeyRequiredError extends ExtendableError {
}
class ExpiresParamError extends ExtendableError {
}
class InvalidDateError extends ExtendableError {
}
class InvalidPrefixError extends ExtendableError {
}
class InvalidBucketPolicyError extends ExtendableError {
}
class InvalidXMLError extends ExtendableError {
}
class S3Error extends ExtendableError {
}
class IsValidBucketNameError extends ExtendableError {
}
function callbackify(fn) {
  return function() {
    const args = [...arguments];
    const callback = args.pop();
    if (typeof callback === "function") {
      return fn.apply(this, args).then((result) => callback(null, result), (err) => callback(err));
    }
    return fn.apply(this, arguments);
  };
}
function initialParams(fn) {
  return function(...args) {
    var callback = args.pop();
    return fn.call(this, args, callback);
  };
}
var hasQueueMicrotask = typeof queueMicrotask === "function" && queueMicrotask;
var hasSetImmediate = typeof setImmediate === "function" && setImmediate;
var hasNextTick = typeof process === "object" && typeof process.nextTick === "function";
function fallback(fn) {
  setTimeout(fn, 0);
}
function wrap(defer) {
  return (fn, ...args) => defer(() => fn(...args));
}
var _defer$1;
if (hasQueueMicrotask) {
  _defer$1 = queueMicrotask;
} else if (hasSetImmediate) {
  _defer$1 = setImmediate;
} else if (hasNextTick) {
  _defer$1 = process.nextTick;
} else {
  _defer$1 = fallback;
}
var setImmediate$1 = wrap(_defer$1);
function asyncify(func) {
  if (isAsync(func)) {
    return function(...args) {
      const callback = args.pop();
      const promise = func.apply(this, args);
      return handlePromise(promise, callback);
    };
  }
  return initialParams(function(args, callback) {
    var result;
    try {
      result = func.apply(this, args);
    } catch (e) {
      return callback(e);
    }
    if (result && typeof result.then === "function") {
      return handlePromise(result, callback);
    } else {
      callback(null, result);
    }
  });
}
function handlePromise(promise, callback) {
  return promise.then((value) => {
    invokeCallback(callback, null, value);
  }, (err) => {
    invokeCallback(callback, err && (err instanceof Error || err.message) ? err : new Error(err));
  });
}
function invokeCallback(callback, error, value) {
  try {
    callback(error, value);
  } catch (err) {
    setImmediate$1((e) => {
      throw e;
    }, err);
  }
}
function isAsync(fn) {
  return fn[Symbol.toStringTag] === "AsyncFunction";
}
function isAsyncGenerator(fn) {
  return fn[Symbol.toStringTag] === "AsyncGenerator";
}
function isAsyncIterable(obj) {
  return typeof obj[Symbol.asyncIterator] === "function";
}
function wrapAsync(asyncFn) {
  if (typeof asyncFn !== "function") throw new Error("expected a function");
  return isAsync(asyncFn) ? asyncify(asyncFn) : asyncFn;
}
function awaitify(asyncFn, arity) {
  if (!arity) arity = asyncFn.length;
  if (!arity) throw new Error("arity is undefined");
  function awaitable(...args) {
    if (typeof args[arity - 1] === "function") {
      return asyncFn.apply(this, args);
    }
    return new Promise((resolve, reject2) => {
      args[arity - 1] = (err, ...cbArgs) => {
        if (err) return reject2(err);
        resolve(cbArgs.length > 1 ? cbArgs : cbArgs[0]);
      };
      asyncFn.apply(this, args);
    });
  }
  return awaitable;
}
function _asyncMap(eachfn, arr, iteratee, callback) {
  arr = arr || [];
  var results = [];
  var counter2 = 0;
  var _iteratee = wrapAsync(iteratee);
  return eachfn(arr, (value, _2, iterCb) => {
    var index2 = counter2++;
    _iteratee(value, (err, v) => {
      results[index2] = v;
      iterCb(err);
    });
  }, (err) => {
    callback(err, results);
  });
}
function isArrayLike(value) {
  return value && typeof value.length === "number" && value.length >= 0 && value.length % 1 === 0;
}
const breakLoop = {};
function once(fn) {
  function wrapper(...args) {
    if (fn === null) return;
    var callFn = fn;
    fn = null;
    callFn.apply(this, args);
  }
  Object.assign(wrapper, fn);
  return wrapper;
}
function getIterator(coll) {
  return coll[Symbol.iterator] && coll[Symbol.iterator]();
}
function createArrayIterator(coll) {
  var i = -1;
  var len = coll.length;
  return function next() {
    return ++i < len ? { value: coll[i], key: i } : null;
  };
}
function createES2015Iterator(iterator) {
  var i = -1;
  return function next() {
    var item = iterator.next();
    if (item.done)
      return null;
    i++;
    return { value: item.value, key: i };
  };
}
function createObjectIterator(obj) {
  var okeys = obj ? Object.keys(obj) : [];
  var i = -1;
  var len = okeys.length;
  return function next() {
    var key = okeys[++i];
    if (key === "__proto__") {
      return next();
    }
    return i < len ? { value: obj[key], key } : null;
  };
}
function createIterator(coll) {
  if (isArrayLike(coll)) {
    return createArrayIterator(coll);
  }
  var iterator = getIterator(coll);
  return iterator ? createES2015Iterator(iterator) : createObjectIterator(coll);
}
function onlyOnce(fn) {
  return function(...args) {
    if (fn === null) throw new Error("Callback was already called.");
    var callFn = fn;
    fn = null;
    callFn.apply(this, args);
  };
}
function asyncEachOfLimit(generator, limit, iteratee, callback) {
  let done = false;
  let canceled = false;
  let awaiting = false;
  let running = 0;
  let idx = 0;
  function replenish() {
    if (running >= limit || awaiting || done) return;
    awaiting = true;
    generator.next().then(({ value, done: iterDone }) => {
      if (canceled || done) return;
      awaiting = false;
      if (iterDone) {
        done = true;
        if (running <= 0) {
          callback(null);
        }
        return;
      }
      running++;
      iteratee(value, idx, iterateeCallback);
      idx++;
      replenish();
    }).catch(handleError2);
  }
  function iterateeCallback(err, result) {
    running -= 1;
    if (canceled) return;
    if (err) return handleError2(err);
    if (err === false) {
      done = true;
      canceled = true;
      return;
    }
    if (result === breakLoop || done && running <= 0) {
      done = true;
      return callback(null);
    }
    replenish();
  }
  function handleError2(err) {
    if (canceled) return;
    awaiting = false;
    done = true;
    callback(err);
  }
  replenish();
}
var eachOfLimit$2 = (limit) => {
  return (obj, iteratee, callback) => {
    callback = once(callback);
    if (limit <= 0) {
      throw new RangeError("concurrency limit cannot be less than 1");
    }
    if (!obj) {
      return callback(null);
    }
    if (isAsyncGenerator(obj)) {
      return asyncEachOfLimit(obj, limit, iteratee, callback);
    }
    if (isAsyncIterable(obj)) {
      return asyncEachOfLimit(obj[Symbol.asyncIterator](), limit, iteratee, callback);
    }
    var nextElem = createIterator(obj);
    var done = false;
    var canceled = false;
    var running = 0;
    var looping = false;
    function iterateeCallback(err, value) {
      if (canceled) return;
      running -= 1;
      if (err) {
        done = true;
        callback(err);
      } else if (err === false) {
        done = true;
        canceled = true;
      } else if (value === breakLoop || done && running <= 0) {
        done = true;
        return callback(null);
      } else if (!looping) {
        replenish();
      }
    }
    function replenish() {
      looping = true;
      while (running < limit && !done) {
        var elem = nextElem();
        if (elem === null) {
          done = true;
          if (running <= 0) {
            callback(null);
          }
          return;
        }
        running += 1;
        iteratee(elem.value, elem.key, onlyOnce(iterateeCallback));
      }
      looping = false;
    }
    replenish();
  };
};
function eachOfLimit(coll, limit, iteratee, callback) {
  return eachOfLimit$2(limit)(coll, wrapAsync(iteratee), callback);
}
var eachOfLimit$1 = awaitify(eachOfLimit, 4);
function eachOfArrayLike(coll, iteratee, callback) {
  callback = once(callback);
  var index2 = 0, completed = 0, { length } = coll, canceled = false;
  if (length === 0) {
    callback(null);
  }
  function iteratorCallback(err, value) {
    if (err === false) {
      canceled = true;
    }
    if (canceled === true) return;
    if (err) {
      callback(err);
    } else if (++completed === length || value === breakLoop) {
      callback(null);
    }
  }
  for (; index2 < length; index2++) {
    iteratee(coll[index2], index2, onlyOnce(iteratorCallback));
  }
}
function eachOfGeneric(coll, iteratee, callback) {
  return eachOfLimit$1(coll, Infinity, iteratee, callback);
}
function eachOf(coll, iteratee, callback) {
  var eachOfImplementation = isArrayLike(coll) ? eachOfArrayLike : eachOfGeneric;
  return eachOfImplementation(coll, wrapAsync(iteratee), callback);
}
var eachOf$1 = awaitify(eachOf, 3);
function map(coll, iteratee, callback) {
  return _asyncMap(eachOf$1, coll, iteratee, callback);
}
var map$1 = awaitify(map, 3);
function eachOfSeries(coll, iteratee, callback) {
  return eachOfLimit$1(coll, 1, iteratee, callback);
}
var eachOfSeries$1 = awaitify(eachOfSeries, 3);
function mapSeries(coll, iteratee, callback) {
  return _asyncMap(eachOfSeries$1, coll, iteratee, callback);
}
awaitify(mapSeries, 3);
function reduce(coll, memo2, iteratee, callback) {
  callback = once(callback);
  var _iteratee = wrapAsync(iteratee);
  return eachOfSeries$1(coll, (x, i, iterCb) => {
    _iteratee(memo2, x, (err, v) => {
      memo2 = v;
      iterCb(err);
    });
  }, (err) => callback(err, memo2));
}
awaitify(reduce, 4);
function mapLimit(coll, limit, iteratee, callback) {
  return _asyncMap(eachOfLimit$2(limit), coll, iteratee, callback);
}
var mapLimit$1 = awaitify(mapLimit, 4);
function concatLimit(coll, limit, iteratee, callback) {
  var _iteratee = wrapAsync(iteratee);
  return mapLimit$1(coll, limit, (val, iterCb) => {
    _iteratee(val, (err, ...args) => {
      if (err) return iterCb(err);
      return iterCb(err, args);
    });
  }, (err, mapResults) => {
    var result = [];
    for (var i = 0; i < mapResults.length; i++) {
      if (mapResults[i]) {
        result = result.concat(...mapResults[i]);
      }
    }
    return callback(err, result);
  });
}
var concatLimit$1 = awaitify(concatLimit, 4);
function concat(coll, iteratee, callback) {
  return concatLimit$1(coll, Infinity, iteratee, callback);
}
awaitify(concat, 3);
function concatSeries(coll, iteratee, callback) {
  return concatLimit$1(coll, 1, iteratee, callback);
}
awaitify(concatSeries, 3);
function _createTester(check, getResult) {
  return (eachfn, arr, _iteratee, cb) => {
    var testPassed = false;
    var testResult;
    const iteratee = wrapAsync(_iteratee);
    eachfn(arr, (value, _2, callback) => {
      iteratee(value, (err, result) => {
        if (err || err === false) return callback(err);
        if (check(result) && !testResult) {
          testPassed = true;
          testResult = getResult(true, value);
          return callback(null, breakLoop);
        }
        callback();
      });
    }, (err) => {
      if (err) return cb(err);
      cb(null, testPassed ? testResult : getResult(false));
    });
  };
}
function detect(coll, iteratee, callback) {
  return _createTester((bool) => bool, (res, item) => item)(eachOf$1, coll, iteratee, callback);
}
awaitify(detect, 3);
function detectLimit(coll, limit, iteratee, callback) {
  return _createTester((bool) => bool, (res, item) => item)(eachOfLimit$2(limit), coll, iteratee, callback);
}
awaitify(detectLimit, 4);
function detectSeries(coll, iteratee, callback) {
  return _createTester((bool) => bool, (res, item) => item)(eachOfLimit$2(1), coll, iteratee, callback);
}
awaitify(detectSeries, 3);
function doWhilst(iteratee, test, callback) {
  callback = onlyOnce(callback);
  var _fn = wrapAsync(iteratee);
  var _test = wrapAsync(test);
  var results;
  function next(err, ...args) {
    if (err) return callback(err);
    if (err === false) return;
    results = args;
    _test(...args, check);
  }
  function check(err, truth) {
    if (err) return callback(err);
    if (err === false) return;
    if (!truth) return callback(null, ...results);
    _fn(next);
  }
  return check(null, true);
}
awaitify(doWhilst, 3);
function _withoutIndex(iteratee) {
  return (value, index2, callback) => iteratee(value, callback);
}
function eachLimit$2(coll, iteratee, callback) {
  return eachOf$1(coll, _withoutIndex(wrapAsync(iteratee)), callback);
}
awaitify(eachLimit$2, 3);
function eachLimit(coll, limit, iteratee, callback) {
  return eachOfLimit$2(limit)(coll, _withoutIndex(wrapAsync(iteratee)), callback);
}
var eachLimit$1 = awaitify(eachLimit, 4);
function eachSeries(coll, iteratee, callback) {
  return eachLimit$1(coll, 1, iteratee, callback);
}
var eachSeries$1 = awaitify(eachSeries, 3);
function ensureAsync(fn) {
  if (isAsync(fn)) return fn;
  return function(...args) {
    var callback = args.pop();
    var sync = true;
    args.push((...innerArgs) => {
      if (sync) {
        setImmediate$1(() => callback(...innerArgs));
      } else {
        callback(...innerArgs);
      }
    });
    fn.apply(this, args);
    sync = false;
  };
}
function every(coll, iteratee, callback) {
  return _createTester((bool) => !bool, (res) => !res)(eachOf$1, coll, iteratee, callback);
}
awaitify(every, 3);
function everyLimit(coll, limit, iteratee, callback) {
  return _createTester((bool) => !bool, (res) => !res)(eachOfLimit$2(limit), coll, iteratee, callback);
}
awaitify(everyLimit, 4);
function everySeries(coll, iteratee, callback) {
  return _createTester((bool) => !bool, (res) => !res)(eachOfSeries$1, coll, iteratee, callback);
}
awaitify(everySeries, 3);
function filterArray(eachfn, arr, iteratee, callback) {
  var truthValues = new Array(arr.length);
  eachfn(arr, (x, index2, iterCb) => {
    iteratee(x, (err, v) => {
      truthValues[index2] = !!v;
      iterCb(err);
    });
  }, (err) => {
    if (err) return callback(err);
    var results = [];
    for (var i = 0; i < arr.length; i++) {
      if (truthValues[i]) results.push(arr[i]);
    }
    callback(null, results);
  });
}
function filterGeneric(eachfn, coll, iteratee, callback) {
  var results = [];
  eachfn(coll, (x, index2, iterCb) => {
    iteratee(x, (err, v) => {
      if (err) return iterCb(err);
      if (v) {
        results.push({ index: index2, value: x });
      }
      iterCb(err);
    });
  }, (err) => {
    if (err) return callback(err);
    callback(null, results.sort((a, b) => a.index - b.index).map((v) => v.value));
  });
}
function _filter(eachfn, coll, iteratee, callback) {
  var filter2 = isArrayLike(coll) ? filterArray : filterGeneric;
  return filter2(eachfn, coll, wrapAsync(iteratee), callback);
}
function filter(coll, iteratee, callback) {
  return _filter(eachOf$1, coll, iteratee, callback);
}
awaitify(filter, 3);
function filterLimit(coll, limit, iteratee, callback) {
  return _filter(eachOfLimit$2(limit), coll, iteratee, callback);
}
awaitify(filterLimit, 4);
function filterSeries(coll, iteratee, callback) {
  return _filter(eachOfSeries$1, coll, iteratee, callback);
}
awaitify(filterSeries, 3);
function forever(fn, errback) {
  var done = onlyOnce(errback);
  var task = wrapAsync(ensureAsync(fn));
  function next(err) {
    if (err) return done(err);
    if (err === false) return;
    task(next);
  }
  return next();
}
awaitify(forever, 2);
function groupByLimit(coll, limit, iteratee, callback) {
  var _iteratee = wrapAsync(iteratee);
  return mapLimit$1(coll, limit, (val, iterCb) => {
    _iteratee(val, (err, key) => {
      if (err) return iterCb(err);
      return iterCb(err, { key, val });
    });
  }, (err, mapResults) => {
    var result = {};
    var { hasOwnProperty } = Object.prototype;
    for (var i = 0; i < mapResults.length; i++) {
      if (mapResults[i]) {
        var { key } = mapResults[i];
        var { val } = mapResults[i];
        if (hasOwnProperty.call(result, key)) {
          result[key].push(val);
        } else {
          result[key] = [val];
        }
      }
    }
    return callback(err, result);
  });
}
awaitify(groupByLimit, 4);
function mapValuesLimit(obj, limit, iteratee, callback) {
  callback = once(callback);
  var newObj = {};
  var _iteratee = wrapAsync(iteratee);
  return eachOfLimit$2(limit)(obj, (val, key, next) => {
    _iteratee(val, key, (err, result) => {
      if (err) return next(err);
      newObj[key] = result;
      next(err);
    });
  }, (err) => callback(err, newObj));
}
awaitify(mapValuesLimit, 4);
if (hasNextTick) {
  process.nextTick;
} else if (hasSetImmediate) {
  setImmediate;
} else ;
awaitify((eachfn, tasks, callback) => {
  var results = isArrayLike(tasks) ? [] : {};
  eachfn(tasks, (task, key, taskCb) => {
    wrapAsync(task)((err, ...result) => {
      if (result.length < 2) {
        [result] = result;
      }
      results[key] = result;
      taskCb(err);
    });
  }, (err) => callback(err, results));
}, 3);
function race(tasks, callback) {
  callback = once(callback);
  if (!Array.isArray(tasks)) return callback(new TypeError("First argument to race must be an array of functions"));
  if (!tasks.length) return callback();
  for (var i = 0, l = tasks.length; i < l; i++) {
    wrapAsync(tasks[i])(callback);
  }
}
awaitify(race, 2);
function reject$2(eachfn, arr, _iteratee, callback) {
  const iteratee = wrapAsync(_iteratee);
  return _filter(eachfn, arr, (value, cb) => {
    iteratee(value, (err, v) => {
      cb(err, !v);
    });
  }, callback);
}
function reject(coll, iteratee, callback) {
  return reject$2(eachOf$1, coll, iteratee, callback);
}
awaitify(reject, 3);
function rejectLimit(coll, limit, iteratee, callback) {
  return reject$2(eachOfLimit$2(limit), coll, iteratee, callback);
}
awaitify(rejectLimit, 4);
function rejectSeries(coll, iteratee, callback) {
  return reject$2(eachOfSeries$1, coll, iteratee, callback);
}
awaitify(rejectSeries, 3);
function some(coll, iteratee, callback) {
  return _createTester(Boolean, (res) => res)(eachOf$1, coll, iteratee, callback);
}
awaitify(some, 3);
function someLimit(coll, limit, iteratee, callback) {
  return _createTester(Boolean, (res) => res)(eachOfLimit$2(limit), coll, iteratee, callback);
}
awaitify(someLimit, 4);
function someSeries(coll, iteratee, callback) {
  return _createTester(Boolean, (res) => res)(eachOfSeries$1, coll, iteratee, callback);
}
awaitify(someSeries, 3);
function sortBy(coll, iteratee, callback) {
  var _iteratee = wrapAsync(iteratee);
  return map$1(coll, (x, iterCb) => {
    _iteratee(x, (err, criteria) => {
      if (err) return iterCb(err);
      iterCb(err, { value: x, criteria });
    });
  }, (err, results) => {
    if (err) return callback(err);
    callback(null, results.sort(comparator).map((v) => v.value));
  });
  function comparator(left, right) {
    var a = left.criteria, b = right.criteria;
    return a < b ? -1 : a > b ? 1 : 0;
  }
}
awaitify(sortBy, 3);
function tryEach(tasks, callback) {
  var error = null;
  var result;
  return eachSeries$1(tasks, (task, taskCb) => {
    wrapAsync(task)((err, ...args) => {
      if (err === false) return taskCb(err);
      if (args.length < 2) {
        [result] = args;
      } else {
        result = args;
      }
      error = err;
      taskCb(err ? null : {});
    });
  }, () => callback(error, result));
}
awaitify(tryEach);
function whilst(test, iteratee, callback) {
  callback = onlyOnce(callback);
  var _fn = wrapAsync(iteratee);
  var _test = wrapAsync(test);
  var results = [];
  function next(err, ...rest) {
    if (err) return callback(err);
    results = rest;
    if (err === false) return;
    _test(check);
  }
  function check(err, truth) {
    if (err) return callback(err);
    if (err === false) return;
    if (!truth) return callback(null, ...results);
    _fn(next);
  }
  return _test(check);
}
awaitify(whilst, 3);
function waterfall(tasks, callback) {
  callback = once(callback);
  if (!Array.isArray(tasks)) return callback(new Error("First argument to waterfall must be an array of functions"));
  if (!tasks.length) return callback();
  var taskIndex = 0;
  function nextTask(args) {
    var task = wrapAsync(tasks[taskIndex++]);
    task(...args, onlyOnce(next));
  }
  function next(err, ...args) {
    if (err === false) return;
    if (err || taskIndex === tasks.length) {
      return callback(err, ...args);
    }
    nextTask(args);
  }
  nextTask([]);
}
awaitify(waterfall);
var readable = { exports: {} };
var stream;
var hasRequiredStream;
function requireStream() {
  if (hasRequiredStream) return stream;
  hasRequiredStream = 1;
  stream = stream__default;
  return stream;
}
var buffer_list;
var hasRequiredBuffer_list;
function requireBuffer_list() {
  if (hasRequiredBuffer_list) return buffer_list;
  hasRequiredBuffer_list = 1;
  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      enumerableOnly && (symbols = symbols.filter(function(sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      })), keys.push.apply(keys, symbols);
    }
    return keys;
  }
  function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = null != arguments[i] ? arguments[i] : {};
      i % 2 ? ownKeys(Object(source), true).forEach(function(key) {
        _defineProperty(target, key, source[key]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function(key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
    return target;
  }
  function _defineProperty(obj, key, value) {
    key = _toPropertyKey(key);
    if (key in obj) {
      Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    Object.defineProperty(Constructor, "prototype", { writable: false });
    return Constructor;
  }
  function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, "string");
    return typeof key === "symbol" ? key : String(key);
  }
  function _toPrimitive(input, hint) {
    if (typeof input !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== void 0) {
      var res = prim.call(input, hint);
      if (typeof res !== "object") return res;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return String(input);
  }
  var _require = require$$2, Buffer2 = _require.Buffer;
  var _require2 = require$$0$1, inspect = _require2.inspect;
  var custom = inspect && inspect.custom || "inspect";
  function copyBuffer(src, target, offset) {
    Buffer2.prototype.copy.call(src, target, offset);
  }
  buffer_list = /* @__PURE__ */ (function() {
    function BufferList() {
      _classCallCheck(this, BufferList);
      this.head = null;
      this.tail = null;
      this.length = 0;
    }
    _createClass(BufferList, [{
      key: "push",
      value: function push(v) {
        var entry = {
          data: v,
          next: null
        };
        if (this.length > 0) this.tail.next = entry;
        else this.head = entry;
        this.tail = entry;
        ++this.length;
      }
    }, {
      key: "unshift",
      value: function unshift(v) {
        var entry = {
          data: v,
          next: this.head
        };
        if (this.length === 0) this.tail = entry;
        this.head = entry;
        ++this.length;
      }
    }, {
      key: "shift",
      value: function shift() {
        if (this.length === 0) return;
        var ret = this.head.data;
        if (this.length === 1) this.head = this.tail = null;
        else this.head = this.head.next;
        --this.length;
        return ret;
      }
    }, {
      key: "clear",
      value: function clear() {
        this.head = this.tail = null;
        this.length = 0;
      }
    }, {
      key: "join",
      value: function join(s) {
        if (this.length === 0) return "";
        var p = this.head;
        var ret = "" + p.data;
        while (p = p.next) ret += s + p.data;
        return ret;
      }
    }, {
      key: "concat",
      value: function concat2(n) {
        if (this.length === 0) return Buffer2.alloc(0);
        var ret = Buffer2.allocUnsafe(n >>> 0);
        var p = this.head;
        var i = 0;
        while (p) {
          copyBuffer(p.data, ret, i);
          i += p.data.length;
          p = p.next;
        }
        return ret;
      }
      // Consumes a specified amount of bytes or characters from the buffered data.
    }, {
      key: "consume",
      value: function consume(n, hasStrings) {
        var ret;
        if (n < this.head.data.length) {
          ret = this.head.data.slice(0, n);
          this.head.data = this.head.data.slice(n);
        } else if (n === this.head.data.length) {
          ret = this.shift();
        } else {
          ret = hasStrings ? this._getString(n) : this._getBuffer(n);
        }
        return ret;
      }
    }, {
      key: "first",
      value: function first() {
        return this.head.data;
      }
      // Consumes a specified amount of characters from the buffered data.
    }, {
      key: "_getString",
      value: function _getString(n) {
        var p = this.head;
        var c = 1;
        var ret = p.data;
        n -= ret.length;
        while (p = p.next) {
          var str = p.data;
          var nb = n > str.length ? str.length : n;
          if (nb === str.length) ret += str;
          else ret += str.slice(0, n);
          n -= nb;
          if (n === 0) {
            if (nb === str.length) {
              ++c;
              if (p.next) this.head = p.next;
              else this.head = this.tail = null;
            } else {
              this.head = p;
              p.data = str.slice(nb);
            }
            break;
          }
          ++c;
        }
        this.length -= c;
        return ret;
      }
      // Consumes a specified amount of bytes from the buffered data.
    }, {
      key: "_getBuffer",
      value: function _getBuffer(n) {
        var ret = Buffer2.allocUnsafe(n);
        var p = this.head;
        var c = 1;
        p.data.copy(ret);
        n -= p.data.length;
        while (p = p.next) {
          var buf = p.data;
          var nb = n > buf.length ? buf.length : n;
          buf.copy(ret, ret.length - n, 0, nb);
          n -= nb;
          if (n === 0) {
            if (nb === buf.length) {
              ++c;
              if (p.next) this.head = p.next;
              else this.head = this.tail = null;
            } else {
              this.head = p;
              p.data = buf.slice(nb);
            }
            break;
          }
          ++c;
        }
        this.length -= c;
        return ret;
      }
      // Make sure the linked list only shows the minimal necessary information.
    }, {
      key: custom,
      value: function value(_2, options) {
        return inspect(this, _objectSpread(_objectSpread({}, options), {}, {
          // Only inspect one level.
          depth: 0,
          // It should not recurse.
          customInspect: false
        }));
      }
    }]);
    return BufferList;
  })();
  return buffer_list;
}
var destroy_1;
var hasRequiredDestroy;
function requireDestroy() {
  if (hasRequiredDestroy) return destroy_1;
  hasRequiredDestroy = 1;
  function destroy(err, cb) {
    var _this = this;
    var readableDestroyed = this._readableState && this._readableState.destroyed;
    var writableDestroyed = this._writableState && this._writableState.destroyed;
    if (readableDestroyed || writableDestroyed) {
      if (cb) {
        cb(err);
      } else if (err) {
        if (!this._writableState) {
          process.nextTick(emitErrorNT, this, err);
        } else if (!this._writableState.errorEmitted) {
          this._writableState.errorEmitted = true;
          process.nextTick(emitErrorNT, this, err);
        }
      }
      return this;
    }
    if (this._readableState) {
      this._readableState.destroyed = true;
    }
    if (this._writableState) {
      this._writableState.destroyed = true;
    }
    this._destroy(err || null, function(err2) {
      if (!cb && err2) {
        if (!_this._writableState) {
          process.nextTick(emitErrorAndCloseNT, _this, err2);
        } else if (!_this._writableState.errorEmitted) {
          _this._writableState.errorEmitted = true;
          process.nextTick(emitErrorAndCloseNT, _this, err2);
        } else {
          process.nextTick(emitCloseNT, _this);
        }
      } else if (cb) {
        process.nextTick(emitCloseNT, _this);
        cb(err2);
      } else {
        process.nextTick(emitCloseNT, _this);
      }
    });
    return this;
  }
  function emitErrorAndCloseNT(self2, err) {
    emitErrorNT(self2, err);
    emitCloseNT(self2);
  }
  function emitCloseNT(self2) {
    if (self2._writableState && !self2._writableState.emitClose) return;
    if (self2._readableState && !self2._readableState.emitClose) return;
    self2.emit("close");
  }
  function undestroy() {
    if (this._readableState) {
      this._readableState.destroyed = false;
      this._readableState.reading = false;
      this._readableState.ended = false;
      this._readableState.endEmitted = false;
    }
    if (this._writableState) {
      this._writableState.destroyed = false;
      this._writableState.ended = false;
      this._writableState.ending = false;
      this._writableState.finalCalled = false;
      this._writableState.prefinished = false;
      this._writableState.finished = false;
      this._writableState.errorEmitted = false;
    }
  }
  function emitErrorNT(self2, err) {
    self2.emit("error", err);
  }
  function errorOrDestroy(stream2, err) {
    var rState = stream2._readableState;
    var wState = stream2._writableState;
    if (rState && rState.autoDestroy || wState && wState.autoDestroy) stream2.destroy(err);
    else stream2.emit("error", err);
  }
  destroy_1 = {
    destroy,
    undestroy,
    errorOrDestroy
  };
  return destroy_1;
}
var errors = {};
var hasRequiredErrors;
function requireErrors() {
  if (hasRequiredErrors) return errors;
  hasRequiredErrors = 1;
  const codes = {};
  function createErrorType(code, message, Base) {
    if (!Base) {
      Base = Error;
    }
    function getMessage(arg1, arg2, arg3) {
      if (typeof message === "string") {
        return message;
      } else {
        return message(arg1, arg2, arg3);
      }
    }
    class NodeError extends Base {
      constructor(arg1, arg2, arg3) {
        super(getMessage(arg1, arg2, arg3));
      }
    }
    NodeError.prototype.name = Base.name;
    NodeError.prototype.code = code;
    codes[code] = NodeError;
  }
  function oneOf(expected, thing) {
    if (Array.isArray(expected)) {
      const len = expected.length;
      expected = expected.map((i) => String(i));
      if (len > 2) {
        return `one of ${thing} ${expected.slice(0, len - 1).join(", ")}, or ` + expected[len - 1];
      } else if (len === 2) {
        return `one of ${thing} ${expected[0]} or ${expected[1]}`;
      } else {
        return `of ${thing} ${expected[0]}`;
      }
    } else {
      return `of ${thing} ${String(expected)}`;
    }
  }
  function startsWith(str, search, pos) {
    return str.substr(0, search.length) === search;
  }
  function endsWith(str, search, this_len) {
    if (this_len === void 0 || this_len > str.length) {
      this_len = str.length;
    }
    return str.substring(this_len - search.length, this_len) === search;
  }
  function includes2(str, search, start) {
    if (typeof start !== "number") {
      start = 0;
    }
    if (start + search.length > str.length) {
      return false;
    } else {
      return str.indexOf(search, start) !== -1;
    }
  }
  createErrorType("ERR_INVALID_OPT_VALUE", function(name, value) {
    return 'The value "' + value + '" is invalid for option "' + name + '"';
  }, TypeError);
  createErrorType("ERR_INVALID_ARG_TYPE", function(name, expected, actual) {
    let determiner;
    if (typeof expected === "string" && startsWith(expected, "not ")) {
      determiner = "must not be";
      expected = expected.replace(/^not /, "");
    } else {
      determiner = "must be";
    }
    let msg;
    if (endsWith(name, " argument")) {
      msg = `The ${name} ${determiner} ${oneOf(expected, "type")}`;
    } else {
      const type = includes2(name, ".") ? "property" : "argument";
      msg = `The "${name}" ${type} ${determiner} ${oneOf(expected, "type")}`;
    }
    msg += `. Received type ${typeof actual}`;
    return msg;
  }, TypeError);
  createErrorType("ERR_STREAM_PUSH_AFTER_EOF", "stream.push() after EOF");
  createErrorType("ERR_METHOD_NOT_IMPLEMENTED", function(name) {
    return "The " + name + " method is not implemented";
  });
  createErrorType("ERR_STREAM_PREMATURE_CLOSE", "Premature close");
  createErrorType("ERR_STREAM_DESTROYED", function(name) {
    return "Cannot call " + name + " after a stream was destroyed";
  });
  createErrorType("ERR_MULTIPLE_CALLBACK", "Callback called multiple times");
  createErrorType("ERR_STREAM_CANNOT_PIPE", "Cannot pipe, not readable");
  createErrorType("ERR_STREAM_WRITE_AFTER_END", "write after end");
  createErrorType("ERR_STREAM_NULL_VALUES", "May not write null values to stream", TypeError);
  createErrorType("ERR_UNKNOWN_ENCODING", function(arg) {
    return "Unknown encoding: " + arg;
  }, TypeError);
  createErrorType("ERR_STREAM_UNSHIFT_AFTER_END_EVENT", "stream.unshift() after end event");
  errors.codes = codes;
  return errors;
}
var state;
var hasRequiredState;
function requireState() {
  if (hasRequiredState) return state;
  hasRequiredState = 1;
  var ERR_INVALID_OPT_VALUE = requireErrors().codes.ERR_INVALID_OPT_VALUE;
  function highWaterMarkFrom(options, isDuplex, duplexKey) {
    return options.highWaterMark != null ? options.highWaterMark : isDuplex ? options[duplexKey] : null;
  }
  function getHighWaterMark(state2, options, duplexKey, isDuplex) {
    var hwm = highWaterMarkFrom(options, isDuplex, duplexKey);
    if (hwm != null) {
      if (!(isFinite(hwm) && Math.floor(hwm) === hwm) || hwm < 0) {
        var name = isDuplex ? duplexKey : "highWaterMark";
        throw new ERR_INVALID_OPT_VALUE(name, hwm);
      }
      return Math.floor(hwm);
    }
    return state2.objectMode ? 16 : 16 * 1024;
  }
  state = {
    getHighWaterMark
  };
  return state;
}
const inherits = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: inherits$1
}, Symbol.toStringTag, { value: "Module" }));
const require$$1 = /* @__PURE__ */ getAugmentedNamespace(inherits);
var node;
var hasRequiredNode;
function requireNode() {
  if (hasRequiredNode) return node;
  hasRequiredNode = 1;
  node = require$$0$1.deprecate;
  return node;
}
var _stream_writable;
var hasRequired_stream_writable;
function require_stream_writable() {
  if (hasRequired_stream_writable) return _stream_writable;
  hasRequired_stream_writable = 1;
  _stream_writable = Writable;
  function CorkedRequest(state2) {
    var _this = this;
    this.next = null;
    this.entry = null;
    this.finish = function() {
      onCorkedFinish(_this, state2);
    };
  }
  var Duplex;
  Writable.WritableState = WritableState;
  var internalUtil = {
    deprecate: requireNode()
  };
  var Stream = requireStream();
  var Buffer2 = require$$2.Buffer;
  var OurUint8Array = (typeof commonjsGlobal !== "undefined" ? commonjsGlobal : typeof window !== "undefined" ? window : typeof self !== "undefined" ? self : {}).Uint8Array || function() {
  };
  function _uint8ArrayToBuffer(chunk) {
    return Buffer2.from(chunk);
  }
  function _isUint8Array(obj) {
    return Buffer2.isBuffer(obj) || obj instanceof OurUint8Array;
  }
  var destroyImpl = requireDestroy();
  var _require = requireState(), getHighWaterMark = _require.getHighWaterMark;
  var _require$codes = requireErrors().codes, ERR_INVALID_ARG_TYPE = _require$codes.ERR_INVALID_ARG_TYPE, ERR_METHOD_NOT_IMPLEMENTED = _require$codes.ERR_METHOD_NOT_IMPLEMENTED, ERR_MULTIPLE_CALLBACK = _require$codes.ERR_MULTIPLE_CALLBACK, ERR_STREAM_CANNOT_PIPE = _require$codes.ERR_STREAM_CANNOT_PIPE, ERR_STREAM_DESTROYED = _require$codes.ERR_STREAM_DESTROYED, ERR_STREAM_NULL_VALUES = _require$codes.ERR_STREAM_NULL_VALUES, ERR_STREAM_WRITE_AFTER_END = _require$codes.ERR_STREAM_WRITE_AFTER_END, ERR_UNKNOWN_ENCODING = _require$codes.ERR_UNKNOWN_ENCODING;
  var errorOrDestroy = destroyImpl.errorOrDestroy;
  require$$1(Writable, Stream);
  function nop() {
  }
  function WritableState(options, stream2, isDuplex) {
    Duplex = Duplex || require_stream_duplex();
    options = options || {};
    if (typeof isDuplex !== "boolean") isDuplex = stream2 instanceof Duplex;
    this.objectMode = !!options.objectMode;
    if (isDuplex) this.objectMode = this.objectMode || !!options.writableObjectMode;
    this.highWaterMark = getHighWaterMark(this, options, "writableHighWaterMark", isDuplex);
    this.finalCalled = false;
    this.needDrain = false;
    this.ending = false;
    this.ended = false;
    this.finished = false;
    this.destroyed = false;
    var noDecode = options.decodeStrings === false;
    this.decodeStrings = !noDecode;
    this.defaultEncoding = options.defaultEncoding || "utf8";
    this.length = 0;
    this.writing = false;
    this.corked = 0;
    this.sync = true;
    this.bufferProcessing = false;
    this.onwrite = function(er) {
      onwrite(stream2, er);
    };
    this.writecb = null;
    this.writelen = 0;
    this.bufferedRequest = null;
    this.lastBufferedRequest = null;
    this.pendingcb = 0;
    this.prefinished = false;
    this.errorEmitted = false;
    this.emitClose = options.emitClose !== false;
    this.autoDestroy = !!options.autoDestroy;
    this.bufferedRequestCount = 0;
    this.corkedRequestsFree = new CorkedRequest(this);
  }
  WritableState.prototype.getBuffer = function getBuffer() {
    var current = this.bufferedRequest;
    var out = [];
    while (current) {
      out.push(current);
      current = current.next;
    }
    return out;
  };
  (function() {
    try {
      Object.defineProperty(WritableState.prototype, "buffer", {
        get: internalUtil.deprecate(function writableStateBufferGetter() {
          return this.getBuffer();
        }, "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.", "DEP0003")
      });
    } catch (_2) {
    }
  })();
  var realHasInstance;
  if (typeof Symbol === "function" && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] === "function") {
    realHasInstance = Function.prototype[Symbol.hasInstance];
    Object.defineProperty(Writable, Symbol.hasInstance, {
      value: function value(object) {
        if (realHasInstance.call(this, object)) return true;
        if (this !== Writable) return false;
        return object && object._writableState instanceof WritableState;
      }
    });
  } else {
    realHasInstance = function realHasInstance2(object) {
      return object instanceof this;
    };
  }
  function Writable(options) {
    Duplex = Duplex || require_stream_duplex();
    var isDuplex = this instanceof Duplex;
    if (!isDuplex && !realHasInstance.call(Writable, this)) return new Writable(options);
    this._writableState = new WritableState(options, this, isDuplex);
    this.writable = true;
    if (options) {
      if (typeof options.write === "function") this._write = options.write;
      if (typeof options.writev === "function") this._writev = options.writev;
      if (typeof options.destroy === "function") this._destroy = options.destroy;
      if (typeof options.final === "function") this._final = options.final;
    }
    Stream.call(this);
  }
  Writable.prototype.pipe = function() {
    errorOrDestroy(this, new ERR_STREAM_CANNOT_PIPE());
  };
  function writeAfterEnd(stream2, cb) {
    var er = new ERR_STREAM_WRITE_AFTER_END();
    errorOrDestroy(stream2, er);
    process.nextTick(cb, er);
  }
  function validChunk(stream2, state2, chunk, cb) {
    var er;
    if (chunk === null) {
      er = new ERR_STREAM_NULL_VALUES();
    } else if (typeof chunk !== "string" && !state2.objectMode) {
      er = new ERR_INVALID_ARG_TYPE("chunk", ["string", "Buffer"], chunk);
    }
    if (er) {
      errorOrDestroy(stream2, er);
      process.nextTick(cb, er);
      return false;
    }
    return true;
  }
  Writable.prototype.write = function(chunk, encoding, cb) {
    var state2 = this._writableState;
    var ret = false;
    var isBuf = !state2.objectMode && _isUint8Array(chunk);
    if (isBuf && !Buffer2.isBuffer(chunk)) {
      chunk = _uint8ArrayToBuffer(chunk);
    }
    if (typeof encoding === "function") {
      cb = encoding;
      encoding = null;
    }
    if (isBuf) encoding = "buffer";
    else if (!encoding) encoding = state2.defaultEncoding;
    if (typeof cb !== "function") cb = nop;
    if (state2.ending) writeAfterEnd(this, cb);
    else if (isBuf || validChunk(this, state2, chunk, cb)) {
      state2.pendingcb++;
      ret = writeOrBuffer(this, state2, isBuf, chunk, encoding, cb);
    }
    return ret;
  };
  Writable.prototype.cork = function() {
    this._writableState.corked++;
  };
  Writable.prototype.uncork = function() {
    var state2 = this._writableState;
    if (state2.corked) {
      state2.corked--;
      if (!state2.writing && !state2.corked && !state2.bufferProcessing && state2.bufferedRequest) clearBuffer(this, state2);
    }
  };
  Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
    if (typeof encoding === "string") encoding = encoding.toLowerCase();
    if (!(["hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "utf-16le", "raw"].indexOf((encoding + "").toLowerCase()) > -1)) throw new ERR_UNKNOWN_ENCODING(encoding);
    this._writableState.defaultEncoding = encoding;
    return this;
  };
  Object.defineProperty(Writable.prototype, "writableBuffer", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: false,
    get: function get() {
      return this._writableState && this._writableState.getBuffer();
    }
  });
  function decodeChunk(state2, chunk, encoding) {
    if (!state2.objectMode && state2.decodeStrings !== false && typeof chunk === "string") {
      chunk = Buffer2.from(chunk, encoding);
    }
    return chunk;
  }
  Object.defineProperty(Writable.prototype, "writableHighWaterMark", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: false,
    get: function get() {
      return this._writableState.highWaterMark;
    }
  });
  function writeOrBuffer(stream2, state2, isBuf, chunk, encoding, cb) {
    if (!isBuf) {
      var newChunk = decodeChunk(state2, chunk, encoding);
      if (chunk !== newChunk) {
        isBuf = true;
        encoding = "buffer";
        chunk = newChunk;
      }
    }
    var len = state2.objectMode ? 1 : chunk.length;
    state2.length += len;
    var ret = state2.length < state2.highWaterMark;
    if (!ret) state2.needDrain = true;
    if (state2.writing || state2.corked) {
      var last = state2.lastBufferedRequest;
      state2.lastBufferedRequest = {
        chunk,
        encoding,
        isBuf,
        callback: cb,
        next: null
      };
      if (last) {
        last.next = state2.lastBufferedRequest;
      } else {
        state2.bufferedRequest = state2.lastBufferedRequest;
      }
      state2.bufferedRequestCount += 1;
    } else {
      doWrite(stream2, state2, false, len, chunk, encoding, cb);
    }
    return ret;
  }
  function doWrite(stream2, state2, writev, len, chunk, encoding, cb) {
    state2.writelen = len;
    state2.writecb = cb;
    state2.writing = true;
    state2.sync = true;
    if (state2.destroyed) state2.onwrite(new ERR_STREAM_DESTROYED("write"));
    else if (writev) stream2._writev(chunk, state2.onwrite);
    else stream2._write(chunk, encoding, state2.onwrite);
    state2.sync = false;
  }
  function onwriteError(stream2, state2, sync, er, cb) {
    --state2.pendingcb;
    if (sync) {
      process.nextTick(cb, er);
      process.nextTick(finishMaybe, stream2, state2);
      stream2._writableState.errorEmitted = true;
      errorOrDestroy(stream2, er);
    } else {
      cb(er);
      stream2._writableState.errorEmitted = true;
      errorOrDestroy(stream2, er);
      finishMaybe(stream2, state2);
    }
  }
  function onwriteStateUpdate(state2) {
    state2.writing = false;
    state2.writecb = null;
    state2.length -= state2.writelen;
    state2.writelen = 0;
  }
  function onwrite(stream2, er) {
    var state2 = stream2._writableState;
    var sync = state2.sync;
    var cb = state2.writecb;
    if (typeof cb !== "function") throw new ERR_MULTIPLE_CALLBACK();
    onwriteStateUpdate(state2);
    if (er) onwriteError(stream2, state2, sync, er, cb);
    else {
      var finished = needFinish(state2) || stream2.destroyed;
      if (!finished && !state2.corked && !state2.bufferProcessing && state2.bufferedRequest) {
        clearBuffer(stream2, state2);
      }
      if (sync) {
        process.nextTick(afterWrite, stream2, state2, finished, cb);
      } else {
        afterWrite(stream2, state2, finished, cb);
      }
    }
  }
  function afterWrite(stream2, state2, finished, cb) {
    if (!finished) onwriteDrain(stream2, state2);
    state2.pendingcb--;
    cb();
    finishMaybe(stream2, state2);
  }
  function onwriteDrain(stream2, state2) {
    if (state2.length === 0 && state2.needDrain) {
      state2.needDrain = false;
      stream2.emit("drain");
    }
  }
  function clearBuffer(stream2, state2) {
    state2.bufferProcessing = true;
    var entry = state2.bufferedRequest;
    if (stream2._writev && entry && entry.next) {
      var l = state2.bufferedRequestCount;
      var buffer = new Array(l);
      var holder = state2.corkedRequestsFree;
      holder.entry = entry;
      var count = 0;
      var allBuffers = true;
      while (entry) {
        buffer[count] = entry;
        if (!entry.isBuf) allBuffers = false;
        entry = entry.next;
        count += 1;
      }
      buffer.allBuffers = allBuffers;
      doWrite(stream2, state2, true, state2.length, buffer, "", holder.finish);
      state2.pendingcb++;
      state2.lastBufferedRequest = null;
      if (holder.next) {
        state2.corkedRequestsFree = holder.next;
        holder.next = null;
      } else {
        state2.corkedRequestsFree = new CorkedRequest(state2);
      }
      state2.bufferedRequestCount = 0;
    } else {
      while (entry) {
        var chunk = entry.chunk;
        var encoding = entry.encoding;
        var cb = entry.callback;
        var len = state2.objectMode ? 1 : chunk.length;
        doWrite(stream2, state2, false, len, chunk, encoding, cb);
        entry = entry.next;
        state2.bufferedRequestCount--;
        if (state2.writing) {
          break;
        }
      }
      if (entry === null) state2.lastBufferedRequest = null;
    }
    state2.bufferedRequest = entry;
    state2.bufferProcessing = false;
  }
  Writable.prototype._write = function(chunk, encoding, cb) {
    cb(new ERR_METHOD_NOT_IMPLEMENTED("_write()"));
  };
  Writable.prototype._writev = null;
  Writable.prototype.end = function(chunk, encoding, cb) {
    var state2 = this._writableState;
    if (typeof chunk === "function") {
      cb = chunk;
      chunk = null;
      encoding = null;
    } else if (typeof encoding === "function") {
      cb = encoding;
      encoding = null;
    }
    if (chunk !== null && chunk !== void 0) this.write(chunk, encoding);
    if (state2.corked) {
      state2.corked = 1;
      this.uncork();
    }
    if (!state2.ending) endWritable(this, state2, cb);
    return this;
  };
  Object.defineProperty(Writable.prototype, "writableLength", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: false,
    get: function get() {
      return this._writableState.length;
    }
  });
  function needFinish(state2) {
    return state2.ending && state2.length === 0 && state2.bufferedRequest === null && !state2.finished && !state2.writing;
  }
  function callFinal(stream2, state2) {
    stream2._final(function(err) {
      state2.pendingcb--;
      if (err) {
        errorOrDestroy(stream2, err);
      }
      state2.prefinished = true;
      stream2.emit("prefinish");
      finishMaybe(stream2, state2);
    });
  }
  function prefinish(stream2, state2) {
    if (!state2.prefinished && !state2.finalCalled) {
      if (typeof stream2._final === "function" && !state2.destroyed) {
        state2.pendingcb++;
        state2.finalCalled = true;
        process.nextTick(callFinal, stream2, state2);
      } else {
        state2.prefinished = true;
        stream2.emit("prefinish");
      }
    }
  }
  function finishMaybe(stream2, state2) {
    var need = needFinish(state2);
    if (need) {
      prefinish(stream2, state2);
      if (state2.pendingcb === 0) {
        state2.finished = true;
        stream2.emit("finish");
        if (state2.autoDestroy) {
          var rState = stream2._readableState;
          if (!rState || rState.autoDestroy && rState.endEmitted) {
            stream2.destroy();
          }
        }
      }
    }
    return need;
  }
  function endWritable(stream2, state2, cb) {
    state2.ending = true;
    finishMaybe(stream2, state2);
    if (cb) {
      if (state2.finished) process.nextTick(cb);
      else stream2.once("finish", cb);
    }
    state2.ended = true;
    stream2.writable = false;
  }
  function onCorkedFinish(corkReq, state2, err) {
    var entry = corkReq.entry;
    corkReq.entry = null;
    while (entry) {
      var cb = entry.callback;
      state2.pendingcb--;
      cb(err);
      entry = entry.next;
    }
    state2.corkedRequestsFree.next = corkReq;
  }
  Object.defineProperty(Writable.prototype, "destroyed", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: false,
    get: function get() {
      if (this._writableState === void 0) {
        return false;
      }
      return this._writableState.destroyed;
    },
    set: function set(value) {
      if (!this._writableState) {
        return;
      }
      this._writableState.destroyed = value;
    }
  });
  Writable.prototype.destroy = destroyImpl.destroy;
  Writable.prototype._undestroy = destroyImpl.undestroy;
  Writable.prototype._destroy = function(err, cb) {
    cb(err);
  };
  return _stream_writable;
}
var _stream_duplex;
var hasRequired_stream_duplex;
function require_stream_duplex() {
  if (hasRequired_stream_duplex) return _stream_duplex;
  hasRequired_stream_duplex = 1;
  var objectKeys = Object.keys || function(obj) {
    var keys2 = [];
    for (var key in obj) keys2.push(key);
    return keys2;
  };
  _stream_duplex = Duplex;
  var Readable = require_stream_readable();
  var Writable = require_stream_writable();
  require$$1(Duplex, Readable);
  {
    var keys = objectKeys(Writable.prototype);
    for (var v = 0; v < keys.length; v++) {
      var method = keys[v];
      if (!Duplex.prototype[method]) Duplex.prototype[method] = Writable.prototype[method];
    }
  }
  function Duplex(options) {
    if (!(this instanceof Duplex)) return new Duplex(options);
    Readable.call(this, options);
    Writable.call(this, options);
    this.allowHalfOpen = true;
    if (options) {
      if (options.readable === false) this.readable = false;
      if (options.writable === false) this.writable = false;
      if (options.allowHalfOpen === false) {
        this.allowHalfOpen = false;
        this.once("end", onend);
      }
    }
  }
  Object.defineProperty(Duplex.prototype, "writableHighWaterMark", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: false,
    get: function get() {
      return this._writableState.highWaterMark;
    }
  });
  Object.defineProperty(Duplex.prototype, "writableBuffer", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: false,
    get: function get() {
      return this._writableState && this._writableState.getBuffer();
    }
  });
  Object.defineProperty(Duplex.prototype, "writableLength", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: false,
    get: function get() {
      return this._writableState.length;
    }
  });
  function onend() {
    if (this._writableState.ended) return;
    process.nextTick(onEndNT, this);
  }
  function onEndNT(self2) {
    self2.end();
  }
  Object.defineProperty(Duplex.prototype, "destroyed", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: false,
    get: function get() {
      if (this._readableState === void 0 || this._writableState === void 0) {
        return false;
      }
      return this._readableState.destroyed && this._writableState.destroyed;
    },
    set: function set(value) {
      if (this._readableState === void 0 || this._writableState === void 0) {
        return;
      }
      this._readableState.destroyed = value;
      this._writableState.destroyed = value;
    }
  });
  return _stream_duplex;
}
var endOfStream;
var hasRequiredEndOfStream;
function requireEndOfStream() {
  if (hasRequiredEndOfStream) return endOfStream;
  hasRequiredEndOfStream = 1;
  var ERR_STREAM_PREMATURE_CLOSE = requireErrors().codes.ERR_STREAM_PREMATURE_CLOSE;
  function once2(callback) {
    var called = false;
    return function() {
      if (called) return;
      called = true;
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      callback.apply(this, args);
    };
  }
  function noop2() {
  }
  function isRequest(stream2) {
    return stream2.setHeader && typeof stream2.abort === "function";
  }
  function eos(stream2, opts, callback) {
    if (typeof opts === "function") return eos(stream2, null, opts);
    if (!opts) opts = {};
    callback = once2(callback || noop2);
    var readable2 = opts.readable || opts.readable !== false && stream2.readable;
    var writable = opts.writable || opts.writable !== false && stream2.writable;
    var onlegacyfinish = function onlegacyfinish2() {
      if (!stream2.writable) onfinish();
    };
    var writableEnded = stream2._writableState && stream2._writableState.finished;
    var onfinish = function onfinish2() {
      writable = false;
      writableEnded = true;
      if (!readable2) callback.call(stream2);
    };
    var readableEnded = stream2._readableState && stream2._readableState.endEmitted;
    var onend = function onend2() {
      readable2 = false;
      readableEnded = true;
      if (!writable) callback.call(stream2);
    };
    var onerror = function onerror2(err) {
      callback.call(stream2, err);
    };
    var onclose = function onclose2() {
      var err;
      if (readable2 && !readableEnded) {
        if (!stream2._readableState || !stream2._readableState.ended) err = new ERR_STREAM_PREMATURE_CLOSE();
        return callback.call(stream2, err);
      }
      if (writable && !writableEnded) {
        if (!stream2._writableState || !stream2._writableState.ended) err = new ERR_STREAM_PREMATURE_CLOSE();
        return callback.call(stream2, err);
      }
    };
    var onrequest = function onrequest2() {
      stream2.req.on("finish", onfinish);
    };
    if (isRequest(stream2)) {
      stream2.on("complete", onfinish);
      stream2.on("abort", onclose);
      if (stream2.req) onrequest();
      else stream2.on("request", onrequest);
    } else if (writable && !stream2._writableState) {
      stream2.on("end", onlegacyfinish);
      stream2.on("close", onlegacyfinish);
    }
    stream2.on("end", onend);
    stream2.on("finish", onfinish);
    if (opts.error !== false) stream2.on("error", onerror);
    stream2.on("close", onclose);
    return function() {
      stream2.removeListener("complete", onfinish);
      stream2.removeListener("abort", onclose);
      stream2.removeListener("request", onrequest);
      if (stream2.req) stream2.req.removeListener("finish", onfinish);
      stream2.removeListener("end", onlegacyfinish);
      stream2.removeListener("close", onlegacyfinish);
      stream2.removeListener("finish", onfinish);
      stream2.removeListener("end", onend);
      stream2.removeListener("error", onerror);
      stream2.removeListener("close", onclose);
    };
  }
  endOfStream = eos;
  return endOfStream;
}
var async_iterator;
var hasRequiredAsync_iterator;
function requireAsync_iterator() {
  if (hasRequiredAsync_iterator) return async_iterator;
  hasRequiredAsync_iterator = 1;
  var _Object$setPrototypeO;
  function _defineProperty(obj, key, value) {
    key = _toPropertyKey(key);
    if (key in obj) {
      Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, "string");
    return typeof key === "symbol" ? key : String(key);
  }
  function _toPrimitive(input, hint) {
    if (typeof input !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== void 0) {
      var res = prim.call(input, hint);
      if (typeof res !== "object") return res;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
  }
  var finished = requireEndOfStream();
  var kLastResolve = Symbol("lastResolve");
  var kLastReject = Symbol("lastReject");
  var kError = Symbol("error");
  var kEnded = Symbol("ended");
  var kLastPromise = Symbol("lastPromise");
  var kHandlePromise = Symbol("handlePromise");
  var kStream = Symbol("stream");
  function createIterResult(value, done) {
    return {
      value,
      done
    };
  }
  function readAndResolve(iter) {
    var resolve = iter[kLastResolve];
    if (resolve !== null) {
      var data = iter[kStream].read();
      if (data !== null) {
        iter[kLastPromise] = null;
        iter[kLastResolve] = null;
        iter[kLastReject] = null;
        resolve(createIterResult(data, false));
      }
    }
  }
  function onReadable(iter) {
    process.nextTick(readAndResolve, iter);
  }
  function wrapForNext(lastPromise, iter) {
    return function(resolve, reject2) {
      lastPromise.then(function() {
        if (iter[kEnded]) {
          resolve(createIterResult(void 0, true));
          return;
        }
        iter[kHandlePromise](resolve, reject2);
      }, reject2);
    };
  }
  var AsyncIteratorPrototype = Object.getPrototypeOf(function() {
  });
  var ReadableStreamAsyncIteratorPrototype = Object.setPrototypeOf((_Object$setPrototypeO = {
    get stream() {
      return this[kStream];
    },
    next: function next() {
      var _this = this;
      var error = this[kError];
      if (error !== null) {
        return Promise.reject(error);
      }
      if (this[kEnded]) {
        return Promise.resolve(createIterResult(void 0, true));
      }
      if (this[kStream].destroyed) {
        return new Promise(function(resolve, reject2) {
          process.nextTick(function() {
            if (_this[kError]) {
              reject2(_this[kError]);
            } else {
              resolve(createIterResult(void 0, true));
            }
          });
        });
      }
      var lastPromise = this[kLastPromise];
      var promise;
      if (lastPromise) {
        promise = new Promise(wrapForNext(lastPromise, this));
      } else {
        var data = this[kStream].read();
        if (data !== null) {
          return Promise.resolve(createIterResult(data, false));
        }
        promise = new Promise(this[kHandlePromise]);
      }
      this[kLastPromise] = promise;
      return promise;
    }
  }, _defineProperty(_Object$setPrototypeO, Symbol.asyncIterator, function() {
    return this;
  }), _defineProperty(_Object$setPrototypeO, "return", function _return() {
    var _this2 = this;
    return new Promise(function(resolve, reject2) {
      _this2[kStream].destroy(null, function(err) {
        if (err) {
          reject2(err);
          return;
        }
        resolve(createIterResult(void 0, true));
      });
    });
  }), _Object$setPrototypeO), AsyncIteratorPrototype);
  var createReadableStreamAsyncIterator = function createReadableStreamAsyncIterator2(stream2) {
    var _Object$create;
    var iterator = Object.create(ReadableStreamAsyncIteratorPrototype, (_Object$create = {}, _defineProperty(_Object$create, kStream, {
      value: stream2,
      writable: true
    }), _defineProperty(_Object$create, kLastResolve, {
      value: null,
      writable: true
    }), _defineProperty(_Object$create, kLastReject, {
      value: null,
      writable: true
    }), _defineProperty(_Object$create, kError, {
      value: null,
      writable: true
    }), _defineProperty(_Object$create, kEnded, {
      value: stream2._readableState.endEmitted,
      writable: true
    }), _defineProperty(_Object$create, kHandlePromise, {
      value: function value(resolve, reject2) {
        var data = iterator[kStream].read();
        if (data) {
          iterator[kLastPromise] = null;
          iterator[kLastResolve] = null;
          iterator[kLastReject] = null;
          resolve(createIterResult(data, false));
        } else {
          iterator[kLastResolve] = resolve;
          iterator[kLastReject] = reject2;
        }
      },
      writable: true
    }), _Object$create));
    iterator[kLastPromise] = null;
    finished(stream2, function(err) {
      if (err && err.code !== "ERR_STREAM_PREMATURE_CLOSE") {
        var reject2 = iterator[kLastReject];
        if (reject2 !== null) {
          iterator[kLastPromise] = null;
          iterator[kLastResolve] = null;
          iterator[kLastReject] = null;
          reject2(err);
        }
        iterator[kError] = err;
        return;
      }
      var resolve = iterator[kLastResolve];
      if (resolve !== null) {
        iterator[kLastPromise] = null;
        iterator[kLastResolve] = null;
        iterator[kLastReject] = null;
        resolve(createIterResult(void 0, true));
      }
      iterator[kEnded] = true;
    });
    stream2.on("readable", onReadable.bind(null, iterator));
    return iterator;
  };
  async_iterator = createReadableStreamAsyncIterator;
  return async_iterator;
}
var from_1;
var hasRequiredFrom;
function requireFrom() {
  if (hasRequiredFrom) return from_1;
  hasRequiredFrom = 1;
  function asyncGeneratorStep(gen, resolve, reject2, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject2(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }
  function _asyncToGenerator(fn) {
    return function() {
      var self2 = this, args = arguments;
      return new Promise(function(resolve, reject2) {
        var gen = fn.apply(self2, args);
        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject2, _next, _throw, "next", value);
        }
        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject2, _next, _throw, "throw", err);
        }
        _next(void 0);
      });
    };
  }
  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      enumerableOnly && (symbols = symbols.filter(function(sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      })), keys.push.apply(keys, symbols);
    }
    return keys;
  }
  function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = null != arguments[i] ? arguments[i] : {};
      i % 2 ? ownKeys(Object(source), true).forEach(function(key) {
        _defineProperty(target, key, source[key]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function(key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
    return target;
  }
  function _defineProperty(obj, key, value) {
    key = _toPropertyKey(key);
    if (key in obj) {
      Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, "string");
    return typeof key === "symbol" ? key : String(key);
  }
  function _toPrimitive(input, hint) {
    if (typeof input !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== void 0) {
      var res = prim.call(input, hint);
      if (typeof res !== "object") return res;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
  }
  var ERR_INVALID_ARG_TYPE = requireErrors().codes.ERR_INVALID_ARG_TYPE;
  function from(Readable, iterable, opts) {
    var iterator;
    if (iterable && typeof iterable.next === "function") {
      iterator = iterable;
    } else if (iterable && iterable[Symbol.asyncIterator]) iterator = iterable[Symbol.asyncIterator]();
    else if (iterable && iterable[Symbol.iterator]) iterator = iterable[Symbol.iterator]();
    else throw new ERR_INVALID_ARG_TYPE("iterable", ["Iterable"], iterable);
    var readable2 = new Readable(_objectSpread({
      objectMode: true
    }, opts));
    var reading = false;
    readable2._read = function() {
      if (!reading) {
        reading = true;
        next();
      }
    };
    function next() {
      return _next2.apply(this, arguments);
    }
    function _next2() {
      _next2 = _asyncToGenerator(function* () {
        try {
          var _yield$iterator$next = yield iterator.next(), value = _yield$iterator$next.value, done = _yield$iterator$next.done;
          if (done) {
            readable2.push(null);
          } else if (readable2.push(yield value)) {
            next();
          } else {
            reading = false;
          }
        } catch (err) {
          readable2.destroy(err);
        }
      });
      return _next2.apply(this, arguments);
    }
    return readable2;
  }
  from_1 = from;
  return from_1;
}
var _stream_readable;
var hasRequired_stream_readable;
function require_stream_readable() {
  if (hasRequired_stream_readable) return _stream_readable;
  hasRequired_stream_readable = 1;
  _stream_readable = Readable;
  var Duplex;
  Readable.ReadableState = ReadableState;
  require$$0.EventEmitter;
  var EElistenerCount = function EElistenerCount2(emitter, type) {
    return emitter.listeners(type).length;
  };
  var Stream = requireStream();
  var Buffer2 = require$$2.Buffer;
  var OurUint8Array = (typeof commonjsGlobal !== "undefined" ? commonjsGlobal : typeof window !== "undefined" ? window : typeof self !== "undefined" ? self : {}).Uint8Array || function() {
  };
  function _uint8ArrayToBuffer(chunk) {
    return Buffer2.from(chunk);
  }
  function _isUint8Array(obj) {
    return Buffer2.isBuffer(obj) || obj instanceof OurUint8Array;
  }
  var debugUtil = require$$0$1;
  var debug;
  if (debugUtil && debugUtil.debuglog) {
    debug = debugUtil.debuglog("stream");
  } else {
    debug = function debug2() {
    };
  }
  var BufferList = requireBuffer_list();
  var destroyImpl = requireDestroy();
  var _require = requireState(), getHighWaterMark = _require.getHighWaterMark;
  var _require$codes = requireErrors().codes, ERR_INVALID_ARG_TYPE = _require$codes.ERR_INVALID_ARG_TYPE, ERR_STREAM_PUSH_AFTER_EOF = _require$codes.ERR_STREAM_PUSH_AFTER_EOF, ERR_METHOD_NOT_IMPLEMENTED = _require$codes.ERR_METHOD_NOT_IMPLEMENTED, ERR_STREAM_UNSHIFT_AFTER_END_EVENT = _require$codes.ERR_STREAM_UNSHIFT_AFTER_END_EVENT;
  var StringDecoder;
  var createReadableStreamAsyncIterator;
  var from;
  require$$1(Readable, Stream);
  var errorOrDestroy = destroyImpl.errorOrDestroy;
  var kProxyEvents = ["error", "close", "destroy", "pause", "resume"];
  function prependListener(emitter, event, fn) {
    if (typeof emitter.prependListener === "function") return emitter.prependListener(event, fn);
    if (!emitter._events || !emitter._events[event]) emitter.on(event, fn);
    else if (Array.isArray(emitter._events[event])) emitter._events[event].unshift(fn);
    else emitter._events[event] = [fn, emitter._events[event]];
  }
  function ReadableState(options, stream2, isDuplex) {
    Duplex = Duplex || require_stream_duplex();
    options = options || {};
    if (typeof isDuplex !== "boolean") isDuplex = stream2 instanceof Duplex;
    this.objectMode = !!options.objectMode;
    if (isDuplex) this.objectMode = this.objectMode || !!options.readableObjectMode;
    this.highWaterMark = getHighWaterMark(this, options, "readableHighWaterMark", isDuplex);
    this.buffer = new BufferList();
    this.length = 0;
    this.pipes = null;
    this.pipesCount = 0;
    this.flowing = null;
    this.ended = false;
    this.endEmitted = false;
    this.reading = false;
    this.sync = true;
    this.needReadable = false;
    this.emittedReadable = false;
    this.readableListening = false;
    this.resumeScheduled = false;
    this.paused = true;
    this.emitClose = options.emitClose !== false;
    this.autoDestroy = !!options.autoDestroy;
    this.destroyed = false;
    this.defaultEncoding = options.defaultEncoding || "utf8";
    this.awaitDrain = 0;
    this.readingMore = false;
    this.decoder = null;
    this.encoding = null;
    if (options.encoding) {
      if (!StringDecoder) StringDecoder = require$$10.StringDecoder;
      this.decoder = new StringDecoder(options.encoding);
      this.encoding = options.encoding;
    }
  }
  function Readable(options) {
    Duplex = Duplex || require_stream_duplex();
    if (!(this instanceof Readable)) return new Readable(options);
    var isDuplex = this instanceof Duplex;
    this._readableState = new ReadableState(options, this, isDuplex);
    this.readable = true;
    if (options) {
      if (typeof options.read === "function") this._read = options.read;
      if (typeof options.destroy === "function") this._destroy = options.destroy;
    }
    Stream.call(this);
  }
  Object.defineProperty(Readable.prototype, "destroyed", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: false,
    get: function get() {
      if (this._readableState === void 0) {
        return false;
      }
      return this._readableState.destroyed;
    },
    set: function set(value) {
      if (!this._readableState) {
        return;
      }
      this._readableState.destroyed = value;
    }
  });
  Readable.prototype.destroy = destroyImpl.destroy;
  Readable.prototype._undestroy = destroyImpl.undestroy;
  Readable.prototype._destroy = function(err, cb) {
    cb(err);
  };
  Readable.prototype.push = function(chunk, encoding) {
    var state2 = this._readableState;
    var skipChunkCheck;
    if (!state2.objectMode) {
      if (typeof chunk === "string") {
        encoding = encoding || state2.defaultEncoding;
        if (encoding !== state2.encoding) {
          chunk = Buffer2.from(chunk, encoding);
          encoding = "";
        }
        skipChunkCheck = true;
      }
    } else {
      skipChunkCheck = true;
    }
    return readableAddChunk(this, chunk, encoding, false, skipChunkCheck);
  };
  Readable.prototype.unshift = function(chunk) {
    return readableAddChunk(this, chunk, null, true, false);
  };
  function readableAddChunk(stream2, chunk, encoding, addToFront, skipChunkCheck) {
    debug("readableAddChunk", chunk);
    var state2 = stream2._readableState;
    if (chunk === null) {
      state2.reading = false;
      onEofChunk(stream2, state2);
    } else {
      var er;
      if (!skipChunkCheck) er = chunkInvalid(state2, chunk);
      if (er) {
        errorOrDestroy(stream2, er);
      } else if (state2.objectMode || chunk && chunk.length > 0) {
        if (typeof chunk !== "string" && !state2.objectMode && Object.getPrototypeOf(chunk) !== Buffer2.prototype) {
          chunk = _uint8ArrayToBuffer(chunk);
        }
        if (addToFront) {
          if (state2.endEmitted) errorOrDestroy(stream2, new ERR_STREAM_UNSHIFT_AFTER_END_EVENT());
          else addChunk(stream2, state2, chunk, true);
        } else if (state2.ended) {
          errorOrDestroy(stream2, new ERR_STREAM_PUSH_AFTER_EOF());
        } else if (state2.destroyed) {
          return false;
        } else {
          state2.reading = false;
          if (state2.decoder && !encoding) {
            chunk = state2.decoder.write(chunk);
            if (state2.objectMode || chunk.length !== 0) addChunk(stream2, state2, chunk, false);
            else maybeReadMore(stream2, state2);
          } else {
            addChunk(stream2, state2, chunk, false);
          }
        }
      } else if (!addToFront) {
        state2.reading = false;
        maybeReadMore(stream2, state2);
      }
    }
    return !state2.ended && (state2.length < state2.highWaterMark || state2.length === 0);
  }
  function addChunk(stream2, state2, chunk, addToFront) {
    if (state2.flowing && state2.length === 0 && !state2.sync) {
      state2.awaitDrain = 0;
      stream2.emit("data", chunk);
    } else {
      state2.length += state2.objectMode ? 1 : chunk.length;
      if (addToFront) state2.buffer.unshift(chunk);
      else state2.buffer.push(chunk);
      if (state2.needReadable) emitReadable(stream2);
    }
    maybeReadMore(stream2, state2);
  }
  function chunkInvalid(state2, chunk) {
    var er;
    if (!_isUint8Array(chunk) && typeof chunk !== "string" && chunk !== void 0 && !state2.objectMode) {
      er = new ERR_INVALID_ARG_TYPE("chunk", ["string", "Buffer", "Uint8Array"], chunk);
    }
    return er;
  }
  Readable.prototype.isPaused = function() {
    return this._readableState.flowing === false;
  };
  Readable.prototype.setEncoding = function(enc) {
    if (!StringDecoder) StringDecoder = require$$10.StringDecoder;
    var decoder = new StringDecoder(enc);
    this._readableState.decoder = decoder;
    this._readableState.encoding = this._readableState.decoder.encoding;
    var p = this._readableState.buffer.head;
    var content = "";
    while (p !== null) {
      content += decoder.write(p.data);
      p = p.next;
    }
    this._readableState.buffer.clear();
    if (content !== "") this._readableState.buffer.push(content);
    this._readableState.length = content.length;
    return this;
  };
  var MAX_HWM = 1073741824;
  function computeNewHighWaterMark(n) {
    if (n >= MAX_HWM) {
      n = MAX_HWM;
    } else {
      n--;
      n |= n >>> 1;
      n |= n >>> 2;
      n |= n >>> 4;
      n |= n >>> 8;
      n |= n >>> 16;
      n++;
    }
    return n;
  }
  function howMuchToRead(n, state2) {
    if (n <= 0 || state2.length === 0 && state2.ended) return 0;
    if (state2.objectMode) return 1;
    if (n !== n) {
      if (state2.flowing && state2.length) return state2.buffer.head.data.length;
      else return state2.length;
    }
    if (n > state2.highWaterMark) state2.highWaterMark = computeNewHighWaterMark(n);
    if (n <= state2.length) return n;
    if (!state2.ended) {
      state2.needReadable = true;
      return 0;
    }
    return state2.length;
  }
  Readable.prototype.read = function(n) {
    debug("read", n);
    n = parseInt(n, 10);
    var state2 = this._readableState;
    var nOrig = n;
    if (n !== 0) state2.emittedReadable = false;
    if (n === 0 && state2.needReadable && ((state2.highWaterMark !== 0 ? state2.length >= state2.highWaterMark : state2.length > 0) || state2.ended)) {
      debug("read: emitReadable", state2.length, state2.ended);
      if (state2.length === 0 && state2.ended) endReadable(this);
      else emitReadable(this);
      return null;
    }
    n = howMuchToRead(n, state2);
    if (n === 0 && state2.ended) {
      if (state2.length === 0) endReadable(this);
      return null;
    }
    var doRead = state2.needReadable;
    debug("need readable", doRead);
    if (state2.length === 0 || state2.length - n < state2.highWaterMark) {
      doRead = true;
      debug("length less than watermark", doRead);
    }
    if (state2.ended || state2.reading) {
      doRead = false;
      debug("reading or ended", doRead);
    } else if (doRead) {
      debug("do read");
      state2.reading = true;
      state2.sync = true;
      if (state2.length === 0) state2.needReadable = true;
      this._read(state2.highWaterMark);
      state2.sync = false;
      if (!state2.reading) n = howMuchToRead(nOrig, state2);
    }
    var ret;
    if (n > 0) ret = fromList(n, state2);
    else ret = null;
    if (ret === null) {
      state2.needReadable = state2.length <= state2.highWaterMark;
      n = 0;
    } else {
      state2.length -= n;
      state2.awaitDrain = 0;
    }
    if (state2.length === 0) {
      if (!state2.ended) state2.needReadable = true;
      if (nOrig !== n && state2.ended) endReadable(this);
    }
    if (ret !== null) this.emit("data", ret);
    return ret;
  };
  function onEofChunk(stream2, state2) {
    debug("onEofChunk");
    if (state2.ended) return;
    if (state2.decoder) {
      var chunk = state2.decoder.end();
      if (chunk && chunk.length) {
        state2.buffer.push(chunk);
        state2.length += state2.objectMode ? 1 : chunk.length;
      }
    }
    state2.ended = true;
    if (state2.sync) {
      emitReadable(stream2);
    } else {
      state2.needReadable = false;
      if (!state2.emittedReadable) {
        state2.emittedReadable = true;
        emitReadable_(stream2);
      }
    }
  }
  function emitReadable(stream2) {
    var state2 = stream2._readableState;
    debug("emitReadable", state2.needReadable, state2.emittedReadable);
    state2.needReadable = false;
    if (!state2.emittedReadable) {
      debug("emitReadable", state2.flowing);
      state2.emittedReadable = true;
      process.nextTick(emitReadable_, stream2);
    }
  }
  function emitReadable_(stream2) {
    var state2 = stream2._readableState;
    debug("emitReadable_", state2.destroyed, state2.length, state2.ended);
    if (!state2.destroyed && (state2.length || state2.ended)) {
      stream2.emit("readable");
      state2.emittedReadable = false;
    }
    state2.needReadable = !state2.flowing && !state2.ended && state2.length <= state2.highWaterMark;
    flow(stream2);
  }
  function maybeReadMore(stream2, state2) {
    if (!state2.readingMore) {
      state2.readingMore = true;
      process.nextTick(maybeReadMore_, stream2, state2);
    }
  }
  function maybeReadMore_(stream2, state2) {
    while (!state2.reading && !state2.ended && (state2.length < state2.highWaterMark || state2.flowing && state2.length === 0)) {
      var len = state2.length;
      debug("maybeReadMore read 0");
      stream2.read(0);
      if (len === state2.length)
        break;
    }
    state2.readingMore = false;
  }
  Readable.prototype._read = function(n) {
    errorOrDestroy(this, new ERR_METHOD_NOT_IMPLEMENTED("_read()"));
  };
  Readable.prototype.pipe = function(dest, pipeOpts) {
    var src = this;
    var state2 = this._readableState;
    switch (state2.pipesCount) {
      case 0:
        state2.pipes = dest;
        break;
      case 1:
        state2.pipes = [state2.pipes, dest];
        break;
      default:
        state2.pipes.push(dest);
        break;
    }
    state2.pipesCount += 1;
    debug("pipe count=%d opts=%j", state2.pipesCount, pipeOpts);
    var doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr;
    var endFn = doEnd ? onend : unpipe;
    if (state2.endEmitted) process.nextTick(endFn);
    else src.once("end", endFn);
    dest.on("unpipe", onunpipe);
    function onunpipe(readable2, unpipeInfo) {
      debug("onunpipe");
      if (readable2 === src) {
        if (unpipeInfo && unpipeInfo.hasUnpiped === false) {
          unpipeInfo.hasUnpiped = true;
          cleanup();
        }
      }
    }
    function onend() {
      debug("onend");
      dest.end();
    }
    var ondrain = pipeOnDrain(src);
    dest.on("drain", ondrain);
    var cleanedUp = false;
    function cleanup() {
      debug("cleanup");
      dest.removeListener("close", onclose);
      dest.removeListener("finish", onfinish);
      dest.removeListener("drain", ondrain);
      dest.removeListener("error", onerror);
      dest.removeListener("unpipe", onunpipe);
      src.removeListener("end", onend);
      src.removeListener("end", unpipe);
      src.removeListener("data", ondata);
      cleanedUp = true;
      if (state2.awaitDrain && (!dest._writableState || dest._writableState.needDrain)) ondrain();
    }
    src.on("data", ondata);
    function ondata(chunk) {
      debug("ondata");
      var ret = dest.write(chunk);
      debug("dest.write", ret);
      if (ret === false) {
        if ((state2.pipesCount === 1 && state2.pipes === dest || state2.pipesCount > 1 && indexOf(state2.pipes, dest) !== -1) && !cleanedUp) {
          debug("false write response, pause", state2.awaitDrain);
          state2.awaitDrain++;
        }
        src.pause();
      }
    }
    function onerror(er) {
      debug("onerror", er);
      unpipe();
      dest.removeListener("error", onerror);
      if (EElistenerCount(dest, "error") === 0) errorOrDestroy(dest, er);
    }
    prependListener(dest, "error", onerror);
    function onclose() {
      dest.removeListener("finish", onfinish);
      unpipe();
    }
    dest.once("close", onclose);
    function onfinish() {
      debug("onfinish");
      dest.removeListener("close", onclose);
      unpipe();
    }
    dest.once("finish", onfinish);
    function unpipe() {
      debug("unpipe");
      src.unpipe(dest);
    }
    dest.emit("pipe", src);
    if (!state2.flowing) {
      debug("pipe resume");
      src.resume();
    }
    return dest;
  };
  function pipeOnDrain(src) {
    return function pipeOnDrainFunctionResult() {
      var state2 = src._readableState;
      debug("pipeOnDrain", state2.awaitDrain);
      if (state2.awaitDrain) state2.awaitDrain--;
      if (state2.awaitDrain === 0 && EElistenerCount(src, "data")) {
        state2.flowing = true;
        flow(src);
      }
    };
  }
  Readable.prototype.unpipe = function(dest) {
    var state2 = this._readableState;
    var unpipeInfo = {
      hasUnpiped: false
    };
    if (state2.pipesCount === 0) return this;
    if (state2.pipesCount === 1) {
      if (dest && dest !== state2.pipes) return this;
      if (!dest) dest = state2.pipes;
      state2.pipes = null;
      state2.pipesCount = 0;
      state2.flowing = false;
      if (dest) dest.emit("unpipe", this, unpipeInfo);
      return this;
    }
    if (!dest) {
      var dests = state2.pipes;
      var len = state2.pipesCount;
      state2.pipes = null;
      state2.pipesCount = 0;
      state2.flowing = false;
      for (var i = 0; i < len; i++) dests[i].emit("unpipe", this, {
        hasUnpiped: false
      });
      return this;
    }
    var index2 = indexOf(state2.pipes, dest);
    if (index2 === -1) return this;
    state2.pipes.splice(index2, 1);
    state2.pipesCount -= 1;
    if (state2.pipesCount === 1) state2.pipes = state2.pipes[0];
    dest.emit("unpipe", this, unpipeInfo);
    return this;
  };
  Readable.prototype.on = function(ev, fn) {
    var res = Stream.prototype.on.call(this, ev, fn);
    var state2 = this._readableState;
    if (ev === "data") {
      state2.readableListening = this.listenerCount("readable") > 0;
      if (state2.flowing !== false) this.resume();
    } else if (ev === "readable") {
      if (!state2.endEmitted && !state2.readableListening) {
        state2.readableListening = state2.needReadable = true;
        state2.flowing = false;
        state2.emittedReadable = false;
        debug("on readable", state2.length, state2.reading);
        if (state2.length) {
          emitReadable(this);
        } else if (!state2.reading) {
          process.nextTick(nReadingNextTick, this);
        }
      }
    }
    return res;
  };
  Readable.prototype.addListener = Readable.prototype.on;
  Readable.prototype.removeListener = function(ev, fn) {
    var res = Stream.prototype.removeListener.call(this, ev, fn);
    if (ev === "readable") {
      process.nextTick(updateReadableListening, this);
    }
    return res;
  };
  Readable.prototype.removeAllListeners = function(ev) {
    var res = Stream.prototype.removeAllListeners.apply(this, arguments);
    if (ev === "readable" || ev === void 0) {
      process.nextTick(updateReadableListening, this);
    }
    return res;
  };
  function updateReadableListening(self2) {
    var state2 = self2._readableState;
    state2.readableListening = self2.listenerCount("readable") > 0;
    if (state2.resumeScheduled && !state2.paused) {
      state2.flowing = true;
    } else if (self2.listenerCount("data") > 0) {
      self2.resume();
    }
  }
  function nReadingNextTick(self2) {
    debug("readable nexttick read 0");
    self2.read(0);
  }
  Readable.prototype.resume = function() {
    var state2 = this._readableState;
    if (!state2.flowing) {
      debug("resume");
      state2.flowing = !state2.readableListening;
      resume(this, state2);
    }
    state2.paused = false;
    return this;
  };
  function resume(stream2, state2) {
    if (!state2.resumeScheduled) {
      state2.resumeScheduled = true;
      process.nextTick(resume_, stream2, state2);
    }
  }
  function resume_(stream2, state2) {
    debug("resume", state2.reading);
    if (!state2.reading) {
      stream2.read(0);
    }
    state2.resumeScheduled = false;
    stream2.emit("resume");
    flow(stream2);
    if (state2.flowing && !state2.reading) stream2.read(0);
  }
  Readable.prototype.pause = function() {
    debug("call pause flowing=%j", this._readableState.flowing);
    if (this._readableState.flowing !== false) {
      debug("pause");
      this._readableState.flowing = false;
      this.emit("pause");
    }
    this._readableState.paused = true;
    return this;
  };
  function flow(stream2) {
    var state2 = stream2._readableState;
    debug("flow", state2.flowing);
    while (state2.flowing && stream2.read() !== null) ;
  }
  Readable.prototype.wrap = function(stream2) {
    var _this = this;
    var state2 = this._readableState;
    var paused = false;
    stream2.on("end", function() {
      debug("wrapped end");
      if (state2.decoder && !state2.ended) {
        var chunk = state2.decoder.end();
        if (chunk && chunk.length) _this.push(chunk);
      }
      _this.push(null);
    });
    stream2.on("data", function(chunk) {
      debug("wrapped data");
      if (state2.decoder) chunk = state2.decoder.write(chunk);
      if (state2.objectMode && (chunk === null || chunk === void 0)) return;
      else if (!state2.objectMode && (!chunk || !chunk.length)) return;
      var ret = _this.push(chunk);
      if (!ret) {
        paused = true;
        stream2.pause();
      }
    });
    for (var i in stream2) {
      if (this[i] === void 0 && typeof stream2[i] === "function") {
        this[i] = /* @__PURE__ */ (function methodWrap(method) {
          return function methodWrapReturnFunction() {
            return stream2[method].apply(stream2, arguments);
          };
        })(i);
      }
    }
    for (var n = 0; n < kProxyEvents.length; n++) {
      stream2.on(kProxyEvents[n], this.emit.bind(this, kProxyEvents[n]));
    }
    this._read = function(n2) {
      debug("wrapped _read", n2);
      if (paused) {
        paused = false;
        stream2.resume();
      }
    };
    return this;
  };
  if (typeof Symbol === "function") {
    Readable.prototype[Symbol.asyncIterator] = function() {
      if (createReadableStreamAsyncIterator === void 0) {
        createReadableStreamAsyncIterator = requireAsync_iterator();
      }
      return createReadableStreamAsyncIterator(this);
    };
  }
  Object.defineProperty(Readable.prototype, "readableHighWaterMark", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: false,
    get: function get() {
      return this._readableState.highWaterMark;
    }
  });
  Object.defineProperty(Readable.prototype, "readableBuffer", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: false,
    get: function get() {
      return this._readableState && this._readableState.buffer;
    }
  });
  Object.defineProperty(Readable.prototype, "readableFlowing", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: false,
    get: function get() {
      return this._readableState.flowing;
    },
    set: function set(state2) {
      if (this._readableState) {
        this._readableState.flowing = state2;
      }
    }
  });
  Readable._fromList = fromList;
  Object.defineProperty(Readable.prototype, "readableLength", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: false,
    get: function get() {
      return this._readableState.length;
    }
  });
  function fromList(n, state2) {
    if (state2.length === 0) return null;
    var ret;
    if (state2.objectMode) ret = state2.buffer.shift();
    else if (!n || n >= state2.length) {
      if (state2.decoder) ret = state2.buffer.join("");
      else if (state2.buffer.length === 1) ret = state2.buffer.first();
      else ret = state2.buffer.concat(state2.length);
      state2.buffer.clear();
    } else {
      ret = state2.buffer.consume(n, state2.decoder);
    }
    return ret;
  }
  function endReadable(stream2) {
    var state2 = stream2._readableState;
    debug("endReadable", state2.endEmitted);
    if (!state2.endEmitted) {
      state2.ended = true;
      process.nextTick(endReadableNT, state2, stream2);
    }
  }
  function endReadableNT(state2, stream2) {
    debug("endReadableNT", state2.endEmitted, state2.length);
    if (!state2.endEmitted && state2.length === 0) {
      state2.endEmitted = true;
      stream2.readable = false;
      stream2.emit("end");
      if (state2.autoDestroy) {
        var wState = stream2._writableState;
        if (!wState || wState.autoDestroy && wState.finished) {
          stream2.destroy();
        }
      }
    }
  }
  if (typeof Symbol === "function") {
    Readable.from = function(iterable, opts) {
      if (from === void 0) {
        from = requireFrom();
      }
      return from(Readable, iterable, opts);
    };
  }
  function indexOf(xs, x) {
    for (var i = 0, l = xs.length; i < l; i++) {
      if (xs[i] === x) return i;
    }
    return -1;
  }
  return _stream_readable;
}
var _stream_transform;
var hasRequired_stream_transform;
function require_stream_transform() {
  if (hasRequired_stream_transform) return _stream_transform;
  hasRequired_stream_transform = 1;
  _stream_transform = Transform;
  var _require$codes = requireErrors().codes, ERR_METHOD_NOT_IMPLEMENTED = _require$codes.ERR_METHOD_NOT_IMPLEMENTED, ERR_MULTIPLE_CALLBACK = _require$codes.ERR_MULTIPLE_CALLBACK, ERR_TRANSFORM_ALREADY_TRANSFORMING = _require$codes.ERR_TRANSFORM_ALREADY_TRANSFORMING, ERR_TRANSFORM_WITH_LENGTH_0 = _require$codes.ERR_TRANSFORM_WITH_LENGTH_0;
  var Duplex = require_stream_duplex();
  require$$1(Transform, Duplex);
  function afterTransform(er, data) {
    var ts = this._transformState;
    ts.transforming = false;
    var cb = ts.writecb;
    if (cb === null) {
      return this.emit("error", new ERR_MULTIPLE_CALLBACK());
    }
    ts.writechunk = null;
    ts.writecb = null;
    if (data != null)
      this.push(data);
    cb(er);
    var rs = this._readableState;
    rs.reading = false;
    if (rs.needReadable || rs.length < rs.highWaterMark) {
      this._read(rs.highWaterMark);
    }
  }
  function Transform(options) {
    if (!(this instanceof Transform)) return new Transform(options);
    Duplex.call(this, options);
    this._transformState = {
      afterTransform: afterTransform.bind(this),
      needTransform: false,
      transforming: false,
      writecb: null,
      writechunk: null,
      writeencoding: null
    };
    this._readableState.needReadable = true;
    this._readableState.sync = false;
    if (options) {
      if (typeof options.transform === "function") this._transform = options.transform;
      if (typeof options.flush === "function") this._flush = options.flush;
    }
    this.on("prefinish", prefinish);
  }
  function prefinish() {
    var _this = this;
    if (typeof this._flush === "function" && !this._readableState.destroyed) {
      this._flush(function(er, data) {
        done(_this, er, data);
      });
    } else {
      done(this, null, null);
    }
  }
  Transform.prototype.push = function(chunk, encoding) {
    this._transformState.needTransform = false;
    return Duplex.prototype.push.call(this, chunk, encoding);
  };
  Transform.prototype._transform = function(chunk, encoding, cb) {
    cb(new ERR_METHOD_NOT_IMPLEMENTED("_transform()"));
  };
  Transform.prototype._write = function(chunk, encoding, cb) {
    var ts = this._transformState;
    ts.writecb = cb;
    ts.writechunk = chunk;
    ts.writeencoding = encoding;
    if (!ts.transforming) {
      var rs = this._readableState;
      if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark) this._read(rs.highWaterMark);
    }
  };
  Transform.prototype._read = function(n) {
    var ts = this._transformState;
    if (ts.writechunk !== null && !ts.transforming) {
      ts.transforming = true;
      this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
    } else {
      ts.needTransform = true;
    }
  };
  Transform.prototype._destroy = function(err, cb) {
    Duplex.prototype._destroy.call(this, err, function(err2) {
      cb(err2);
    });
  };
  function done(stream2, er, data) {
    if (er) return stream2.emit("error", er);
    if (data != null)
      stream2.push(data);
    if (stream2._writableState.length) throw new ERR_TRANSFORM_WITH_LENGTH_0();
    if (stream2._transformState.transforming) throw new ERR_TRANSFORM_ALREADY_TRANSFORMING();
    return stream2.push(null);
  }
  return _stream_transform;
}
var _stream_passthrough;
var hasRequired_stream_passthrough;
function require_stream_passthrough() {
  if (hasRequired_stream_passthrough) return _stream_passthrough;
  hasRequired_stream_passthrough = 1;
  _stream_passthrough = PassThrough;
  var Transform = require_stream_transform();
  require$$1(PassThrough, Transform);
  function PassThrough(options) {
    if (!(this instanceof PassThrough)) return new PassThrough(options);
    Transform.call(this, options);
  }
  PassThrough.prototype._transform = function(chunk, encoding, cb) {
    cb(null, chunk);
  };
  return _stream_passthrough;
}
var pipeline_1;
var hasRequiredPipeline;
function requirePipeline() {
  if (hasRequiredPipeline) return pipeline_1;
  hasRequiredPipeline = 1;
  var eos;
  function once2(callback) {
    var called = false;
    return function() {
      if (called) return;
      called = true;
      callback.apply(void 0, arguments);
    };
  }
  var _require$codes = requireErrors().codes, ERR_MISSING_ARGS = _require$codes.ERR_MISSING_ARGS, ERR_STREAM_DESTROYED = _require$codes.ERR_STREAM_DESTROYED;
  function noop2(err) {
    if (err) throw err;
  }
  function isRequest(stream2) {
    return stream2.setHeader && typeof stream2.abort === "function";
  }
  function destroyer(stream2, reading, writing, callback) {
    callback = once2(callback);
    var closed = false;
    stream2.on("close", function() {
      closed = true;
    });
    if (eos === void 0) eos = requireEndOfStream();
    eos(stream2, {
      readable: reading,
      writable: writing
    }, function(err) {
      if (err) return callback(err);
      closed = true;
      callback();
    });
    var destroyed = false;
    return function(err) {
      if (closed) return;
      if (destroyed) return;
      destroyed = true;
      if (isRequest(stream2)) return stream2.abort();
      if (typeof stream2.destroy === "function") return stream2.destroy();
      callback(err || new ERR_STREAM_DESTROYED("pipe"));
    };
  }
  function call(fn) {
    fn();
  }
  function pipe(from, to) {
    return from.pipe(to);
  }
  function popCallback(streams) {
    if (!streams.length) return noop2;
    if (typeof streams[streams.length - 1] !== "function") return noop2;
    return streams.pop();
  }
  function pipeline2() {
    for (var _len = arguments.length, streams = new Array(_len), _key = 0; _key < _len; _key++) {
      streams[_key] = arguments[_key];
    }
    var callback = popCallback(streams);
    if (Array.isArray(streams[0])) streams = streams[0];
    if (streams.length < 2) {
      throw new ERR_MISSING_ARGS("streams");
    }
    var error;
    var destroys = streams.map(function(stream2, i) {
      var reading = i < streams.length - 1;
      var writing = i > 0;
      return destroyer(stream2, reading, writing, function(err) {
        if (!error) error = err;
        if (err) destroys.forEach(call);
        if (reading) return;
        destroys.forEach(call);
        callback(error);
      });
    });
    return streams.reduce(pipe);
  }
  pipeline_1 = pipeline2;
  return pipeline_1;
}
var hasRequiredReadable;
function requireReadable() {
  if (hasRequiredReadable) return readable.exports;
  hasRequiredReadable = 1;
  (function(module, exports) {
    var Stream = stream__default;
    if (process.env.READABLE_STREAM === "disable" && Stream) {
      module.exports = Stream.Readable;
      Object.assign(module.exports, Stream);
      module.exports.Stream = Stream;
    } else {
      exports = module.exports = require_stream_readable();
      exports.Stream = Stream || exports;
      exports.Readable = exports;
      exports.Writable = require_stream_writable();
      exports.Duplex = require_stream_duplex();
      exports.Transform = require_stream_transform();
      exports.PassThrough = require_stream_passthrough();
      exports.finished = requireEndOfStream();
      exports.pipeline = requirePipeline();
    }
  })(readable, readable.exports);
  return readable.exports;
}
var blockStream2;
var hasRequiredBlockStream2;
function requireBlockStream2() {
  if (hasRequiredBlockStream2) return blockStream2;
  hasRequiredBlockStream2 = 1;
  const { Transform } = requireReadable();
  class Block extends Transform {
    constructor(size, opts = {}) {
      super(opts);
      if (typeof size === "object") {
        opts = size;
        size = opts.size;
      }
      this.size = size || 512;
      const { nopad, zeroPadding = true } = opts;
      if (nopad) this._zeroPadding = false;
      else this._zeroPadding = !!zeroPadding;
      this._buffered = [];
      this._bufferedBytes = 0;
    }
    _transform(buf, enc, next) {
      this._bufferedBytes += buf.length;
      this._buffered.push(buf);
      while (this._bufferedBytes >= this.size) {
        this._bufferedBytes -= this.size;
        const blockBufs = [];
        let blockBufsBytes = 0;
        while (blockBufsBytes < this.size) {
          const b = this._buffered.shift();
          if (blockBufsBytes + b.length <= this.size) {
            blockBufs.push(b);
            blockBufsBytes += b.length;
          } else {
            const neededSize = this.size - blockBufsBytes;
            blockBufs.push(b.slice(0, neededSize));
            blockBufsBytes += neededSize;
            this._buffered.unshift(b.slice(neededSize));
          }
        }
        this.push(Buffer.concat(blockBufs, this.size));
      }
      next();
    }
    _flush() {
      if (this._bufferedBytes && this._zeroPadding) {
        const zeroes = Buffer.alloc(this.size - this._bufferedBytes);
        this._buffered.push(zeroes);
        this.push(Buffer.concat(this._buffered));
        this._buffered = null;
      } else if (this._bufferedBytes) {
        this.push(Buffer.concat(this._buffered));
        this._buffered = null;
      }
      this.push(null);
    }
  }
  blockStream2 = Block;
  return blockStream2;
}
var blockStream2Exports = requireBlockStream2();
const BlockStream2 = /* @__PURE__ */ getDefaultExportFromCjs$1(blockStream2Exports);
var lib = {};
var hasRequiredLib;
function requireLib() {
  if (hasRequiredLib) return lib;
  hasRequiredLib = 1;
  Object.defineProperty(lib, "__esModule", {
    value: true
  });
  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
    return typeof obj;
  } : function(obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };
  var isBrowser = typeof window !== "undefined" && typeof window.document !== "undefined";
  var isNode = typeof process !== "undefined" && process.versions != null && process.versions.node != null;
  var isWebWorker = (typeof self === "undefined" ? "undefined" : _typeof(self)) === "object" && self.constructor && self.constructor.name === "DedicatedWorkerGlobalScope";
  var isJsDom = typeof window !== "undefined" && window.name === "nodejs" || typeof navigator !== "undefined" && (navigator.userAgent.includes("Node.js") || navigator.userAgent.includes("jsdom"));
  var isDeno = typeof Deno !== "undefined" && typeof Deno.version !== "undefined" && typeof Deno.version.deno !== "undefined";
  lib.isBrowser = isBrowser;
  lib.isWebWorker = isWebWorker;
  lib.isNode = isNode;
  lib.isJsDom = isJsDom;
  lib.isDeno = isDeno;
  return lib;
}
var libExports = requireLib();
var lodashExports = requireLodash();
const _ = /* @__PURE__ */ getDefaultExportFromCjs$1(lodashExports);
var queryString = {};
var strictUriEncode;
var hasRequiredStrictUriEncode;
function requireStrictUriEncode() {
  if (hasRequiredStrictUriEncode) return strictUriEncode;
  hasRequiredStrictUriEncode = 1;
  strictUriEncode = (str) => encodeURIComponent(str).replace(/[!'()*]/g, (x) => `%${x.charCodeAt(0).toString(16).toUpperCase()}`);
  return strictUriEncode;
}
var decodeUriComponent;
var hasRequiredDecodeUriComponent;
function requireDecodeUriComponent() {
  if (hasRequiredDecodeUriComponent) return decodeUriComponent;
  hasRequiredDecodeUriComponent = 1;
  var token = "%[a-f0-9]{2}";
  var singleMatcher = new RegExp("(" + token + ")|([^%]+?)", "gi");
  var multiMatcher = new RegExp("(" + token + ")+", "gi");
  function decodeComponents(components, split) {
    try {
      return [decodeURIComponent(components.join(""))];
    } catch (err) {
    }
    if (components.length === 1) {
      return components;
    }
    split = split || 1;
    var left = components.slice(0, split);
    var right = components.slice(split);
    return Array.prototype.concat.call([], decodeComponents(left), decodeComponents(right));
  }
  function decode(input) {
    try {
      return decodeURIComponent(input);
    } catch (err) {
      var tokens = input.match(singleMatcher) || [];
      for (var i = 1; i < tokens.length; i++) {
        input = decodeComponents(tokens, i).join("");
        tokens = input.match(singleMatcher) || [];
      }
      return input;
    }
  }
  function customDecodeURIComponent(input) {
    var replaceMap = {
      "%FE%FF": "��",
      "%FF%FE": "��"
    };
    var match = multiMatcher.exec(input);
    while (match) {
      try {
        replaceMap[match[0]] = decodeURIComponent(match[0]);
      } catch (err) {
        var result = decode(match[0]);
        if (result !== match[0]) {
          replaceMap[match[0]] = result;
        }
      }
      match = multiMatcher.exec(input);
    }
    replaceMap["%C2"] = "�";
    var entries = Object.keys(replaceMap);
    for (var i = 0; i < entries.length; i++) {
      var key = entries[i];
      input = input.replace(new RegExp(key, "g"), replaceMap[key]);
    }
    return input;
  }
  decodeUriComponent = function(encodedURI) {
    if (typeof encodedURI !== "string") {
      throw new TypeError("Expected `encodedURI` to be of type `string`, got `" + typeof encodedURI + "`");
    }
    try {
      encodedURI = encodedURI.replace(/\+/g, " ");
      return decodeURIComponent(encodedURI);
    } catch (err) {
      return customDecodeURIComponent(encodedURI);
    }
  };
  return decodeUriComponent;
}
var splitOnFirst;
var hasRequiredSplitOnFirst;
function requireSplitOnFirst() {
  if (hasRequiredSplitOnFirst) return splitOnFirst;
  hasRequiredSplitOnFirst = 1;
  splitOnFirst = (string, separator) => {
    if (!(typeof string === "string" && typeof separator === "string")) {
      throw new TypeError("Expected the arguments to be of type `string`");
    }
    if (separator === "") {
      return [string];
    }
    const separatorIndex = string.indexOf(separator);
    if (separatorIndex === -1) {
      return [string];
    }
    return [
      string.slice(0, separatorIndex),
      string.slice(separatorIndex + separator.length)
    ];
  };
  return splitOnFirst;
}
var filterObj;
var hasRequiredFilterObj;
function requireFilterObj() {
  if (hasRequiredFilterObj) return filterObj;
  hasRequiredFilterObj = 1;
  filterObj = function(obj, predicate) {
    var ret = {};
    var keys = Object.keys(obj);
    var isArr = Array.isArray(predicate);
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var val = obj[key];
      if (isArr ? predicate.indexOf(key) !== -1 : predicate(key, val, obj)) {
        ret[key] = val;
      }
    }
    return ret;
  };
  return filterObj;
}
var hasRequiredQueryString;
function requireQueryString() {
  if (hasRequiredQueryString) return queryString;
  hasRequiredQueryString = 1;
  (function(exports) {
    const strictUriEncode2 = requireStrictUriEncode();
    const decodeComponent = requireDecodeUriComponent();
    const splitOnFirst2 = requireSplitOnFirst();
    const filterObject = requireFilterObj();
    const isNullOrUndefined = (value) => value === null || value === void 0;
    const encodeFragmentIdentifier = Symbol("encodeFragmentIdentifier");
    function encoderForArrayFormat(options) {
      switch (options.arrayFormat) {
        case "index":
          return (key) => (result, value) => {
            const index2 = result.length;
            if (value === void 0 || options.skipNull && value === null || options.skipEmptyString && value === "") {
              return result;
            }
            if (value === null) {
              return [...result, [encode(key, options), "[", index2, "]"].join("")];
            }
            return [
              ...result,
              [encode(key, options), "[", encode(index2, options), "]=", encode(value, options)].join("")
            ];
          };
        case "bracket":
          return (key) => (result, value) => {
            if (value === void 0 || options.skipNull && value === null || options.skipEmptyString && value === "") {
              return result;
            }
            if (value === null) {
              return [...result, [encode(key, options), "[]"].join("")];
            }
            return [...result, [encode(key, options), "[]=", encode(value, options)].join("")];
          };
        case "colon-list-separator":
          return (key) => (result, value) => {
            if (value === void 0 || options.skipNull && value === null || options.skipEmptyString && value === "") {
              return result;
            }
            if (value === null) {
              return [...result, [encode(key, options), ":list="].join("")];
            }
            return [...result, [encode(key, options), ":list=", encode(value, options)].join("")];
          };
        case "comma":
        case "separator":
        case "bracket-separator": {
          const keyValueSep = options.arrayFormat === "bracket-separator" ? "[]=" : "=";
          return (key) => (result, value) => {
            if (value === void 0 || options.skipNull && value === null || options.skipEmptyString && value === "") {
              return result;
            }
            value = value === null ? "" : value;
            if (result.length === 0) {
              return [[encode(key, options), keyValueSep, encode(value, options)].join("")];
            }
            return [[result, encode(value, options)].join(options.arrayFormatSeparator)];
          };
        }
        default:
          return (key) => (result, value) => {
            if (value === void 0 || options.skipNull && value === null || options.skipEmptyString && value === "") {
              return result;
            }
            if (value === null) {
              return [...result, encode(key, options)];
            }
            return [...result, [encode(key, options), "=", encode(value, options)].join("")];
          };
      }
    }
    function parserForArrayFormat(options) {
      let result;
      switch (options.arrayFormat) {
        case "index":
          return (key, value, accumulator) => {
            result = /\[(\d*)\]$/.exec(key);
            key = key.replace(/\[\d*\]$/, "");
            if (!result) {
              accumulator[key] = value;
              return;
            }
            if (accumulator[key] === void 0) {
              accumulator[key] = {};
            }
            accumulator[key][result[1]] = value;
          };
        case "bracket":
          return (key, value, accumulator) => {
            result = /(\[\])$/.exec(key);
            key = key.replace(/\[\]$/, "");
            if (!result) {
              accumulator[key] = value;
              return;
            }
            if (accumulator[key] === void 0) {
              accumulator[key] = [value];
              return;
            }
            accumulator[key] = [].concat(accumulator[key], value);
          };
        case "colon-list-separator":
          return (key, value, accumulator) => {
            result = /(:list)$/.exec(key);
            key = key.replace(/:list$/, "");
            if (!result) {
              accumulator[key] = value;
              return;
            }
            if (accumulator[key] === void 0) {
              accumulator[key] = [value];
              return;
            }
            accumulator[key] = [].concat(accumulator[key], value);
          };
        case "comma":
        case "separator":
          return (key, value, accumulator) => {
            const isArray3 = typeof value === "string" && value.includes(options.arrayFormatSeparator);
            const isEncodedArray = typeof value === "string" && !isArray3 && decode(value, options).includes(options.arrayFormatSeparator);
            value = isEncodedArray ? decode(value, options) : value;
            const newValue = isArray3 || isEncodedArray ? value.split(options.arrayFormatSeparator).map((item) => decode(item, options)) : value === null ? value : decode(value, options);
            accumulator[key] = newValue;
          };
        case "bracket-separator":
          return (key, value, accumulator) => {
            const isArray3 = /(\[\])$/.test(key);
            key = key.replace(/\[\]$/, "");
            if (!isArray3) {
              accumulator[key] = value ? decode(value, options) : value;
              return;
            }
            const arrayValue = value === null ? [] : value.split(options.arrayFormatSeparator).map((item) => decode(item, options));
            if (accumulator[key] === void 0) {
              accumulator[key] = arrayValue;
              return;
            }
            accumulator[key] = [].concat(accumulator[key], arrayValue);
          };
        default:
          return (key, value, accumulator) => {
            if (accumulator[key] === void 0) {
              accumulator[key] = value;
              return;
            }
            accumulator[key] = [].concat(accumulator[key], value);
          };
      }
    }
    function validateArrayFormatSeparator(value) {
      if (typeof value !== "string" || value.length !== 1) {
        throw new TypeError("arrayFormatSeparator must be single character string");
      }
    }
    function encode(value, options) {
      if (options.encode) {
        return options.strict ? strictUriEncode2(value) : encodeURIComponent(value);
      }
      return value;
    }
    function decode(value, options) {
      if (options.decode) {
        return decodeComponent(value);
      }
      return value;
    }
    function keysSorter(input) {
      if (Array.isArray(input)) {
        return input.sort();
      }
      if (typeof input === "object") {
        return keysSorter(Object.keys(input)).sort((a, b) => Number(a) - Number(b)).map((key) => input[key]);
      }
      return input;
    }
    function removeHash(input) {
      const hashStart = input.indexOf("#");
      if (hashStart !== -1) {
        input = input.slice(0, hashStart);
      }
      return input;
    }
    function getHash(url) {
      let hash = "";
      const hashStart = url.indexOf("#");
      if (hashStart !== -1) {
        hash = url.slice(hashStart);
      }
      return hash;
    }
    function extract(input) {
      input = removeHash(input);
      const queryStart = input.indexOf("?");
      if (queryStart === -1) {
        return "";
      }
      return input.slice(queryStart + 1);
    }
    function parseValue(value, options) {
      if (options.parseNumbers && !Number.isNaN(Number(value)) && (typeof value === "string" && value.trim() !== "")) {
        value = Number(value);
      } else if (options.parseBooleans && value !== null && (value.toLowerCase() === "true" || value.toLowerCase() === "false")) {
        value = value.toLowerCase() === "true";
      }
      return value;
    }
    function parse(query, options) {
      options = Object.assign({
        decode: true,
        sort: true,
        arrayFormat: "none",
        arrayFormatSeparator: ",",
        parseNumbers: false,
        parseBooleans: false
      }, options);
      validateArrayFormatSeparator(options.arrayFormatSeparator);
      const formatter = parserForArrayFormat(options);
      const ret = /* @__PURE__ */ Object.create(null);
      if (typeof query !== "string") {
        return ret;
      }
      query = query.trim().replace(/^[?#&]/, "");
      if (!query) {
        return ret;
      }
      for (const param of query.split("&")) {
        if (param === "") {
          continue;
        }
        let [key, value] = splitOnFirst2(options.decode ? param.replace(/\+/g, " ") : param, "=");
        value = value === void 0 ? null : ["comma", "separator", "bracket-separator"].includes(options.arrayFormat) ? value : decode(value, options);
        formatter(decode(key, options), value, ret);
      }
      for (const key of Object.keys(ret)) {
        const value = ret[key];
        if (typeof value === "object" && value !== null) {
          for (const k of Object.keys(value)) {
            value[k] = parseValue(value[k], options);
          }
        } else {
          ret[key] = parseValue(value, options);
        }
      }
      if (options.sort === false) {
        return ret;
      }
      return (options.sort === true ? Object.keys(ret).sort() : Object.keys(ret).sort(options.sort)).reduce((result, key) => {
        const value = ret[key];
        if (Boolean(value) && typeof value === "object" && !Array.isArray(value)) {
          result[key] = keysSorter(value);
        } else {
          result[key] = value;
        }
        return result;
      }, /* @__PURE__ */ Object.create(null));
    }
    exports.extract = extract;
    exports.parse = parse;
    exports.stringify = (object, options) => {
      if (!object) {
        return "";
      }
      options = Object.assign({
        encode: true,
        strict: true,
        arrayFormat: "none",
        arrayFormatSeparator: ","
      }, options);
      validateArrayFormatSeparator(options.arrayFormatSeparator);
      const shouldFilter = (key) => options.skipNull && isNullOrUndefined(object[key]) || options.skipEmptyString && object[key] === "";
      const formatter = encoderForArrayFormat(options);
      const objectCopy = {};
      for (const key of Object.keys(object)) {
        if (!shouldFilter(key)) {
          objectCopy[key] = object[key];
        }
      }
      const keys = Object.keys(objectCopy);
      if (options.sort !== false) {
        keys.sort(options.sort);
      }
      return keys.map((key) => {
        const value = object[key];
        if (value === void 0) {
          return "";
        }
        if (value === null) {
          return encode(key, options);
        }
        if (Array.isArray(value)) {
          if (value.length === 0 && options.arrayFormat === "bracket-separator") {
            return encode(key, options) + "[]";
          }
          return value.reduce(formatter(key), []).join("&");
        }
        return encode(key, options) + "=" + encode(value, options);
      }).filter((x) => x.length > 0).join("&");
    };
    exports.parseUrl = (url, options) => {
      options = Object.assign({
        decode: true
      }, options);
      const [url_, hash] = splitOnFirst2(url, "#");
      return Object.assign(
        {
          url: url_.split("?")[0] || "",
          query: parse(extract(url), options)
        },
        options && options.parseFragmentIdentifier && hash ? { fragmentIdentifier: decode(hash, options) } : {}
      );
    };
    exports.stringifyUrl = (object, options) => {
      options = Object.assign({
        encode: true,
        strict: true,
        [encodeFragmentIdentifier]: true
      }, options);
      const url = removeHash(object.url).split("?")[0] || "";
      const queryFromUrl = exports.extract(object.url);
      const parsedQueryFromUrl = exports.parse(queryFromUrl, { sort: false });
      const query = Object.assign(parsedQueryFromUrl, object.query);
      let queryString2 = exports.stringify(query, options);
      if (queryString2) {
        queryString2 = `?${queryString2}`;
      }
      let hash = getHash(object.url);
      if (object.fragmentIdentifier) {
        hash = `#${options[encodeFragmentIdentifier] ? encode(object.fragmentIdentifier, options) : object.fragmentIdentifier}`;
      }
      return `${url}${queryString2}${hash}`;
    };
    exports.pick = (input, filter2, options) => {
      options = Object.assign({
        parseFragmentIdentifier: true,
        [encodeFragmentIdentifier]: false
      }, options);
      const { url, query, fragmentIdentifier } = exports.parseUrl(input, options);
      return exports.stringifyUrl({
        url,
        query: filterObject(query, filter2),
        fragmentIdentifier
      }, options);
    };
    exports.exclude = (input, filter2, options) => {
      const exclusionFilter = Array.isArray(filter2) ? (key) => !filter2.includes(key) : (key, value) => !filter2(key, value);
      return exports.pick(input, exclusionFilter, options);
    };
  })(queryString);
  return queryString;
}
var queryStringExports = requireQueryString();
class Credentials {
  constructor({
    accessKey,
    secretKey,
    sessionToken
  }) {
    this.accessKey = accessKey;
    this.secretKey = secretKey;
    this.sessionToken = sessionToken;
  }
  setAccessKey(accessKey) {
    this.accessKey = accessKey;
  }
  getAccessKey() {
    return this.accessKey;
  }
  setSecretKey(secretKey) {
    this.secretKey = secretKey;
  }
  getSecretKey() {
    return this.secretKey;
  }
  setSessionToken(sessionToken) {
    this.sessionToken = sessionToken;
  }
  getSessionToken() {
    return this.sessionToken;
  }
  get() {
    return this;
  }
}
class CredentialProvider {
  constructor({
    accessKey,
    secretKey,
    sessionToken
  }) {
    this.credentials = new Credentials({
      accessKey,
      secretKey,
      sessionToken
    });
  }
  async getCredentials() {
    return this.credentials.get();
  }
  setCredentials(credentials) {
    if (credentials instanceof Credentials) {
      this.credentials = credentials;
    } else {
      throw new Error("Unable to set Credentials. it should be an instance of Credentials class");
    }
  }
  setAccessKey(accessKey) {
    this.credentials.setAccessKey(accessKey);
  }
  getAccessKey() {
    return this.credentials.getAccessKey();
  }
  setSecretKey(secretKey) {
    this.credentials.setSecretKey(secretKey);
  }
  getSecretKey() {
    return this.credentials.getSecretKey();
  }
  setSessionToken(sessionToken) {
    this.credentials.setSessionToken(sessionToken);
  }
  getSessionToken() {
    return this.credentials.getSessionToken();
  }
}
var validator = {};
var util = {};
var hasRequiredUtil;
function requireUtil() {
  if (hasRequiredUtil) return util;
  hasRequiredUtil = 1;
  (function(exports) {
    const nameStartChar = ":A-Za-z_\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD";
    const nameChar = nameStartChar + "\\-.\\d\\u00B7\\u0300-\\u036F\\u203F-\\u2040";
    const nameRegexp = "[" + nameStartChar + "][" + nameChar + "]*";
    const regexName = new RegExp("^" + nameRegexp + "$");
    const getAllMatches = function(string, regex) {
      const matches = [];
      let match = regex.exec(string);
      while (match) {
        const allmatches = [];
        allmatches.startIndex = regex.lastIndex - match[0].length;
        const len = match.length;
        for (let index2 = 0; index2 < len; index2++) {
          allmatches.push(match[index2]);
        }
        matches.push(allmatches);
        match = regex.exec(string);
      }
      return matches;
    };
    const isName = function(string) {
      const match = regexName.exec(string);
      return !(match === null || typeof match === "undefined");
    };
    exports.isExist = function(v) {
      return typeof v !== "undefined";
    };
    exports.isEmptyObject = function(obj) {
      return Object.keys(obj).length === 0;
    };
    exports.merge = function(target, a, arrayMode) {
      if (a) {
        const keys = Object.keys(a);
        const len = keys.length;
        for (let i = 0; i < len; i++) {
          if (arrayMode === "strict") {
            target[keys[i]] = [a[keys[i]]];
          } else {
            target[keys[i]] = a[keys[i]];
          }
        }
      }
    };
    exports.getValue = function(v) {
      if (exports.isExist(v)) {
        return v;
      } else {
        return "";
      }
    };
    exports.isName = isName;
    exports.getAllMatches = getAllMatches;
    exports.nameRegexp = nameRegexp;
  })(util);
  return util;
}
var hasRequiredValidator;
function requireValidator() {
  if (hasRequiredValidator) return validator;
  hasRequiredValidator = 1;
  const util2 = requireUtil();
  const defaultOptions = {
    allowBooleanAttributes: false,
    //A tag can have attributes without any value
    unpairedTags: []
  };
  validator.validate = function(xmlData, options) {
    options = Object.assign({}, defaultOptions, options);
    const tags = [];
    let tagFound = false;
    let reachedRoot = false;
    if (xmlData[0] === "\uFEFF") {
      xmlData = xmlData.substr(1);
    }
    for (let i = 0; i < xmlData.length; i++) {
      if (xmlData[i] === "<" && xmlData[i + 1] === "?") {
        i += 2;
        i = readPI(xmlData, i);
        if (i.err) return i;
      } else if (xmlData[i] === "<") {
        let tagStartPos = i;
        i++;
        if (xmlData[i] === "!") {
          i = readCommentAndCDATA(xmlData, i);
          continue;
        } else {
          let closingTag = false;
          if (xmlData[i] === "/") {
            closingTag = true;
            i++;
          }
          let tagName = "";
          for (; i < xmlData.length && xmlData[i] !== ">" && xmlData[i] !== " " && xmlData[i] !== "	" && xmlData[i] !== "\n" && xmlData[i] !== "\r"; i++) {
            tagName += xmlData[i];
          }
          tagName = tagName.trim();
          if (tagName[tagName.length - 1] === "/") {
            tagName = tagName.substring(0, tagName.length - 1);
            i--;
          }
          if (!validateTagName(tagName)) {
            let msg;
            if (tagName.trim().length === 0) {
              msg = "Invalid space after '<'.";
            } else {
              msg = "Tag '" + tagName + "' is an invalid name.";
            }
            return getErrorObject("InvalidTag", msg, getLineNumberForPosition(xmlData, i));
          }
          const result = readAttributeStr(xmlData, i);
          if (result === false) {
            return getErrorObject("InvalidAttr", "Attributes for '" + tagName + "' have open quote.", getLineNumberForPosition(xmlData, i));
          }
          let attrStr = result.value;
          i = result.index;
          if (attrStr[attrStr.length - 1] === "/") {
            const attrStrStart = i - attrStr.length;
            attrStr = attrStr.substring(0, attrStr.length - 1);
            const isValid = validateAttributeString(attrStr, options);
            if (isValid === true) {
              tagFound = true;
            } else {
              return getErrorObject(isValid.err.code, isValid.err.msg, getLineNumberForPosition(xmlData, attrStrStart + isValid.err.line));
            }
          } else if (closingTag) {
            if (!result.tagClosed) {
              return getErrorObject("InvalidTag", "Closing tag '" + tagName + "' doesn't have proper closing.", getLineNumberForPosition(xmlData, i));
            } else if (attrStr.trim().length > 0) {
              return getErrorObject("InvalidTag", "Closing tag '" + tagName + "' can't have attributes or invalid starting.", getLineNumberForPosition(xmlData, tagStartPos));
            } else if (tags.length === 0) {
              return getErrorObject("InvalidTag", "Closing tag '" + tagName + "' has not been opened.", getLineNumberForPosition(xmlData, tagStartPos));
            } else {
              const otg = tags.pop();
              if (tagName !== otg.tagName) {
                let openPos = getLineNumberForPosition(xmlData, otg.tagStartPos);
                return getErrorObject(
                  "InvalidTag",
                  "Expected closing tag '" + otg.tagName + "' (opened in line " + openPos.line + ", col " + openPos.col + ") instead of closing tag '" + tagName + "'.",
                  getLineNumberForPosition(xmlData, tagStartPos)
                );
              }
              if (tags.length == 0) {
                reachedRoot = true;
              }
            }
          } else {
            const isValid = validateAttributeString(attrStr, options);
            if (isValid !== true) {
              return getErrorObject(isValid.err.code, isValid.err.msg, getLineNumberForPosition(xmlData, i - attrStr.length + isValid.err.line));
            }
            if (reachedRoot === true) {
              return getErrorObject("InvalidXml", "Multiple possible root nodes found.", getLineNumberForPosition(xmlData, i));
            } else if (options.unpairedTags.indexOf(tagName) !== -1) ;
            else {
              tags.push({ tagName, tagStartPos });
            }
            tagFound = true;
          }
          for (i++; i < xmlData.length; i++) {
            if (xmlData[i] === "<") {
              if (xmlData[i + 1] === "!") {
                i++;
                i = readCommentAndCDATA(xmlData, i);
                continue;
              } else if (xmlData[i + 1] === "?") {
                i = readPI(xmlData, ++i);
                if (i.err) return i;
              } else {
                break;
              }
            } else if (xmlData[i] === "&") {
              const afterAmp = validateAmpersand(xmlData, i);
              if (afterAmp == -1)
                return getErrorObject("InvalidChar", "char '&' is not expected.", getLineNumberForPosition(xmlData, i));
              i = afterAmp;
            } else {
              if (reachedRoot === true && !isWhiteSpace(xmlData[i])) {
                return getErrorObject("InvalidXml", "Extra text at the end", getLineNumberForPosition(xmlData, i));
              }
            }
          }
          if (xmlData[i] === "<") {
            i--;
          }
        }
      } else {
        if (isWhiteSpace(xmlData[i])) {
          continue;
        }
        return getErrorObject("InvalidChar", "char '" + xmlData[i] + "' is not expected.", getLineNumberForPosition(xmlData, i));
      }
    }
    if (!tagFound) {
      return getErrorObject("InvalidXml", "Start tag expected.", 1);
    } else if (tags.length == 1) {
      return getErrorObject("InvalidTag", "Unclosed tag '" + tags[0].tagName + "'.", getLineNumberForPosition(xmlData, tags[0].tagStartPos));
    } else if (tags.length > 0) {
      return getErrorObject("InvalidXml", "Invalid '" + JSON.stringify(tags.map((t) => t.tagName), null, 4).replace(/\r?\n/g, "") + "' found.", { line: 1, col: 1 });
    }
    return true;
  };
  function isWhiteSpace(char) {
    return char === " " || char === "	" || char === "\n" || char === "\r";
  }
  function readPI(xmlData, i) {
    const start = i;
    for (; i < xmlData.length; i++) {
      if (xmlData[i] == "?" || xmlData[i] == " ") {
        const tagname = xmlData.substr(start, i - start);
        if (i > 5 && tagname === "xml") {
          return getErrorObject("InvalidXml", "XML declaration allowed only at the start of the document.", getLineNumberForPosition(xmlData, i));
        } else if (xmlData[i] == "?" && xmlData[i + 1] == ">") {
          i++;
          break;
        } else {
          continue;
        }
      }
    }
    return i;
  }
  function readCommentAndCDATA(xmlData, i) {
    if (xmlData.length > i + 5 && xmlData[i + 1] === "-" && xmlData[i + 2] === "-") {
      for (i += 3; i < xmlData.length; i++) {
        if (xmlData[i] === "-" && xmlData[i + 1] === "-" && xmlData[i + 2] === ">") {
          i += 2;
          break;
        }
      }
    } else if (xmlData.length > i + 8 && xmlData[i + 1] === "D" && xmlData[i + 2] === "O" && xmlData[i + 3] === "C" && xmlData[i + 4] === "T" && xmlData[i + 5] === "Y" && xmlData[i + 6] === "P" && xmlData[i + 7] === "E") {
      let angleBracketsCount = 1;
      for (i += 8; i < xmlData.length; i++) {
        if (xmlData[i] === "<") {
          angleBracketsCount++;
        } else if (xmlData[i] === ">") {
          angleBracketsCount--;
          if (angleBracketsCount === 0) {
            break;
          }
        }
      }
    } else if (xmlData.length > i + 9 && xmlData[i + 1] === "[" && xmlData[i + 2] === "C" && xmlData[i + 3] === "D" && xmlData[i + 4] === "A" && xmlData[i + 5] === "T" && xmlData[i + 6] === "A" && xmlData[i + 7] === "[") {
      for (i += 8; i < xmlData.length; i++) {
        if (xmlData[i] === "]" && xmlData[i + 1] === "]" && xmlData[i + 2] === ">") {
          i += 2;
          break;
        }
      }
    }
    return i;
  }
  const doubleQuote = '"';
  const singleQuote = "'";
  function readAttributeStr(xmlData, i) {
    let attrStr = "";
    let startChar = "";
    let tagClosed = false;
    for (; i < xmlData.length; i++) {
      if (xmlData[i] === doubleQuote || xmlData[i] === singleQuote) {
        if (startChar === "") {
          startChar = xmlData[i];
        } else if (startChar !== xmlData[i]) ;
        else {
          startChar = "";
        }
      } else if (xmlData[i] === ">") {
        if (startChar === "") {
          tagClosed = true;
          break;
        }
      }
      attrStr += xmlData[i];
    }
    if (startChar !== "") {
      return false;
    }
    return {
      value: attrStr,
      index: i,
      tagClosed
    };
  }
  const validAttrStrRegxp = new RegExp(`(\\s*)([^\\s=]+)(\\s*=)?(\\s*(['"])(([\\s\\S])*?)\\5)?`, "g");
  function validateAttributeString(attrStr, options) {
    const matches = util2.getAllMatches(attrStr, validAttrStrRegxp);
    const attrNames = {};
    for (let i = 0; i < matches.length; i++) {
      if (matches[i][1].length === 0) {
        return getErrorObject("InvalidAttr", "Attribute '" + matches[i][2] + "' has no space in starting.", getPositionFromMatch(matches[i]));
      } else if (matches[i][3] !== void 0 && matches[i][4] === void 0) {
        return getErrorObject("InvalidAttr", "Attribute '" + matches[i][2] + "' is without value.", getPositionFromMatch(matches[i]));
      } else if (matches[i][3] === void 0 && !options.allowBooleanAttributes) {
        return getErrorObject("InvalidAttr", "boolean attribute '" + matches[i][2] + "' is not allowed.", getPositionFromMatch(matches[i]));
      }
      const attrName = matches[i][2];
      if (!validateAttrName(attrName)) {
        return getErrorObject("InvalidAttr", "Attribute '" + attrName + "' is an invalid name.", getPositionFromMatch(matches[i]));
      }
      if (!attrNames.hasOwnProperty(attrName)) {
        attrNames[attrName] = 1;
      } else {
        return getErrorObject("InvalidAttr", "Attribute '" + attrName + "' is repeated.", getPositionFromMatch(matches[i]));
      }
    }
    return true;
  }
  function validateNumberAmpersand(xmlData, i) {
    let re = /\d/;
    if (xmlData[i] === "x") {
      i++;
      re = /[\da-fA-F]/;
    }
    for (; i < xmlData.length; i++) {
      if (xmlData[i] === ";")
        return i;
      if (!xmlData[i].match(re))
        break;
    }
    return -1;
  }
  function validateAmpersand(xmlData, i) {
    i++;
    if (xmlData[i] === ";")
      return -1;
    if (xmlData[i] === "#") {
      i++;
      return validateNumberAmpersand(xmlData, i);
    }
    let count = 0;
    for (; i < xmlData.length; i++, count++) {
      if (xmlData[i].match(/\w/) && count < 20)
        continue;
      if (xmlData[i] === ";")
        break;
      return -1;
    }
    return i;
  }
  function getErrorObject(code, message, lineNumber) {
    return {
      err: {
        code,
        msg: message,
        line: lineNumber.line || lineNumber,
        col: lineNumber.col
      }
    };
  }
  function validateAttrName(attrName) {
    return util2.isName(attrName);
  }
  function validateTagName(tagname) {
    return util2.isName(tagname);
  }
  function getLineNumberForPosition(xmlData, index2) {
    const lines = xmlData.substring(0, index2).split(/\r?\n/);
    return {
      line: lines.length,
      // column number is last line's length + 1, because column numbering starts at 1:
      col: lines[lines.length - 1].length + 1
    };
  }
  function getPositionFromMatch(match) {
    return match.startIndex + match[1].length;
  }
  return validator;
}
var OptionsBuilder = {};
var hasRequiredOptionsBuilder;
function requireOptionsBuilder() {
  if (hasRequiredOptionsBuilder) return OptionsBuilder;
  hasRequiredOptionsBuilder = 1;
  const defaultOptions = {
    preserveOrder: false,
    attributeNamePrefix: "@_",
    attributesGroupName: false,
    textNodeName: "#text",
    ignoreAttributes: true,
    removeNSPrefix: false,
    // remove NS from tag name or attribute name if true
    allowBooleanAttributes: false,
    //a tag can have attributes without any value
    //ignoreRootElement : false,
    parseTagValue: true,
    parseAttributeValue: false,
    trimValues: true,
    //Trim string values of tag and attributes
    cdataPropName: false,
    numberParseOptions: {
      hex: true,
      leadingZeros: true,
      eNotation: true
    },
    tagValueProcessor: function(tagName, val) {
      return val;
    },
    attributeValueProcessor: function(attrName, val) {
      return val;
    },
    stopNodes: [],
    //nested tags will not be parsed even for errors
    alwaysCreateTextNode: false,
    isArray: () => false,
    commentPropName: false,
    unpairedTags: [],
    processEntities: true,
    htmlEntities: false,
    ignoreDeclaration: false,
    ignorePiTags: false,
    transformTagName: false,
    transformAttributeName: false,
    updateTag: function(tagName, jPath, attrs) {
      return tagName;
    }
    // skipEmptyListItem: false
  };
  const buildOptions = function(options) {
    return Object.assign({}, defaultOptions, options);
  };
  OptionsBuilder.buildOptions = buildOptions;
  OptionsBuilder.defaultOptions = defaultOptions;
  return OptionsBuilder;
}
var xmlNode;
var hasRequiredXmlNode;
function requireXmlNode() {
  if (hasRequiredXmlNode) return xmlNode;
  hasRequiredXmlNode = 1;
  class XmlNode {
    constructor(tagname) {
      this.tagname = tagname;
      this.child = [];
      this[":@"] = {};
    }
    add(key, val) {
      if (key === "__proto__") key = "#__proto__";
      this.child.push({ [key]: val });
    }
    addChild(node2) {
      if (node2.tagname === "__proto__") node2.tagname = "#__proto__";
      if (node2[":@"] && Object.keys(node2[":@"]).length > 0) {
        this.child.push({ [node2.tagname]: node2.child, [":@"]: node2[":@"] });
      } else {
        this.child.push({ [node2.tagname]: node2.child });
      }
    }
  }
  xmlNode = XmlNode;
  return xmlNode;
}
var DocTypeReader;
var hasRequiredDocTypeReader;
function requireDocTypeReader() {
  if (hasRequiredDocTypeReader) return DocTypeReader;
  hasRequiredDocTypeReader = 1;
  const util2 = requireUtil();
  function readDocType(xmlData, i) {
    const entities = {};
    if (xmlData[i + 3] === "O" && xmlData[i + 4] === "C" && xmlData[i + 5] === "T" && xmlData[i + 6] === "Y" && xmlData[i + 7] === "P" && xmlData[i + 8] === "E") {
      i = i + 9;
      let angleBracketsCount = 1;
      let hasBody = false, comment = false;
      let exp = "";
      for (; i < xmlData.length; i++) {
        if (xmlData[i] === "<" && !comment) {
          if (hasBody && isEntity(xmlData, i)) {
            i += 7;
            let entityName, val;
            [entityName, val, i] = readEntityExp(xmlData, i + 1);
            if (val.indexOf("&") === -1)
              entities[validateEntityName(entityName)] = {
                regx: RegExp(`&${entityName};`, "g"),
                val
              };
          } else if (hasBody && isElement(xmlData, i)) i += 8;
          else if (hasBody && isAttlist(xmlData, i)) i += 8;
          else if (hasBody && isNotation(xmlData, i)) i += 9;
          else if (isComment) comment = true;
          else throw new Error("Invalid DOCTYPE");
          angleBracketsCount++;
          exp = "";
        } else if (xmlData[i] === ">") {
          if (comment) {
            if (xmlData[i - 1] === "-" && xmlData[i - 2] === "-") {
              comment = false;
              angleBracketsCount--;
            }
          } else {
            angleBracketsCount--;
          }
          if (angleBracketsCount === 0) {
            break;
          }
        } else if (xmlData[i] === "[") {
          hasBody = true;
        } else {
          exp += xmlData[i];
        }
      }
      if (angleBracketsCount !== 0) {
        throw new Error(`Unclosed DOCTYPE`);
      }
    } else {
      throw new Error(`Invalid Tag instead of DOCTYPE`);
    }
    return { entities, i };
  }
  function readEntityExp(xmlData, i) {
    let entityName = "";
    for (; i < xmlData.length && (xmlData[i] !== "'" && xmlData[i] !== '"'); i++) {
      entityName += xmlData[i];
    }
    entityName = entityName.trim();
    if (entityName.indexOf(" ") !== -1) throw new Error("External entites are not supported");
    const startChar = xmlData[i++];
    let val = "";
    for (; i < xmlData.length && xmlData[i] !== startChar; i++) {
      val += xmlData[i];
    }
    return [entityName, val, i];
  }
  function isComment(xmlData, i) {
    if (xmlData[i + 1] === "!" && xmlData[i + 2] === "-" && xmlData[i + 3] === "-") return true;
    return false;
  }
  function isEntity(xmlData, i) {
    if (xmlData[i + 1] === "!" && xmlData[i + 2] === "E" && xmlData[i + 3] === "N" && xmlData[i + 4] === "T" && xmlData[i + 5] === "I" && xmlData[i + 6] === "T" && xmlData[i + 7] === "Y") return true;
    return false;
  }
  function isElement(xmlData, i) {
    if (xmlData[i + 1] === "!" && xmlData[i + 2] === "E" && xmlData[i + 3] === "L" && xmlData[i + 4] === "E" && xmlData[i + 5] === "M" && xmlData[i + 6] === "E" && xmlData[i + 7] === "N" && xmlData[i + 8] === "T") return true;
    return false;
  }
  function isAttlist(xmlData, i) {
    if (xmlData[i + 1] === "!" && xmlData[i + 2] === "A" && xmlData[i + 3] === "T" && xmlData[i + 4] === "T" && xmlData[i + 5] === "L" && xmlData[i + 6] === "I" && xmlData[i + 7] === "S" && xmlData[i + 8] === "T") return true;
    return false;
  }
  function isNotation(xmlData, i) {
    if (xmlData[i + 1] === "!" && xmlData[i + 2] === "N" && xmlData[i + 3] === "O" && xmlData[i + 4] === "T" && xmlData[i + 5] === "A" && xmlData[i + 6] === "T" && xmlData[i + 7] === "I" && xmlData[i + 8] === "O" && xmlData[i + 9] === "N") return true;
    return false;
  }
  function validateEntityName(name) {
    if (util2.isName(name))
      return name;
    else
      throw new Error(`Invalid entity name ${name}`);
  }
  DocTypeReader = readDocType;
  return DocTypeReader;
}
var strnum;
var hasRequiredStrnum;
function requireStrnum() {
  if (hasRequiredStrnum) return strnum;
  hasRequiredStrnum = 1;
  const hexRegex = /^[-+]?0x[a-fA-F0-9]+$/;
  const numRegex = /^([\-\+])?(0*)([0-9]*(\.[0-9]*)?)$/;
  const consider = {
    hex: true,
    // oct: false,
    leadingZeros: true,
    decimalPoint: ".",
    eNotation: true
    //skipLike: /regex/
  };
  function toNumber(str, options = {}) {
    options = Object.assign({}, consider, options);
    if (!str || typeof str !== "string") return str;
    let trimmedStr = str.trim();
    if (options.skipLike !== void 0 && options.skipLike.test(trimmedStr)) return str;
    else if (str === "0") return 0;
    else if (options.hex && hexRegex.test(trimmedStr)) {
      return parse_int(trimmedStr, 16);
    } else if (trimmedStr.search(/[eE]/) !== -1) {
      const notation = trimmedStr.match(/^([-\+])?(0*)([0-9]*(\.[0-9]*)?[eE][-\+]?[0-9]+)$/);
      if (notation) {
        if (options.leadingZeros) {
          trimmedStr = (notation[1] || "") + notation[3];
        } else {
          if (notation[2] === "0" && notation[3][0] === ".") ;
          else {
            return str;
          }
        }
        return options.eNotation ? Number(trimmedStr) : str;
      } else {
        return str;
      }
    } else {
      const match = numRegex.exec(trimmedStr);
      if (match) {
        const sign = match[1];
        const leadingZeros = match[2];
        let numTrimmedByZeros = trimZeros(match[3]);
        if (!options.leadingZeros && leadingZeros.length > 0 && sign && trimmedStr[2] !== ".") return str;
        else if (!options.leadingZeros && leadingZeros.length > 0 && !sign && trimmedStr[1] !== ".") return str;
        else if (options.leadingZeros && leadingZeros === str) return 0;
        else {
          const num = Number(trimmedStr);
          const numStr = "" + num;
          if (numStr.search(/[eE]/) !== -1) {
            if (options.eNotation) return num;
            else return str;
          } else if (trimmedStr.indexOf(".") !== -1) {
            if (numStr === "0" && numTrimmedByZeros === "") return num;
            else if (numStr === numTrimmedByZeros) return num;
            else if (sign && numStr === "-" + numTrimmedByZeros) return num;
            else return str;
          }
          if (leadingZeros) {
            return numTrimmedByZeros === numStr || sign + numTrimmedByZeros === numStr ? num : str;
          } else {
            return trimmedStr === numStr || trimmedStr === sign + numStr ? num : str;
          }
        }
      } else {
        return str;
      }
    }
  }
  function trimZeros(numStr) {
    if (numStr && numStr.indexOf(".") !== -1) {
      numStr = numStr.replace(/0+$/, "");
      if (numStr === ".") numStr = "0";
      else if (numStr[0] === ".") numStr = "0" + numStr;
      else if (numStr[numStr.length - 1] === ".") numStr = numStr.substr(0, numStr.length - 1);
      return numStr;
    }
    return numStr;
  }
  function parse_int(numStr, base) {
    if (parseInt) return parseInt(numStr, base);
    else if (Number.parseInt) return Number.parseInt(numStr, base);
    else if (window && window.parseInt) return window.parseInt(numStr, base);
    else throw new Error("parseInt, Number.parseInt, window.parseInt are not supported");
  }
  strnum = toNumber;
  return strnum;
}
var ignoreAttributes;
var hasRequiredIgnoreAttributes;
function requireIgnoreAttributes() {
  if (hasRequiredIgnoreAttributes) return ignoreAttributes;
  hasRequiredIgnoreAttributes = 1;
  function getIgnoreAttributesFn(ignoreAttributes2) {
    if (typeof ignoreAttributes2 === "function") {
      return ignoreAttributes2;
    }
    if (Array.isArray(ignoreAttributes2)) {
      return (attrName) => {
        for (const pattern of ignoreAttributes2) {
          if (typeof pattern === "string" && attrName === pattern) {
            return true;
          }
          if (pattern instanceof RegExp && pattern.test(attrName)) {
            return true;
          }
        }
      };
    }
    return () => false;
  }
  ignoreAttributes = getIgnoreAttributesFn;
  return ignoreAttributes;
}
var OrderedObjParser_1;
var hasRequiredOrderedObjParser;
function requireOrderedObjParser() {
  if (hasRequiredOrderedObjParser) return OrderedObjParser_1;
  hasRequiredOrderedObjParser = 1;
  const util2 = requireUtil();
  const xmlNode2 = requireXmlNode();
  const readDocType = requireDocTypeReader();
  const toNumber = requireStrnum();
  const getIgnoreAttributesFn = requireIgnoreAttributes();
  class OrderedObjParser {
    constructor(options) {
      this.options = options;
      this.currentNode = null;
      this.tagsNodeStack = [];
      this.docTypeEntities = {};
      this.lastEntities = {
        "apos": { regex: /&(apos|#39|#x27);/g, val: "'" },
        "gt": { regex: /&(gt|#62|#x3E);/g, val: ">" },
        "lt": { regex: /&(lt|#60|#x3C);/g, val: "<" },
        "quot": { regex: /&(quot|#34|#x22);/g, val: '"' }
      };
      this.ampEntity = { regex: /&(amp|#38|#x26);/g, val: "&" };
      this.htmlEntities = {
        "space": { regex: /&(nbsp|#160);/g, val: " " },
        // "lt" : { regex: /&(lt|#60);/g, val: "<" },
        // "gt" : { regex: /&(gt|#62);/g, val: ">" },
        // "amp" : { regex: /&(amp|#38);/g, val: "&" },
        // "quot" : { regex: /&(quot|#34);/g, val: "\"" },
        // "apos" : { regex: /&(apos|#39);/g, val: "'" },
        "cent": { regex: /&(cent|#162);/g, val: "¢" },
        "pound": { regex: /&(pound|#163);/g, val: "£" },
        "yen": { regex: /&(yen|#165);/g, val: "¥" },
        "euro": { regex: /&(euro|#8364);/g, val: "€" },
        "copyright": { regex: /&(copy|#169);/g, val: "©" },
        "reg": { regex: /&(reg|#174);/g, val: "®" },
        "inr": { regex: /&(inr|#8377);/g, val: "₹" },
        "num_dec": { regex: /&#([0-9]{1,7});/g, val: (_2, str) => String.fromCharCode(Number.parseInt(str, 10)) },
        "num_hex": { regex: /&#x([0-9a-fA-F]{1,6});/g, val: (_2, str) => String.fromCharCode(Number.parseInt(str, 16)) }
      };
      this.addExternalEntities = addExternalEntities;
      this.parseXml = parseXml2;
      this.parseTextData = parseTextData;
      this.resolveNameSpace = resolveNameSpace;
      this.buildAttributesMap = buildAttributesMap;
      this.isItStopNode = isItStopNode;
      this.replaceEntitiesValue = replaceEntitiesValue;
      this.readStopNodeData = readStopNodeData;
      this.saveTextToParentTag = saveTextToParentTag;
      this.addChild = addChild;
      this.ignoreAttributesFn = getIgnoreAttributesFn(this.options.ignoreAttributes);
    }
  }
  function addExternalEntities(externalEntities) {
    const entKeys = Object.keys(externalEntities);
    for (let i = 0; i < entKeys.length; i++) {
      const ent = entKeys[i];
      this.lastEntities[ent] = {
        regex: new RegExp("&" + ent + ";", "g"),
        val: externalEntities[ent]
      };
    }
  }
  function parseTextData(val, tagName, jPath, dontTrim, hasAttributes, isLeafNode, escapeEntities) {
    if (val !== void 0) {
      if (this.options.trimValues && !dontTrim) {
        val = val.trim();
      }
      if (val.length > 0) {
        if (!escapeEntities) val = this.replaceEntitiesValue(val);
        const newval = this.options.tagValueProcessor(tagName, val, jPath, hasAttributes, isLeafNode);
        if (newval === null || newval === void 0) {
          return val;
        } else if (typeof newval !== typeof val || newval !== val) {
          return newval;
        } else if (this.options.trimValues) {
          return parseValue(val, this.options.parseTagValue, this.options.numberParseOptions);
        } else {
          const trimmedVal = val.trim();
          if (trimmedVal === val) {
            return parseValue(val, this.options.parseTagValue, this.options.numberParseOptions);
          } else {
            return val;
          }
        }
      }
    }
  }
  function resolveNameSpace(tagname) {
    if (this.options.removeNSPrefix) {
      const tags = tagname.split(":");
      const prefix = tagname.charAt(0) === "/" ? "/" : "";
      if (tags[0] === "xmlns") {
        return "";
      }
      if (tags.length === 2) {
        tagname = prefix + tags[1];
      }
    }
    return tagname;
  }
  const attrsRegx = new RegExp(`([^\\s=]+)\\s*(=\\s*(['"])([\\s\\S]*?)\\3)?`, "gm");
  function buildAttributesMap(attrStr, jPath, tagName) {
    if (this.options.ignoreAttributes !== true && typeof attrStr === "string") {
      const matches = util2.getAllMatches(attrStr, attrsRegx);
      const len = matches.length;
      const attrs = {};
      for (let i = 0; i < len; i++) {
        const attrName = this.resolveNameSpace(matches[i][1]);
        if (this.ignoreAttributesFn(attrName, jPath)) {
          continue;
        }
        let oldVal = matches[i][4];
        let aName = this.options.attributeNamePrefix + attrName;
        if (attrName.length) {
          if (this.options.transformAttributeName) {
            aName = this.options.transformAttributeName(aName);
          }
          if (aName === "__proto__") aName = "#__proto__";
          if (oldVal !== void 0) {
            if (this.options.trimValues) {
              oldVal = oldVal.trim();
            }
            oldVal = this.replaceEntitiesValue(oldVal);
            const newVal = this.options.attributeValueProcessor(attrName, oldVal, jPath);
            if (newVal === null || newVal === void 0) {
              attrs[aName] = oldVal;
            } else if (typeof newVal !== typeof oldVal || newVal !== oldVal) {
              attrs[aName] = newVal;
            } else {
              attrs[aName] = parseValue(
                oldVal,
                this.options.parseAttributeValue,
                this.options.numberParseOptions
              );
            }
          } else if (this.options.allowBooleanAttributes) {
            attrs[aName] = true;
          }
        }
      }
      if (!Object.keys(attrs).length) {
        return;
      }
      if (this.options.attributesGroupName) {
        const attrCollection = {};
        attrCollection[this.options.attributesGroupName] = attrs;
        return attrCollection;
      }
      return attrs;
    }
  }
  const parseXml2 = function(xmlData) {
    xmlData = xmlData.replace(/\r\n?/g, "\n");
    const xmlObj = new xmlNode2("!xml");
    let currentNode = xmlObj;
    let textData = "";
    let jPath = "";
    for (let i = 0; i < xmlData.length; i++) {
      const ch = xmlData[i];
      if (ch === "<") {
        if (xmlData[i + 1] === "/") {
          const closeIndex = findClosingIndex(xmlData, ">", i, "Closing Tag is not closed.");
          let tagName = xmlData.substring(i + 2, closeIndex).trim();
          if (this.options.removeNSPrefix) {
            const colonIndex = tagName.indexOf(":");
            if (colonIndex !== -1) {
              tagName = tagName.substr(colonIndex + 1);
            }
          }
          if (this.options.transformTagName) {
            tagName = this.options.transformTagName(tagName);
          }
          if (currentNode) {
            textData = this.saveTextToParentTag(textData, currentNode, jPath);
          }
          const lastTagName = jPath.substring(jPath.lastIndexOf(".") + 1);
          if (tagName && this.options.unpairedTags.indexOf(tagName) !== -1) {
            throw new Error(`Unpaired tag can not be used as closing tag: </${tagName}>`);
          }
          let propIndex = 0;
          if (lastTagName && this.options.unpairedTags.indexOf(lastTagName) !== -1) {
            propIndex = jPath.lastIndexOf(".", jPath.lastIndexOf(".") - 1);
            this.tagsNodeStack.pop();
          } else {
            propIndex = jPath.lastIndexOf(".");
          }
          jPath = jPath.substring(0, propIndex);
          currentNode = this.tagsNodeStack.pop();
          textData = "";
          i = closeIndex;
        } else if (xmlData[i + 1] === "?") {
          let tagData = readTagExp(xmlData, i, false, "?>");
          if (!tagData) throw new Error("Pi Tag is not closed.");
          textData = this.saveTextToParentTag(textData, currentNode, jPath);
          if (this.options.ignoreDeclaration && tagData.tagName === "?xml" || this.options.ignorePiTags) ;
          else {
            const childNode = new xmlNode2(tagData.tagName);
            childNode.add(this.options.textNodeName, "");
            if (tagData.tagName !== tagData.tagExp && tagData.attrExpPresent) {
              childNode[":@"] = this.buildAttributesMap(tagData.tagExp, jPath, tagData.tagName);
            }
            this.addChild(currentNode, childNode, jPath);
          }
          i = tagData.closeIndex + 1;
        } else if (xmlData.substr(i + 1, 3) === "!--") {
          const endIndex = findClosingIndex(xmlData, "-->", i + 4, "Comment is not closed.");
          if (this.options.commentPropName) {
            const comment = xmlData.substring(i + 4, endIndex - 2);
            textData = this.saveTextToParentTag(textData, currentNode, jPath);
            currentNode.add(this.options.commentPropName, [{ [this.options.textNodeName]: comment }]);
          }
          i = endIndex;
        } else if (xmlData.substr(i + 1, 2) === "!D") {
          const result = readDocType(xmlData, i);
          this.docTypeEntities = result.entities;
          i = result.i;
        } else if (xmlData.substr(i + 1, 2) === "![") {
          const closeIndex = findClosingIndex(xmlData, "]]>", i, "CDATA is not closed.") - 2;
          const tagExp = xmlData.substring(i + 9, closeIndex);
          textData = this.saveTextToParentTag(textData, currentNode, jPath);
          let val = this.parseTextData(tagExp, currentNode.tagname, jPath, true, false, true, true);
          if (val == void 0) val = "";
          if (this.options.cdataPropName) {
            currentNode.add(this.options.cdataPropName, [{ [this.options.textNodeName]: tagExp }]);
          } else {
            currentNode.add(this.options.textNodeName, val);
          }
          i = closeIndex + 2;
        } else {
          let result = readTagExp(xmlData, i, this.options.removeNSPrefix);
          let tagName = result.tagName;
          const rawTagName = result.rawTagName;
          let tagExp = result.tagExp;
          let attrExpPresent = result.attrExpPresent;
          let closeIndex = result.closeIndex;
          if (this.options.transformTagName) {
            tagName = this.options.transformTagName(tagName);
          }
          if (currentNode && textData) {
            if (currentNode.tagname !== "!xml") {
              textData = this.saveTextToParentTag(textData, currentNode, jPath, false);
            }
          }
          const lastTag = currentNode;
          if (lastTag && this.options.unpairedTags.indexOf(lastTag.tagname) !== -1) {
            currentNode = this.tagsNodeStack.pop();
            jPath = jPath.substring(0, jPath.lastIndexOf("."));
          }
          if (tagName !== xmlObj.tagname) {
            jPath += jPath ? "." + tagName : tagName;
          }
          if (this.isItStopNode(this.options.stopNodes, jPath, tagName)) {
            let tagContent = "";
            if (tagExp.length > 0 && tagExp.lastIndexOf("/") === tagExp.length - 1) {
              if (tagName[tagName.length - 1] === "/") {
                tagName = tagName.substr(0, tagName.length - 1);
                jPath = jPath.substr(0, jPath.length - 1);
                tagExp = tagName;
              } else {
                tagExp = tagExp.substr(0, tagExp.length - 1);
              }
              i = result.closeIndex;
            } else if (this.options.unpairedTags.indexOf(tagName) !== -1) {
              i = result.closeIndex;
            } else {
              const result2 = this.readStopNodeData(xmlData, rawTagName, closeIndex + 1);
              if (!result2) throw new Error(`Unexpected end of ${rawTagName}`);
              i = result2.i;
              tagContent = result2.tagContent;
            }
            const childNode = new xmlNode2(tagName);
            if (tagName !== tagExp && attrExpPresent) {
              childNode[":@"] = this.buildAttributesMap(tagExp, jPath, tagName);
            }
            if (tagContent) {
              tagContent = this.parseTextData(tagContent, tagName, jPath, true, attrExpPresent, true, true);
            }
            jPath = jPath.substr(0, jPath.lastIndexOf("."));
            childNode.add(this.options.textNodeName, tagContent);
            this.addChild(currentNode, childNode, jPath);
          } else {
            if (tagExp.length > 0 && tagExp.lastIndexOf("/") === tagExp.length - 1) {
              if (tagName[tagName.length - 1] === "/") {
                tagName = tagName.substr(0, tagName.length - 1);
                jPath = jPath.substr(0, jPath.length - 1);
                tagExp = tagName;
              } else {
                tagExp = tagExp.substr(0, tagExp.length - 1);
              }
              if (this.options.transformTagName) {
                tagName = this.options.transformTagName(tagName);
              }
              const childNode = new xmlNode2(tagName);
              if (tagName !== tagExp && attrExpPresent) {
                childNode[":@"] = this.buildAttributesMap(tagExp, jPath, tagName);
              }
              this.addChild(currentNode, childNode, jPath);
              jPath = jPath.substr(0, jPath.lastIndexOf("."));
            } else {
              const childNode = new xmlNode2(tagName);
              this.tagsNodeStack.push(currentNode);
              if (tagName !== tagExp && attrExpPresent) {
                childNode[":@"] = this.buildAttributesMap(tagExp, jPath, tagName);
              }
              this.addChild(currentNode, childNode, jPath);
              currentNode = childNode;
            }
            textData = "";
            i = closeIndex;
          }
        }
      } else {
        textData += xmlData[i];
      }
    }
    return xmlObj.child;
  };
  function addChild(currentNode, childNode, jPath) {
    const result = this.options.updateTag(childNode.tagname, jPath, childNode[":@"]);
    if (result === false) ;
    else if (typeof result === "string") {
      childNode.tagname = result;
      currentNode.addChild(childNode);
    } else {
      currentNode.addChild(childNode);
    }
  }
  const replaceEntitiesValue = function(val) {
    if (this.options.processEntities) {
      for (let entityName in this.docTypeEntities) {
        const entity = this.docTypeEntities[entityName];
        val = val.replace(entity.regx, entity.val);
      }
      for (let entityName in this.lastEntities) {
        const entity = this.lastEntities[entityName];
        val = val.replace(entity.regex, entity.val);
      }
      if (this.options.htmlEntities) {
        for (let entityName in this.htmlEntities) {
          const entity = this.htmlEntities[entityName];
          val = val.replace(entity.regex, entity.val);
        }
      }
      val = val.replace(this.ampEntity.regex, this.ampEntity.val);
    }
    return val;
  };
  function saveTextToParentTag(textData, currentNode, jPath, isLeafNode) {
    if (textData) {
      if (isLeafNode === void 0) isLeafNode = currentNode.child.length === 0;
      textData = this.parseTextData(
        textData,
        currentNode.tagname,
        jPath,
        false,
        currentNode[":@"] ? Object.keys(currentNode[":@"]).length !== 0 : false,
        isLeafNode
      );
      if (textData !== void 0 && textData !== "")
        currentNode.add(this.options.textNodeName, textData);
      textData = "";
    }
    return textData;
  }
  function isItStopNode(stopNodes, jPath, currentTagName) {
    const allNodesExp = "*." + currentTagName;
    for (const stopNodePath in stopNodes) {
      const stopNodeExp = stopNodes[stopNodePath];
      if (allNodesExp === stopNodeExp || jPath === stopNodeExp) return true;
    }
    return false;
  }
  function tagExpWithClosingIndex(xmlData, i, closingChar = ">") {
    let attrBoundary;
    let tagExp = "";
    for (let index2 = i; index2 < xmlData.length; index2++) {
      let ch = xmlData[index2];
      if (attrBoundary) {
        if (ch === attrBoundary) attrBoundary = "";
      } else if (ch === '"' || ch === "'") {
        attrBoundary = ch;
      } else if (ch === closingChar[0]) {
        if (closingChar[1]) {
          if (xmlData[index2 + 1] === closingChar[1]) {
            return {
              data: tagExp,
              index: index2
            };
          }
        } else {
          return {
            data: tagExp,
            index: index2
          };
        }
      } else if (ch === "	") {
        ch = " ";
      }
      tagExp += ch;
    }
  }
  function findClosingIndex(xmlData, str, i, errMsg) {
    const closingIndex = xmlData.indexOf(str, i);
    if (closingIndex === -1) {
      throw new Error(errMsg);
    } else {
      return closingIndex + str.length - 1;
    }
  }
  function readTagExp(xmlData, i, removeNSPrefix, closingChar = ">") {
    const result = tagExpWithClosingIndex(xmlData, i + 1, closingChar);
    if (!result) return;
    let tagExp = result.data;
    const closeIndex = result.index;
    const separatorIndex = tagExp.search(/\s/);
    let tagName = tagExp;
    let attrExpPresent = true;
    if (separatorIndex !== -1) {
      tagName = tagExp.substring(0, separatorIndex);
      tagExp = tagExp.substring(separatorIndex + 1).trimStart();
    }
    const rawTagName = tagName;
    if (removeNSPrefix) {
      const colonIndex = tagName.indexOf(":");
      if (colonIndex !== -1) {
        tagName = tagName.substr(colonIndex + 1);
        attrExpPresent = tagName !== result.data.substr(colonIndex + 1);
      }
    }
    return {
      tagName,
      tagExp,
      closeIndex,
      attrExpPresent,
      rawTagName
    };
  }
  function readStopNodeData(xmlData, tagName, i) {
    const startIndex = i;
    let openTagCount = 1;
    for (; i < xmlData.length; i++) {
      if (xmlData[i] === "<") {
        if (xmlData[i + 1] === "/") {
          const closeIndex = findClosingIndex(xmlData, ">", i, `${tagName} is not closed`);
          let closeTagName = xmlData.substring(i + 2, closeIndex).trim();
          if (closeTagName === tagName) {
            openTagCount--;
            if (openTagCount === 0) {
              return {
                tagContent: xmlData.substring(startIndex, i),
                i: closeIndex
              };
            }
          }
          i = closeIndex;
        } else if (xmlData[i + 1] === "?") {
          const closeIndex = findClosingIndex(xmlData, "?>", i + 1, "StopNode is not closed.");
          i = closeIndex;
        } else if (xmlData.substr(i + 1, 3) === "!--") {
          const closeIndex = findClosingIndex(xmlData, "-->", i + 3, "StopNode is not closed.");
          i = closeIndex;
        } else if (xmlData.substr(i + 1, 2) === "![") {
          const closeIndex = findClosingIndex(xmlData, "]]>", i, "StopNode is not closed.") - 2;
          i = closeIndex;
        } else {
          const tagData = readTagExp(xmlData, i, ">");
          if (tagData) {
            const openTagName = tagData && tagData.tagName;
            if (openTagName === tagName && tagData.tagExp[tagData.tagExp.length - 1] !== "/") {
              openTagCount++;
            }
            i = tagData.closeIndex;
          }
        }
      }
    }
  }
  function parseValue(val, shouldParse, options) {
    if (shouldParse && typeof val === "string") {
      const newval = val.trim();
      if (newval === "true") return true;
      else if (newval === "false") return false;
      else return toNumber(val, options);
    } else {
      if (util2.isExist(val)) {
        return val;
      } else {
        return "";
      }
    }
  }
  OrderedObjParser_1 = OrderedObjParser;
  return OrderedObjParser_1;
}
var node2json = {};
var hasRequiredNode2json;
function requireNode2json() {
  if (hasRequiredNode2json) return node2json;
  hasRequiredNode2json = 1;
  function prettify(node2, options) {
    return compress(node2, options);
  }
  function compress(arr, options, jPath) {
    let text;
    const compressedObj = {};
    for (let i = 0; i < arr.length; i++) {
      const tagObj = arr[i];
      const property = propName(tagObj);
      let newJpath = "";
      if (jPath === void 0) newJpath = property;
      else newJpath = jPath + "." + property;
      if (property === options.textNodeName) {
        if (text === void 0) text = tagObj[property];
        else text += "" + tagObj[property];
      } else if (property === void 0) {
        continue;
      } else if (tagObj[property]) {
        let val = compress(tagObj[property], options, newJpath);
        const isLeaf = isLeafTag(val, options);
        if (tagObj[":@"]) {
          assignAttributes(val, tagObj[":@"], newJpath, options);
        } else if (Object.keys(val).length === 1 && val[options.textNodeName] !== void 0 && !options.alwaysCreateTextNode) {
          val = val[options.textNodeName];
        } else if (Object.keys(val).length === 0) {
          if (options.alwaysCreateTextNode) val[options.textNodeName] = "";
          else val = "";
        }
        if (compressedObj[property] !== void 0 && compressedObj.hasOwnProperty(property)) {
          if (!Array.isArray(compressedObj[property])) {
            compressedObj[property] = [compressedObj[property]];
          }
          compressedObj[property].push(val);
        } else {
          if (options.isArray(property, newJpath, isLeaf)) {
            compressedObj[property] = [val];
          } else {
            compressedObj[property] = val;
          }
        }
      }
    }
    if (typeof text === "string") {
      if (text.length > 0) compressedObj[options.textNodeName] = text;
    } else if (text !== void 0) compressedObj[options.textNodeName] = text;
    return compressedObj;
  }
  function propName(obj) {
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (key !== ":@") return key;
    }
  }
  function assignAttributes(obj, attrMap, jpath, options) {
    if (attrMap) {
      const keys = Object.keys(attrMap);
      const len = keys.length;
      for (let i = 0; i < len; i++) {
        const atrrName = keys[i];
        if (options.isArray(atrrName, jpath + "." + atrrName, true, true)) {
          obj[atrrName] = [attrMap[atrrName]];
        } else {
          obj[atrrName] = attrMap[atrrName];
        }
      }
    }
  }
  function isLeafTag(obj, options) {
    const { textNodeName } = options;
    const propCount = Object.keys(obj).length;
    if (propCount === 0) {
      return true;
    }
    if (propCount === 1 && (obj[textNodeName] || typeof obj[textNodeName] === "boolean" || obj[textNodeName] === 0)) {
      return true;
    }
    return false;
  }
  node2json.prettify = prettify;
  return node2json;
}
var XMLParser_1;
var hasRequiredXMLParser;
function requireXMLParser() {
  if (hasRequiredXMLParser) return XMLParser_1;
  hasRequiredXMLParser = 1;
  const { buildOptions } = requireOptionsBuilder();
  const OrderedObjParser = requireOrderedObjParser();
  const { prettify } = requireNode2json();
  const validator2 = requireValidator();
  class XMLParser {
    constructor(options) {
      this.externalEntities = {};
      this.options = buildOptions(options);
    }
    /**
     * Parse XML dats to JS object 
     * @param {string|Buffer} xmlData 
     * @param {boolean|Object} validationOption 
     */
    parse(xmlData, validationOption) {
      if (typeof xmlData === "string") ;
      else if (xmlData.toString) {
        xmlData = xmlData.toString();
      } else {
        throw new Error("XML data is accepted in String or Bytes[] form.");
      }
      if (validationOption) {
        if (validationOption === true) validationOption = {};
        const result = validator2.validate(xmlData, validationOption);
        if (result !== true) {
          throw Error(`${result.err.msg}:${result.err.line}:${result.err.col}`);
        }
      }
      const orderedObjParser = new OrderedObjParser(this.options);
      orderedObjParser.addExternalEntities(this.externalEntities);
      const orderedResult = orderedObjParser.parseXml(xmlData);
      if (this.options.preserveOrder || orderedResult === void 0) return orderedResult;
      else return prettify(orderedResult, this.options);
    }
    /**
     * Add Entity which is not by default supported by this library
     * @param {string} key 
     * @param {string} value 
     */
    addEntity(key, value) {
      if (value.indexOf("&") !== -1) {
        throw new Error("Entity value can't have '&'");
      } else if (key.indexOf("&") !== -1 || key.indexOf(";") !== -1) {
        throw new Error("An entity must be set without '&' and ';'. Eg. use '#xD' for '&#xD;'");
      } else if (value === "&") {
        throw new Error("An entity with value '&' is not permitted");
      } else {
        this.externalEntities[key] = value;
      }
    }
  }
  XMLParser_1 = XMLParser;
  return XMLParser_1;
}
var orderedJs2Xml;
var hasRequiredOrderedJs2Xml;
function requireOrderedJs2Xml() {
  if (hasRequiredOrderedJs2Xml) return orderedJs2Xml;
  hasRequiredOrderedJs2Xml = 1;
  const EOL = "\n";
  function toXml(jArray, options) {
    let indentation = "";
    if (options.format && options.indentBy.length > 0) {
      indentation = EOL;
    }
    return arrToStr(jArray, options, "", indentation);
  }
  function arrToStr(arr, options, jPath, indentation) {
    let xmlStr = "";
    let isPreviousElementTag = false;
    for (let i = 0; i < arr.length; i++) {
      const tagObj = arr[i];
      const tagName = propName(tagObj);
      if (tagName === void 0) continue;
      let newJPath = "";
      if (jPath.length === 0) newJPath = tagName;
      else newJPath = `${jPath}.${tagName}`;
      if (tagName === options.textNodeName) {
        let tagText = tagObj[tagName];
        if (!isStopNode(newJPath, options)) {
          tagText = options.tagValueProcessor(tagName, tagText);
          tagText = replaceEntitiesValue(tagText, options);
        }
        if (isPreviousElementTag) {
          xmlStr += indentation;
        }
        xmlStr += tagText;
        isPreviousElementTag = false;
        continue;
      } else if (tagName === options.cdataPropName) {
        if (isPreviousElementTag) {
          xmlStr += indentation;
        }
        xmlStr += `<![CDATA[${tagObj[tagName][0][options.textNodeName]}]]>`;
        isPreviousElementTag = false;
        continue;
      } else if (tagName === options.commentPropName) {
        xmlStr += indentation + `<!--${tagObj[tagName][0][options.textNodeName]}-->`;
        isPreviousElementTag = true;
        continue;
      } else if (tagName[0] === "?") {
        const attStr2 = attr_to_str(tagObj[":@"], options);
        const tempInd = tagName === "?xml" ? "" : indentation;
        let piTextNodeName = tagObj[tagName][0][options.textNodeName];
        piTextNodeName = piTextNodeName.length !== 0 ? " " + piTextNodeName : "";
        xmlStr += tempInd + `<${tagName}${piTextNodeName}${attStr2}?>`;
        isPreviousElementTag = true;
        continue;
      }
      let newIdentation = indentation;
      if (newIdentation !== "") {
        newIdentation += options.indentBy;
      }
      const attStr = attr_to_str(tagObj[":@"], options);
      const tagStart = indentation + `<${tagName}${attStr}`;
      const tagValue = arrToStr(tagObj[tagName], options, newJPath, newIdentation);
      if (options.unpairedTags.indexOf(tagName) !== -1) {
        if (options.suppressUnpairedNode) xmlStr += tagStart + ">";
        else xmlStr += tagStart + "/>";
      } else if ((!tagValue || tagValue.length === 0) && options.suppressEmptyNode) {
        xmlStr += tagStart + "/>";
      } else if (tagValue && tagValue.endsWith(">")) {
        xmlStr += tagStart + `>${tagValue}${indentation}</${tagName}>`;
      } else {
        xmlStr += tagStart + ">";
        if (tagValue && indentation !== "" && (tagValue.includes("/>") || tagValue.includes("</"))) {
          xmlStr += indentation + options.indentBy + tagValue + indentation;
        } else {
          xmlStr += tagValue;
        }
        xmlStr += `</${tagName}>`;
      }
      isPreviousElementTag = true;
    }
    return xmlStr;
  }
  function propName(obj) {
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (!obj.hasOwnProperty(key)) continue;
      if (key !== ":@") return key;
    }
  }
  function attr_to_str(attrMap, options) {
    let attrStr = "";
    if (attrMap && !options.ignoreAttributes) {
      for (let attr in attrMap) {
        if (!attrMap.hasOwnProperty(attr)) continue;
        let attrVal = options.attributeValueProcessor(attr, attrMap[attr]);
        attrVal = replaceEntitiesValue(attrVal, options);
        if (attrVal === true && options.suppressBooleanAttributes) {
          attrStr += ` ${attr.substr(options.attributeNamePrefix.length)}`;
        } else {
          attrStr += ` ${attr.substr(options.attributeNamePrefix.length)}="${attrVal}"`;
        }
      }
    }
    return attrStr;
  }
  function isStopNode(jPath, options) {
    jPath = jPath.substr(0, jPath.length - options.textNodeName.length - 1);
    let tagName = jPath.substr(jPath.lastIndexOf(".") + 1);
    for (let index2 in options.stopNodes) {
      if (options.stopNodes[index2] === jPath || options.stopNodes[index2] === "*." + tagName) return true;
    }
    return false;
  }
  function replaceEntitiesValue(textValue, options) {
    if (textValue && textValue.length > 0 && options.processEntities) {
      for (let i = 0; i < options.entities.length; i++) {
        const entity = options.entities[i];
        textValue = textValue.replace(entity.regex, entity.val);
      }
    }
    return textValue;
  }
  orderedJs2Xml = toXml;
  return orderedJs2Xml;
}
var json2xml;
var hasRequiredJson2xml;
function requireJson2xml() {
  if (hasRequiredJson2xml) return json2xml;
  hasRequiredJson2xml = 1;
  const buildFromOrderedJs = requireOrderedJs2Xml();
  const getIgnoreAttributesFn = requireIgnoreAttributes();
  const defaultOptions = {
    attributeNamePrefix: "@_",
    attributesGroupName: false,
    textNodeName: "#text",
    ignoreAttributes: true,
    cdataPropName: false,
    format: false,
    indentBy: "  ",
    suppressEmptyNode: false,
    suppressUnpairedNode: true,
    suppressBooleanAttributes: true,
    tagValueProcessor: function(key, a) {
      return a;
    },
    attributeValueProcessor: function(attrName, a) {
      return a;
    },
    preserveOrder: false,
    commentPropName: false,
    unpairedTags: [],
    entities: [
      { regex: new RegExp("&", "g"), val: "&amp;" },
      //it must be on top
      { regex: new RegExp(">", "g"), val: "&gt;" },
      { regex: new RegExp("<", "g"), val: "&lt;" },
      { regex: new RegExp("'", "g"), val: "&apos;" },
      { regex: new RegExp('"', "g"), val: "&quot;" }
    ],
    processEntities: true,
    stopNodes: [],
    // transformTagName: false,
    // transformAttributeName: false,
    oneListGroup: false
  };
  function Builder(options) {
    this.options = Object.assign({}, defaultOptions, options);
    if (this.options.ignoreAttributes === true || this.options.attributesGroupName) {
      this.isAttribute = function() {
        return false;
      };
    } else {
      this.ignoreAttributesFn = getIgnoreAttributesFn(this.options.ignoreAttributes);
      this.attrPrefixLen = this.options.attributeNamePrefix.length;
      this.isAttribute = isAttribute;
    }
    this.processTextOrObjNode = processTextOrObjNode;
    if (this.options.format) {
      this.indentate = indentate;
      this.tagEndChar = ">\n";
      this.newLine = "\n";
    } else {
      this.indentate = function() {
        return "";
      };
      this.tagEndChar = ">";
      this.newLine = "";
    }
  }
  Builder.prototype.build = function(jObj) {
    if (this.options.preserveOrder) {
      return buildFromOrderedJs(jObj, this.options);
    } else {
      if (Array.isArray(jObj) && this.options.arrayNodeName && this.options.arrayNodeName.length > 1) {
        jObj = {
          [this.options.arrayNodeName]: jObj
        };
      }
      return this.j2x(jObj, 0, []).val;
    }
  };
  Builder.prototype.j2x = function(jObj, level, ajPath) {
    let attrStr = "";
    let val = "";
    const jPath = ajPath.join(".");
    for (let key in jObj) {
      if (!Object.prototype.hasOwnProperty.call(jObj, key)) continue;
      if (typeof jObj[key] === "undefined") {
        if (this.isAttribute(key)) {
          val += "";
        }
      } else if (jObj[key] === null) {
        if (this.isAttribute(key)) {
          val += "";
        } else if (key === this.options.cdataPropName) {
          val += "";
        } else if (key[0] === "?") {
          val += this.indentate(level) + "<" + key + "?" + this.tagEndChar;
        } else {
          val += this.indentate(level) + "<" + key + "/" + this.tagEndChar;
        }
      } else if (jObj[key] instanceof Date) {
        val += this.buildTextValNode(jObj[key], key, "", level);
      } else if (typeof jObj[key] !== "object") {
        const attr = this.isAttribute(key);
        if (attr && !this.ignoreAttributesFn(attr, jPath)) {
          attrStr += this.buildAttrPairStr(attr, "" + jObj[key]);
        } else if (!attr) {
          if (key === this.options.textNodeName) {
            let newval = this.options.tagValueProcessor(key, "" + jObj[key]);
            val += this.replaceEntitiesValue(newval);
          } else {
            val += this.buildTextValNode(jObj[key], key, "", level);
          }
        }
      } else if (Array.isArray(jObj[key])) {
        const arrLen = jObj[key].length;
        let listTagVal = "";
        let listTagAttr = "";
        for (let j = 0; j < arrLen; j++) {
          const item = jObj[key][j];
          if (typeof item === "undefined") ;
          else if (item === null) {
            if (key[0] === "?") val += this.indentate(level) + "<" + key + "?" + this.tagEndChar;
            else val += this.indentate(level) + "<" + key + "/" + this.tagEndChar;
          } else if (typeof item === "object") {
            if (this.options.oneListGroup) {
              const result = this.j2x(item, level + 1, ajPath.concat(key));
              listTagVal += result.val;
              if (this.options.attributesGroupName && item.hasOwnProperty(this.options.attributesGroupName)) {
                listTagAttr += result.attrStr;
              }
            } else {
              listTagVal += this.processTextOrObjNode(item, key, level, ajPath);
            }
          } else {
            if (this.options.oneListGroup) {
              let textValue = this.options.tagValueProcessor(key, item);
              textValue = this.replaceEntitiesValue(textValue);
              listTagVal += textValue;
            } else {
              listTagVal += this.buildTextValNode(item, key, "", level);
            }
          }
        }
        if (this.options.oneListGroup) {
          listTagVal = this.buildObjectNode(listTagVal, key, listTagAttr, level);
        }
        val += listTagVal;
      } else {
        if (this.options.attributesGroupName && key === this.options.attributesGroupName) {
          const Ks = Object.keys(jObj[key]);
          const L = Ks.length;
          for (let j = 0; j < L; j++) {
            attrStr += this.buildAttrPairStr(Ks[j], "" + jObj[key][Ks[j]]);
          }
        } else {
          val += this.processTextOrObjNode(jObj[key], key, level, ajPath);
        }
      }
    }
    return { attrStr, val };
  };
  Builder.prototype.buildAttrPairStr = function(attrName, val) {
    val = this.options.attributeValueProcessor(attrName, "" + val);
    val = this.replaceEntitiesValue(val);
    if (this.options.suppressBooleanAttributes && val === "true") {
      return " " + attrName;
    } else return " " + attrName + '="' + val + '"';
  };
  function processTextOrObjNode(object, key, level, ajPath) {
    const result = this.j2x(object, level + 1, ajPath.concat(key));
    if (object[this.options.textNodeName] !== void 0 && Object.keys(object).length === 1) {
      return this.buildTextValNode(object[this.options.textNodeName], key, result.attrStr, level);
    } else {
      return this.buildObjectNode(result.val, key, result.attrStr, level);
    }
  }
  Builder.prototype.buildObjectNode = function(val, key, attrStr, level) {
    if (val === "") {
      if (key[0] === "?") return this.indentate(level) + "<" + key + attrStr + "?" + this.tagEndChar;
      else {
        return this.indentate(level) + "<" + key + attrStr + this.closeTag(key) + this.tagEndChar;
      }
    } else {
      let tagEndExp = "</" + key + this.tagEndChar;
      let piClosingChar = "";
      if (key[0] === "?") {
        piClosingChar = "?";
        tagEndExp = "";
      }
      if ((attrStr || attrStr === "") && val.indexOf("<") === -1) {
        return this.indentate(level) + "<" + key + attrStr + piClosingChar + ">" + val + tagEndExp;
      } else if (this.options.commentPropName !== false && key === this.options.commentPropName && piClosingChar.length === 0) {
        return this.indentate(level) + `<!--${val}-->` + this.newLine;
      } else {
        return this.indentate(level) + "<" + key + attrStr + piClosingChar + this.tagEndChar + val + this.indentate(level) + tagEndExp;
      }
    }
  };
  Builder.prototype.closeTag = function(key) {
    let closeTag = "";
    if (this.options.unpairedTags.indexOf(key) !== -1) {
      if (!this.options.suppressUnpairedNode) closeTag = "/";
    } else if (this.options.suppressEmptyNode) {
      closeTag = "/";
    } else {
      closeTag = `></${key}`;
    }
    return closeTag;
  };
  Builder.prototype.buildTextValNode = function(val, key, attrStr, level) {
    if (this.options.cdataPropName !== false && key === this.options.cdataPropName) {
      return this.indentate(level) + `<![CDATA[${val}]]>` + this.newLine;
    } else if (this.options.commentPropName !== false && key === this.options.commentPropName) {
      return this.indentate(level) + `<!--${val}-->` + this.newLine;
    } else if (key[0] === "?") {
      return this.indentate(level) + "<" + key + attrStr + "?" + this.tagEndChar;
    } else {
      let textValue = this.options.tagValueProcessor(key, val);
      textValue = this.replaceEntitiesValue(textValue);
      if (textValue === "") {
        return this.indentate(level) + "<" + key + attrStr + this.closeTag(key) + this.tagEndChar;
      } else {
        return this.indentate(level) + "<" + key + attrStr + ">" + textValue + "</" + key + this.tagEndChar;
      }
    }
  };
  Builder.prototype.replaceEntitiesValue = function(textValue) {
    if (textValue && textValue.length > 0 && this.options.processEntities) {
      for (let i = 0; i < this.options.entities.length; i++) {
        const entity = this.options.entities[i];
        textValue = textValue.replace(entity.regex, entity.val);
      }
    }
    return textValue;
  };
  function indentate(level) {
    return this.options.indentBy.repeat(level);
  }
  function isAttribute(name) {
    if (name.startsWith(this.options.attributeNamePrefix) && name !== this.options.textNodeName) {
      return name.substr(this.attrPrefixLen);
    } else {
      return false;
    }
  }
  json2xml = Builder;
  return json2xml;
}
var fxp$2;
var hasRequiredFxp;
function requireFxp() {
  if (hasRequiredFxp) return fxp$2;
  hasRequiredFxp = 1;
  const validator2 = requireValidator();
  const XMLParser = requireXMLParser();
  const XMLBuilder = requireJson2xml();
  fxp$2 = {
    XMLParser,
    XMLValidator: validator2,
    XMLBuilder
  };
  return fxp$2;
}
var fxpExports = requireFxp();
var ipaddr$2 = { exports: {} };
var ipaddr$1 = ipaddr$2.exports;
var hasRequiredIpaddr;
function requireIpaddr() {
  if (hasRequiredIpaddr) return ipaddr$2.exports;
  hasRequiredIpaddr = 1;
  (function(module) {
    (function(root) {
      const ipv4Part = "(0?\\d+|0x[a-f0-9]+)";
      const ipv4Regexes = {
        fourOctet: new RegExp(`^${ipv4Part}\\.${ipv4Part}\\.${ipv4Part}\\.${ipv4Part}$`, "i"),
        threeOctet: new RegExp(`^${ipv4Part}\\.${ipv4Part}\\.${ipv4Part}$`, "i"),
        twoOctet: new RegExp(`^${ipv4Part}\\.${ipv4Part}$`, "i"),
        longValue: new RegExp(`^${ipv4Part}$`, "i")
      };
      const octalRegex = new RegExp(`^0[0-7]+$`, "i");
      const hexRegex = new RegExp(`^0x[a-f0-9]+$`, "i");
      const zoneIndex = "%[0-9a-z]{1,}";
      const ipv6Part = "(?:[0-9a-f]+::?)+";
      const ipv6Regexes = {
        zoneIndex: new RegExp(zoneIndex, "i"),
        "native": new RegExp(`^(::)?(${ipv6Part})?([0-9a-f]+)?(::)?(${zoneIndex})?$`, "i"),
        deprecatedTransitional: new RegExp(`^(?:::)(${ipv4Part}\\.${ipv4Part}\\.${ipv4Part}\\.${ipv4Part}(${zoneIndex})?)$`, "i"),
        transitional: new RegExp(`^((?:${ipv6Part})|(?:::)(?:${ipv6Part})?)${ipv4Part}\\.${ipv4Part}\\.${ipv4Part}\\.${ipv4Part}(${zoneIndex})?$`, "i")
      };
      function expandIPv6(string, parts) {
        if (string.indexOf("::") !== string.lastIndexOf("::")) {
          return null;
        }
        let colonCount = 0;
        let lastColon = -1;
        let zoneId = (string.match(ipv6Regexes.zoneIndex) || [])[0];
        let replacement, replacementCount;
        if (zoneId) {
          zoneId = zoneId.substring(1);
          string = string.replace(/%.+$/, "");
        }
        while ((lastColon = string.indexOf(":", lastColon + 1)) >= 0) {
          colonCount++;
        }
        if (string.substr(0, 2) === "::") {
          colonCount--;
        }
        if (string.substr(-2, 2) === "::") {
          colonCount--;
        }
        if (colonCount > parts) {
          return null;
        }
        replacementCount = parts - colonCount;
        replacement = ":";
        while (replacementCount--) {
          replacement += "0:";
        }
        string = string.replace("::", replacement);
        if (string[0] === ":") {
          string = string.slice(1);
        }
        if (string[string.length - 1] === ":") {
          string = string.slice(0, -1);
        }
        parts = (function() {
          const ref = string.split(":");
          const results = [];
          for (let i = 0; i < ref.length; i++) {
            results.push(parseInt(ref[i], 16));
          }
          return results;
        })();
        return {
          parts,
          zoneId
        };
      }
      function matchCIDR(first, second, partSize, cidrBits) {
        if (first.length !== second.length) {
          throw new Error("ipaddr: cannot match CIDR for objects with different lengths");
        }
        let part = 0;
        let shift;
        while (cidrBits > 0) {
          shift = partSize - cidrBits;
          if (shift < 0) {
            shift = 0;
          }
          if (first[part] >> shift !== second[part] >> shift) {
            return false;
          }
          cidrBits -= partSize;
          part += 1;
        }
        return true;
      }
      function parseIntAuto(string) {
        if (hexRegex.test(string)) {
          return parseInt(string, 16);
        }
        if (string[0] === "0" && !isNaN(parseInt(string[1], 10))) {
          if (octalRegex.test(string)) {
            return parseInt(string, 8);
          }
          throw new Error(`ipaddr: cannot parse ${string} as octal`);
        }
        return parseInt(string, 10);
      }
      function padPart(part, length) {
        while (part.length < length) {
          part = `0${part}`;
        }
        return part;
      }
      const ipaddr2 = {};
      ipaddr2.IPv4 = (function() {
        function IPv4(octets) {
          if (octets.length !== 4) {
            throw new Error("ipaddr: ipv4 octet count should be 4");
          }
          let i, octet;
          for (i = 0; i < octets.length; i++) {
            octet = octets[i];
            if (!(0 <= octet && octet <= 255)) {
              throw new Error("ipaddr: ipv4 octet should fit in 8 bits");
            }
          }
          this.octets = octets;
        }
        IPv4.prototype.SpecialRanges = {
          unspecified: [[new IPv4([0, 0, 0, 0]), 8]],
          broadcast: [[new IPv4([255, 255, 255, 255]), 32]],
          // RFC3171
          multicast: [[new IPv4([224, 0, 0, 0]), 4]],
          // RFC3927
          linkLocal: [[new IPv4([169, 254, 0, 0]), 16]],
          // RFC5735
          loopback: [[new IPv4([127, 0, 0, 0]), 8]],
          // RFC6598
          carrierGradeNat: [[new IPv4([100, 64, 0, 0]), 10]],
          // RFC1918
          "private": [
            [new IPv4([10, 0, 0, 0]), 8],
            [new IPv4([172, 16, 0, 0]), 12],
            [new IPv4([192, 168, 0, 0]), 16]
          ],
          // Reserved and testing-only ranges; RFCs 5735, 5737, 2544, 1700
          reserved: [
            [new IPv4([192, 0, 0, 0]), 24],
            [new IPv4([192, 0, 2, 0]), 24],
            [new IPv4([192, 88, 99, 0]), 24],
            [new IPv4([198, 18, 0, 0]), 15],
            [new IPv4([198, 51, 100, 0]), 24],
            [new IPv4([203, 0, 113, 0]), 24],
            [new IPv4([240, 0, 0, 0]), 4]
          ],
          // RFC7534, RFC7535
          as112: [
            [new IPv4([192, 175, 48, 0]), 24],
            [new IPv4([192, 31, 196, 0]), 24]
          ],
          // RFC7450
          amt: [
            [new IPv4([192, 52, 193, 0]), 24]
          ]
        };
        IPv4.prototype.kind = function() {
          return "ipv4";
        };
        IPv4.prototype.match = function(other, cidrRange) {
          let ref;
          if (cidrRange === void 0) {
            ref = other;
            other = ref[0];
            cidrRange = ref[1];
          }
          if (other.kind() !== "ipv4") {
            throw new Error("ipaddr: cannot match ipv4 address with non-ipv4 one");
          }
          return matchCIDR(this.octets, other.octets, 8, cidrRange);
        };
        IPv4.prototype.prefixLengthFromSubnetMask = function() {
          let cidr = 0;
          let stop = false;
          const zerotable = {
            0: 8,
            128: 7,
            192: 6,
            224: 5,
            240: 4,
            248: 3,
            252: 2,
            254: 1,
            255: 0
          };
          let i, octet, zeros;
          for (i = 3; i >= 0; i -= 1) {
            octet = this.octets[i];
            if (octet in zerotable) {
              zeros = zerotable[octet];
              if (stop && zeros !== 0) {
                return null;
              }
              if (zeros !== 8) {
                stop = true;
              }
              cidr += zeros;
            } else {
              return null;
            }
          }
          return 32 - cidr;
        };
        IPv4.prototype.range = function() {
          return ipaddr2.subnetMatch(this, this.SpecialRanges);
        };
        IPv4.prototype.toByteArray = function() {
          return this.octets.slice(0);
        };
        IPv4.prototype.toIPv4MappedAddress = function() {
          return ipaddr2.IPv6.parse(`::ffff:${this.toString()}`);
        };
        IPv4.prototype.toNormalizedString = function() {
          return this.toString();
        };
        IPv4.prototype.toString = function() {
          return this.octets.join(".");
        };
        return IPv4;
      })();
      ipaddr2.IPv4.broadcastAddressFromCIDR = function(string) {
        try {
          const cidr = this.parseCIDR(string);
          const ipInterfaceOctets = cidr[0].toByteArray();
          const subnetMaskOctets = this.subnetMaskFromPrefixLength(cidr[1]).toByteArray();
          const octets = [];
          let i = 0;
          while (i < 4) {
            octets.push(parseInt(ipInterfaceOctets[i], 10) | parseInt(subnetMaskOctets[i], 10) ^ 255);
            i++;
          }
          return new this(octets);
        } catch (e) {
          throw new Error("ipaddr: the address does not have IPv4 CIDR format");
        }
      };
      ipaddr2.IPv4.isIPv4 = function(string) {
        return this.parser(string) !== null;
      };
      ipaddr2.IPv4.isValid = function(string) {
        try {
          new this(this.parser(string));
          return true;
        } catch (e) {
          return false;
        }
      };
      ipaddr2.IPv4.isValidCIDR = function(string) {
        try {
          this.parseCIDR(string);
          return true;
        } catch (e) {
          return false;
        }
      };
      ipaddr2.IPv4.isValidFourPartDecimal = function(string) {
        if (ipaddr2.IPv4.isValid(string) && string.match(/^(0|[1-9]\d*)(\.(0|[1-9]\d*)){3}$/)) {
          return true;
        } else {
          return false;
        }
      };
      ipaddr2.IPv4.networkAddressFromCIDR = function(string) {
        let cidr, i, ipInterfaceOctets, octets, subnetMaskOctets;
        try {
          cidr = this.parseCIDR(string);
          ipInterfaceOctets = cidr[0].toByteArray();
          subnetMaskOctets = this.subnetMaskFromPrefixLength(cidr[1]).toByteArray();
          octets = [];
          i = 0;
          while (i < 4) {
            octets.push(parseInt(ipInterfaceOctets[i], 10) & parseInt(subnetMaskOctets[i], 10));
            i++;
          }
          return new this(octets);
        } catch (e) {
          throw new Error("ipaddr: the address does not have IPv4 CIDR format");
        }
      };
      ipaddr2.IPv4.parse = function(string) {
        const parts = this.parser(string);
        if (parts === null) {
          throw new Error("ipaddr: string is not formatted like an IPv4 Address");
        }
        return new this(parts);
      };
      ipaddr2.IPv4.parseCIDR = function(string) {
        let match;
        if (match = string.match(/^(.+)\/(\d+)$/)) {
          const maskLength = parseInt(match[2]);
          if (maskLength >= 0 && maskLength <= 32) {
            const parsed = [this.parse(match[1]), maskLength];
            Object.defineProperty(parsed, "toString", {
              value: function() {
                return this.join("/");
              }
            });
            return parsed;
          }
        }
        throw new Error("ipaddr: string is not formatted like an IPv4 CIDR range");
      };
      ipaddr2.IPv4.parser = function(string) {
        let match, part, value;
        if (match = string.match(ipv4Regexes.fourOctet)) {
          return (function() {
            const ref = match.slice(1, 6);
            const results = [];
            for (let i = 0; i < ref.length; i++) {
              part = ref[i];
              results.push(parseIntAuto(part));
            }
            return results;
          })();
        } else if (match = string.match(ipv4Regexes.longValue)) {
          value = parseIntAuto(match[1]);
          if (value > 4294967295 || value < 0) {
            throw new Error("ipaddr: address outside defined range");
          }
          return (function() {
            const results = [];
            let shift;
            for (shift = 0; shift <= 24; shift += 8) {
              results.push(value >> shift & 255);
            }
            return results;
          })().reverse();
        } else if (match = string.match(ipv4Regexes.twoOctet)) {
          return (function() {
            const ref = match.slice(1, 4);
            const results = [];
            value = parseIntAuto(ref[1]);
            if (value > 16777215 || value < 0) {
              throw new Error("ipaddr: address outside defined range");
            }
            results.push(parseIntAuto(ref[0]));
            results.push(value >> 16 & 255);
            results.push(value >> 8 & 255);
            results.push(value & 255);
            return results;
          })();
        } else if (match = string.match(ipv4Regexes.threeOctet)) {
          return (function() {
            const ref = match.slice(1, 5);
            const results = [];
            value = parseIntAuto(ref[2]);
            if (value > 65535 || value < 0) {
              throw new Error("ipaddr: address outside defined range");
            }
            results.push(parseIntAuto(ref[0]));
            results.push(parseIntAuto(ref[1]));
            results.push(value >> 8 & 255);
            results.push(value & 255);
            return results;
          })();
        } else {
          return null;
        }
      };
      ipaddr2.IPv4.subnetMaskFromPrefixLength = function(prefix) {
        prefix = parseInt(prefix);
        if (prefix < 0 || prefix > 32) {
          throw new Error("ipaddr: invalid IPv4 prefix length");
        }
        const octets = [0, 0, 0, 0];
        let j = 0;
        const filledOctetCount = Math.floor(prefix / 8);
        while (j < filledOctetCount) {
          octets[j] = 255;
          j++;
        }
        if (filledOctetCount < 4) {
          octets[filledOctetCount] = Math.pow(2, prefix % 8) - 1 << 8 - prefix % 8;
        }
        return new this(octets);
      };
      ipaddr2.IPv6 = (function() {
        function IPv6(parts, zoneId) {
          let i, part;
          if (parts.length === 16) {
            this.parts = [];
            for (i = 0; i <= 14; i += 2) {
              this.parts.push(parts[i] << 8 | parts[i + 1]);
            }
          } else if (parts.length === 8) {
            this.parts = parts;
          } else {
            throw new Error("ipaddr: ipv6 part count should be 8 or 16");
          }
          for (i = 0; i < this.parts.length; i++) {
            part = this.parts[i];
            if (!(0 <= part && part <= 65535)) {
              throw new Error("ipaddr: ipv6 part should fit in 16 bits");
            }
          }
          if (zoneId) {
            this.zoneId = zoneId;
          }
        }
        IPv6.prototype.SpecialRanges = {
          // RFC4291, here and after
          unspecified: [new IPv6([0, 0, 0, 0, 0, 0, 0, 0]), 128],
          linkLocal: [new IPv6([65152, 0, 0, 0, 0, 0, 0, 0]), 10],
          multicast: [new IPv6([65280, 0, 0, 0, 0, 0, 0, 0]), 8],
          loopback: [new IPv6([0, 0, 0, 0, 0, 0, 0, 1]), 128],
          uniqueLocal: [new IPv6([64512, 0, 0, 0, 0, 0, 0, 0]), 7],
          ipv4Mapped: [new IPv6([0, 0, 0, 0, 0, 65535, 0, 0]), 96],
          // RFC6666
          discard: [new IPv6([256, 0, 0, 0, 0, 0, 0, 0]), 64],
          // RFC6145
          rfc6145: [new IPv6([0, 0, 0, 0, 65535, 0, 0, 0]), 96],
          // RFC6052
          rfc6052: [new IPv6([100, 65435, 0, 0, 0, 0, 0, 0]), 96],
          // RFC3056
          "6to4": [new IPv6([8194, 0, 0, 0, 0, 0, 0, 0]), 16],
          // RFC6052, RFC6146
          teredo: [new IPv6([8193, 0, 0, 0, 0, 0, 0, 0]), 32],
          // RFC5180
          benchmarking: [new IPv6([8193, 2, 0, 0, 0, 0, 0, 0]), 48],
          // RFC7450
          amt: [new IPv6([8193, 3, 0, 0, 0, 0, 0, 0]), 32],
          as112v6: [
            [new IPv6([8193, 4, 274, 0, 0, 0, 0, 0]), 48],
            [new IPv6([9760, 79, 32768, 0, 0, 0, 0, 0]), 48]
          ],
          deprecated: [new IPv6([8193, 16, 0, 0, 0, 0, 0, 0]), 28],
          orchid2: [new IPv6([8193, 32, 0, 0, 0, 0, 0, 0]), 28],
          droneRemoteIdProtocolEntityTags: [new IPv6([8193, 48, 0, 0, 0, 0, 0, 0]), 28],
          reserved: [
            // RFC3849
            [new IPv6([8193, 0, 0, 0, 0, 0, 0, 0]), 23],
            // RFC2928
            [new IPv6([8193, 3512, 0, 0, 0, 0, 0, 0]), 32]
          ]
        };
        IPv6.prototype.isIPv4MappedAddress = function() {
          return this.range() === "ipv4Mapped";
        };
        IPv6.prototype.kind = function() {
          return "ipv6";
        };
        IPv6.prototype.match = function(other, cidrRange) {
          let ref;
          if (cidrRange === void 0) {
            ref = other;
            other = ref[0];
            cidrRange = ref[1];
          }
          if (other.kind() !== "ipv6") {
            throw new Error("ipaddr: cannot match ipv6 address with non-ipv6 one");
          }
          return matchCIDR(this.parts, other.parts, 16, cidrRange);
        };
        IPv6.prototype.prefixLengthFromSubnetMask = function() {
          let cidr = 0;
          let stop = false;
          const zerotable = {
            0: 16,
            32768: 15,
            49152: 14,
            57344: 13,
            61440: 12,
            63488: 11,
            64512: 10,
            65024: 9,
            65280: 8,
            65408: 7,
            65472: 6,
            65504: 5,
            65520: 4,
            65528: 3,
            65532: 2,
            65534: 1,
            65535: 0
          };
          let part, zeros;
          for (let i = 7; i >= 0; i -= 1) {
            part = this.parts[i];
            if (part in zerotable) {
              zeros = zerotable[part];
              if (stop && zeros !== 0) {
                return null;
              }
              if (zeros !== 16) {
                stop = true;
              }
              cidr += zeros;
            } else {
              return null;
            }
          }
          return 128 - cidr;
        };
        IPv6.prototype.range = function() {
          return ipaddr2.subnetMatch(this, this.SpecialRanges);
        };
        IPv6.prototype.toByteArray = function() {
          let part;
          const bytes = [];
          const ref = this.parts;
          for (let i = 0; i < ref.length; i++) {
            part = ref[i];
            bytes.push(part >> 8);
            bytes.push(part & 255);
          }
          return bytes;
        };
        IPv6.prototype.toFixedLengthString = function() {
          const addr = (function() {
            const results = [];
            for (let i = 0; i < this.parts.length; i++) {
              results.push(padPart(this.parts[i].toString(16), 4));
            }
            return results;
          }).call(this).join(":");
          let suffix = "";
          if (this.zoneId) {
            suffix = `%${this.zoneId}`;
          }
          return addr + suffix;
        };
        IPv6.prototype.toIPv4Address = function() {
          if (!this.isIPv4MappedAddress()) {
            throw new Error("ipaddr: trying to convert a generic ipv6 address to ipv4");
          }
          const ref = this.parts.slice(-2);
          const high = ref[0];
          const low = ref[1];
          return new ipaddr2.IPv4([high >> 8, high & 255, low >> 8, low & 255]);
        };
        IPv6.prototype.toNormalizedString = function() {
          const addr = (function() {
            const results = [];
            for (let i = 0; i < this.parts.length; i++) {
              results.push(this.parts[i].toString(16));
            }
            return results;
          }).call(this).join(":");
          let suffix = "";
          if (this.zoneId) {
            suffix = `%${this.zoneId}`;
          }
          return addr + suffix;
        };
        IPv6.prototype.toRFC5952String = function() {
          const regex = /((^|:)(0(:|$)){2,})/g;
          const string = this.toNormalizedString();
          let bestMatchIndex = 0;
          let bestMatchLength = -1;
          let match;
          while (match = regex.exec(string)) {
            if (match[0].length > bestMatchLength) {
              bestMatchIndex = match.index;
              bestMatchLength = match[0].length;
            }
          }
          if (bestMatchLength < 0) {
            return string;
          }
          return `${string.substring(0, bestMatchIndex)}::${string.substring(bestMatchIndex + bestMatchLength)}`;
        };
        IPv6.prototype.toString = function() {
          return this.toRFC5952String();
        };
        return IPv6;
      })();
      ipaddr2.IPv6.broadcastAddressFromCIDR = function(string) {
        try {
          const cidr = this.parseCIDR(string);
          const ipInterfaceOctets = cidr[0].toByteArray();
          const subnetMaskOctets = this.subnetMaskFromPrefixLength(cidr[1]).toByteArray();
          const octets = [];
          let i = 0;
          while (i < 16) {
            octets.push(parseInt(ipInterfaceOctets[i], 10) | parseInt(subnetMaskOctets[i], 10) ^ 255);
            i++;
          }
          return new this(octets);
        } catch (e) {
          throw new Error(`ipaddr: the address does not have IPv6 CIDR format (${e})`);
        }
      };
      ipaddr2.IPv6.isIPv6 = function(string) {
        return this.parser(string) !== null;
      };
      ipaddr2.IPv6.isValid = function(string) {
        if (typeof string === "string" && string.indexOf(":") === -1) {
          return false;
        }
        try {
          const addr = this.parser(string);
          new this(addr.parts, addr.zoneId);
          return true;
        } catch (e) {
          return false;
        }
      };
      ipaddr2.IPv6.isValidCIDR = function(string) {
        if (typeof string === "string" && string.indexOf(":") === -1) {
          return false;
        }
        try {
          this.parseCIDR(string);
          return true;
        } catch (e) {
          return false;
        }
      };
      ipaddr2.IPv6.networkAddressFromCIDR = function(string) {
        let cidr, i, ipInterfaceOctets, octets, subnetMaskOctets;
        try {
          cidr = this.parseCIDR(string);
          ipInterfaceOctets = cidr[0].toByteArray();
          subnetMaskOctets = this.subnetMaskFromPrefixLength(cidr[1]).toByteArray();
          octets = [];
          i = 0;
          while (i < 16) {
            octets.push(parseInt(ipInterfaceOctets[i], 10) & parseInt(subnetMaskOctets[i], 10));
            i++;
          }
          return new this(octets);
        } catch (e) {
          throw new Error(`ipaddr: the address does not have IPv6 CIDR format (${e})`);
        }
      };
      ipaddr2.IPv6.parse = function(string) {
        const addr = this.parser(string);
        if (addr.parts === null) {
          throw new Error("ipaddr: string is not formatted like an IPv6 Address");
        }
        return new this(addr.parts, addr.zoneId);
      };
      ipaddr2.IPv6.parseCIDR = function(string) {
        let maskLength, match, parsed;
        if (match = string.match(/^(.+)\/(\d+)$/)) {
          maskLength = parseInt(match[2]);
          if (maskLength >= 0 && maskLength <= 128) {
            parsed = [this.parse(match[1]), maskLength];
            Object.defineProperty(parsed, "toString", {
              value: function() {
                return this.join("/");
              }
            });
            return parsed;
          }
        }
        throw new Error("ipaddr: string is not formatted like an IPv6 CIDR range");
      };
      ipaddr2.IPv6.parser = function(string) {
        let addr, i, match, octet, octets, zoneId;
        if (match = string.match(ipv6Regexes.deprecatedTransitional)) {
          return this.parser(`::ffff:${match[1]}`);
        }
        if (ipv6Regexes.native.test(string)) {
          return expandIPv6(string, 8);
        }
        if (match = string.match(ipv6Regexes.transitional)) {
          zoneId = match[6] || "";
          addr = match[1];
          if (!match[1].endsWith("::")) {
            addr = addr.slice(0, -1);
          }
          addr = expandIPv6(addr + zoneId, 6);
          if (addr.parts) {
            octets = [
              parseInt(match[2]),
              parseInt(match[3]),
              parseInt(match[4]),
              parseInt(match[5])
            ];
            for (i = 0; i < octets.length; i++) {
              octet = octets[i];
              if (!(0 <= octet && octet <= 255)) {
                return null;
              }
            }
            addr.parts.push(octets[0] << 8 | octets[1]);
            addr.parts.push(octets[2] << 8 | octets[3]);
            return {
              parts: addr.parts,
              zoneId: addr.zoneId
            };
          }
        }
        return null;
      };
      ipaddr2.IPv6.subnetMaskFromPrefixLength = function(prefix) {
        prefix = parseInt(prefix);
        if (prefix < 0 || prefix > 128) {
          throw new Error("ipaddr: invalid IPv6 prefix length");
        }
        const octets = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        let j = 0;
        const filledOctetCount = Math.floor(prefix / 8);
        while (j < filledOctetCount) {
          octets[j] = 255;
          j++;
        }
        if (filledOctetCount < 16) {
          octets[filledOctetCount] = Math.pow(2, prefix % 8) - 1 << 8 - prefix % 8;
        }
        return new this(octets);
      };
      ipaddr2.fromByteArray = function(bytes) {
        const length = bytes.length;
        if (length === 4) {
          return new ipaddr2.IPv4(bytes);
        } else if (length === 16) {
          return new ipaddr2.IPv6(bytes);
        } else {
          throw new Error("ipaddr: the binary input is neither an IPv6 nor IPv4 address");
        }
      };
      ipaddr2.isValid = function(string) {
        return ipaddr2.IPv6.isValid(string) || ipaddr2.IPv4.isValid(string);
      };
      ipaddr2.isValidCIDR = function(string) {
        return ipaddr2.IPv6.isValidCIDR(string) || ipaddr2.IPv4.isValidCIDR(string);
      };
      ipaddr2.parse = function(string) {
        if (ipaddr2.IPv6.isValid(string)) {
          return ipaddr2.IPv6.parse(string);
        } else if (ipaddr2.IPv4.isValid(string)) {
          return ipaddr2.IPv4.parse(string);
        } else {
          throw new Error("ipaddr: the address has neither IPv6 nor IPv4 format");
        }
      };
      ipaddr2.parseCIDR = function(string) {
        try {
          return ipaddr2.IPv6.parseCIDR(string);
        } catch (e) {
          try {
            return ipaddr2.IPv4.parseCIDR(string);
          } catch (e2) {
            throw new Error("ipaddr: the address has neither IPv6 nor IPv4 CIDR format");
          }
        }
      };
      ipaddr2.process = function(string) {
        const addr = this.parse(string);
        if (addr.kind() === "ipv6" && addr.isIPv4MappedAddress()) {
          return addr.toIPv4Address();
        } else {
          return addr;
        }
      };
      ipaddr2.subnetMatch = function(address, rangeList, defaultName) {
        let i, rangeName, rangeSubnets, subnet;
        if (defaultName === void 0 || defaultName === null) {
          defaultName = "unicast";
        }
        for (rangeName in rangeList) {
          if (Object.prototype.hasOwnProperty.call(rangeList, rangeName)) {
            rangeSubnets = rangeList[rangeName];
            if (rangeSubnets[0] && !(rangeSubnets[0] instanceof Array)) {
              rangeSubnets = [rangeSubnets];
            }
            for (i = 0; i < rangeSubnets.length; i++) {
              subnet = rangeSubnets[i];
              if (address.kind() === subnet[0].kind() && address.match.apply(address, subnet)) {
                return rangeName;
              }
            }
          }
        }
        return defaultName;
      };
      if (module.exports) {
        module.exports = ipaddr2;
      } else {
        root.ipaddr = ipaddr2;
      }
    })(ipaddr$1);
  })(ipaddr$2);
  return ipaddr$2.exports;
}
var ipaddrExports = requireIpaddr();
const ipaddr = /* @__PURE__ */ getDefaultExportFromCjs$1(ipaddrExports);
var mimeTypesExports = requireMimeTypes();
const streamPromise = {
  // node:stream/promises Added in: v15.0.0
  pipeline: promisify$1(stream$1.pipeline)
};
const fstat = promisify$1(fs.fstat);
const ENCRYPTION_TYPES = {
  SSEC: "SSE-C",
  KMS: "KMS"
};
const RETENTION_MODES = {
  GOVERNANCE: "GOVERNANCE",
  COMPLIANCE: "COMPLIANCE"
};
const RETENTION_VALIDITY_UNITS = {
  DAYS: "Days",
  YEARS: "Years"
};
const LEGAL_HOLD_STATUS = {
  ENABLED: "ON",
  DISABLED: "OFF"
};
const MetaDataHeaderPrefix = "x-amz-meta-";
function hashBinary(buf, enableSHA256) {
  let sha256sum = "";
  if (enableSHA256) {
    sha256sum = crypto.createHash("sha256").update(buf).digest("hex");
  }
  const md5sum = crypto.createHash("md5").update(buf).digest("base64");
  return {
    md5sum,
    sha256sum
  };
}
const encodeAsHex = (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`;
function uriEscape(uriStr) {
  return encodeURIComponent(uriStr).replace(/[!'()*]/g, encodeAsHex);
}
function uriResourceEscape(string) {
  return uriEscape(string).replace(/%2F/g, "/");
}
function getScope(region, date, serviceName = "s3") {
  return `${makeDateShort(date)}/${region}/${serviceName}/aws4_request`;
}
function isAmazonEndpoint(endpoint) {
  return endpoint === "s3.amazonaws.com" || endpoint === "s3.cn-north-1.amazonaws.com.cn";
}
function isVirtualHostStyle(endpoint, protocol, bucket, pathStyle) {
  if (protocol === "https:" && bucket.includes(".")) {
    return false;
  }
  return isAmazonEndpoint(endpoint) || !pathStyle;
}
function isValidIP(ip) {
  return ipaddr.isValid(ip);
}
function isValidEndpoint(endpoint) {
  return isValidDomain(endpoint) || isValidIP(endpoint);
}
function isValidDomain(host) {
  if (!isString(host)) {
    return false;
  }
  if (host.length === 0 || host.length > 255) {
    return false;
  }
  if (host[0] === "-" || host.slice(-1) === "-") {
    return false;
  }
  if (host[0] === "_" || host.slice(-1) === "_") {
    return false;
  }
  if (host[0] === ".") {
    return false;
  }
  const nonAlphaNumerics = "`~!@#$%^&*()+={}[]|\\\"';:><?/";
  for (const char of nonAlphaNumerics) {
    if (host.includes(char)) {
      return false;
    }
  }
  return true;
}
function probeContentType(path2) {
  let contentType = mimeTypesExports.lookup(path2);
  if (!contentType) {
    contentType = "application/octet-stream";
  }
  return contentType;
}
function isValidPort(port) {
  const portNum = typeof port === "string" ? parseInt(port, 10) : port;
  if (!isNumber(portNum) || isNaN(portNum)) {
    return false;
  }
  return 0 <= portNum && portNum <= 65535;
}
function isValidBucketName(bucket) {
  if (!isString(bucket)) {
    return false;
  }
  if (bucket.length < 3 || bucket.length > 63) {
    return false;
  }
  if (bucket.includes("..")) {
    return false;
  }
  if (/[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+/.test(bucket)) {
    return false;
  }
  if (/^[a-z0-9][a-z0-9.-]+[a-z0-9]$/.test(bucket)) {
    return true;
  }
  return false;
}
function isValidObjectName(objectName) {
  if (!isValidPrefix(objectName)) {
    return false;
  }
  return objectName.length !== 0;
}
function isValidPrefix(prefix) {
  if (!isString(prefix)) {
    return false;
  }
  if (prefix.length > 1024) {
    return false;
  }
  return true;
}
function isNumber(arg) {
  return typeof arg === "number";
}
function isFunction(arg) {
  return typeof arg === "function";
}
function isString(arg) {
  return typeof arg === "string";
}
function isObject(arg) {
  return typeof arg === "object" && arg !== null;
}
function isPlainObject(arg) {
  return Object.prototype.toString.call(arg) === "[object Object]";
}
function isReadableStream(arg) {
  return isObject(arg) && isFunction(arg._read);
}
function isBoolean(arg) {
  return typeof arg === "boolean";
}
function isEmpty(o) {
  return _.isEmpty(o);
}
function isEmptyObject(o) {
  return Object.values(o).filter((x) => x !== void 0).length !== 0;
}
function isDefined(o) {
  return o !== null && o !== void 0;
}
function makeDateLong(date) {
  date = date || /* @__PURE__ */ new Date();
  const s = date.toISOString();
  return s.slice(0, 4) + s.slice(5, 7) + s.slice(8, 13) + s.slice(14, 16) + s.slice(17, 19) + "Z";
}
function makeDateShort(date) {
  date = date || /* @__PURE__ */ new Date();
  const s = date.toISOString();
  return s.slice(0, 4) + s.slice(5, 7) + s.slice(8, 10);
}
function pipesetup(...streams) {
  return streams.reduce((src, dst) => {
    src.on("error", (err) => dst.emit("error", err));
    return src.pipe(dst);
  });
}
function readableStream(data) {
  const s = new stream$1.Readable();
  s._read = () => {
  };
  s.push(data);
  s.push(null);
  return s;
}
function insertContentType(metaData, filePath) {
  for (const key in metaData) {
    if (key.toLowerCase() === "content-type") {
      return metaData;
    }
  }
  return {
    ...metaData,
    "content-type": probeContentType(filePath)
  };
}
function prependXAMZMeta(metaData) {
  if (!metaData) {
    return {};
  }
  return _.mapKeys(metaData, (value, key) => {
    if (isAmzHeader(key) || isSupportedHeader(key) || isStorageClassHeader(key)) {
      return key;
    }
    return MetaDataHeaderPrefix + key;
  });
}
function isAmzHeader(key) {
  const temp = key.toLowerCase();
  return temp.startsWith(MetaDataHeaderPrefix) || temp === "x-amz-acl" || temp.startsWith("x-amz-server-side-encryption-") || temp === "x-amz-server-side-encryption";
}
function isSupportedHeader(key) {
  const supported_headers = ["content-type", "cache-control", "content-encoding", "content-disposition", "content-language", "x-amz-website-redirect-location", "if-none-match", "if-match"];
  return supported_headers.includes(key.toLowerCase());
}
function isStorageClassHeader(key) {
  return key.toLowerCase() === "x-amz-storage-class";
}
function extractMetadata(headers) {
  return _.mapKeys(_.pickBy(headers, (value, key) => isSupportedHeader(key) || isStorageClassHeader(key) || isAmzHeader(key)), (value, key) => {
    const lower = key.toLowerCase();
    if (lower.startsWith(MetaDataHeaderPrefix)) {
      return lower.slice(MetaDataHeaderPrefix.length);
    }
    return key;
  });
}
function getVersionId(headers = {}) {
  return headers["x-amz-version-id"] || null;
}
function getSourceVersionId(headers = {}) {
  return headers["x-amz-copy-source-version-id"] || null;
}
function sanitizeETag(etag = "") {
  const replaceChars = {
    '"': "",
    "&quot;": "",
    "&#34;": "",
    "&QUOT;": "",
    "&#x00022": ""
  };
  return etag.replace(/^("|&quot;|&#34;)|("|&quot;|&#34;)$/g, (m) => replaceChars[m]);
}
function toMd5(payload) {
  return crypto.createHash("md5").update(Buffer.from(payload)).digest().toString("base64");
}
function toSha256(payload) {
  return crypto.createHash("sha256").update(payload).digest("hex");
}
function toArray(param) {
  if (!Array.isArray(param)) {
    return [param];
  }
  return param;
}
function sanitizeObjectKey(objectName) {
  const asStrName = (objectName ? objectName.toString() : "").replace(/\+/g, " ");
  return decodeURIComponent(asStrName);
}
function sanitizeSize(size) {
  return size ? Number.parseInt(size) : void 0;
}
const PART_CONSTRAINTS = {
  // absMinPartSize - absolute minimum part size (5 MiB)
  ABS_MIN_PART_SIZE: 1024 * 1024 * 5,
  // MAX_PARTS_COUNT - maximum number of parts for a single multipart session.
  MAX_PARTS_COUNT: 1e4,
  // MAX_PART_SIZE - maximum part size 5GiB for a single multipart upload
  // operation.
  MAX_PART_SIZE: 1024 * 1024 * 1024 * 5,
  // MAX_MULTIPART_PUT_OBJECT_SIZE - maximum size 5TiB of object for
  // Multipart operation.
  MAX_MULTIPART_PUT_OBJECT_SIZE: 1024 * 1024 * 1024 * 1024 * 5
};
const GENERIC_SSE_HEADER = "X-Amz-Server-Side-Encryption";
const ENCRYPTION_HEADERS = {
  // sseGenericHeader is the AWS SSE header used for SSE-S3 and SSE-KMS.
  sseGenericHeader: GENERIC_SSE_HEADER,
  // sseKmsKeyID is the AWS SSE-KMS key id.
  sseKmsKeyID: GENERIC_SSE_HEADER + "-Aws-Kms-Key-Id"
};
function getEncryptionHeaders(encConfig) {
  const encType = encConfig.type;
  if (!isEmpty(encType)) {
    if (encType === ENCRYPTION_TYPES.SSEC) {
      return {
        [ENCRYPTION_HEADERS.sseGenericHeader]: "AES256"
      };
    } else if (encType === ENCRYPTION_TYPES.KMS) {
      return {
        [ENCRYPTION_HEADERS.sseGenericHeader]: encConfig.SSEAlgorithm,
        [ENCRYPTION_HEADERS.sseKmsKeyID]: encConfig.KMSMasterKeyID
      };
    }
  }
  return {};
}
function partsRequired(size) {
  const maxPartSize = PART_CONSTRAINTS.MAX_MULTIPART_PUT_OBJECT_SIZE / (PART_CONSTRAINTS.MAX_PARTS_COUNT - 1);
  let requiredPartSize = size / maxPartSize;
  if (size % maxPartSize > 0) {
    requiredPartSize++;
  }
  requiredPartSize = Math.trunc(requiredPartSize);
  return requiredPartSize;
}
function calculateEvenSplits(size, objInfo) {
  if (size === 0) {
    return null;
  }
  const reqParts = partsRequired(size);
  const startIndexParts = [];
  const endIndexParts = [];
  let start = objInfo.Start;
  if (isEmpty(start) || start === -1) {
    start = 0;
  }
  const divisorValue = Math.trunc(size / reqParts);
  const reminderValue = size % reqParts;
  let nextStart = start;
  for (let i = 0; i < reqParts; i++) {
    let curPartSize = divisorValue;
    if (i < reminderValue) {
      curPartSize++;
    }
    const currentStart = nextStart;
    const currentEnd = currentStart + curPartSize - 1;
    nextStart = currentEnd + 1;
    startIndexParts.push(currentStart);
    endIndexParts.push(currentEnd);
  }
  return {
    startIndex: startIndexParts,
    endIndex: endIndexParts,
    objInfo
  };
}
const fxp$1 = new fxpExports.XMLParser({
  numberParseOptions: {
    eNotation: false,
    hex: true,
    leadingZeros: true
  }
});
function parseXml(xml2) {
  const result = fxp$1.parse(xml2);
  if (result.Error) {
    throw result.Error;
  }
  return result;
}
async function getContentLength(s) {
  if (typeof s === "string" || Buffer.isBuffer(s)) {
    return s.length;
  }
  const filePath = s.path;
  if (filePath && typeof filePath === "string") {
    const stat = await promises.lstat(filePath);
    return stat.size;
  }
  const fd = s.fd;
  if (fd && typeof fd === "number") {
    const stat = await fstat(fd);
    return stat.size;
  }
  return null;
}
const DEFAULT_REGION = "us-east-1";
const PRESIGN_EXPIRY_DAYS_MAX = 24 * 60 * 60 * 7;
class CopySourceOptions {
  constructor({
    Bucket,
    Object: Object2,
    VersionID = "",
    MatchETag = "",
    NoMatchETag = "",
    MatchModifiedSince = null,
    MatchUnmodifiedSince = null,
    MatchRange = false,
    Start = 0,
    End = 0,
    Encryption = void 0
  }) {
    this.Bucket = Bucket;
    this.Object = Object2;
    this.VersionID = VersionID;
    this.MatchETag = MatchETag;
    this.NoMatchETag = NoMatchETag;
    this.MatchModifiedSince = MatchModifiedSince;
    this.MatchUnmodifiedSince = MatchUnmodifiedSince;
    this.MatchRange = MatchRange;
    this.Start = Start;
    this.End = End;
    this.Encryption = Encryption;
  }
  validate() {
    if (!isValidBucketName(this.Bucket)) {
      throw new InvalidBucketNameError("Invalid Source bucket name: " + this.Bucket);
    }
    if (!isValidObjectName(this.Object)) {
      throw new InvalidObjectNameError(`Invalid Source object name: ${this.Object}`);
    }
    if (this.MatchRange && this.Start !== -1 && this.End !== -1 && this.Start > this.End || this.Start < 0) {
      throw new InvalidObjectNameError("Source start must be non-negative, and start must be at most end.");
    } else if (this.MatchRange && !isNumber(this.Start) || !isNumber(this.End)) {
      throw new InvalidObjectNameError("MatchRange is specified. But Invalid Start and End values are specified.");
    }
    return true;
  }
  getHeaders() {
    const headerOptions = {};
    headerOptions["x-amz-copy-source"] = encodeURI(this.Bucket + "/" + this.Object);
    if (!isEmpty(this.VersionID)) {
      headerOptions["x-amz-copy-source"] = `${encodeURI(this.Bucket + "/" + this.Object)}?versionId=${this.VersionID}`;
    }
    if (!isEmpty(this.MatchETag)) {
      headerOptions["x-amz-copy-source-if-match"] = this.MatchETag;
    }
    if (!isEmpty(this.NoMatchETag)) {
      headerOptions["x-amz-copy-source-if-none-match"] = this.NoMatchETag;
    }
    if (!isEmpty(this.MatchModifiedSince)) {
      headerOptions["x-amz-copy-source-if-modified-since"] = this.MatchModifiedSince;
    }
    if (!isEmpty(this.MatchUnmodifiedSince)) {
      headerOptions["x-amz-copy-source-if-unmodified-since"] = this.MatchUnmodifiedSince;
    }
    return headerOptions;
  }
}
class CopyDestinationOptions {
  constructor({
    Bucket,
    Object: Object2,
    Encryption,
    UserMetadata,
    UserTags,
    LegalHold,
    RetainUntilDate,
    Mode,
    MetadataDirective,
    Headers
  }) {
    this.Bucket = Bucket;
    this.Object = Object2;
    this.Encryption = Encryption ?? void 0;
    this.UserMetadata = UserMetadata;
    this.UserTags = UserTags;
    this.LegalHold = LegalHold;
    this.Mode = Mode;
    this.RetainUntilDate = RetainUntilDate;
    this.MetadataDirective = MetadataDirective;
    this.Headers = Headers;
  }
  getHeaders() {
    const replaceDirective = "REPLACE";
    const headerOptions = {};
    const userTags = this.UserTags;
    if (!isEmpty(userTags)) {
      headerOptions["X-Amz-Tagging-Directive"] = replaceDirective;
      headerOptions["X-Amz-Tagging"] = isObject(userTags) ? queryStringExports.stringify(userTags) : isString(userTags) ? userTags : "";
    }
    if (this.Mode) {
      headerOptions["X-Amz-Object-Lock-Mode"] = this.Mode;
    }
    if (this.RetainUntilDate) {
      headerOptions["X-Amz-Object-Lock-Retain-Until-Date"] = this.RetainUntilDate;
    }
    if (this.LegalHold) {
      headerOptions["X-Amz-Object-Lock-Legal-Hold"] = this.LegalHold;
    }
    if (this.UserMetadata) {
      for (const [key, value] of Object.entries(this.UserMetadata)) {
        headerOptions[`X-Amz-Meta-${key}`] = value.toString();
      }
    }
    if (this.MetadataDirective) {
      headerOptions[`X-Amz-Metadata-Directive`] = this.MetadataDirective;
    }
    if (this.Encryption) {
      const encryptionHeaders = getEncryptionHeaders(this.Encryption);
      for (const [key, value] of Object.entries(encryptionHeaders)) {
        headerOptions[key] = value;
      }
    }
    if (this.Headers) {
      for (const [key, value] of Object.entries(this.Headers)) {
        headerOptions[key] = value;
      }
    }
    return headerOptions;
  }
  validate() {
    if (!isValidBucketName(this.Bucket)) {
      throw new InvalidBucketNameError("Invalid Destination bucket name: " + this.Bucket);
    }
    if (!isValidObjectName(this.Object)) {
      throw new InvalidObjectNameError(`Invalid Destination object name: ${this.Object}`);
    }
    if (!isEmpty(this.UserMetadata) && !isObject(this.UserMetadata)) {
      throw new InvalidObjectNameError(`Destination UserMetadata should be an object with key value pairs`);
    }
    if (!isEmpty(this.Mode) && ![RETENTION_MODES.GOVERNANCE, RETENTION_MODES.COMPLIANCE].includes(this.Mode)) {
      throw new InvalidObjectNameError(`Invalid Mode specified for destination object it should be one of [GOVERNANCE,COMPLIANCE]`);
    }
    if (this.Encryption !== void 0 && isEmptyObject(this.Encryption)) {
      throw new InvalidObjectNameError(`Invalid Encryption configuration for destination object `);
    }
    return true;
  }
}
class SelectResults {
  constructor({
    records,
    // parsed data as stream
    response,
    // original response stream
    stats,
    // stats as xml
    progress
    // stats as xml
  }) {
    this.records = records;
    this.response = response;
    this.stats = stats;
    this.progress = progress;
  }
  setStats(stats) {
    this.stats = stats;
  }
  getStats() {
    return this.stats;
  }
  setProgress(progress) {
    this.progress = progress;
  }
  getProgress() {
    return this.progress;
  }
  setResponse(response) {
    this.response = response;
  }
  getResponse() {
    return this.response;
  }
  setRecords(records) {
    this.records = records;
  }
  getRecords() {
    return this.records;
  }
}
const signV4Algorithm = "AWS4-HMAC-SHA256";
function getCanonicalRequest(method, path2, headers, signedHeaders, hashedPayload) {
  if (!isString(method)) {
    throw new TypeError('method should be of type "string"');
  }
  if (!isString(path2)) {
    throw new TypeError('path should be of type "string"');
  }
  if (!isObject(headers)) {
    throw new TypeError('headers should be of type "object"');
  }
  if (!Array.isArray(signedHeaders)) {
    throw new TypeError('signedHeaders should be of type "array"');
  }
  if (!isString(hashedPayload)) {
    throw new TypeError('hashedPayload should be of type "string"');
  }
  const headersArray = signedHeaders.reduce((acc, i) => {
    const val = `${headers[i]}`.replace(/ +/g, " ");
    acc.push(`${i.toLowerCase()}:${val}`);
    return acc;
  }, []);
  const requestResource = path2.split("?")[0];
  let requestQuery = path2.split("?")[1];
  if (!requestQuery) {
    requestQuery = "";
  }
  if (requestQuery) {
    requestQuery = requestQuery.split("&").sort().map((element) => !element.includes("=") ? element + "=" : element).join("&");
  }
  return [method.toUpperCase(), requestResource, requestQuery, headersArray.join("\n") + "\n", signedHeaders.join(";").toLowerCase(), hashedPayload].join("\n");
}
function getCredential(accessKey, region, requestDate, serviceName = "s3") {
  if (!isString(accessKey)) {
    throw new TypeError('accessKey should be of type "string"');
  }
  if (!isString(region)) {
    throw new TypeError('region should be of type "string"');
  }
  if (!isObject(requestDate)) {
    throw new TypeError('requestDate should be of type "object"');
  }
  return `${accessKey}/${getScope(region, requestDate, serviceName)}`;
}
function getSignedHeaders(headers) {
  if (!isObject(headers)) {
    throw new TypeError('request should be of type "object"');
  }
  const ignoredHeaders = ["authorization", "content-length", "content-type", "user-agent"];
  return Object.keys(headers).filter((header) => !ignoredHeaders.includes(header)).sort();
}
function getSigningKey(date, region, secretKey, serviceName = "s3") {
  if (!isObject(date)) {
    throw new TypeError('date should be of type "object"');
  }
  if (!isString(region)) {
    throw new TypeError('region should be of type "string"');
  }
  if (!isString(secretKey)) {
    throw new TypeError('secretKey should be of type "string"');
  }
  const dateLine = makeDateShort(date);
  const hmac1 = crypto.createHmac("sha256", "AWS4" + secretKey).update(dateLine).digest(), hmac2 = crypto.createHmac("sha256", hmac1).update(region).digest(), hmac3 = crypto.createHmac("sha256", hmac2).update(serviceName).digest();
  return crypto.createHmac("sha256", hmac3).update("aws4_request").digest();
}
function getStringToSign(canonicalRequest, requestDate, region, serviceName = "s3") {
  if (!isString(canonicalRequest)) {
    throw new TypeError('canonicalRequest should be of type "string"');
  }
  if (!isObject(requestDate)) {
    throw new TypeError('requestDate should be of type "object"');
  }
  if (!isString(region)) {
    throw new TypeError('region should be of type "string"');
  }
  const hash = crypto.createHash("sha256").update(canonicalRequest).digest("hex");
  const scope = getScope(region, requestDate, serviceName);
  const stringToSign = [signV4Algorithm, makeDateLong(requestDate), scope, hash];
  return stringToSign.join("\n");
}
function postPresignSignatureV4(region, date, secretKey, policyBase64) {
  if (!isString(region)) {
    throw new TypeError('region should be of type "string"');
  }
  if (!isObject(date)) {
    throw new TypeError('date should be of type "object"');
  }
  if (!isString(secretKey)) {
    throw new TypeError('secretKey should be of type "string"');
  }
  if (!isString(policyBase64)) {
    throw new TypeError('policyBase64 should be of type "string"');
  }
  const signingKey = getSigningKey(date, region, secretKey);
  return crypto.createHmac("sha256", signingKey).update(policyBase64).digest("hex").toLowerCase();
}
function signV4(request2, accessKey, secretKey, region, requestDate, sha256sum, serviceName = "s3") {
  if (!isObject(request2)) {
    throw new TypeError('request should be of type "object"');
  }
  if (!isString(accessKey)) {
    throw new TypeError('accessKey should be of type "string"');
  }
  if (!isString(secretKey)) {
    throw new TypeError('secretKey should be of type "string"');
  }
  if (!isString(region)) {
    throw new TypeError('region should be of type "string"');
  }
  if (!accessKey) {
    throw new AccessKeyRequiredError("accessKey is required for signing");
  }
  if (!secretKey) {
    throw new SecretKeyRequiredError("secretKey is required for signing");
  }
  const signedHeaders = getSignedHeaders(request2.headers);
  const canonicalRequest = getCanonicalRequest(request2.method, request2.path, request2.headers, signedHeaders, sha256sum);
  const serviceIdentifier = serviceName || "s3";
  const stringToSign = getStringToSign(canonicalRequest, requestDate, region, serviceIdentifier);
  const signingKey = getSigningKey(requestDate, region, secretKey, serviceIdentifier);
  const credential = getCredential(accessKey, region, requestDate, serviceIdentifier);
  const signature = crypto.createHmac("sha256", signingKey).update(stringToSign).digest("hex").toLowerCase();
  return `${signV4Algorithm} Credential=${credential}, SignedHeaders=${signedHeaders.join(";").toLowerCase()}, Signature=${signature}`;
}
function presignSignatureV4(request2, accessKey, secretKey, sessionToken, region, requestDate, expires) {
  if (!isObject(request2)) {
    throw new TypeError('request should be of type "object"');
  }
  if (!isString(accessKey)) {
    throw new TypeError('accessKey should be of type "string"');
  }
  if (!isString(secretKey)) {
    throw new TypeError('secretKey should be of type "string"');
  }
  if (!isString(region)) {
    throw new TypeError('region should be of type "string"');
  }
  if (!accessKey) {
    throw new AccessKeyRequiredError("accessKey is required for presigning");
  }
  if (!secretKey) {
    throw new SecretKeyRequiredError("secretKey is required for presigning");
  }
  if (expires && !isNumber(expires)) {
    throw new TypeError('expires should be of type "number"');
  }
  if (expires && expires < 1) {
    throw new ExpiresParamError("expires param cannot be less than 1 seconds");
  }
  if (expires && expires > PRESIGN_EXPIRY_DAYS_MAX) {
    throw new ExpiresParamError("expires param cannot be greater than 7 days");
  }
  const iso8601Date = makeDateLong(requestDate);
  const signedHeaders = getSignedHeaders(request2.headers);
  const credential = getCredential(accessKey, region, requestDate);
  const hashedPayload = "UNSIGNED-PAYLOAD";
  const requestQuery = [];
  requestQuery.push(`X-Amz-Algorithm=${signV4Algorithm}`);
  requestQuery.push(`X-Amz-Credential=${uriEscape(credential)}`);
  requestQuery.push(`X-Amz-Date=${iso8601Date}`);
  requestQuery.push(`X-Amz-Expires=${expires}`);
  requestQuery.push(`X-Amz-SignedHeaders=${uriEscape(signedHeaders.join(";").toLowerCase())}`);
  if (sessionToken) {
    requestQuery.push(`X-Amz-Security-Token=${uriEscape(sessionToken)}`);
  }
  const resource = request2.path.split("?")[0];
  let query = request2.path.split("?")[1];
  if (query) {
    query = query + "&" + requestQuery.join("&");
  } else {
    query = requestQuery.join("&");
  }
  const path2 = resource + "?" + query;
  const canonicalRequest = getCanonicalRequest(request2.method, path2, request2.headers, signedHeaders, hashedPayload);
  const stringToSign = getStringToSign(canonicalRequest, requestDate, region);
  const signingKey = getSigningKey(requestDate, region, secretKey);
  const signature = crypto.createHmac("sha256", signingKey).update(stringToSign).digest("hex").toLowerCase();
  return request2.protocol + "//" + request2.headers.host + path2 + `&X-Amz-Signature=${signature}`;
}
class CopyConditions {
  modified = "";
  unmodified = "";
  matchETag = "";
  matchETagExcept = "";
  setModified(date) {
    if (!(date instanceof Date)) {
      throw new TypeError("date must be of type Date");
    }
    this.modified = date.toUTCString();
  }
  setUnmodified(date) {
    if (!(date instanceof Date)) {
      throw new TypeError("date must be of type Date");
    }
    this.unmodified = date.toUTCString();
  }
  setMatchETag(etag) {
    this.matchETag = etag;
  }
  setMatchETagExcept(etag) {
    this.matchETagExcept = etag;
  }
}
async function readAsBuffer(res) {
  return new Promise((resolve, reject2) => {
    const body = [];
    res.on("data", (chunk) => body.push(chunk)).on("error", (e) => reject2(e)).on("end", () => resolve(Buffer.concat(body)));
  });
}
async function readAsString(res) {
  const body = await readAsBuffer(res);
  return body.toString();
}
async function drainResponse(res) {
  return new Promise((resolve, reject2) => {
    res.on("data", () => {
    }).on("error", (e) => reject2(e)).on("end", () => resolve());
  });
}
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
const CRC_TABLE = new Int32Array([
  0,
  1996959894,
  3993919788,
  2567524794,
  124634137,
  1886057615,
  3915621685,
  2657392035,
  249268274,
  2044508324,
  3772115230,
  2547177864,
  162941995,
  2125561021,
  3887607047,
  2428444049,
  498536548,
  1789927666,
  4089016648,
  2227061214,
  450548861,
  1843258603,
  4107580753,
  2211677639,
  325883990,
  1684777152,
  4251122042,
  2321926636,
  335633487,
  1661365465,
  4195302755,
  2366115317,
  997073096,
  1281953886,
  3579855332,
  2724688242,
  1006888145,
  1258607687,
  3524101629,
  2768942443,
  901097722,
  1119000684,
  3686517206,
  2898065728,
  853044451,
  1172266101,
  3705015759,
  2882616665,
  651767980,
  1373503546,
  3369554304,
  3218104598,
  565507253,
  1454621731,
  3485111705,
  3099436303,
  671266974,
  1594198024,
  3322730930,
  2970347812,
  795835527,
  1483230225,
  3244367275,
  3060149565,
  1994146192,
  31158534,
  2563907772,
  4023717930,
  1907459465,
  112637215,
  2680153253,
  3904427059,
  2013776290,
  251722036,
  2517215374,
  3775830040,
  2137656763,
  141376813,
  2439277719,
  3865271297,
  1802195444,
  476864866,
  2238001368,
  4066508878,
  1812370925,
  453092731,
  2181625025,
  4111451223,
  1706088902,
  314042704,
  2344532202,
  4240017532,
  1658658271,
  366619977,
  2362670323,
  4224994405,
  1303535960,
  984961486,
  2747007092,
  3569037538,
  1256170817,
  1037604311,
  2765210733,
  3554079995,
  1131014506,
  879679996,
  2909243462,
  3663771856,
  1141124467,
  855842277,
  2852801631,
  3708648649,
  1342533948,
  654459306,
  3188396048,
  3373015174,
  1466479909,
  544179635,
  3110523913,
  3462522015,
  1591671054,
  702138776,
  2966460450,
  3352799412,
  1504918807,
  783551873,
  3082640443,
  3233442989,
  3988292384,
  2596254646,
  62317068,
  1957810842,
  3939845945,
  2647816111,
  81470997,
  1943803523,
  3814918930,
  2489596804,
  225274430,
  2053790376,
  3826175755,
  2466906013,
  167816743,
  2097651377,
  4027552580,
  2265490386,
  503444072,
  1762050814,
  4150417245,
  2154129355,
  426522225,
  1852507879,
  4275313526,
  2312317920,
  282753626,
  1742555852,
  4189708143,
  2394877945,
  397917763,
  1622183637,
  3604390888,
  2714866558,
  953729732,
  1340076626,
  3518719985,
  2797360999,
  1068828381,
  1219638859,
  3624741850,
  2936675148,
  906185462,
  1090812512,
  3747672003,
  2825379669,
  829329135,
  1181335161,
  3412177804,
  3160834842,
  628085408,
  1382605366,
  3423369109,
  3138078467,
  570562233,
  1426400815,
  3317316542,
  2998733608,
  733239954,
  1555261956,
  3268935591,
  3050360625,
  752459403,
  1541320221,
  2607071920,
  3965973030,
  1969922972,
  40735498,
  2617837225,
  3943577151,
  1913087877,
  83908371,
  2512341634,
  3803740692,
  2075208622,
  213261112,
  2463272603,
  3855990285,
  2094854071,
  198958881,
  2262029012,
  4057260610,
  1759359992,
  534414190,
  2176718541,
  4139329115,
  1873836001,
  414664567,
  2282248934,
  4279200368,
  1711684554,
  285281116,
  2405801727,
  4167216745,
  1634467795,
  376229701,
  2685067896,
  3608007406,
  1308918612,
  956543938,
  2808555105,
  3495958263,
  1231636301,
  1047427035,
  2932959818,
  3654703836,
  1088359270,
  936918e3,
  2847714899,
  3736837829,
  1202900863,
  817233897,
  3183342108,
  3401237130,
  1404277552,
  615818150,
  3134207493,
  3453421203,
  1423857449,
  601450431,
  3009837614,
  3294710456,
  1567103746,
  711928724,
  3020668471,
  3272380065,
  1510334235,
  755167117
]);
function ensureBuffer(input) {
  if (Buffer.isBuffer(input)) {
    return input;
  }
  if (typeof input === "number") {
    return Buffer.alloc(input);
  } else if (typeof input === "string") {
    return Buffer.from(input);
  } else {
    throw new Error("input must be buffer, number, or string, received " + typeof input);
  }
}
function bufferizeInt(num) {
  const tmp = ensureBuffer(4);
  tmp.writeInt32BE(num, 0);
  return tmp;
}
function _crc32(buf, previous) {
  buf = ensureBuffer(buf);
  if (Buffer.isBuffer(previous)) {
    previous = previous.readUInt32BE(0);
  }
  let crc = ~~previous ^ -1;
  for (var n = 0; n < buf.length; n++) {
    crc = CRC_TABLE[(crc ^ buf[n]) & 255] ^ crc >>> 8;
  }
  return crc ^ -1;
}
function crc32() {
  return bufferizeInt(_crc32.apply(null, arguments));
}
crc32.signed = function() {
  return _crc32.apply(null, arguments);
};
crc32.unsigned = function() {
  return _crc32.apply(null, arguments) >>> 0;
};
var bufferCrc32 = crc32;
const index = /* @__PURE__ */ getDefaultExportFromCjs(bufferCrc32);
function parseBucketRegion(xml2) {
  return parseXml(xml2).LocationConstraint;
}
const fxp = new fxpExports.XMLParser();
const fxpWithoutNumParser = new fxpExports.XMLParser({
  // @ts-ignore
  numberParseOptions: {
    skipLike: /./
  }
});
function parseError(xml2, headerInfo) {
  let xmlErr = {};
  const xmlObj = fxp.parse(xml2);
  if (xmlObj.Error) {
    xmlErr = xmlObj.Error;
  }
  const e = new S3Error();
  Object.entries(xmlErr).forEach(([key, value]) => {
    e[key.toLowerCase()] = value;
  });
  Object.entries(headerInfo).forEach(([key, value]) => {
    e[key] = value;
  });
  return e;
}
async function parseResponseError(response) {
  const statusCode = response.statusCode;
  let code = "", message = "";
  if (statusCode === 301) {
    code = "MovedPermanently";
    message = "Moved Permanently";
  } else if (statusCode === 307) {
    code = "TemporaryRedirect";
    message = "Are you using the correct endpoint URL?";
  } else if (statusCode === 403) {
    code = "AccessDenied";
    message = "Valid and authorized credentials required";
  } else if (statusCode === 404) {
    code = "NotFound";
    message = "Not Found";
  } else if (statusCode === 405) {
    code = "MethodNotAllowed";
    message = "Method Not Allowed";
  } else if (statusCode === 501) {
    code = "MethodNotAllowed";
    message = "Method Not Allowed";
  } else if (statusCode === 503) {
    code = "SlowDown";
    message = "Please reduce your request rate.";
  } else {
    const hErrCode = response.headers["x-minio-error-code"];
    const hErrDesc = response.headers["x-minio-error-desc"];
    if (hErrCode && hErrDesc) {
      code = hErrCode;
      message = hErrDesc;
    }
  }
  const headerInfo = {};
  headerInfo.amzRequestid = response.headers["x-amz-request-id"];
  headerInfo.amzId2 = response.headers["x-amz-id-2"];
  headerInfo.amzBucketRegion = response.headers["x-amz-bucket-region"];
  const xmlString = await readAsString(response);
  if (xmlString) {
    throw parseError(xmlString, headerInfo);
  }
  const e = new S3Error(message, {
    cause: headerInfo
  });
  e.code = code;
  Object.entries(headerInfo).forEach(([key, value]) => {
    e[key] = value;
  });
  throw e;
}
function parseListObjectsV2WithMetadata(xml2) {
  const result = {
    objects: [],
    isTruncated: false,
    nextContinuationToken: ""
  };
  let xmlobj = parseXml(xml2);
  if (!xmlobj.ListBucketResult) {
    throw new InvalidXMLError('Missing tag: "ListBucketResult"');
  }
  xmlobj = xmlobj.ListBucketResult;
  if (xmlobj.IsTruncated) {
    result.isTruncated = xmlobj.IsTruncated;
  }
  if (xmlobj.NextContinuationToken) {
    result.nextContinuationToken = xmlobj.NextContinuationToken;
  }
  if (xmlobj.Contents) {
    toArray(xmlobj.Contents).forEach((content) => {
      const name = sanitizeObjectKey(content.Key);
      const lastModified = new Date(content.LastModified);
      const etag = sanitizeETag(content.ETag);
      const size = content.Size;
      let tags = {};
      if (content.UserTags != null) {
        toArray(content.UserTags.split("&")).forEach((tag) => {
          const [key, value] = tag.split("=");
          tags[key] = value;
        });
      } else {
        tags = {};
      }
      let metadata;
      if (content.UserMetadata != null) {
        metadata = toArray(content.UserMetadata)[0];
      } else {
        metadata = null;
      }
      result.objects.push({
        name,
        lastModified,
        etag,
        size,
        metadata,
        tags
      });
    });
  }
  if (xmlobj.CommonPrefixes) {
    toArray(xmlobj.CommonPrefixes).forEach((commonPrefix) => {
      result.objects.push({
        prefix: sanitizeObjectKey(toArray(commonPrefix.Prefix)[0]),
        size: 0
      });
    });
  }
  return result;
}
function parseListParts(xml2) {
  let xmlobj = parseXml(xml2);
  const result = {
    isTruncated: false,
    parts: [],
    marker: 0
  };
  if (!xmlobj.ListPartsResult) {
    throw new InvalidXMLError('Missing tag: "ListPartsResult"');
  }
  xmlobj = xmlobj.ListPartsResult;
  if (xmlobj.IsTruncated) {
    result.isTruncated = xmlobj.IsTruncated;
  }
  if (xmlobj.NextPartNumberMarker) {
    result.marker = toArray(xmlobj.NextPartNumberMarker)[0] || "";
  }
  if (xmlobj.Part) {
    toArray(xmlobj.Part).forEach((p) => {
      const part = parseInt(toArray(p.PartNumber)[0], 10);
      const lastModified = new Date(p.LastModified);
      const etag = p.ETag.replace(/^"/g, "").replace(/"$/g, "").replace(/^&quot;/g, "").replace(/&quot;$/g, "").replace(/^&#34;/g, "").replace(/&#34;$/g, "");
      result.parts.push({
        part,
        lastModified,
        etag,
        size: parseInt(p.Size, 10)
      });
    });
  }
  return result;
}
function parseListBucket(xml2) {
  let result = [];
  const listBucketResultParser = new fxpExports.XMLParser({
    parseTagValue: true,
    // Enable parsing of values
    numberParseOptions: {
      leadingZeros: false,
      // Disable number parsing for values with leading zeros
      hex: false,
      // Disable hex number parsing - Invalid bucket name
      skipLike: /^[0-9]+$/
      // Skip number parsing if the value consists entirely of digits
    },
    tagValueProcessor: (tagName, tagValue = "") => {
      if (tagName === "Name") {
        return tagValue.toString();
      }
      return tagValue;
    },
    ignoreAttributes: false
    // Ensure that all attributes are parsed
  });
  const parsedXmlRes = listBucketResultParser.parse(xml2);
  if (!parsedXmlRes.ListAllMyBucketsResult) {
    throw new InvalidXMLError('Missing tag: "ListAllMyBucketsResult"');
  }
  const {
    ListAllMyBucketsResult: {
      Buckets = {}
    } = {}
  } = parsedXmlRes;
  if (Buckets.Bucket) {
    result = toArray(Buckets.Bucket).map((bucket = {}) => {
      const {
        Name: bucketName,
        CreationDate
      } = bucket;
      const creationDate = new Date(CreationDate);
      return {
        name: bucketName,
        creationDate
      };
    });
  }
  return result;
}
function parseInitiateMultipart(xml2) {
  let xmlobj = parseXml(xml2);
  if (!xmlobj.InitiateMultipartUploadResult) {
    throw new InvalidXMLError('Missing tag: "InitiateMultipartUploadResult"');
  }
  xmlobj = xmlobj.InitiateMultipartUploadResult;
  if (xmlobj.UploadId) {
    return xmlobj.UploadId;
  }
  throw new InvalidXMLError('Missing tag: "UploadId"');
}
function parseReplicationConfig(xml2) {
  const xmlObj = parseXml(xml2);
  const {
    Role,
    Rule
  } = xmlObj.ReplicationConfiguration;
  return {
    ReplicationConfiguration: {
      role: Role,
      rules: toArray(Rule)
    }
  };
}
function parseObjectLegalHoldConfig(xml2) {
  const xmlObj = parseXml(xml2);
  return xmlObj.LegalHold;
}
function parseTagging(xml2) {
  const xmlObj = parseXml(xml2);
  let result = [];
  if (xmlObj.Tagging && xmlObj.Tagging.TagSet && xmlObj.Tagging.TagSet.Tag) {
    const tagResult = xmlObj.Tagging.TagSet.Tag;
    if (Array.isArray(tagResult)) {
      result = [...tagResult];
    } else {
      result.push(tagResult);
    }
  }
  return result;
}
function parseCompleteMultipart(xml2) {
  const xmlobj = parseXml(xml2).CompleteMultipartUploadResult;
  if (xmlobj.Location) {
    const location = toArray(xmlobj.Location)[0];
    const bucket = toArray(xmlobj.Bucket)[0];
    const key = xmlobj.Key;
    const etag = xmlobj.ETag.replace(/^"/g, "").replace(/"$/g, "").replace(/^&quot;/g, "").replace(/&quot;$/g, "").replace(/^&#34;/g, "").replace(/&#34;$/g, "");
    return {
      location,
      bucket,
      key,
      etag
    };
  }
  if (xmlobj.Code && xmlobj.Message) {
    const errCode = toArray(xmlobj.Code)[0];
    const errMessage = toArray(xmlobj.Message)[0];
    return {
      errCode,
      errMessage
    };
  }
}
function parseListMultipart(xml2) {
  const result = {
    prefixes: [],
    uploads: [],
    isTruncated: false,
    nextKeyMarker: "",
    nextUploadIdMarker: ""
  };
  let xmlobj = parseXml(xml2);
  if (!xmlobj.ListMultipartUploadsResult) {
    throw new InvalidXMLError('Missing tag: "ListMultipartUploadsResult"');
  }
  xmlobj = xmlobj.ListMultipartUploadsResult;
  if (xmlobj.IsTruncated) {
    result.isTruncated = xmlobj.IsTruncated;
  }
  if (xmlobj.NextKeyMarker) {
    result.nextKeyMarker = xmlobj.NextKeyMarker;
  }
  if (xmlobj.NextUploadIdMarker) {
    result.nextUploadIdMarker = xmlobj.nextUploadIdMarker || "";
  }
  if (xmlobj.CommonPrefixes) {
    toArray(xmlobj.CommonPrefixes).forEach((prefix) => {
      result.prefixes.push({
        prefix: sanitizeObjectKey(toArray(prefix.Prefix)[0])
      });
    });
  }
  if (xmlobj.Upload) {
    toArray(xmlobj.Upload).forEach((upload) => {
      const uploadItem = {
        key: upload.Key,
        uploadId: upload.UploadId,
        storageClass: upload.StorageClass,
        initiated: new Date(upload.Initiated)
      };
      if (upload.Initiator) {
        uploadItem.initiator = {
          id: upload.Initiator.ID,
          displayName: upload.Initiator.DisplayName
        };
      }
      if (upload.Owner) {
        uploadItem.owner = {
          id: upload.Owner.ID,
          displayName: upload.Owner.DisplayName
        };
      }
      result.uploads.push(uploadItem);
    });
  }
  return result;
}
function parseObjectLockConfig(xml2) {
  const xmlObj = parseXml(xml2);
  let lockConfigResult = {};
  if (xmlObj.ObjectLockConfiguration) {
    lockConfigResult = {
      objectLockEnabled: xmlObj.ObjectLockConfiguration.ObjectLockEnabled
    };
    let retentionResp;
    if (xmlObj.ObjectLockConfiguration && xmlObj.ObjectLockConfiguration.Rule && xmlObj.ObjectLockConfiguration.Rule.DefaultRetention) {
      retentionResp = xmlObj.ObjectLockConfiguration.Rule.DefaultRetention || {};
      lockConfigResult.mode = retentionResp.Mode;
    }
    if (retentionResp) {
      const isUnitYears = retentionResp.Years;
      if (isUnitYears) {
        lockConfigResult.validity = isUnitYears;
        lockConfigResult.unit = RETENTION_VALIDITY_UNITS.YEARS;
      } else {
        lockConfigResult.validity = retentionResp.Days;
        lockConfigResult.unit = RETENTION_VALIDITY_UNITS.DAYS;
      }
    }
  }
  return lockConfigResult;
}
function parseBucketVersioningConfig(xml2) {
  const xmlObj = parseXml(xml2);
  return xmlObj.VersioningConfiguration;
}
function extractHeaderType(stream2) {
  const headerNameLen = Buffer.from(stream2.read(1)).readUInt8();
  const headerNameWithSeparator = Buffer.from(stream2.read(headerNameLen)).toString();
  const splitBySeparator = (headerNameWithSeparator || "").split(":");
  return splitBySeparator.length >= 1 ? splitBySeparator[1] : "";
}
function extractHeaderValue(stream2) {
  const bodyLen = Buffer.from(stream2.read(2)).readUInt16BE();
  return Buffer.from(stream2.read(bodyLen)).toString();
}
function parseSelectObjectContentResponse(res) {
  const selectResults = new SelectResults({});
  const responseStream = readableStream(res);
  while (responseStream._readableState.length) {
    let msgCrcAccumulator;
    const totalByteLengthBuffer = Buffer.from(responseStream.read(4));
    msgCrcAccumulator = index(totalByteLengthBuffer);
    const headerBytesBuffer = Buffer.from(responseStream.read(4));
    msgCrcAccumulator = index(headerBytesBuffer, msgCrcAccumulator);
    const calculatedPreludeCrc = msgCrcAccumulator.readInt32BE();
    const preludeCrcBuffer = Buffer.from(responseStream.read(4));
    msgCrcAccumulator = index(preludeCrcBuffer, msgCrcAccumulator);
    const totalMsgLength = totalByteLengthBuffer.readInt32BE();
    const headerLength = headerBytesBuffer.readInt32BE();
    const preludeCrcByteValue = preludeCrcBuffer.readInt32BE();
    if (preludeCrcByteValue !== calculatedPreludeCrc) {
      throw new Error(`Header Checksum Mismatch, Prelude CRC of ${preludeCrcByteValue} does not equal expected CRC of ${calculatedPreludeCrc}`);
    }
    const headers = {};
    if (headerLength > 0) {
      const headerBytes = Buffer.from(responseStream.read(headerLength));
      msgCrcAccumulator = index(headerBytes, msgCrcAccumulator);
      const headerReaderStream = readableStream(headerBytes);
      while (headerReaderStream._readableState.length) {
        const headerTypeName = extractHeaderType(headerReaderStream);
        headerReaderStream.read(1);
        if (headerTypeName) {
          headers[headerTypeName] = extractHeaderValue(headerReaderStream);
        }
      }
    }
    let payloadStream;
    const payLoadLength = totalMsgLength - headerLength - 16;
    if (payLoadLength > 0) {
      const payLoadBuffer = Buffer.from(responseStream.read(payLoadLength));
      msgCrcAccumulator = index(payLoadBuffer, msgCrcAccumulator);
      const messageCrcByteValue = Buffer.from(responseStream.read(4)).readInt32BE();
      const calculatedCrc = msgCrcAccumulator.readInt32BE();
      if (messageCrcByteValue !== calculatedCrc) {
        throw new Error(`Message Checksum Mismatch, Message CRC of ${messageCrcByteValue} does not equal expected CRC of ${calculatedCrc}`);
      }
      payloadStream = readableStream(payLoadBuffer);
    }
    const messageType = headers["message-type"];
    switch (messageType) {
      case "error": {
        const errorMessage = headers["error-code"] + ':"' + headers["error-message"] + '"';
        throw new Error(errorMessage);
      }
      case "event": {
        const contentType = headers["content-type"];
        const eventType = headers["event-type"];
        switch (eventType) {
          case "End": {
            selectResults.setResponse(res);
            return selectResults;
          }
          case "Records": {
            var _payloadStream;
            const readData = (_payloadStream = payloadStream) === null || _payloadStream === void 0 ? void 0 : _payloadStream.read(payLoadLength);
            selectResults.setRecords(readData);
            break;
          }
          case "Progress":
            {
              switch (contentType) {
                case "text/xml": {
                  var _payloadStream2;
                  const progressData = (_payloadStream2 = payloadStream) === null || _payloadStream2 === void 0 ? void 0 : _payloadStream2.read(payLoadLength);
                  selectResults.setProgress(progressData.toString());
                  break;
                }
                default: {
                  const errorMessage = `Unexpected content-type ${contentType} sent for event-type Progress`;
                  throw new Error(errorMessage);
                }
              }
            }
            break;
          case "Stats":
            {
              switch (contentType) {
                case "text/xml": {
                  var _payloadStream3;
                  const statsData = (_payloadStream3 = payloadStream) === null || _payloadStream3 === void 0 ? void 0 : _payloadStream3.read(payLoadLength);
                  selectResults.setStats(statsData.toString());
                  break;
                }
                default: {
                  const errorMessage = `Unexpected content-type ${contentType} sent for event-type Stats`;
                  throw new Error(errorMessage);
                }
              }
            }
            break;
          default: {
            const warningMessage = `Un implemented event detected  ${messageType}.`;
            console.warn(warningMessage);
          }
        }
      }
    }
  }
}
function parseLifecycleConfig(xml2) {
  const xmlObj = parseXml(xml2);
  return xmlObj.LifecycleConfiguration;
}
function parseBucketEncryptionConfig(xml2) {
  return parseXml(xml2);
}
function parseObjectRetentionConfig(xml2) {
  const xmlObj = parseXml(xml2);
  const retentionConfig = xmlObj.Retention;
  return {
    mode: retentionConfig.Mode,
    retainUntilDate: retentionConfig.RetainUntilDate
  };
}
function removeObjectsParser(xml2) {
  const xmlObj = parseXml(xml2);
  if (xmlObj.DeleteResult && xmlObj.DeleteResult.Error) {
    return toArray(xmlObj.DeleteResult.Error);
  }
  return [];
}
function parseCopyObject(xml2) {
  const result = {
    etag: "",
    lastModified: ""
  };
  let xmlobj = parseXml(xml2);
  if (!xmlobj.CopyObjectResult) {
    throw new InvalidXMLError('Missing tag: "CopyObjectResult"');
  }
  xmlobj = xmlobj.CopyObjectResult;
  if (xmlobj.ETag) {
    result.etag = xmlobj.ETag.replace(/^"/g, "").replace(/"$/g, "").replace(/^&quot;/g, "").replace(/&quot;$/g, "").replace(/^&#34;/g, "").replace(/&#34;$/g, "");
  }
  if (xmlobj.LastModified) {
    result.lastModified = new Date(xmlobj.LastModified);
  }
  return result;
}
const formatObjInfo = (content, opts = {}) => {
  const {
    Key,
    LastModified,
    ETag,
    Size,
    VersionId,
    IsLatest
  } = content;
  if (!isObject(opts)) {
    opts = {};
  }
  const name = sanitizeObjectKey(toArray(Key)[0] || "");
  const lastModified = LastModified ? new Date(toArray(LastModified)[0] || "") : void 0;
  const etag = sanitizeETag(toArray(ETag)[0] || "");
  const size = sanitizeSize(Size || "");
  return {
    name,
    lastModified,
    etag,
    size,
    versionId: VersionId,
    isLatest: IsLatest,
    isDeleteMarker: opts.IsDeleteMarker ? opts.IsDeleteMarker : false
  };
};
function parseListObjects(xml2) {
  const result = {
    objects: [],
    isTruncated: false,
    nextMarker: void 0,
    versionIdMarker: void 0,
    keyMarker: void 0
  };
  let isTruncated = false;
  let nextMarker;
  const xmlobj = fxpWithoutNumParser.parse(xml2);
  const parseCommonPrefixesEntity = (commonPrefixEntry) => {
    if (commonPrefixEntry) {
      toArray(commonPrefixEntry).forEach((commonPrefix) => {
        result.objects.push({
          prefix: sanitizeObjectKey(toArray(commonPrefix.Prefix)[0] || ""),
          size: 0
        });
      });
    }
  };
  const listBucketResult = xmlobj.ListBucketResult;
  const listVersionsResult = xmlobj.ListVersionsResult;
  if (listBucketResult) {
    if (listBucketResult.IsTruncated) {
      isTruncated = listBucketResult.IsTruncated;
    }
    if (listBucketResult.Contents) {
      toArray(listBucketResult.Contents).forEach((content) => {
        const name = sanitizeObjectKey(toArray(content.Key)[0] || "");
        const lastModified = new Date(toArray(content.LastModified)[0] || "");
        const etag = sanitizeETag(toArray(content.ETag)[0] || "");
        const size = sanitizeSize(content.Size || "");
        result.objects.push({
          name,
          lastModified,
          etag,
          size
        });
      });
    }
    if (listBucketResult.Marker) {
      nextMarker = listBucketResult.Marker;
    }
    if (listBucketResult.NextMarker) {
      nextMarker = listBucketResult.NextMarker;
    } else if (isTruncated && result.objects.length > 0) {
      var _result$objects;
      nextMarker = (_result$objects = result.objects[result.objects.length - 1]) === null || _result$objects === void 0 ? void 0 : _result$objects.name;
    }
    if (listBucketResult.CommonPrefixes) {
      parseCommonPrefixesEntity(listBucketResult.CommonPrefixes);
    }
  }
  if (listVersionsResult) {
    if (listVersionsResult.IsTruncated) {
      isTruncated = listVersionsResult.IsTruncated;
    }
    if (listVersionsResult.Version) {
      toArray(listVersionsResult.Version).forEach((content) => {
        result.objects.push(formatObjInfo(content));
      });
    }
    if (listVersionsResult.DeleteMarker) {
      toArray(listVersionsResult.DeleteMarker).forEach((content) => {
        result.objects.push(formatObjInfo(content, {
          IsDeleteMarker: true
        }));
      });
    }
    if (listVersionsResult.NextKeyMarker) {
      result.keyMarker = listVersionsResult.NextKeyMarker;
    }
    if (listVersionsResult.NextVersionIdMarker) {
      result.versionIdMarker = listVersionsResult.NextVersionIdMarker;
    }
    if (listVersionsResult.CommonPrefixes) {
      parseCommonPrefixesEntity(listVersionsResult.CommonPrefixes);
    }
  }
  result.isTruncated = isTruncated;
  if (isTruncated) {
    result.nextMarker = nextMarker;
  }
  return result;
}
function uploadPartParser(xml2) {
  const xmlObj = parseXml(xml2);
  const respEl = xmlObj.CopyPartResult;
  return respEl;
}
class Extensions {
  constructor(client) {
    this.client = client;
  }
  /**
   * List the objects in the bucket using S3 ListObjects V2 With Metadata
   *
   * @param bucketName - name of the bucket
   * @param prefix - the prefix of the objects that should be listed (optional, default `''`)
   * @param recursive - `true` indicates recursive style listing and `false` indicates directory style listing delimited by '/'. (optional, default `false`)
   * @param startAfter - Specifies the key to start after when listing objects in a bucket. (optional, default `''`)
   * @returns stream emitting the objects in the bucket, the object is of the format:
   */
  listObjectsV2WithMetadata(bucketName, prefix, recursive, startAfter) {
    if (prefix === void 0) {
      prefix = "";
    }
    if (recursive === void 0) {
      recursive = false;
    }
    if (startAfter === void 0) {
      startAfter = "";
    }
    if (!isValidBucketName(bucketName)) {
      throw new InvalidBucketNameError("Invalid bucket name: " + bucketName);
    }
    if (!isValidPrefix(prefix)) {
      throw new InvalidPrefixError(`Invalid prefix : ${prefix}`);
    }
    if (!isString(prefix)) {
      throw new TypeError('prefix should be of type "string"');
    }
    if (!isBoolean(recursive)) {
      throw new TypeError('recursive should be of type "boolean"');
    }
    if (!isString(startAfter)) {
      throw new TypeError('startAfter should be of type "string"');
    }
    const delimiter = recursive ? "" : "/";
    return stream$1.Readable.from(this.listObjectsV2WithMetadataGen(bucketName, prefix, delimiter, startAfter), {
      objectMode: true
    });
  }
  async *listObjectsV2WithMetadataGen(bucketName, prefix, delimiter, startAfter) {
    let ended = false;
    let continuationToken = "";
    do {
      const result = await this.listObjectsV2WithMetadataQuery(bucketName, prefix, continuationToken, delimiter, startAfter);
      ended = !result.isTruncated;
      continuationToken = result.nextContinuationToken;
      for (const obj of result.objects) {
        yield obj;
      }
    } while (!ended);
  }
  async listObjectsV2WithMetadataQuery(bucketName, prefix, continuationToken, delimiter, startAfter) {
    const queries = [];
    queries.push(`list-type=2`);
    queries.push(`encoding-type=url`);
    queries.push(`prefix=${uriEscape(prefix)}`);
    queries.push(`delimiter=${uriEscape(delimiter)}`);
    queries.push(`metadata=true`);
    if (continuationToken) {
      continuationToken = uriEscape(continuationToken);
      queries.push(`continuation-token=${continuationToken}`);
    }
    if (startAfter) {
      startAfter = uriEscape(startAfter);
      queries.push(`start-after=${startAfter}`);
    }
    queries.push(`max-keys=1000`);
    queries.sort();
    let query = "";
    if (queries.length > 0) {
      query = `${queries.join("&")}`;
    }
    const method = "GET";
    const res = await this.client.makeRequestAsync({
      method,
      bucketName,
      query
    });
    return parseListObjectsV2WithMetadata(await readAsString(res));
  }
}
function joinHostPort(host, port) {
  if (port === void 0) {
    return host;
  }
  if (host.includes(":")) {
    return `[${host}]:${port.toString()}`;
  }
  return `${host}:${port.toString()}`;
}
class PostPolicy {
  policy = {
    conditions: []
  };
  formData = {};
  // set expiration date
  setExpires(date) {
    if (!date) {
      throw new InvalidDateError("Invalid date: cannot be null");
    }
    this.policy.expiration = date.toISOString();
  }
  // set object name
  setKey(objectName) {
    if (!isValidObjectName(objectName)) {
      throw new InvalidObjectNameError(`Invalid object name : ${objectName}`);
    }
    this.policy.conditions.push(["eq", "$key", objectName]);
    this.formData.key = objectName;
  }
  // set object name prefix, i.e policy allows any keys with this prefix
  setKeyStartsWith(prefix) {
    if (!isValidPrefix(prefix)) {
      throw new InvalidPrefixError(`Invalid prefix : ${prefix}`);
    }
    this.policy.conditions.push(["starts-with", "$key", prefix]);
    this.formData.key = prefix;
  }
  // set bucket name
  setBucket(bucketName) {
    if (!isValidBucketName(bucketName)) {
      throw new InvalidBucketNameError(`Invalid bucket name : ${bucketName}`);
    }
    this.policy.conditions.push(["eq", "$bucket", bucketName]);
    this.formData.bucket = bucketName;
  }
  // set Content-Type
  setContentType(type) {
    if (!type) {
      throw new Error("content-type cannot be null");
    }
    this.policy.conditions.push(["eq", "$Content-Type", type]);
    this.formData["Content-Type"] = type;
  }
  // set Content-Type prefix, i.e image/ allows any image
  setContentTypeStartsWith(prefix) {
    if (!prefix) {
      throw new Error("content-type cannot be null");
    }
    this.policy.conditions.push(["starts-with", "$Content-Type", prefix]);
    this.formData["Content-Type"] = prefix;
  }
  // set Content-Disposition
  setContentDisposition(value) {
    if (!value) {
      throw new Error("content-disposition cannot be null");
    }
    this.policy.conditions.push(["eq", "$Content-Disposition", value]);
    this.formData["Content-Disposition"] = value;
  }
  // set minimum/maximum length of what Content-Length can be.
  setContentLengthRange(min, max) {
    if (min > max) {
      throw new Error("min cannot be more than max");
    }
    if (min < 0) {
      throw new Error("min should be > 0");
    }
    if (max < 0) {
      throw new Error("max should be > 0");
    }
    this.policy.conditions.push(["content-length-range", min, max]);
  }
  // set user defined metadata
  setUserMetaData(metaData) {
    if (!isObject(metaData)) {
      throw new TypeError('metadata should be of type "object"');
    }
    Object.entries(metaData).forEach(([key, value]) => {
      const amzMetaDataKey = `x-amz-meta-${key}`;
      this.policy.conditions.push(["eq", `$${amzMetaDataKey}`, value]);
      this.formData[amzMetaDataKey] = value.toString();
    });
  }
}
const pipelineAsync = promisify$1(pipeline);
async function request(transport, opt, body = null) {
  return new Promise((resolve, reject2) => {
    const requestObj = transport.request(opt, (response) => {
      resolve(response);
    });
    requestObj.on("error", reject2);
    if (!body || Buffer.isBuffer(body) || typeof body === "string") {
      requestObj.end(body);
    } else {
      pipelineAsync(body, requestObj).catch(reject2);
    }
  });
}
const MAX_RETRIES = 10;
const EXP_BACK_OFF_BASE_DELAY = 1e3;
const ADDITIONAL_DELAY_FACTOR = 1;
const retryHttpCodes = {
  408: true,
  429: true,
  499: true,
  500: true,
  502: true,
  503: true,
  504: true,
  520: true
};
const isHttpRetryable = (httpResCode) => {
  return retryHttpCodes[httpResCode] !== void 0;
};
const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
const getExpBackOffDelay = (retryCount) => {
  const backOffBy = EXP_BACK_OFF_BASE_DELAY * 2 ** retryCount;
  const additionalDelay = Math.random() * backOffBy * ADDITIONAL_DELAY_FACTOR;
  return backOffBy + additionalDelay;
};
async function requestWithRetry(transport, opt, body = null, maxRetries = MAX_RETRIES) {
  let attempt = 0;
  let isRetryable = false;
  while (attempt <= maxRetries) {
    try {
      const response = await request(transport, opt, body);
      if (isHttpRetryable(response.statusCode)) {
        isRetryable = true;
        throw new Error(`Retryable HTTP status: ${response.statusCode}`);
      }
      return response;
    } catch (err) {
      if (isRetryable) {
        attempt++;
        isRetryable = false;
        if (attempt > maxRetries) {
          throw new Error(`Request failed after ${maxRetries} retries: ${err}`);
        }
        const delay = getExpBackOffDelay(attempt);
        console.warn(`${(/* @__PURE__ */ new Date()).toLocaleString()} Retrying request (attempt ${attempt}/${maxRetries}) after ${delay}ms due to: ${err}`);
        await sleep(delay);
      } else {
        throw err;
      }
    }
  }
  throw new Error(`${MAX_RETRIES} Retries exhausted, request failed.`);
}
const awsS3Endpoint = {
  "af-south-1": "s3.af-south-1.amazonaws.com",
  "ap-east-1": "s3.ap-east-1.amazonaws.com",
  "ap-south-1": "s3.ap-south-1.amazonaws.com",
  "ap-south-2": "s3.ap-south-2.amazonaws.com",
  "ap-southeast-1": "s3.ap-southeast-1.amazonaws.com",
  "ap-southeast-2": "s3.ap-southeast-2.amazonaws.com",
  "ap-southeast-3": "s3.ap-southeast-3.amazonaws.com",
  "ap-southeast-4": "s3.ap-southeast-4.amazonaws.com",
  "ap-southeast-5": "s3.ap-southeast-5.amazonaws.com",
  "ap-northeast-1": "s3.ap-northeast-1.amazonaws.com",
  "ap-northeast-2": "s3.ap-northeast-2.amazonaws.com",
  "ap-northeast-3": "s3.ap-northeast-3.amazonaws.com",
  "ca-central-1": "s3.ca-central-1.amazonaws.com",
  "ca-west-1": "s3.ca-west-1.amazonaws.com",
  "cn-north-1": "s3.cn-north-1.amazonaws.com.cn",
  "eu-central-1": "s3.eu-central-1.amazonaws.com",
  "eu-central-2": "s3.eu-central-2.amazonaws.com",
  "eu-north-1": "s3.eu-north-1.amazonaws.com",
  "eu-south-1": "s3.eu-south-1.amazonaws.com",
  "eu-south-2": "s3.eu-south-2.amazonaws.com",
  "eu-west-1": "s3.eu-west-1.amazonaws.com",
  "eu-west-2": "s3.eu-west-2.amazonaws.com",
  "eu-west-3": "s3.eu-west-3.amazonaws.com",
  "il-central-1": "s3.il-central-1.amazonaws.com",
  "me-central-1": "s3.me-central-1.amazonaws.com",
  "me-south-1": "s3.me-south-1.amazonaws.com",
  "sa-east-1": "s3.sa-east-1.amazonaws.com",
  "us-east-1": "s3.us-east-1.amazonaws.com",
  "us-east-2": "s3.us-east-2.amazonaws.com",
  "us-west-1": "s3.us-west-1.amazonaws.com",
  "us-west-2": "s3.us-west-2.amazonaws.com",
  "us-gov-east-1": "s3.us-gov-east-1.amazonaws.com",
  "us-gov-west-1": "s3.us-gov-west-1.amazonaws.com"
  // Add new endpoints here.
};
function getS3Endpoint(region) {
  if (!isString(region)) {
    throw new TypeError(`Invalid region: ${region}`);
  }
  const endpoint = awsS3Endpoint[region];
  if (endpoint) {
    return endpoint;
  }
  return "s3.amazonaws.com";
}
const xml = new xml2js.Builder({
  renderOpts: {
    pretty: false
  },
  headless: true
});
const Package = {
  version: "8.0.6"
};
const requestOptionProperties = ["agent", "ca", "cert", "ciphers", "clientCertEngine", "crl", "dhparam", "ecdhCurve", "family", "honorCipherOrder", "key", "passphrase", "pfx", "rejectUnauthorized", "secureOptions", "secureProtocol", "servername", "sessionIdContext"];
class TypedClient {
  partSize = 64 * 1024 * 1024;
  maximumPartSize = 5 * 1024 * 1024 * 1024;
  maxObjectSize = 5 * 1024 * 1024 * 1024 * 1024;
  constructor(params) {
    if (params.secure !== void 0) {
      throw new Error('"secure" option deprecated, "useSSL" should be used instead');
    }
    if (params.useSSL === void 0) {
      params.useSSL = true;
    }
    if (!params.port) {
      params.port = 0;
    }
    if (!isValidEndpoint(params.endPoint)) {
      throw new InvalidEndpointError(`Invalid endPoint : ${params.endPoint}`);
    }
    if (!isValidPort(params.port)) {
      throw new InvalidArgumentError(`Invalid port : ${params.port}`);
    }
    if (!isBoolean(params.useSSL)) {
      throw new InvalidArgumentError(`Invalid useSSL flag type : ${params.useSSL}, expected to be of type "boolean"`);
    }
    if (params.region) {
      if (!isString(params.region)) {
        throw new InvalidArgumentError(`Invalid region : ${params.region}`);
      }
    }
    const host = params.endPoint.toLowerCase();
    let port = params.port;
    let protocol;
    let transport;
    let transportAgent;
    if (params.useSSL) {
      transport = https;
      protocol = "https:";
      port = port || 443;
      transportAgent = https.globalAgent;
    } else {
      transport = http;
      protocol = "http:";
      port = port || 80;
      transportAgent = http.globalAgent;
    }
    if (params.transport) {
      if (!isObject(params.transport)) {
        throw new InvalidArgumentError(`Invalid transport type : ${params.transport}, expected to be type "object"`);
      }
      transport = params.transport;
    }
    if (params.transportAgent) {
      if (!isObject(params.transportAgent)) {
        throw new InvalidArgumentError(`Invalid transportAgent type: ${params.transportAgent}, expected to be type "object"`);
      }
      transportAgent = params.transportAgent;
    }
    const libraryComments = `(${process.platform}; ${process.arch})`;
    const libraryAgent = `MinIO ${libraryComments} minio-js/${Package.version}`;
    this.transport = transport;
    this.transportAgent = transportAgent;
    this.host = host;
    this.port = port;
    this.protocol = protocol;
    this.userAgent = `${libraryAgent}`;
    if (params.pathStyle === void 0) {
      this.pathStyle = true;
    } else {
      this.pathStyle = params.pathStyle;
    }
    this.accessKey = params.accessKey ?? "";
    this.secretKey = params.secretKey ?? "";
    this.sessionToken = params.sessionToken;
    this.anonymous = !this.accessKey || !this.secretKey;
    if (params.credentialsProvider) {
      this.anonymous = false;
      this.credentialsProvider = params.credentialsProvider;
    }
    this.regionMap = {};
    if (params.region) {
      this.region = params.region;
    }
    if (params.partSize) {
      this.partSize = params.partSize;
      this.overRidePartSize = true;
    }
    if (this.partSize < 5 * 1024 * 1024) {
      throw new InvalidArgumentError(`Part size should be greater than 5MB`);
    }
    if (this.partSize > 5 * 1024 * 1024 * 1024) {
      throw new InvalidArgumentError(`Part size should be less than 5GB`);
    }
    this.enableSHA256 = !this.anonymous && !params.useSSL;
    this.s3AccelerateEndpoint = params.s3AccelerateEndpoint || void 0;
    this.reqOptions = {};
    this.clientExtensions = new Extensions(this);
  }
  /**
   * Minio extensions that aren't necessary present for Amazon S3 compatible storage servers
   */
  get extensions() {
    return this.clientExtensions;
  }
  /**
   * @param endPoint - valid S3 acceleration end point
   */
  setS3TransferAccelerate(endPoint) {
    this.s3AccelerateEndpoint = endPoint;
  }
  /**
   * Sets the supported request options.
   */
  setRequestOptions(options) {
    if (!isObject(options)) {
      throw new TypeError('request options should be of type "object"');
    }
    this.reqOptions = _.pick(options, requestOptionProperties);
  }
  /**
   *  This is s3 Specific and does not hold validity in any other Object storage.
   */
  getAccelerateEndPointIfSet(bucketName, objectName) {
    if (!isEmpty(this.s3AccelerateEndpoint) && !isEmpty(bucketName) && !isEmpty(objectName)) {
      if (bucketName.includes(".")) {
        throw new Error(`Transfer Acceleration is not supported for non compliant bucket:${bucketName}`);
      }
      return this.s3AccelerateEndpoint;
    }
    return false;
  }
  /**
   *   Set application specific information.
   *   Generates User-Agent in the following style.
   *   MinIO (OS; ARCH) LIB/VER APP/VER
   */
  setAppInfo(appName, appVersion) {
    if (!isString(appName)) {
      throw new TypeError(`Invalid appName: ${appName}`);
    }
    if (appName.trim() === "") {
      throw new InvalidArgumentError("Input appName cannot be empty.");
    }
    if (!isString(appVersion)) {
      throw new TypeError(`Invalid appVersion: ${appVersion}`);
    }
    if (appVersion.trim() === "") {
      throw new InvalidArgumentError("Input appVersion cannot be empty.");
    }
    this.userAgent = `${this.userAgent} ${appName}/${appVersion}`;
  }
  /**
   * returns options object that can be used with http.request()
   * Takes care of constructing virtual-host-style or path-style hostname
   */
  getRequestOptions(opts) {
    const method = opts.method;
    const region = opts.region;
    const bucketName = opts.bucketName;
    let objectName = opts.objectName;
    const headers = opts.headers;
    const query = opts.query;
    let reqOptions = {
      method,
      headers: {},
      protocol: this.protocol,
      // If custom transportAgent was supplied earlier, we'll inject it here
      agent: this.transportAgent
    };
    let virtualHostStyle;
    if (bucketName) {
      virtualHostStyle = isVirtualHostStyle(this.host, this.protocol, bucketName, this.pathStyle);
    }
    let path2 = "/";
    let host = this.host;
    let port;
    if (this.port) {
      port = this.port;
    }
    if (objectName) {
      objectName = uriResourceEscape(objectName);
    }
    if (isAmazonEndpoint(host)) {
      const accelerateEndPoint = this.getAccelerateEndPointIfSet(bucketName, objectName);
      if (accelerateEndPoint) {
        host = `${accelerateEndPoint}`;
      } else {
        host = getS3Endpoint(region);
      }
    }
    if (virtualHostStyle && !opts.pathStyle) {
      if (bucketName) {
        host = `${bucketName}.${host}`;
      }
      if (objectName) {
        path2 = `/${objectName}`;
      }
    } else {
      if (bucketName) {
        path2 = `/${bucketName}`;
      }
      if (objectName) {
        path2 = `/${bucketName}/${objectName}`;
      }
    }
    if (query) {
      path2 += `?${query}`;
    }
    reqOptions.headers.host = host;
    if (reqOptions.protocol === "http:" && port !== 80 || reqOptions.protocol === "https:" && port !== 443) {
      reqOptions.headers.host = joinHostPort(host, port);
    }
    reqOptions.headers["user-agent"] = this.userAgent;
    if (headers) {
      for (const [k, v] of Object.entries(headers)) {
        reqOptions.headers[k.toLowerCase()] = v;
      }
    }
    reqOptions = Object.assign({}, this.reqOptions, reqOptions);
    return {
      ...reqOptions,
      headers: _.mapValues(_.pickBy(reqOptions.headers, isDefined), (v) => v.toString()),
      host,
      port,
      path: path2
    };
  }
  async setCredentialsProvider(credentialsProvider) {
    if (!(credentialsProvider instanceof CredentialProvider)) {
      throw new Error("Unable to get credentials. Expected instance of CredentialProvider");
    }
    this.credentialsProvider = credentialsProvider;
    await this.checkAndRefreshCreds();
  }
  async checkAndRefreshCreds() {
    if (this.credentialsProvider) {
      try {
        const credentialsConf = await this.credentialsProvider.getCredentials();
        this.accessKey = credentialsConf.getAccessKey();
        this.secretKey = credentialsConf.getSecretKey();
        this.sessionToken = credentialsConf.getSessionToken();
      } catch (e) {
        throw new Error(`Unable to get credentials: ${e}`, {
          cause: e
        });
      }
    }
  }
  /**
   * log the request, response, error
   */
  logHTTP(reqOptions, response, err) {
    if (!this.logStream) {
      return;
    }
    if (!isObject(reqOptions)) {
      throw new TypeError('reqOptions should be of type "object"');
    }
    if (response && !isReadableStream(response)) {
      throw new TypeError('response should be of type "Stream"');
    }
    if (err && !(err instanceof Error)) {
      throw new TypeError('err should be of type "Error"');
    }
    const logStream = this.logStream;
    const logHeaders = (headers) => {
      Object.entries(headers).forEach(([k, v]) => {
        if (k == "authorization") {
          if (isString(v)) {
            const redactor = new RegExp("Signature=([0-9a-f]+)");
            v = v.replace(redactor, "Signature=**REDACTED**");
          }
        }
        logStream.write(`${k}: ${v}
`);
      });
      logStream.write("\n");
    };
    logStream.write(`REQUEST: ${reqOptions.method} ${reqOptions.path}
`);
    logHeaders(reqOptions.headers);
    if (response) {
      this.logStream.write(`RESPONSE: ${response.statusCode}
`);
      logHeaders(response.headers);
    }
    if (err) {
      logStream.write("ERROR BODY:\n");
      const errJSON = JSON.stringify(err, null, "	");
      logStream.write(`${errJSON}
`);
    }
  }
  /**
   * Enable tracing
   */
  traceOn(stream2) {
    if (!stream2) {
      stream2 = process.stdout;
    }
    this.logStream = stream2;
  }
  /**
   * Disable tracing
   */
  traceOff() {
    this.logStream = void 0;
  }
  /**
   * makeRequest is the primitive used by the apis for making S3 requests.
   * payload can be empty string in case of no payload.
   * statusCode is the expected statusCode. If response.statusCode does not match
   * we parse the XML error and call the callback with the error message.
   *
   * A valid region is passed by the calls - listBuckets, makeBucket and getBucketRegion.
   *
   * @internal
   */
  async makeRequestAsync(options, payload = "", expectedCodes = [200], region = "") {
    if (!isObject(options)) {
      throw new TypeError('options should be of type "object"');
    }
    if (!isString(payload) && !isObject(payload)) {
      throw new TypeError('payload should be of type "string" or "Buffer"');
    }
    expectedCodes.forEach((statusCode) => {
      if (!isNumber(statusCode)) {
        throw new TypeError('statusCode should be of type "number"');
      }
    });
    if (!isString(region)) {
      throw new TypeError('region should be of type "string"');
    }
    if (!options.headers) {
      options.headers = {};
    }
    if (options.method === "POST" || options.method === "PUT" || options.method === "DELETE") {
      options.headers["content-length"] = payload.length.toString();
    }
    const sha256sum = this.enableSHA256 ? toSha256(payload) : "";
    return this.makeRequestStreamAsync(options, payload, sha256sum, expectedCodes, region);
  }
  /**
   * new request with promise
   *
   * No need to drain response, response body is not valid
   */
  async makeRequestAsyncOmit(options, payload = "", statusCodes = [200], region = "") {
    const res = await this.makeRequestAsync(options, payload, statusCodes, region);
    await drainResponse(res);
    return res;
  }
  /**
   * makeRequestStream will be used directly instead of makeRequest in case the payload
   * is available as a stream. for ex. putObject
   *
   * @internal
   */
  async makeRequestStreamAsync(options, body, sha256sum, statusCodes, region) {
    if (!isObject(options)) {
      throw new TypeError('options should be of type "object"');
    }
    if (!(Buffer.isBuffer(body) || typeof body === "string" || isReadableStream(body))) {
      throw new InvalidArgumentError(`stream should be a Buffer, string or readable Stream, got ${typeof body} instead`);
    }
    if (!isString(sha256sum)) {
      throw new TypeError('sha256sum should be of type "string"');
    }
    statusCodes.forEach((statusCode) => {
      if (!isNumber(statusCode)) {
        throw new TypeError('statusCode should be of type "number"');
      }
    });
    if (!isString(region)) {
      throw new TypeError('region should be of type "string"');
    }
    if (!this.enableSHA256 && sha256sum.length !== 0) {
      throw new InvalidArgumentError(`sha256sum expected to be empty for anonymous or https requests`);
    }
    if (this.enableSHA256 && sha256sum.length !== 64) {
      throw new InvalidArgumentError(`Invalid sha256sum : ${sha256sum}`);
    }
    await this.checkAndRefreshCreds();
    region = region || await this.getBucketRegionAsync(options.bucketName);
    const reqOptions = this.getRequestOptions({
      ...options,
      region
    });
    if (!this.anonymous) {
      if (!this.enableSHA256) {
        sha256sum = "UNSIGNED-PAYLOAD";
      }
      const date = /* @__PURE__ */ new Date();
      reqOptions.headers["x-amz-date"] = makeDateLong(date);
      reqOptions.headers["x-amz-content-sha256"] = sha256sum;
      if (this.sessionToken) {
        reqOptions.headers["x-amz-security-token"] = this.sessionToken;
      }
      reqOptions.headers.authorization = signV4(reqOptions, this.accessKey, this.secretKey, region, date, sha256sum);
    }
    const response = await requestWithRetry(this.transport, reqOptions, body);
    if (!response.statusCode) {
      throw new Error("BUG: response doesn't have a statusCode");
    }
    if (!statusCodes.includes(response.statusCode)) {
      delete this.regionMap[options.bucketName];
      const err = await parseResponseError(response);
      this.logHTTP(reqOptions, response, err);
      throw err;
    }
    this.logHTTP(reqOptions, response);
    return response;
  }
  /**
   * gets the region of the bucket
   *
   * @param bucketName
   *
   */
  async getBucketRegionAsync(bucketName) {
    if (!isValidBucketName(bucketName)) {
      throw new InvalidBucketNameError(`Invalid bucket name : ${bucketName}`);
    }
    if (this.region) {
      return this.region;
    }
    const cached = this.regionMap[bucketName];
    if (cached) {
      return cached;
    }
    const extractRegionAsync = async (response) => {
      const body = await readAsString(response);
      const region2 = parseBucketRegion(body) || DEFAULT_REGION;
      this.regionMap[bucketName] = region2;
      return region2;
    };
    const method = "GET";
    const query = "location";
    const pathStyle = this.pathStyle && !libExports.isBrowser;
    let region;
    try {
      const res2 = await this.makeRequestAsync({
        method,
        bucketName,
        query,
        pathStyle
      }, "", [200], DEFAULT_REGION);
      return extractRegionAsync(res2);
    } catch (e) {
      if (e instanceof S3Error) {
        const errCode = e.code;
        const errRegion = e.region;
        if (errCode === "AccessDenied" && !errRegion) {
          return DEFAULT_REGION;
        }
      }
      if (!(e.name === "AuthorizationHeaderMalformed")) {
        throw e;
      }
      region = e.Region;
      if (!region) {
        throw e;
      }
    }
    const res = await this.makeRequestAsync({
      method,
      bucketName,
      query,
      pathStyle
    }, "", [200], region);
    return await extractRegionAsync(res);
  }
  /**
   * makeRequest is the primitive used by the apis for making S3 requests.
   * payload can be empty string in case of no payload.
   * statusCode is the expected statusCode. If response.statusCode does not match
   * we parse the XML error and call the callback with the error message.
   * A valid region is passed by the calls - listBuckets, makeBucket and
   * getBucketRegion.
   *
   * @deprecated use `makeRequestAsync` instead
   */
  makeRequest(options, payload = "", expectedCodes = [200], region = "", returnResponse, cb) {
    let prom;
    if (returnResponse) {
      prom = this.makeRequestAsync(options, payload, expectedCodes, region);
    } else {
      prom = this.makeRequestAsyncOmit(options, payload, expectedCodes, region);
    }
    prom.then((result) => cb(null, result), (err) => {
      cb(err);
    });
  }
  /**
   * makeRequestStream will be used directly instead of makeRequest in case the payload
   * is available as a stream. for ex. putObject
   *
   * @deprecated use `makeRequestStreamAsync` instead
   */
  makeRequestStream(options, stream2, sha256sum, statusCodes, region, returnResponse, cb) {
    const executor = async () => {
      const res = await this.makeRequestStreamAsync(options, stream2, sha256sum, statusCodes, region);
      if (!returnResponse) {
        await drainResponse(res);
      }
      return res;
    };
    executor().then(
      (result) => cb(null, result),
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      (err) => cb(err)
    );
  }
  /**
   * @deprecated use `getBucketRegionAsync` instead
   */
  getBucketRegion(bucketName, cb) {
    return this.getBucketRegionAsync(bucketName).then(
      (result) => cb(null, result),
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      (err) => cb(err)
    );
  }
  // Bucket operations
  /**
   * Creates the bucket `bucketName`.
   *
   */
  async makeBucket(bucketName, region = "", makeOpts) {
    if (!isValidBucketName(bucketName)) {
      throw new InvalidBucketNameError("Invalid bucket name: " + bucketName);
    }
    if (isObject(region)) {
      makeOpts = region;
      region = "";
    }
    if (!isString(region)) {
      throw new TypeError('region should be of type "string"');
    }
    if (makeOpts && !isObject(makeOpts)) {
      throw new TypeError('makeOpts should be of type "object"');
    }
    let payload = "";
    if (region && this.region) {
      if (region !== this.region) {
        throw new InvalidArgumentError(`Configured region ${this.region}, requested ${region}`);
      }
    }
    if (region && region !== DEFAULT_REGION) {
      payload = xml.buildObject({
        CreateBucketConfiguration: {
          $: {
            xmlns: "http://s3.amazonaws.com/doc/2006-03-01/"
          },
          LocationConstraint: region
        }
      });
    }
    const method = "PUT";
    const headers = {};
    if (makeOpts && makeOpts.ObjectLocking) {
      headers["x-amz-bucket-object-lock-enabled"] = true;
    }
    const finalRegion = this.region || region || DEFAULT_REGION;
    const requestOpt = {
      method,
      bucketName,
      headers
    };
    try {
      await this.makeRequestAsyncOmit(requestOpt, payload, [200], finalRegion);
    } catch (err) {
      if (region === "" || region === DEFAULT_REGION) {
        if (err instanceof S3Error) {
          const errCode = err.code;
          const errRegion = err.region;
          if (errCode === "AuthorizationHeaderMalformed" && errRegion !== "") {
            await this.makeRequestAsyncOmit(requestOpt, payload, [200], errCode);
          }
        }
      }
      throw err;
    }
  }
  /**
   * To check if a bucket already exists.
   */
  async bucketExists(bucketName) {
    if (!isValidBucketName(bucketName)) {
      throw new InvalidBucketNameError("Invalid bucket name: " + bucketName);
    }
    const method = "HEAD";
    try {
      await this.makeRequestAsyncOmit({
        method,
        bucketName
      });
    } catch (err) {
      if (err.code === "NoSuchBucket" || err.code === "NotFound") {
        return false;
      }
      throw err;
    }
    return true;
  }
  /**
   * @deprecated use promise style API
   */
  async removeBucket(bucketName) {
    if (!isValidBucketName(bucketName)) {
      throw new InvalidBucketNameError("Invalid bucket name: " + bucketName);
    }
    const method = "DELETE";
    await this.makeRequestAsyncOmit({
      method,
      bucketName
    }, "", [204]);
    delete this.regionMap[bucketName];
  }
  /**
   * Callback is called with readable stream of the object content.
   */
  async getObject(bucketName, objectName, getOpts) {
    if (!isValidBucketName(bucketName)) {
      throw new InvalidBucketNameError("Invalid bucket name: " + bucketName);
    }
    if (!isValidObjectName(objectName)) {
      throw new InvalidObjectNameError(`Invalid object name: ${objectName}`);
    }
    return this.getPartialObject(bucketName, objectName, 0, 0, getOpts);
  }
  /**
   * Callback is called with readable stream of the partial object content.
   * @param bucketName
   * @param objectName
   * @param offset
   * @param length - length of the object that will be read in the stream (optional, if not specified we read the rest of the file from the offset)
   * @param getOpts
   */
  async getPartialObject(bucketName, objectName, offset, length = 0, getOpts) {
    if (!isValidBucketName(bucketName)) {
      throw new InvalidBucketNameError("Invalid bucket name: " + bucketName);
    }
    if (!isValidObjectName(objectName)) {
      throw new InvalidObjectNameError(`Invalid object name: ${objectName}`);
    }
    if (!isNumber(offset)) {
      throw new TypeError('offset should be of type "number"');
    }
    if (!isNumber(length)) {
      throw new TypeError('length should be of type "number"');
    }
    let range = "";
    if (offset || length) {
      if (offset) {
        range = `bytes=${+offset}-`;
      } else {
        range = "bytes=0-";
        offset = 0;
      }
      if (length) {
        range += `${+length + offset - 1}`;
      }
    }
    let query = "";
    let headers = {
      ...range !== "" && {
        range
      }
    };
    if (getOpts) {
      const sseHeaders = {
        ...getOpts.SSECustomerAlgorithm && {
          "X-Amz-Server-Side-Encryption-Customer-Algorithm": getOpts.SSECustomerAlgorithm
        },
        ...getOpts.SSECustomerKey && {
          "X-Amz-Server-Side-Encryption-Customer-Key": getOpts.SSECustomerKey
        },
        ...getOpts.SSECustomerKeyMD5 && {
          "X-Amz-Server-Side-Encryption-Customer-Key-MD5": getOpts.SSECustomerKeyMD5
        }
      };
      query = queryStringExports.stringify(getOpts);
      headers = {
        ...prependXAMZMeta(sseHeaders),
        ...headers
      };
    }
    const expectedStatusCodes = [200];
    if (range) {
      expectedStatusCodes.push(206);
    }
    const method = "GET";
    return await this.makeRequestAsync({
      method,
      bucketName,
      objectName,
      headers,
      query
    }, "", expectedStatusCodes);
  }
  /**
   * download object content to a file.
   * This method will create a temp file named `${filename}.${base64(etag)}.part.minio` when downloading.
   *
   * @param bucketName - name of the bucket
   * @param objectName - name of the object
   * @param filePath - path to which the object data will be written to
   * @param getOpts - Optional object get option
   */
  async fGetObject(bucketName, objectName, filePath, getOpts) {
    if (!isValidBucketName(bucketName)) {
      throw new InvalidBucketNameError("Invalid bucket name: " + bucketName);
    }
    if (!isValidObjectName(objectName)) {
      throw new InvalidObjectNameError(`Invalid object name: ${objectName}`);
    }
    if (!isString(filePath)) {
      throw new TypeError('filePath should be of type "string"');
    }
    const downloadToTmpFile = async () => {
      let partFileStream;
      const objStat = await this.statObject(bucketName, objectName, getOpts);
      const encodedEtag = Buffer.from(objStat.etag).toString("base64");
      const partFile2 = `${filePath}.${encodedEtag}.part.minio`;
      await promises.mkdir(path.dirname(filePath), {
        recursive: true
      });
      let offset = 0;
      try {
        const stats2 = await promises.stat(partFile2);
        if (objStat.size === stats2.size) {
          return partFile2;
        }
        offset = stats2.size;
        partFileStream = fs.createWriteStream(partFile2, {
          flags: "a"
        });
      } catch (e) {
        if (e instanceof Error && e.code === "ENOENT") {
          partFileStream = fs.createWriteStream(partFile2, {
            flags: "w"
          });
        } else {
          throw e;
        }
      }
      const downloadStream = await this.getPartialObject(bucketName, objectName, offset, 0, getOpts);
      await streamPromise.pipeline(downloadStream, partFileStream);
      const stats = await promises.stat(partFile2);
      if (stats.size === objStat.size) {
        return partFile2;
      }
      throw new Error("Size mismatch between downloaded file and the object");
    };
    const partFile = await downloadToTmpFile();
    await promises.rename(partFile, filePath);
  }
  /**
   * Stat information of the object.
   */
  async statObject(bucketName, objectName, statOpts) {
    const statOptDef = statOpts || {};
    if (!isValidBucketName(bucketName)) {
      throw new InvalidBucketNameError("Invalid bucket name: " + bucketName);
    }
    if (!isValidObjectName(objectName)) {
      throw new InvalidObjectNameError(`Invalid object name: ${objectName}`);
    }
    if (!isObject(statOptDef)) {
      throw new InvalidArgumentError('statOpts should be of type "object"');
    }
    const query = queryStringExports.stringify(statOptDef);
    const method = "HEAD";
    const res = await this.makeRequestAsyncOmit({
      method,
      bucketName,
      objectName,
      query
    });
    return {
      size: parseInt(res.headers["content-length"]),
      metaData: extractMetadata(res.headers),
      lastModified: new Date(res.headers["last-modified"]),
      versionId: getVersionId(res.headers),
      etag: sanitizeETag(res.headers.etag)
    };
  }
  async removeObject(bucketName, objectName, removeOpts) {
    if (!isValidBucketName(bucketName)) {
      throw new InvalidBucketNameError(`Invalid bucket name: ${bucketName}`);
    }
    if (!isValidObjectName(objectName)) {
      throw new InvalidObjectNameError(`Invalid object name: ${objectName}`);
    }
    if (removeOpts && !isObject(removeOpts)) {
      throw new InvalidArgumentError('removeOpts should be of type "object"');
    }
    const method = "DELETE";
    const headers = {};
    if (removeOpts !== null && removeOpts !== void 0 && removeOpts.governanceBypass) {
      headers["X-Amz-Bypass-Governance-Retention"] = true;
    }
    if (removeOpts !== null && removeOpts !== void 0 && removeOpts.forceDelete) {
      headers["x-minio-force-delete"] = true;
    }
    const queryParams = {};
    if (removeOpts !== null && removeOpts !== void 0 && removeOpts.versionId) {
      queryParams.versionId = `${removeOpts.versionId}`;
    }
    const query = queryStringExports.stringify(queryParams);
    await this.makeRequestAsyncOmit({
      method,
      bucketName,
      objectName,
      headers,
      query
    }, "", [200, 204]);
  }
  // Calls implemented below are related to multipart.
  listIncompleteUploads(bucket, prefix, recursive) {
    if (prefix === void 0) {
      prefix = "";
    }
    if (recursive === void 0) {
      recursive = false;
    }
    if (!isValidBucketName(bucket)) {
      throw new InvalidBucketNameError("Invalid bucket name: " + bucket);
    }
    if (!isValidPrefix(prefix)) {
      throw new InvalidPrefixError(`Invalid prefix : ${prefix}`);
    }
    if (!isBoolean(recursive)) {
      throw new TypeError('recursive should be of type "boolean"');
    }
    const delimiter = recursive ? "" : "/";
    let keyMarker = "";
    let uploadIdMarker = "";
    const uploads = [];
    let ended = false;
    const readStream = new stream$1.Readable({
      objectMode: true
    });
    readStream._read = () => {
      if (uploads.length) {
        return readStream.push(uploads.shift());
      }
      if (ended) {
        return readStream.push(null);
      }
      this.listIncompleteUploadsQuery(bucket, prefix, keyMarker, uploadIdMarker, delimiter).then((result) => {
        result.prefixes.forEach((prefix2) => uploads.push(prefix2));
        eachSeries$1(result.uploads, (upload, cb) => {
          this.listParts(bucket, upload.key, upload.uploadId).then((parts) => {
            upload.size = parts.reduce((acc, item) => acc + item.size, 0);
            uploads.push(upload);
            cb();
          }, (err) => cb(err));
        }, (err) => {
          if (err) {
            readStream.emit("error", err);
            return;
          }
          if (result.isTruncated) {
            keyMarker = result.nextKeyMarker;
            uploadIdMarker = result.nextUploadIdMarker;
          } else {
            ended = true;
          }
          readStream._read();
        });
      }, (e) => {
        readStream.emit("error", e);
      });
    };
    return readStream;
  }
  /**
   * Called by listIncompleteUploads to fetch a batch of incomplete uploads.
   */
  async listIncompleteUploadsQuery(bucketName, prefix, keyMarker, uploadIdMarker, delimiter) {
    if (!isValidBucketName(bucketName)) {
      throw new InvalidBucketNameError("Invalid bucket name: " + bucketName);
    }
    if (!isString(prefix)) {
      throw new TypeError('prefix should be of type "string"');
    }
    if (!isString(keyMarker)) {
      throw new TypeError('keyMarker should be of type "string"');
    }
    if (!isString(uploadIdMarker)) {
      throw new TypeError('uploadIdMarker should be of type "string"');
    }
    if (!isString(delimiter)) {
      throw new TypeError('delimiter should be of type "string"');
    }
    const queries = [];
    queries.push(`prefix=${uriEscape(prefix)}`);
    queries.push(`delimiter=${uriEscape(delimiter)}`);
    if (keyMarker) {
      queries.push(`key-marker=${uriEscape(keyMarker)}`);
    }
    if (uploadIdMarker) {
      queries.push(`upload-id-marker=${uploadIdMarker}`);
    }
    const maxUploads = 1e3;
    queries.push(`max-uploads=${maxUploads}`);
    queries.sort();
    queries.unshift("uploads");
    let query = "";
    if (queries.length > 0) {
      query = `${queries.join("&")}`;
    }
    const method = "GET";
    const res = await this.makeRequestAsync({
      method,
      bucketName,
      query
    });
    const body = await readAsString(res);
    return parseListMultipart(body);
  }
  /**
   * Initiate a new multipart upload.
   * @internal
   */
  async initiateNewMultipartUpload(bucketName, objectName, headers) {
    if (!isValidBucketName(bucketName)) {
      throw new InvalidBucketNameError("Invalid bucket name: " + bucketName);
    }
    if (!isValidObjectName(objectName)) {
      throw new InvalidObjectNameError(`Invalid object name: ${objectName}`);
    }
    if (!isObject(headers)) {
      throw new InvalidObjectNameError('contentType should be of type "object"');
    }
    const method = "POST";
    const query = "uploads";
    const res = await this.makeRequestAsync({
      method,
      bucketName,
      objectName,
      query,
      headers
    });
    const body = await readAsBuffer(res);
    return parseInitiateMultipart(body.toString());
  }
  /**
   * Internal Method to abort a multipart upload request in case of any errors.
   *
   * @param bucketName - Bucket Name
   * @param objectName - Object Name
   * @param uploadId - id of a multipart upload to cancel during compose object sequence.
   */
  async abortMultipartUpload(bucketName, objectName, uploadId) {
    const method = "DELETE";
    const query = `uploadId=${uploadId}`;
    const requestOptions = {
      method,
      bucketName,
      objectName,
      query
    };
    await this.makeRequestAsyncOmit(requestOptions, "", [204]);
  }
  async findUploadId(bucketName, objectName) {
    var _latestUpload;
    if (!isValidBucketName(bucketName)) {
      throw new InvalidBucketNameError("Invalid bucket name: " + bucketName);
    }
    if (!isValidObjectName(objectName)) {
      throw new InvalidObjectNameError(`Invalid object name: ${objectName}`);
    }
    let latestUpload;
    let keyMarker = "";
    let uploadIdMarker = "";
    for (; ; ) {
      const result = await this.listIncompleteUploadsQuery(bucketName, objectName, keyMarker, uploadIdMarker, "");
      for (const upload of result.uploads) {
        if (upload.key === objectName) {
          if (!latestUpload || upload.initiated.getTime() > latestUpload.initiated.getTime()) {
            latestUpload = upload;
          }
        }
      }
      if (result.isTruncated) {
        keyMarker = result.nextKeyMarker;
        uploadIdMarker = result.nextUploadIdMarker;
        continue;
      }
      break;
    }
    return (_latestUpload = latestUpload) === null || _latestUpload === void 0 ? void 0 : _latestUpload.uploadId;
  }
  /**
   * this call will aggregate the parts on the server into a single object.
   */
  async completeMultipartUpload(bucketName, objectName, uploadId, etags) {
    if (!isValidBucketName(bucketName)) {
      throw new InvalidBucketNameError("Invalid bucket name: " + bucketName);
    }
    if (!isValidObjectName(objectName)) {
      throw new InvalidObjectNameError(`Invalid object name: ${objectName}`);
    }
    if (!isString(uploadId)) {
      throw new TypeError('uploadId should be of type "string"');
    }
    if (!isObject(etags)) {
      throw new TypeError('etags should be of type "Array"');
    }
    if (!uploadId) {
      throw new InvalidArgumentError("uploadId cannot be empty");
    }
    const method = "POST";
    const query = `uploadId=${uriEscape(uploadId)}`;
    const builder2 = new xml2js.Builder();
    const payload = builder2.buildObject({
      CompleteMultipartUpload: {
        $: {
          xmlns: "http://s3.amazonaws.com/doc/2006-03-01/"
        },
        Part: etags.map((etag) => {
          return {
            PartNumber: etag.part,
            ETag: etag.etag
          };
        })
      }
    });
    const res = await this.makeRequestAsync({
      method,
      bucketName,
      objectName,
      query
    }, payload);
    const body = await readAsBuffer(res);
    const result = parseCompleteMultipart(body.toString());
    if (!result) {
      throw new Error("BUG: failed to parse server response");
    }
    if (result.errCode) {
      throw new S3Error(result.errMessage);
    }
    return {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      etag: result.etag,
      versionId: getVersionId(res.headers)
    };
  }
  /**
   * Get part-info of all parts of an incomplete upload specified by uploadId.
   */
  async listParts(bucketName, objectName, uploadId) {
    if (!isValidBucketName(bucketName)) {
      throw new InvalidBucketNameError("Invalid bucket name: " + bucketName);
    }
    if (!isValidObjectName(objectName)) {
      throw new InvalidObjectNameError(`Invalid object name: ${objectName}`);
    }
    if (!isString(uploadId)) {
      throw new TypeError('uploadId should be of type "string"');
    }
    if (!uploadId) {
      throw new InvalidArgumentError("uploadId cannot be empty");
    }
    const parts = [];
    let marker = 0;
    let result;
    do {
      result = await this.listPartsQuery(bucketName, objectName, uploadId, marker);
      marker = result.marker;
      parts.push(...result.parts);
    } while (result.isTruncated);
    return parts;
  }
  /**
   * Called by listParts to fetch a batch of part-info
   */
  async listPartsQuery(bucketName, objectName, uploadId, marker) {
    if (!isValidBucketName(bucketName)) {
      throw new InvalidBucketNameError("Invalid bucket name: " + bucketName);
    }
    if (!isValidObjectName(objectName)) {
      throw new InvalidObjectNameError(`Invalid object name: ${objectName}`);
    }
    if (!isString(uploadId)) {
      throw new TypeError('uploadId should be of type "string"');
    }
    if (!isNumber(marker)) {
      throw new TypeError('marker should be of type "number"');
    }
    if (!uploadId) {
      throw new InvalidArgumentError("uploadId cannot be empty");
    }
    let query = `uploadId=${uriEscape(uploadId)}`;
    if (marker) {
      query += `&part-number-marker=${marker}`;
    }
    const method = "GET";
    const res = await this.makeRequestAsync({
      method,
      bucketName,
      objectName,
      query
    });
    return parseListParts(await readAsString(res));
  }
  async listBuckets() {
    const method = "GET";
    const regionConf = this.region || DEFAULT_REGION;
    const httpRes = await this.makeRequestAsync({
      method
    }, "", [200], regionConf);
    const xmlResult = await readAsString(httpRes);
    return parseListBucket(xmlResult);
  }
  /**
   * Calculate part size given the object size. Part size will be atleast this.partSize
   */
  calculatePartSize(size) {
    if (!isNumber(size)) {
      throw new TypeError('size should be of type "number"');
    }
    if (size > this.maxObjectSize) {
      throw new TypeError(`size should not be more than ${this.maxObjectSize}`);
    }
    if (this.overRidePartSize) {
      return this.partSize;
    }
    let partSize = this.partSize;
    for (; ; ) {
      if (partSize * 1e4 > size) {
        return partSize;
      }
      partSize += 16 * 1024 * 1024;
    }
  }
  /**
   * Uploads the object using contents from a file
   */
  async fPutObject(bucketName, objectName, filePath, metaData) {
    if (!isValidBucketName(bucketName)) {
      throw new InvalidBucketNameError("Invalid bucket name: " + bucketName);
    }
    if (!isValidObjectName(objectName)) {
      throw new InvalidObjectNameError(`Invalid object name: ${objectName}`);
    }
    if (!isString(filePath)) {
      throw new TypeError('filePath should be of type "string"');
    }
    if (metaData && !isObject(metaData)) {
      throw new TypeError('metaData should be of type "object"');
    }
    metaData = insertContentType(metaData || {}, filePath);
    const stat = await promises.stat(filePath);
    return await this.putObject(bucketName, objectName, fs.createReadStream(filePath), stat.size, metaData);
  }
  /**
   *  Uploading a stream, "Buffer" or "string".
   *  It's recommended to pass `size` argument with stream.
   */
  async putObject(bucketName, objectName, stream2, size, metaData) {
    if (!isValidBucketName(bucketName)) {
      throw new InvalidBucketNameError(`Invalid bucket name: ${bucketName}`);
    }
    if (!isValidObjectName(objectName)) {
      throw new InvalidObjectNameError(`Invalid object name: ${objectName}`);
    }
    if (isObject(size)) {
      metaData = size;
    }
    const headers = prependXAMZMeta(metaData);
    if (typeof stream2 === "string" || stream2 instanceof Buffer) {
      size = stream2.length;
      stream2 = readableStream(stream2);
    } else if (!isReadableStream(stream2)) {
      throw new TypeError('third argument should be of type "stream.Readable" or "Buffer" or "string"');
    }
    if (isNumber(size) && size < 0) {
      throw new InvalidArgumentError(`size cannot be negative, given size: ${size}`);
    }
    if (!isNumber(size)) {
      size = this.maxObjectSize;
    }
    if (size === void 0) {
      const statSize = await getContentLength(stream2);
      if (statSize !== null) {
        size = statSize;
      }
    }
    if (!isNumber(size)) {
      size = this.maxObjectSize;
    }
    if (size === 0) {
      return this.uploadBuffer(bucketName, objectName, headers, Buffer.from(""));
    }
    const partSize = this.calculatePartSize(size);
    if (typeof stream2 === "string" || Buffer.isBuffer(stream2) || size <= partSize) {
      const buf = isReadableStream(stream2) ? await readAsBuffer(stream2) : Buffer.from(stream2);
      return this.uploadBuffer(bucketName, objectName, headers, buf);
    }
    return this.uploadStream(bucketName, objectName, headers, stream2, partSize);
  }
  /**
   * method to upload buffer in one call
   * @private
   */
  async uploadBuffer(bucketName, objectName, headers, buf) {
    const {
      md5sum,
      sha256sum
    } = hashBinary(buf, this.enableSHA256);
    headers["Content-Length"] = buf.length;
    if (!this.enableSHA256) {
      headers["Content-MD5"] = md5sum;
    }
    const res = await this.makeRequestStreamAsync({
      method: "PUT",
      bucketName,
      objectName,
      headers
    }, buf, sha256sum, [200], "");
    await drainResponse(res);
    return {
      etag: sanitizeETag(res.headers.etag),
      versionId: getVersionId(res.headers)
    };
  }
  /**
   * upload stream with MultipartUpload
   * @private
   */
  async uploadStream(bucketName, objectName, headers, body, partSize) {
    const oldParts = {};
    const eTags = [];
    const previousUploadId = await this.findUploadId(bucketName, objectName);
    let uploadId;
    if (!previousUploadId) {
      uploadId = await this.initiateNewMultipartUpload(bucketName, objectName, headers);
    } else {
      uploadId = previousUploadId;
      const oldTags = await this.listParts(bucketName, objectName, previousUploadId);
      oldTags.forEach((e) => {
        oldParts[e.part] = e;
      });
    }
    const chunkier = new BlockStream2({
      size: partSize,
      zeroPadding: false
    });
    const [_2, o] = await Promise.all([new Promise((resolve, reject2) => {
      body.pipe(chunkier).on("error", reject2);
      chunkier.on("end", resolve).on("error", reject2);
    }), (async () => {
      let partNumber = 1;
      for await (const chunk of chunkier) {
        const md5 = crypto.createHash("md5").update(chunk).digest();
        const oldPart = oldParts[partNumber];
        if (oldPart) {
          if (oldPart.etag === md5.toString("hex")) {
            eTags.push({
              part: partNumber,
              etag: oldPart.etag
            });
            partNumber++;
            continue;
          }
        }
        partNumber++;
        const options = {
          method: "PUT",
          query: queryStringExports.stringify({
            partNumber,
            uploadId
          }),
          headers: {
            "Content-Length": chunk.length,
            "Content-MD5": md5.toString("base64")
          },
          bucketName,
          objectName
        };
        const response = await this.makeRequestAsyncOmit(options, chunk);
        let etag = response.headers.etag;
        if (etag) {
          etag = etag.replace(/^"/, "").replace(/"$/, "");
        } else {
          etag = "";
        }
        eTags.push({
          part: partNumber,
          etag
        });
      }
      return await this.completeMultipartUpload(bucketName, objectName, uploadId, eTags);
    })()]);
    return o;
  }
  async removeBucketReplication(bucketName) {
    if (!isValidBucketName(bucketName)) {
      throw new InvalidBucketNameError("Invalid bucket name: " + bucketName);
    }
    const method = "DELETE";
    const query = "replication";
    await this.makeRequestAsyncOmit({
      method,
      bucketName,
      query
    }, "", [200, 204], "");
  }
  async setBucketReplication(bucketName, replicationConfig) {
    if (!isValidBucketName(bucketName)) {
      throw new InvalidBucketNameError("Invalid bucket name: " + bucketName);
    }
    if (!isObject(replicationConfig)) {
      throw new InvalidArgumentError('replicationConfig should be of type "object"');
    } else {
      if (_.isEmpty(replicationConfig.role)) {
        throw new InvalidArgumentError("Role cannot be empty");
      } else if (replicationConfig.role && !isString(replicationConfig.role)) {
        throw new InvalidArgumentError("Invalid value for role", replicationConfig.role);
      }
      if (_.isEmpty(replicationConfig.rules)) {
        throw new InvalidArgumentError("Minimum one replication rule must be specified");
      }
    }
    const method = "PUT";
    const query = "replication";
    const headers = {};
    const replicationParamsConfig = {
      ReplicationConfiguration: {
        Role: replicationConfig.role,
        Rule: replicationConfig.rules
      }
    };
    const builder2 = new xml2js.Builder({
      renderOpts: {
        pretty: false
      },
      headless: true
    });
    const payload = builder2.buildObject(replicationParamsConfig);
    headers["Content-MD5"] = toMd5(payload);
    await this.makeRequestAsyncOmit({
      method,
      bucketName,
      query,
      headers
    }, payload);
  }
  async getBucketReplication(bucketName) {
    if (!isValidBucketName(bucketName)) {
      throw new InvalidBucketNameError("Invalid bucket name: " + bucketName);
    }
    const method = "GET";
    const query = "replication";
    const httpRes = await this.makeRequestAsync({
      method,
      bucketName,
      query
    }, "", [200, 204]);
    const xmlResult = await readAsString(httpRes);
    return parseReplicationConfig(xmlResult);
  }
  async getObjectLegalHold(bucketName, objectName, getOpts) {
    if (!isValidBucketName(bucketName)) {
      throw new InvalidBucketNameError("Invalid bucket name: " + bucketName);
    }
    if (!isValidObjectName(objectName)) {
      throw new InvalidObjectNameError(`Invalid object name: ${objectName}`);
    }
    if (getOpts) {
      if (!isObject(getOpts)) {
        throw new TypeError('getOpts should be of type "Object"');
      } else if (Object.keys(getOpts).length > 0 && getOpts.versionId && !isString(getOpts.versionId)) {
        throw new TypeError("versionId should be of type string.:", getOpts.versionId);
      }
    }
    const method = "GET";
    let query = "legal-hold";
    if (getOpts !== null && getOpts !== void 0 && getOpts.versionId) {
      query += `&versionId=${getOpts.versionId}`;
    }
    const httpRes = await this.makeRequestAsync({
      method,
      bucketName,
      objectName,
      query
    }, "", [200]);
    const strRes = await readAsString(httpRes);
    return parseObjectLegalHoldConfig(strRes);
  }
  async setObjectLegalHold(bucketName, objectName, setOpts = {
    status: LEGAL_HOLD_STATUS.ENABLED
  }) {
    if (!isValidBucketName(bucketName)) {
      throw new InvalidBucketNameError("Invalid bucket name: " + bucketName);
    }
    if (!isValidObjectName(objectName)) {
      throw new InvalidObjectNameError(`Invalid object name: ${objectName}`);
    }
    if (!isObject(setOpts)) {
      throw new TypeError('setOpts should be of type "Object"');
    } else {
      if (![LEGAL_HOLD_STATUS.ENABLED, LEGAL_HOLD_STATUS.DISABLED].includes(setOpts === null || setOpts === void 0 ? void 0 : setOpts.status)) {
        throw new TypeError("Invalid status: " + setOpts.status);
      }
      if (setOpts.versionId && !setOpts.versionId.length) {
        throw new TypeError("versionId should be of type string.:" + setOpts.versionId);
      }
    }
    const method = "PUT";
    let query = "legal-hold";
    if (setOpts.versionId) {
      query += `&versionId=${setOpts.versionId}`;
    }
    const config = {
      Status: setOpts.status
    };
    const builder2 = new xml2js.Builder({
      rootName: "LegalHold",
      renderOpts: {
        pretty: false
      },
      headless: true
    });
    const payload = builder2.buildObject(config);
    const headers = {};
    headers["Content-MD5"] = toMd5(payload);
    await this.makeRequestAsyncOmit({
      method,
      bucketName,
      objectName,
      query,
      headers
    }, payload);
  }
  /**
   * Get Tags associated with a Bucket
   */
  async getBucketTagging(bucketName) {
    if (!isValidBucketName(bucketName)) {
      throw new InvalidBucketNameError(`Invalid bucket name: ${bucketName}`);
    }
    const method = "GET";
    const query = "tagging";
    const requestOptions = {
      method,
      bucketName,
      query
    };
    const response = await this.makeRequestAsync(requestOptions);
    const body = await readAsString(response);
    return parseTagging(body);
  }
  /**
   *  Get the tags associated with a bucket OR an object
   */
  async getObjectTagging(bucketName, objectName, getOpts) {
    const method = "GET";
    let query = "tagging";
    if (!isValidBucketName(bucketName)) {
      throw new InvalidBucketNameError("Invalid bucket name: " + bucketName);
    }
    if (!isValidObjectName(objectName)) {
      throw new InvalidBucketNameError("Invalid object name: " + objectName);
    }
    if (getOpts && !isObject(getOpts)) {
      throw new InvalidArgumentError('getOpts should be of type "object"');
    }
    if (getOpts && getOpts.versionId) {
      query = `${query}&versionId=${getOpts.versionId}`;
    }
    const requestOptions = {
      method,
      bucketName,
      query
    };
    if (objectName) {
      requestOptions["objectName"] = objectName;
    }
    const response = await this.makeRequestAsync(requestOptions);
    const body = await readAsString(response);
    return parseTagging(body);
  }
  /**
   *  Set the policy on a bucket or an object prefix.
   */
  async setBucketPolicy(bucketName, policy) {
    if (!isValidBucketName(bucketName)) {
      throw new InvalidBucketNameError(`Invalid bucket name: ${bucketName}`);
    }
    if (!isString(policy)) {
      throw new InvalidBucketPolicyError(`Invalid bucket policy: ${policy} - must be "string"`);
    }
    const query = "policy";
    let method = "DELETE";
    if (policy) {
      method = "PUT";
    }
    await this.makeRequestAsyncOmit({
      method,
      bucketName,
      query
    }, policy, [204], "");
  }
  /**
   * Get the policy on a bucket or an object prefix.
   */
  async getBucketPolicy(bucketName) {
    if (!isValidBucketName(bucketName)) {
      throw new InvalidBucketNameError(`Invalid bucket name: ${bucketName}`);
    }
    const method = "GET";
    const query = "policy";
    const res = await this.makeRequestAsync({
      method,
      bucketName,
      query
    });
    return await readAsString(res);
  }
  async putObjectRetention(bucketName, objectName, retentionOpts = {}) {
    if (!isValidBucketName(bucketName)) {
      throw new InvalidBucketNameError(`Invalid bucket name: ${bucketName}`);
    }
    if (!isValidObjectName(objectName)) {
      throw new InvalidObjectNameError(`Invalid object name: ${objectName}`);
    }
    if (!isObject(retentionOpts)) {
      throw new InvalidArgumentError('retentionOpts should be of type "object"');
    } else {
      if (retentionOpts.governanceBypass && !isBoolean(retentionOpts.governanceBypass)) {
        throw new InvalidArgumentError(`Invalid value for governanceBypass: ${retentionOpts.governanceBypass}`);
      }
      if (retentionOpts.mode && ![RETENTION_MODES.COMPLIANCE, RETENTION_MODES.GOVERNANCE].includes(retentionOpts.mode)) {
        throw new InvalidArgumentError(`Invalid object retention mode: ${retentionOpts.mode}`);
      }
      if (retentionOpts.retainUntilDate && !isString(retentionOpts.retainUntilDate)) {
        throw new InvalidArgumentError(`Invalid value for retainUntilDate: ${retentionOpts.retainUntilDate}`);
      }
      if (retentionOpts.versionId && !isString(retentionOpts.versionId)) {
        throw new InvalidArgumentError(`Invalid value for versionId: ${retentionOpts.versionId}`);
      }
    }
    const method = "PUT";
    let query = "retention";
    const headers = {};
    if (retentionOpts.governanceBypass) {
      headers["X-Amz-Bypass-Governance-Retention"] = true;
    }
    const builder2 = new xml2js.Builder({
      rootName: "Retention",
      renderOpts: {
        pretty: false
      },
      headless: true
    });
    const params = {};
    if (retentionOpts.mode) {
      params.Mode = retentionOpts.mode;
    }
    if (retentionOpts.retainUntilDate) {
      params.RetainUntilDate = retentionOpts.retainUntilDate;
    }
    if (retentionOpts.versionId) {
      query += `&versionId=${retentionOpts.versionId}`;
    }
    const payload = builder2.buildObject(params);
    headers["Content-MD5"] = toMd5(payload);
    await this.makeRequestAsyncOmit({
      method,
      bucketName,
      objectName,
      query,
      headers
    }, payload, [200, 204]);
  }
  async getObjectLockConfig(bucketName) {
    if (!isValidBucketName(bucketName)) {
      throw new InvalidBucketNameError("Invalid bucket name: " + bucketName);
    }
    const method = "GET";
    const query = "object-lock";
    const httpRes = await this.makeRequestAsync({
      method,
      bucketName,
      query
    });
    const xmlResult = await readAsString(httpRes);
    return parseObjectLockConfig(xmlResult);
  }
  async setObjectLockConfig(bucketName, lockConfigOpts) {
    const retentionModes = [RETENTION_MODES.COMPLIANCE, RETENTION_MODES.GOVERNANCE];
    const validUnits = [RETENTION_VALIDITY_UNITS.DAYS, RETENTION_VALIDITY_UNITS.YEARS];
    if (!isValidBucketName(bucketName)) {
      throw new InvalidBucketNameError("Invalid bucket name: " + bucketName);
    }
    if (lockConfigOpts.mode && !retentionModes.includes(lockConfigOpts.mode)) {
      throw new TypeError(`lockConfigOpts.mode should be one of ${retentionModes}`);
    }
    if (lockConfigOpts.unit && !validUnits.includes(lockConfigOpts.unit)) {
      throw new TypeError(`lockConfigOpts.unit should be one of ${validUnits}`);
    }
    if (lockConfigOpts.validity && !isNumber(lockConfigOpts.validity)) {
      throw new TypeError(`lockConfigOpts.validity should be a number`);
    }
    const method = "PUT";
    const query = "object-lock";
    const config = {
      ObjectLockEnabled: "Enabled"
    };
    const configKeys = Object.keys(lockConfigOpts);
    const isAllKeysSet = ["unit", "mode", "validity"].every((lck) => configKeys.includes(lck));
    if (configKeys.length > 0) {
      if (!isAllKeysSet) {
        throw new TypeError(`lockConfigOpts.mode,lockConfigOpts.unit,lockConfigOpts.validity all the properties should be specified.`);
      } else {
        config.Rule = {
          DefaultRetention: {}
        };
        if (lockConfigOpts.mode) {
          config.Rule.DefaultRetention.Mode = lockConfigOpts.mode;
        }
        if (lockConfigOpts.unit === RETENTION_VALIDITY_UNITS.DAYS) {
          config.Rule.DefaultRetention.Days = lockConfigOpts.validity;
        } else if (lockConfigOpts.unit === RETENTION_VALIDITY_UNITS.YEARS) {
          config.Rule.DefaultRetention.Years = lockConfigOpts.validity;
        }
      }
    }
    const builder2 = new xml2js.Builder({
      rootName: "ObjectLockConfiguration",
      renderOpts: {
        pretty: false
      },
      headless: true
    });
    const payload = builder2.buildObject(config);
    const headers = {};
    headers["Content-MD5"] = toMd5(payload);
    await this.makeRequestAsyncOmit({
      method,
      bucketName,
      query,
      headers
    }, payload);
  }
  async getBucketVersioning(bucketName) {
    if (!isValidBucketName(bucketName)) {
      throw new InvalidBucketNameError("Invalid bucket name: " + bucketName);
    }
    const method = "GET";
    const query = "versioning";
    const httpRes = await this.makeRequestAsync({
      method,
      bucketName,
      query
    });
    const xmlResult = await readAsString(httpRes);
    return await parseBucketVersioningConfig(xmlResult);
  }
  async setBucketVersioning(bucketName, versionConfig) {
    if (!isValidBucketName(bucketName)) {
      throw new InvalidBucketNameError("Invalid bucket name: " + bucketName);
    }
    if (!Object.keys(versionConfig).length) {
      throw new InvalidArgumentError('versionConfig should be of type "object"');
    }
    const method = "PUT";
    const query = "versioning";
    const builder2 = new xml2js.Builder({
      rootName: "VersioningConfiguration",
      renderOpts: {
        pretty: false
      },
      headless: true
    });
    const payload = builder2.buildObject(versionConfig);
    await this.makeRequestAsyncOmit({
      method,
      bucketName,
      query
    }, payload);
  }
  async setTagging(taggingParams) {
    const {
      bucketName,
      objectName,
      tags,
      putOpts
    } = taggingParams;
    const method = "PUT";
    let query = "tagging";
    if (putOpts && putOpts !== null && putOpts !== void 0 && putOpts.versionId) {
      query = `${query}&versionId=${putOpts.versionId}`;
    }
    const tagsList = [];
    for (const [key, value] of Object.entries(tags)) {
      tagsList.push({
        Key: key,
        Value: value
      });
    }
    const taggingConfig = {
      Tagging: {
        TagSet: {
          Tag: tagsList
        }
      }
    };
    const headers = {};
    const builder2 = new xml2js.Builder({
      headless: true,
      renderOpts: {
        pretty: false
      }
    });
    const payloadBuf = Buffer.from(builder2.buildObject(taggingConfig));
    const requestOptions = {
      method,
      bucketName,
      query,
      headers,
      ...objectName && {
        objectName
      }
    };
    headers["Content-MD5"] = toMd5(payloadBuf);
    await this.makeRequestAsyncOmit(requestOptions, payloadBuf);
  }
  async removeTagging({
    bucketName,
    objectName,
    removeOpts
  }) {
    const method = "DELETE";
    let query = "tagging";
    if (removeOpts && Object.keys(removeOpts).length && removeOpts.versionId) {
      query = `${query}&versionId=${removeOpts.versionId}`;
    }
    const requestOptions = {
      method,
      bucketName,
      objectName,
      query
    };
    if (objectName) {
      requestOptions["objectName"] = objectName;
    }
    await this.makeRequestAsync(requestOptions, "", [200, 204]);
  }
  async setBucketTagging(bucketName, tags) {
    if (!isValidBucketName(bucketName)) {
      throw new InvalidBucketNameError("Invalid bucket name: " + bucketName);
    }
    if (!isPlainObject(tags)) {
      throw new InvalidArgumentError('tags should be of type "object"');
    }
    if (Object.keys(tags).length > 10) {
      throw new InvalidArgumentError('maximum tags allowed is 10"');
    }
    await this.setTagging({
      bucketName,
      tags
    });
  }
  async removeBucketTagging(bucketName) {
    if (!isValidBucketName(bucketName)) {
      throw new InvalidBucketNameError("Invalid bucket name: " + bucketName);
    }
    await this.removeTagging({
      bucketName
    });
  }
  async setObjectTagging(bucketName, objectName, tags, putOpts) {
    if (!isValidBucketName(bucketName)) {
      throw new InvalidBucketNameError("Invalid bucket name: " + bucketName);
    }
    if (!isValidObjectName(objectName)) {
      throw new InvalidBucketNameError("Invalid object name: " + objectName);
    }
    if (!isPlainObject(tags)) {
      throw new InvalidArgumentError('tags should be of type "object"');
    }
    if (Object.keys(tags).length > 10) {
      throw new InvalidArgumentError('Maximum tags allowed is 10"');
    }
    await this.setTagging({
      bucketName,
      objectName,
      tags,
      putOpts
    });
  }
  async removeObjectTagging(bucketName, objectName, removeOpts) {
    if (!isValidBucketName(bucketName)) {
      throw new InvalidBucketNameError("Invalid bucket name: " + bucketName);
    }
    if (!isValidObjectName(objectName)) {
      throw new InvalidBucketNameError("Invalid object name: " + objectName);
    }
    if (removeOpts && Object.keys(removeOpts).length && !isObject(removeOpts)) {
      throw new InvalidArgumentError('removeOpts should be of type "object"');
    }
    await this.removeTagging({
      bucketName,
      objectName,
      removeOpts
    });
  }
  async selectObjectContent(bucketName, objectName, selectOpts) {
    if (!isValidBucketName(bucketName)) {
      throw new InvalidBucketNameError(`Invalid bucket name: ${bucketName}`);
    }
    if (!isValidObjectName(objectName)) {
      throw new InvalidObjectNameError(`Invalid object name: ${objectName}`);
    }
    if (!_.isEmpty(selectOpts)) {
      if (!isString(selectOpts.expression)) {
        throw new TypeError('sqlExpression should be of type "string"');
      }
      if (!_.isEmpty(selectOpts.inputSerialization)) {
        if (!isObject(selectOpts.inputSerialization)) {
          throw new TypeError('inputSerialization should be of type "object"');
        }
      } else {
        throw new TypeError("inputSerialization is required");
      }
      if (!_.isEmpty(selectOpts.outputSerialization)) {
        if (!isObject(selectOpts.outputSerialization)) {
          throw new TypeError('outputSerialization should be of type "object"');
        }
      } else {
        throw new TypeError("outputSerialization is required");
      }
    } else {
      throw new TypeError("valid select configuration is required");
    }
    const method = "POST";
    const query = `select&select-type=2`;
    const config = [{
      Expression: selectOpts.expression
    }, {
      ExpressionType: selectOpts.expressionType || "SQL"
    }, {
      InputSerialization: [selectOpts.inputSerialization]
    }, {
      OutputSerialization: [selectOpts.outputSerialization]
    }];
    if (selectOpts.requestProgress) {
      config.push({
        RequestProgress: selectOpts === null || selectOpts === void 0 ? void 0 : selectOpts.requestProgress
      });
    }
    if (selectOpts.scanRange) {
      config.push({
        ScanRange: selectOpts.scanRange
      });
    }
    const builder2 = new xml2js.Builder({
      rootName: "SelectObjectContentRequest",
      renderOpts: {
        pretty: false
      },
      headless: true
    });
    const payload = builder2.buildObject(config);
    const res = await this.makeRequestAsync({
      method,
      bucketName,
      objectName,
      query
    }, payload);
    const body = await readAsBuffer(res);
    return parseSelectObjectContentResponse(body);
  }
  async applyBucketLifecycle(bucketName, policyConfig) {
    const method = "PUT";
    const query = "lifecycle";
    const headers = {};
    const builder2 = new xml2js.Builder({
      rootName: "LifecycleConfiguration",
      headless: true,
      renderOpts: {
        pretty: false
      }
    });
    const payload = builder2.buildObject(policyConfig);
    headers["Content-MD5"] = toMd5(payload);
    await this.makeRequestAsyncOmit({
      method,
      bucketName,
      query,
      headers
    }, payload);
  }
  async removeBucketLifecycle(bucketName) {
    if (!isValidBucketName(bucketName)) {
      throw new InvalidBucketNameError("Invalid bucket name: " + bucketName);
    }
    const method = "DELETE";
    const query = "lifecycle";
    await this.makeRequestAsyncOmit({
      method,
      bucketName,
      query
    }, "", [204]);
  }
  async setBucketLifecycle(bucketName, lifeCycleConfig) {
    if (!isValidBucketName(bucketName)) {
      throw new InvalidBucketNameError("Invalid bucket name: " + bucketName);
    }
    if (_.isEmpty(lifeCycleConfig)) {
      await this.removeBucketLifecycle(bucketName);
    } else {
      await this.applyBucketLifecycle(bucketName, lifeCycleConfig);
    }
  }
  async getBucketLifecycle(bucketName) {
    if (!isValidBucketName(bucketName)) {
      throw new InvalidBucketNameError("Invalid bucket name: " + bucketName);
    }
    const method = "GET";
    const query = "lifecycle";
    const res = await this.makeRequestAsync({
      method,
      bucketName,
      query
    });
    const body = await readAsString(res);
    return parseLifecycleConfig(body);
  }
  async setBucketEncryption(bucketName, encryptionConfig) {
    if (!isValidBucketName(bucketName)) {
      throw new InvalidBucketNameError("Invalid bucket name: " + bucketName);
    }
    if (!_.isEmpty(encryptionConfig) && encryptionConfig.Rule.length > 1) {
      throw new InvalidArgumentError("Invalid Rule length. Only one rule is allowed.: " + encryptionConfig.Rule);
    }
    let encryptionObj = encryptionConfig;
    if (_.isEmpty(encryptionConfig)) {
      encryptionObj = {
        // Default MinIO Server Supported Rule
        Rule: [{
          ApplyServerSideEncryptionByDefault: {
            SSEAlgorithm: "AES256"
          }
        }]
      };
    }
    const method = "PUT";
    const query = "encryption";
    const builder2 = new xml2js.Builder({
      rootName: "ServerSideEncryptionConfiguration",
      renderOpts: {
        pretty: false
      },
      headless: true
    });
    const payload = builder2.buildObject(encryptionObj);
    const headers = {};
    headers["Content-MD5"] = toMd5(payload);
    await this.makeRequestAsyncOmit({
      method,
      bucketName,
      query,
      headers
    }, payload);
  }
  async getBucketEncryption(bucketName) {
    if (!isValidBucketName(bucketName)) {
      throw new InvalidBucketNameError("Invalid bucket name: " + bucketName);
    }
    const method = "GET";
    const query = "encryption";
    const res = await this.makeRequestAsync({
      method,
      bucketName,
      query
    });
    const body = await readAsString(res);
    return parseBucketEncryptionConfig(body);
  }
  async removeBucketEncryption(bucketName) {
    if (!isValidBucketName(bucketName)) {
      throw new InvalidBucketNameError("Invalid bucket name: " + bucketName);
    }
    const method = "DELETE";
    const query = "encryption";
    await this.makeRequestAsyncOmit({
      method,
      bucketName,
      query
    }, "", [204]);
  }
  async getObjectRetention(bucketName, objectName, getOpts) {
    if (!isValidBucketName(bucketName)) {
      throw new InvalidBucketNameError("Invalid bucket name: " + bucketName);
    }
    if (!isValidObjectName(objectName)) {
      throw new InvalidObjectNameError(`Invalid object name: ${objectName}`);
    }
    if (getOpts && !isObject(getOpts)) {
      throw new InvalidArgumentError('getOpts should be of type "object"');
    } else if (getOpts !== null && getOpts !== void 0 && getOpts.versionId && !isString(getOpts.versionId)) {
      throw new InvalidArgumentError('versionId should be of type "string"');
    }
    const method = "GET";
    let query = "retention";
    if (getOpts !== null && getOpts !== void 0 && getOpts.versionId) {
      query += `&versionId=${getOpts.versionId}`;
    }
    const res = await this.makeRequestAsync({
      method,
      bucketName,
      objectName,
      query
    });
    const body = await readAsString(res);
    return parseObjectRetentionConfig(body);
  }
  async removeObjects(bucketName, objectsList) {
    if (!isValidBucketName(bucketName)) {
      throw new InvalidBucketNameError("Invalid bucket name: " + bucketName);
    }
    if (!Array.isArray(objectsList)) {
      throw new InvalidArgumentError("objectsList should be a list");
    }
    const runDeleteObjects = async (batch2) => {
      const delObjects = batch2.map((value) => {
        return isObject(value) ? {
          Key: value.name,
          VersionId: value.versionId
        } : {
          Key: value
        };
      });
      const remObjects = {
        Delete: {
          Quiet: true,
          Object: delObjects
        }
      };
      const payload = Buffer.from(new xml2js.Builder({
        headless: true
      }).buildObject(remObjects));
      const headers = {
        "Content-MD5": toMd5(payload)
      };
      const res = await this.makeRequestAsync({
        method: "POST",
        bucketName,
        query: "delete",
        headers
      }, payload);
      const body = await readAsString(res);
      return removeObjectsParser(body);
    };
    const maxEntries = 1e3;
    const batches = [];
    for (let i = 0; i < objectsList.length; i += maxEntries) {
      batches.push(objectsList.slice(i, i + maxEntries));
    }
    const batchResults = await Promise.all(batches.map(runDeleteObjects));
    return batchResults.flat();
  }
  async removeIncompleteUpload(bucketName, objectName) {
    if (!isValidBucketName(bucketName)) {
      throw new IsValidBucketNameError("Invalid bucket name: " + bucketName);
    }
    if (!isValidObjectName(objectName)) {
      throw new InvalidObjectNameError(`Invalid object name: ${objectName}`);
    }
    const removeUploadId = await this.findUploadId(bucketName, objectName);
    const method = "DELETE";
    const query = `uploadId=${removeUploadId}`;
    await this.makeRequestAsyncOmit({
      method,
      bucketName,
      objectName,
      query
    }, "", [204]);
  }
  async copyObjectV1(targetBucketName, targetObjectName, sourceBucketNameAndObjectName, conditions) {
    if (typeof conditions == "function") {
      conditions = null;
    }
    if (!isValidBucketName(targetBucketName)) {
      throw new InvalidBucketNameError("Invalid bucket name: " + targetBucketName);
    }
    if (!isValidObjectName(targetObjectName)) {
      throw new InvalidObjectNameError(`Invalid object name: ${targetObjectName}`);
    }
    if (!isString(sourceBucketNameAndObjectName)) {
      throw new TypeError('sourceBucketNameAndObjectName should be of type "string"');
    }
    if (sourceBucketNameAndObjectName === "") {
      throw new InvalidPrefixError(`Empty source prefix`);
    }
    if (conditions != null && !(conditions instanceof CopyConditions)) {
      throw new TypeError('conditions should be of type "CopyConditions"');
    }
    const headers = {};
    headers["x-amz-copy-source"] = uriResourceEscape(sourceBucketNameAndObjectName);
    if (conditions) {
      if (conditions.modified !== "") {
        headers["x-amz-copy-source-if-modified-since"] = conditions.modified;
      }
      if (conditions.unmodified !== "") {
        headers["x-amz-copy-source-if-unmodified-since"] = conditions.unmodified;
      }
      if (conditions.matchETag !== "") {
        headers["x-amz-copy-source-if-match"] = conditions.matchETag;
      }
      if (conditions.matchETagExcept !== "") {
        headers["x-amz-copy-source-if-none-match"] = conditions.matchETagExcept;
      }
    }
    const method = "PUT";
    const res = await this.makeRequestAsync({
      method,
      bucketName: targetBucketName,
      objectName: targetObjectName,
      headers
    });
    const body = await readAsString(res);
    return parseCopyObject(body);
  }
  async copyObjectV2(sourceConfig, destConfig) {
    if (!(sourceConfig instanceof CopySourceOptions)) {
      throw new InvalidArgumentError("sourceConfig should of type CopySourceOptions ");
    }
    if (!(destConfig instanceof CopyDestinationOptions)) {
      throw new InvalidArgumentError("destConfig should of type CopyDestinationOptions ");
    }
    if (!destConfig.validate()) {
      return Promise.reject();
    }
    if (!destConfig.validate()) {
      return Promise.reject();
    }
    const headers = Object.assign({}, sourceConfig.getHeaders(), destConfig.getHeaders());
    const bucketName = destConfig.Bucket;
    const objectName = destConfig.Object;
    const method = "PUT";
    const res = await this.makeRequestAsync({
      method,
      bucketName,
      objectName,
      headers
    });
    const body = await readAsString(res);
    const copyRes = parseCopyObject(body);
    const resHeaders = res.headers;
    const sizeHeaderValue = resHeaders && resHeaders["content-length"];
    const size = typeof sizeHeaderValue === "number" ? sizeHeaderValue : void 0;
    return {
      Bucket: destConfig.Bucket,
      Key: destConfig.Object,
      LastModified: copyRes.lastModified,
      MetaData: extractMetadata(resHeaders),
      VersionId: getVersionId(resHeaders),
      SourceVersionId: getSourceVersionId(resHeaders),
      Etag: sanitizeETag(resHeaders.etag),
      Size: size
    };
  }
  async copyObject(...allArgs) {
    if (typeof allArgs[0] === "string") {
      const [targetBucketName, targetObjectName, sourceBucketNameAndObjectName, conditions] = allArgs;
      return await this.copyObjectV1(targetBucketName, targetObjectName, sourceBucketNameAndObjectName, conditions);
    }
    const [source, dest] = allArgs;
    return await this.copyObjectV2(source, dest);
  }
  async uploadPart(partConfig, payload) {
    const {
      bucketName,
      objectName,
      uploadID,
      partNumber,
      headers
    } = partConfig;
    const method = "PUT";
    const query = `uploadId=${uploadID}&partNumber=${partNumber}`;
    const requestOptions = {
      method,
      bucketName,
      objectName,
      query,
      headers
    };
    const res = await this.makeRequestAsync(requestOptions, payload);
    const body = await readAsString(res);
    const partRes = uploadPartParser(body);
    return {
      etag: sanitizeETag(partRes.ETag),
      key: objectName,
      part: partNumber
    };
  }
  async composeObject(destObjConfig, sourceObjList) {
    const sourceFilesLength = sourceObjList.length;
    if (!Array.isArray(sourceObjList)) {
      throw new InvalidArgumentError("sourceConfig should an array of CopySourceOptions ");
    }
    if (!(destObjConfig instanceof CopyDestinationOptions)) {
      throw new InvalidArgumentError("destConfig should of type CopyDestinationOptions ");
    }
    if (sourceFilesLength < 1 || sourceFilesLength > PART_CONSTRAINTS.MAX_PARTS_COUNT) {
      throw new InvalidArgumentError(`"There must be as least one and up to ${PART_CONSTRAINTS.MAX_PARTS_COUNT} source objects.`);
    }
    for (let i = 0; i < sourceFilesLength; i++) {
      const sObj = sourceObjList[i];
      if (!sObj.validate()) {
        return false;
      }
    }
    if (!destObjConfig.validate()) {
      return false;
    }
    const getStatOptions = (srcConfig) => {
      let statOpts = {};
      if (!_.isEmpty(srcConfig.VersionID)) {
        statOpts = {
          versionId: srcConfig.VersionID
        };
      }
      return statOpts;
    };
    const srcObjectSizes = [];
    let totalSize = 0;
    let totalParts = 0;
    const sourceObjStats = sourceObjList.map((srcItem) => this.statObject(srcItem.Bucket, srcItem.Object, getStatOptions(srcItem)));
    const srcObjectInfos = await Promise.all(sourceObjStats);
    const validatedStats = srcObjectInfos.map((resItemStat, index2) => {
      const srcConfig = sourceObjList[index2];
      let srcCopySize = resItemStat.size;
      if (srcConfig && srcConfig.MatchRange) {
        const srcStart = srcConfig.Start;
        const srcEnd = srcConfig.End;
        if (srcEnd >= srcCopySize || srcStart < 0) {
          throw new InvalidArgumentError(`CopySrcOptions ${index2} has invalid segment-to-copy [${srcStart}, ${srcEnd}] (size is ${srcCopySize})`);
        }
        srcCopySize = srcEnd - srcStart + 1;
      }
      if (srcCopySize < PART_CONSTRAINTS.ABS_MIN_PART_SIZE && index2 < sourceFilesLength - 1) {
        throw new InvalidArgumentError(`CopySrcOptions ${index2} is too small (${srcCopySize}) and it is not the last part.`);
      }
      totalSize += srcCopySize;
      if (totalSize > PART_CONSTRAINTS.MAX_MULTIPART_PUT_OBJECT_SIZE) {
        throw new InvalidArgumentError(`Cannot compose an object of size ${totalSize} (> 5TiB)`);
      }
      srcObjectSizes[index2] = srcCopySize;
      totalParts += partsRequired(srcCopySize);
      if (totalParts > PART_CONSTRAINTS.MAX_PARTS_COUNT) {
        throw new InvalidArgumentError(`Your proposed compose object requires more than ${PART_CONSTRAINTS.MAX_PARTS_COUNT} parts`);
      }
      return resItemStat;
    });
    if (totalParts === 1 && totalSize <= PART_CONSTRAINTS.MAX_PART_SIZE || totalSize === 0) {
      return await this.copyObject(sourceObjList[0], destObjConfig);
    }
    for (let i = 0; i < sourceFilesLength; i++) {
      sourceObjList[i].MatchETag = validatedStats[i].etag;
    }
    const splitPartSizeList = validatedStats.map((resItemStat, idx) => {
      return calculateEvenSplits(srcObjectSizes[idx], sourceObjList[idx]);
    });
    const getUploadPartConfigList = (uploadId2) => {
      const uploadPartConfigList = [];
      splitPartSizeList.forEach((splitSize, splitIndex) => {
        if (splitSize) {
          const {
            startIndex: startIdx,
            endIndex: endIdx,
            objInfo: objConfig
          } = splitSize;
          const partIndex = splitIndex + 1;
          const totalUploads = Array.from(startIdx);
          const headers = sourceObjList[splitIndex].getHeaders();
          totalUploads.forEach((splitStart, upldCtrIdx) => {
            const splitEnd = endIdx[upldCtrIdx];
            const sourceObj = `${objConfig.Bucket}/${objConfig.Object}`;
            headers["x-amz-copy-source"] = `${sourceObj}`;
            headers["x-amz-copy-source-range"] = `bytes=${splitStart}-${splitEnd}`;
            const uploadPartConfig = {
              bucketName: destObjConfig.Bucket,
              objectName: destObjConfig.Object,
              uploadID: uploadId2,
              partNumber: partIndex,
              headers,
              sourceObj
            };
            uploadPartConfigList.push(uploadPartConfig);
          });
        }
      });
      return uploadPartConfigList;
    };
    const uploadAllParts = async (uploadList) => {
      const partUploads = uploadList.map(async (item) => {
        return this.uploadPart(item);
      });
      return await Promise.all(partUploads);
    };
    const performUploadParts = async (uploadId2) => {
      const uploadList = getUploadPartConfigList(uploadId2);
      const partsRes = await uploadAllParts(uploadList);
      return partsRes.map((partCopy) => ({
        etag: partCopy.etag,
        part: partCopy.part
      }));
    };
    const newUploadHeaders = destObjConfig.getHeaders();
    const uploadId = await this.initiateNewMultipartUpload(destObjConfig.Bucket, destObjConfig.Object, newUploadHeaders);
    try {
      const partsDone = await performUploadParts(uploadId);
      return await this.completeMultipartUpload(destObjConfig.Bucket, destObjConfig.Object, uploadId, partsDone);
    } catch (err) {
      return await this.abortMultipartUpload(destObjConfig.Bucket, destObjConfig.Object, uploadId);
    }
  }
  async presignedUrl(method, bucketName, objectName, expires, reqParams, requestDate) {
    var _requestDate;
    if (this.anonymous) {
      throw new AnonymousRequestError(`Presigned ${method} url cannot be generated for anonymous requests`);
    }
    if (!expires) {
      expires = PRESIGN_EXPIRY_DAYS_MAX;
    }
    if (!reqParams) {
      reqParams = {};
    }
    if (!requestDate) {
      requestDate = /* @__PURE__ */ new Date();
    }
    if (expires && typeof expires !== "number") {
      throw new TypeError('expires should be of type "number"');
    }
    if (reqParams && typeof reqParams !== "object") {
      throw new TypeError('reqParams should be of type "object"');
    }
    if (requestDate && !(requestDate instanceof Date) || requestDate && isNaN((_requestDate = requestDate) === null || _requestDate === void 0 ? void 0 : _requestDate.getTime())) {
      throw new TypeError('requestDate should be of type "Date" and valid');
    }
    const query = reqParams ? queryStringExports.stringify(reqParams) : void 0;
    try {
      const region = await this.getBucketRegionAsync(bucketName);
      await this.checkAndRefreshCreds();
      const reqOptions = this.getRequestOptions({
        method,
        region,
        bucketName,
        objectName,
        query
      });
      return presignSignatureV4(reqOptions, this.accessKey, this.secretKey, this.sessionToken, region, requestDate, expires);
    } catch (err) {
      if (err instanceof InvalidBucketNameError) {
        throw new InvalidArgumentError(`Unable to get bucket region for ${bucketName}.`);
      }
      throw err;
    }
  }
  async presignedGetObject(bucketName, objectName, expires, respHeaders, requestDate) {
    if (!isValidBucketName(bucketName)) {
      throw new InvalidBucketNameError("Invalid bucket name: " + bucketName);
    }
    if (!isValidObjectName(objectName)) {
      throw new InvalidObjectNameError(`Invalid object name: ${objectName}`);
    }
    const validRespHeaders = ["response-content-type", "response-content-language", "response-expires", "response-cache-control", "response-content-disposition", "response-content-encoding"];
    validRespHeaders.forEach((header) => {
      if (respHeaders !== void 0 && respHeaders[header] !== void 0 && !isString(respHeaders[header])) {
        throw new TypeError(`response header ${header} should be of type "string"`);
      }
    });
    return this.presignedUrl("GET", bucketName, objectName, expires, respHeaders, requestDate);
  }
  async presignedPutObject(bucketName, objectName, expires) {
    if (!isValidBucketName(bucketName)) {
      throw new InvalidBucketNameError(`Invalid bucket name: ${bucketName}`);
    }
    if (!isValidObjectName(objectName)) {
      throw new InvalidObjectNameError(`Invalid object name: ${objectName}`);
    }
    return this.presignedUrl("PUT", bucketName, objectName, expires);
  }
  newPostPolicy() {
    return new PostPolicy();
  }
  async presignedPostPolicy(postPolicy) {
    if (this.anonymous) {
      throw new AnonymousRequestError("Presigned POST policy cannot be generated for anonymous requests");
    }
    if (!isObject(postPolicy)) {
      throw new TypeError('postPolicy should be of type "object"');
    }
    const bucketName = postPolicy.formData.bucket;
    try {
      const region = await this.getBucketRegionAsync(bucketName);
      const date = /* @__PURE__ */ new Date();
      const dateStr = makeDateLong(date);
      await this.checkAndRefreshCreds();
      if (!postPolicy.policy.expiration) {
        const expires = /* @__PURE__ */ new Date();
        expires.setSeconds(PRESIGN_EXPIRY_DAYS_MAX);
        postPolicy.setExpires(expires);
      }
      postPolicy.policy.conditions.push(["eq", "$x-amz-date", dateStr]);
      postPolicy.formData["x-amz-date"] = dateStr;
      postPolicy.policy.conditions.push(["eq", "$x-amz-algorithm", "AWS4-HMAC-SHA256"]);
      postPolicy.formData["x-amz-algorithm"] = "AWS4-HMAC-SHA256";
      postPolicy.policy.conditions.push(["eq", "$x-amz-credential", this.accessKey + "/" + getScope(region, date)]);
      postPolicy.formData["x-amz-credential"] = this.accessKey + "/" + getScope(region, date);
      if (this.sessionToken) {
        postPolicy.policy.conditions.push(["eq", "$x-amz-security-token", this.sessionToken]);
        postPolicy.formData["x-amz-security-token"] = this.sessionToken;
      }
      const policyBase64 = Buffer.from(JSON.stringify(postPolicy.policy)).toString("base64");
      postPolicy.formData.policy = policyBase64;
      postPolicy.formData["x-amz-signature"] = postPresignSignatureV4(region, date, this.secretKey, policyBase64);
      const opts = {
        region,
        bucketName,
        method: "POST"
      };
      const reqOptions = this.getRequestOptions(opts);
      const portStr = this.port == 80 || this.port === 443 ? "" : `:${this.port.toString()}`;
      const urlStr = `${reqOptions.protocol}//${reqOptions.host}${portStr}${reqOptions.path}`;
      return {
        postURL: urlStr,
        formData: postPolicy.formData
      };
    } catch (err) {
      if (err instanceof InvalidBucketNameError) {
        throw new InvalidArgumentError(`Unable to get bucket region for ${bucketName}.`);
      }
      throw err;
    }
  }
  // list a batch of objects
  async listObjectsQuery(bucketName, prefix, marker, listQueryOpts) {
    if (!isValidBucketName(bucketName)) {
      throw new InvalidBucketNameError("Invalid bucket name: " + bucketName);
    }
    if (!isString(prefix)) {
      throw new TypeError('prefix should be of type "string"');
    }
    if (marker && !isString(marker)) {
      throw new TypeError('marker should be of type "string"');
    }
    if (listQueryOpts && !isObject(listQueryOpts)) {
      throw new TypeError('listQueryOpts should be of type "object"');
    }
    let {
      Delimiter,
      MaxKeys,
      IncludeVersion,
      versionIdMarker,
      keyMarker
    } = listQueryOpts;
    if (!isString(Delimiter)) {
      throw new TypeError('Delimiter should be of type "string"');
    }
    if (!isNumber(MaxKeys)) {
      throw new TypeError('MaxKeys should be of type "number"');
    }
    const queries = [];
    queries.push(`prefix=${uriEscape(prefix)}`);
    queries.push(`delimiter=${uriEscape(Delimiter)}`);
    queries.push(`encoding-type=url`);
    if (IncludeVersion) {
      queries.push(`versions`);
    }
    if (IncludeVersion) {
      if (keyMarker) {
        queries.push(`key-marker=${keyMarker}`);
      }
      if (versionIdMarker) {
        queries.push(`version-id-marker=${versionIdMarker}`);
      }
    } else if (marker) {
      marker = uriEscape(marker);
      queries.push(`marker=${marker}`);
    }
    if (MaxKeys) {
      if (MaxKeys >= 1e3) {
        MaxKeys = 1e3;
      }
      queries.push(`max-keys=${MaxKeys}`);
    }
    queries.sort();
    let query = "";
    if (queries.length > 0) {
      query = `${queries.join("&")}`;
    }
    const method = "GET";
    const res = await this.makeRequestAsync({
      method,
      bucketName,
      query
    });
    const body = await readAsString(res);
    const listQryList = parseListObjects(body);
    return listQryList;
  }
  listObjects(bucketName, prefix, recursive, listOpts) {
    if (prefix === void 0) {
      prefix = "";
    }
    if (recursive === void 0) {
      recursive = false;
    }
    if (!isValidBucketName(bucketName)) {
      throw new InvalidBucketNameError("Invalid bucket name: " + bucketName);
    }
    if (!isValidPrefix(prefix)) {
      throw new InvalidPrefixError(`Invalid prefix : ${prefix}`);
    }
    if (!isString(prefix)) {
      throw new TypeError('prefix should be of type "string"');
    }
    if (!isBoolean(recursive)) {
      throw new TypeError('recursive should be of type "boolean"');
    }
    if (listOpts && !isObject(listOpts)) {
      throw new TypeError('listOpts should be of type "object"');
    }
    let marker = "";
    let keyMarker = "";
    let versionIdMarker = "";
    let objects = [];
    let ended = false;
    const readStream = new stream$1.Readable({
      objectMode: true
    });
    readStream._read = async () => {
      if (objects.length) {
        readStream.push(objects.shift());
        return;
      }
      if (ended) {
        return readStream.push(null);
      }
      try {
        const listQueryOpts = {
          Delimiter: recursive ? "" : "/",
          // if recursive is false set delimiter to '/'
          MaxKeys: 1e3,
          IncludeVersion: listOpts === null || listOpts === void 0 ? void 0 : listOpts.IncludeVersion,
          // version listing specific options
          keyMarker,
          versionIdMarker
        };
        const result = await this.listObjectsQuery(bucketName, prefix, marker, listQueryOpts);
        if (result.isTruncated) {
          marker = result.nextMarker || void 0;
          if (result.keyMarker) {
            keyMarker = result.keyMarker;
          }
          if (result.versionIdMarker) {
            versionIdMarker = result.versionIdMarker;
          }
        } else {
          ended = true;
        }
        if (result.objects) {
          objects = result.objects;
        }
        readStream._read();
      } catch (err) {
        readStream.emit("error", err);
      }
    };
    return readStream;
  }
}
var eventemitter3 = { exports: {} };
var hasRequiredEventemitter3;
function requireEventemitter3() {
  if (hasRequiredEventemitter3) return eventemitter3.exports;
  hasRequiredEventemitter3 = 1;
  (function(module) {
    var has = Object.prototype.hasOwnProperty, prefix = "~";
    function Events() {
    }
    if (Object.create) {
      Events.prototype = /* @__PURE__ */ Object.create(null);
      if (!new Events().__proto__) prefix = false;
    }
    function EE(fn, context, once2) {
      this.fn = fn;
      this.context = context;
      this.once = once2 || false;
    }
    function addListener(emitter, event, fn, context, once2) {
      if (typeof fn !== "function") {
        throw new TypeError("The listener must be a function");
      }
      var listener = new EE(fn, context || emitter, once2), evt = prefix ? prefix + event : event;
      if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;
      else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
      else emitter._events[evt] = [emitter._events[evt], listener];
      return emitter;
    }
    function clearEvent(emitter, evt) {
      if (--emitter._eventsCount === 0) emitter._events = new Events();
      else delete emitter._events[evt];
    }
    function EventEmitter2() {
      this._events = new Events();
      this._eventsCount = 0;
    }
    EventEmitter2.prototype.eventNames = function eventNames() {
      var names = [], events, name;
      if (this._eventsCount === 0) return names;
      for (name in events = this._events) {
        if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
      }
      if (Object.getOwnPropertySymbols) {
        return names.concat(Object.getOwnPropertySymbols(events));
      }
      return names;
    };
    EventEmitter2.prototype.listeners = function listeners(event) {
      var evt = prefix ? prefix + event : event, handlers = this._events[evt];
      if (!handlers) return [];
      if (handlers.fn) return [handlers.fn];
      for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
        ee[i] = handlers[i].fn;
      }
      return ee;
    };
    EventEmitter2.prototype.listenerCount = function listenerCount(event) {
      var evt = prefix ? prefix + event : event, listeners = this._events[evt];
      if (!listeners) return 0;
      if (listeners.fn) return 1;
      return listeners.length;
    };
    EventEmitter2.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
      var evt = prefix ? prefix + event : event;
      if (!this._events[evt]) return false;
      var listeners = this._events[evt], len = arguments.length, args, i;
      if (listeners.fn) {
        if (listeners.once) this.removeListener(event, listeners.fn, void 0, true);
        switch (len) {
          case 1:
            return listeners.fn.call(listeners.context), true;
          case 2:
            return listeners.fn.call(listeners.context, a1), true;
          case 3:
            return listeners.fn.call(listeners.context, a1, a2), true;
          case 4:
            return listeners.fn.call(listeners.context, a1, a2, a3), true;
          case 5:
            return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
          case 6:
            return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
        }
        for (i = 1, args = new Array(len - 1); i < len; i++) {
          args[i - 1] = arguments[i];
        }
        listeners.fn.apply(listeners.context, args);
      } else {
        var length = listeners.length, j;
        for (i = 0; i < length; i++) {
          if (listeners[i].once) this.removeListener(event, listeners[i].fn, void 0, true);
          switch (len) {
            case 1:
              listeners[i].fn.call(listeners[i].context);
              break;
            case 2:
              listeners[i].fn.call(listeners[i].context, a1);
              break;
            case 3:
              listeners[i].fn.call(listeners[i].context, a1, a2);
              break;
            case 4:
              listeners[i].fn.call(listeners[i].context, a1, a2, a3);
              break;
            default:
              if (!args) for (j = 1, args = new Array(len - 1); j < len; j++) {
                args[j - 1] = arguments[j];
              }
              listeners[i].fn.apply(listeners[i].context, args);
          }
        }
      }
      return true;
    };
    EventEmitter2.prototype.on = function on2(event, fn, context) {
      return addListener(this, event, fn, context, false);
    };
    EventEmitter2.prototype.once = function once2(event, fn, context) {
      return addListener(this, event, fn, context, true);
    };
    EventEmitter2.prototype.removeListener = function removeListener(event, fn, context, once2) {
      var evt = prefix ? prefix + event : event;
      if (!this._events[evt]) return this;
      if (!fn) {
        clearEvent(this, evt);
        return this;
      }
      var listeners = this._events[evt];
      if (listeners.fn) {
        if (listeners.fn === fn && (!once2 || listeners.once) && (!context || listeners.context === context)) {
          clearEvent(this, evt);
        }
      } else {
        for (var i = 0, events = [], length = listeners.length; i < length; i++) {
          if (listeners[i].fn !== fn || once2 && !listeners[i].once || context && listeners[i].context !== context) {
            events.push(listeners[i]);
          }
        }
        if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
        else clearEvent(this, evt);
      }
      return this;
    };
    EventEmitter2.prototype.removeAllListeners = function removeAllListeners(event) {
      var evt;
      if (event) {
        evt = prefix ? prefix + event : event;
        if (this._events[evt]) clearEvent(this, evt);
      } else {
        this._events = new Events();
        this._eventsCount = 0;
      }
      return this;
    };
    EventEmitter2.prototype.off = EventEmitter2.prototype.removeListener;
    EventEmitter2.prototype.addListener = EventEmitter2.prototype.on;
    EventEmitter2.prefixed = prefix;
    EventEmitter2.EventEmitter = EventEmitter2;
    {
      module.exports = EventEmitter2;
    }
  })(eventemitter3);
  return eventemitter3.exports;
}
var eventemitter3Exports = requireEventemitter3();
const EventEmitter = /* @__PURE__ */ getDefaultExportFromCjs$1(eventemitter3Exports);
var Utf8Stream_1;
var hasRequiredUtf8Stream;
function requireUtf8Stream() {
  if (hasRequiredUtf8Stream) return Utf8Stream_1;
  hasRequiredUtf8Stream = 1;
  const { Transform } = stream__default;
  const { StringDecoder } = require$$1$1;
  class Utf8Stream extends Transform {
    constructor(options) {
      super(Object.assign({}, options, { writableObjectMode: false }));
      this._buffer = "";
    }
    _transform(chunk, encoding, callback) {
      if (typeof chunk == "string") {
        this._transform = this._transformString;
      } else {
        this._stringDecoder = new StringDecoder();
        this._transform = this._transformBuffer;
      }
      this._transform(chunk, encoding, callback);
    }
    _transformBuffer(chunk, _2, callback) {
      this._buffer += this._stringDecoder.write(chunk);
      this._processBuffer(callback);
    }
    _transformString(chunk, _2, callback) {
      this._buffer += chunk.toString();
      this._processBuffer(callback);
    }
    _processBuffer(callback) {
      if (this._buffer) {
        this.push(this._buffer, "utf8");
        this._buffer = "";
      }
      callback(null);
    }
    _flushInput() {
      if (this._stringDecoder) {
        this._buffer += this._stringDecoder.end();
      }
    }
    _flush(callback) {
      this._flushInput();
      this._processBuffer(callback);
    }
  }
  Utf8Stream_1 = Utf8Stream;
  return Utf8Stream_1;
}
var Parser;
var hasRequiredParser;
function requireParser() {
  if (hasRequiredParser) return Parser;
  hasRequiredParser = 1;
  const Utf8Stream = requireUtf8Stream();
  class JsonlParser extends Utf8Stream {
    static make(options) {
      return new JsonlParser(options);
    }
    static checkedParse(input, reviver, errorIndicator) {
      try {
        return JSON.parse(input, reviver);
      } catch (error) {
        if (typeof errorIndicator == "function") return errorIndicator(error, input, reviver);
      }
      return errorIndicator;
    }
    constructor(options) {
      super(Object.assign({}, options, { readableObjectMode: true }));
      this._rest = "";
      this._counter = 0;
      this._reviver = options && options.reviver;
      this._errorIndicator = options && options.errorIndicator;
      if (options && options.checkErrors) {
        this._processBuffer = this._checked_processBuffer;
        this._flush = this._checked_flush;
      }
      if (options && "errorIndicator" in options) {
        this._processBuffer = this._suppressed_processBuffer;
        this._flush = this._suppressed_flush;
      }
    }
    _processBuffer(callback) {
      const lines = this._buffer.split("\n");
      this._rest += lines[0];
      if (lines.length > 1) {
        this._rest && this.push({ key: this._counter++, value: JSON.parse(this._rest, this._reviver) });
        this._rest = lines.pop();
        for (let i = 1; i < lines.length; ++i) {
          lines[i] && this.push({ key: this._counter++, value: JSON.parse(lines[i], this._reviver) });
        }
      }
      this._buffer = "";
      callback(null);
    }
    _flush(callback) {
      super._flush((error) => {
        if (error) return callback(error);
        if (this._rest) {
          this.push({ key: this._counter++, value: JSON.parse(this._rest, this._reviver) });
          this._rest = "";
        }
        callback(null);
      });
    }
    _suppressed_processBuffer(callback) {
      const lines = this._buffer.split("\n");
      this._rest += lines[0];
      if (lines.length > 1) {
        if (this._rest) {
          const value = JsonlParser.checkedParse(this._rest, this._reviver, this._errorIndicator);
          value !== void 0 && this.push({ key: this._counter++, value });
        }
        this._rest = lines.pop();
        for (let i = 1; i < lines.length; ++i) {
          if (!lines[i]) continue;
          const value = JsonlParser.checkedParse(lines[i], this._reviver, this._errorIndicator);
          value !== void 0 && this.push({ key: this._counter++, value });
        }
      }
      this._buffer = "";
      callback(null);
    }
    _suppressed_flush(callback) {
      super._flush((error) => {
        if (error) return callback(error);
        if (this._rest) {
          const value = JsonlParser.checkedParse(this._rest, this._reviver, this._errorIndicator);
          value !== void 0 && this.push({ key: this._counter++, value });
          this._rest = "";
        }
        callback(null);
      });
    }
    _checked_processBuffer(callback) {
      const lines = this._buffer.split("\n");
      this._rest += lines[0];
      if (lines.length > 1) {
        try {
          this._rest && this.push({ key: this._counter++, value: JSON.parse(this._rest, this._reviver) });
          this._rest = lines.pop();
          for (let i = 1; i < lines.length; ++i) {
            lines[i] && this.push({ key: this._counter++, value: JSON.parse(lines[i], this._reviver) });
          }
        } catch (cbErr) {
          this._buffer = "";
          callback(cbErr);
          return;
        }
      }
      this._buffer = "";
      callback(null);
    }
    _checked_flush(callback) {
      super._flush((error) => {
        if (error) return callback(error);
        if (this._rest) {
          try {
            this.push({ key: this._counter++, value: JSON.parse(this._rest, this._reviver) });
          } catch (cbErr) {
            this._rest = "";
            callback(cbErr);
            return;
          }
          this._rest = "";
        }
        callback(null);
      });
    }
  }
  JsonlParser.parser = JsonlParser.make;
  JsonlParser.make.Constructor = JsonlParser;
  Parser = JsonlParser;
  return Parser;
}
var ParserExports = requireParser();
const jsonLineParser = /* @__PURE__ */ getDefaultExportFromCjs$1(ParserExports);
class TargetConfig {
  setId(id) {
    this.Id = id;
  }
  addEvent(newevent) {
    if (!this.Event) {
      this.Event = [];
    }
    this.Event.push(newevent);
  }
  addFilterSuffix(suffix) {
    if (!this.Filter) {
      this.Filter = {
        S3Key: {
          FilterRule: []
        }
      };
    }
    this.Filter.S3Key.FilterRule.push({
      Name: "suffix",
      Value: suffix
    });
  }
  addFilterPrefix(prefix) {
    if (!this.Filter) {
      this.Filter = {
        S3Key: {
          FilterRule: []
        }
      };
    }
    this.Filter.S3Key.FilterRule.push({
      Name: "prefix",
      Value: prefix
    });
  }
}
class TopicConfig extends TargetConfig {
  constructor(arn) {
    super();
    this.Topic = arn;
  }
}
class QueueConfig extends TargetConfig {
  constructor(arn) {
    super();
    this.Queue = arn;
  }
}
class CloudFunctionConfig extends TargetConfig {
  constructor(arn) {
    super();
    this.CloudFunction = arn;
  }
}
class NotificationConfig {
  add(target) {
    let instance;
    if (target instanceof TopicConfig) {
      instance = this.TopicConfiguration ?? (this.TopicConfiguration = []);
    }
    if (target instanceof QueueConfig) {
      instance = this.QueueConfiguration ?? (this.QueueConfiguration = []);
    }
    if (target instanceof CloudFunctionConfig) {
      instance = this.CloudFunctionConfiguration ?? (this.CloudFunctionConfiguration = []);
    }
    if (instance) {
      instance.push(target);
    }
  }
}
class NotificationPoller extends EventEmitter {
  constructor(client, bucketName, prefix, suffix, events) {
    super();
    this.client = client;
    this.bucketName = bucketName;
    this.prefix = prefix;
    this.suffix = suffix;
    this.events = events;
    this.ending = false;
  }
  // Starts the polling.
  start() {
    this.ending = false;
    process.nextTick(() => {
      this.checkForChanges();
    });
  }
  // Stops the polling.
  stop() {
    this.ending = true;
  }
  checkForChanges() {
    if (this.ending) {
      return;
    }
    const method = "GET";
    const queries = [];
    if (this.prefix) {
      const prefix = uriEscape(this.prefix);
      queries.push(`prefix=${prefix}`);
    }
    if (this.suffix) {
      const suffix = uriEscape(this.suffix);
      queries.push(`suffix=${suffix}`);
    }
    if (this.events) {
      this.events.forEach((s3event) => queries.push("events=" + uriEscape(s3event)));
    }
    queries.sort();
    let query = "";
    if (queries.length > 0) {
      query = `${queries.join("&")}`;
    }
    const region = this.client.region || DEFAULT_REGION;
    this.client.makeRequestAsync({
      method,
      bucketName: this.bucketName,
      query
    }, "", [200], region).then((response) => {
      const asm = jsonLineParser.make();
      pipesetup(response, asm).on("data", (data) => {
        let records = data.value.Records;
        if (!records) {
          records = [];
        }
        records.forEach((record) => {
          this.emit("notification", record);
        });
        if (this.ending) {
          response === null || response === void 0 ? void 0 : response.destroy();
        }
      }).on("error", (e) => this.emit("error", e)).on("end", () => {
        process.nextTick(() => {
          this.checkForChanges();
        });
      });
    }, (e) => {
      return this.emit("error", e);
    });
  }
}
function promisify(fn) {
  return function() {
    let callback = arguments[arguments.length - 1];
    if (typeof callback === "function") {
      return fn.apply(this, arguments);
    }
    let args = [...arguments];
    return new Promise((resolve, reject2) => {
      args.push((err, value) => {
        if (err) {
          return reject2(err);
        }
        resolve(value);
      });
      fn.apply(this, args);
    });
  };
}
var through2 = { exports: {} };
var hasRequiredThrough2;
function requireThrough2() {
  if (hasRequiredThrough2) return through2.exports;
  hasRequiredThrough2 = 1;
  const { Transform } = requireReadable();
  function inherits2(fn, sup) {
    fn.super_ = sup;
    fn.prototype = Object.create(sup.prototype, {
      constructor: { value: fn, enumerable: false, writable: true, configurable: true }
    });
  }
  function through2$1(construct) {
    return (options, transform, flush) => {
      if (typeof options === "function") {
        flush = transform;
        transform = options;
        options = {};
      }
      if (typeof transform !== "function") {
        transform = (chunk, enc, cb) => cb(null, chunk);
      }
      if (typeof flush !== "function") {
        flush = null;
      }
      return construct(options, transform, flush);
    };
  }
  const make = through2$1((options, transform, flush) => {
    const t2 = new Transform(options);
    t2._transform = transform;
    if (flush) {
      t2._flush = flush;
    }
    return t2;
  });
  const ctor = through2$1((options, transform, flush) => {
    function Through22(override) {
      if (!(this instanceof Through22)) {
        return new Through22(override);
      }
      this.options = Object.assign({}, options, override);
      Transform.call(this, this.options);
      this._transform = transform;
      if (flush) {
        this._flush = flush;
      }
    }
    inherits2(Through22, Transform);
    return Through22;
  });
  const obj = through2$1(function(options, transform, flush) {
    const t2 = new Transform(Object.assign({ objectMode: true, highWaterMark: 16 }, options));
    t2._transform = transform;
    if (flush) {
      t2._flush = flush;
    }
    return t2;
  });
  through2.exports = make;
  through2.exports.ctor = ctor;
  through2.exports.obj = obj;
  return through2.exports;
}
var through2Exports = requireThrough2();
const Through2 = /* @__PURE__ */ getDefaultExportFromCjs$1(through2Exports);
function parseBucketNotification(xml2) {
  var result = {
    TopicConfiguration: [],
    QueueConfiguration: [],
    CloudFunctionConfiguration: []
  };
  var genEvents = function(events) {
    var result2 = [];
    if (events) {
      toArray(events).forEach((s3event) => {
        result2.push(s3event);
      });
    }
    return result2;
  };
  var genFilterRules = function(filters) {
    var result2 = [];
    if (filters) {
      filters = toArray(filters);
      if (filters[0].S3Key) {
        filters[0].S3Key = toArray(filters[0].S3Key);
        if (filters[0].S3Key[0].FilterRule) {
          toArray(filters[0].S3Key[0].FilterRule).forEach((rule) => {
            var Name = toArray(rule.Name)[0];
            var Value = toArray(rule.Value)[0];
            result2.push({
              Name,
              Value
            });
          });
        }
      }
    }
    return result2;
  };
  var xmlobj = parseXml(xml2);
  xmlobj = xmlobj.NotificationConfiguration;
  if (xmlobj.TopicConfiguration) {
    toArray(xmlobj.TopicConfiguration).forEach((config) => {
      var Id = toArray(config.Id)[0];
      var Topic = toArray(config.Topic)[0];
      var Event = genEvents(config.Event);
      var Filter = genFilterRules(config.Filter);
      result.TopicConfiguration.push({
        Id,
        Topic,
        Event,
        Filter
      });
    });
  }
  if (xmlobj.QueueConfiguration) {
    toArray(xmlobj.QueueConfiguration).forEach((config) => {
      var Id = toArray(config.Id)[0];
      var Queue = toArray(config.Queue)[0];
      var Event = genEvents(config.Event);
      var Filter = genFilterRules(config.Filter);
      result.QueueConfiguration.push({
        Id,
        Queue,
        Event,
        Filter
      });
    });
  }
  if (xmlobj.CloudFunctionConfiguration) {
    toArray(xmlobj.CloudFunctionConfiguration).forEach((config) => {
      var Id = toArray(config.Id)[0];
      var CloudFunction = toArray(config.CloudFunction)[0];
      var Event = genEvents(config.Event);
      var Filter = genFilterRules(config.Filter);
      result.CloudFunctionConfiguration.push({
        Id,
        CloudFunction,
        Event,
        Filter
      });
    });
  }
  return result;
}
function parseListObjectsV2(xml2) {
  var result = {
    objects: [],
    isTruncated: false
  };
  var xmlobj = parseXml(xml2);
  if (!xmlobj.ListBucketResult) {
    throw new InvalidXMLError('Missing tag: "ListBucketResult"');
  }
  xmlobj = xmlobj.ListBucketResult;
  if (xmlobj.IsTruncated) {
    result.isTruncated = xmlobj.IsTruncated;
  }
  if (xmlobj.NextContinuationToken) {
    result.nextContinuationToken = xmlobj.NextContinuationToken;
  }
  if (xmlobj.Contents) {
    toArray(xmlobj.Contents).forEach((content) => {
      var name = sanitizeObjectKey(toArray(content.Key)[0]);
      var lastModified = new Date(content.LastModified);
      var etag = sanitizeETag(content.ETag);
      var size = content.Size;
      result.objects.push({
        name,
        lastModified,
        etag,
        size
      });
    });
  }
  if (xmlobj.CommonPrefixes) {
    toArray(xmlobj.CommonPrefixes).forEach((commonPrefix) => {
      result.objects.push({
        prefix: sanitizeObjectKey(toArray(commonPrefix.Prefix)[0]),
        size: 0
      });
    });
  }
  return result;
}
function getConcater(parser2, emitError) {
  var objectMode = false;
  var bufs = [];
  if (parser2 && !isFunction(parser2)) {
    throw new TypeError('parser should be of type "function"');
  }
  if (parser2) {
    objectMode = true;
  }
  return Through2({
    objectMode
  }, function(chunk, enc, cb) {
    bufs.push(chunk);
    cb();
  }, function(cb) {
    if (bufs.length) {
      if (parser2) {
        try {
          this.push(parser2(Buffer.concat(bufs).toString()));
        } catch (e) {
          cb(e);
          return;
        }
      } else {
        this.push(Buffer.concat(bufs));
      }
    }
    cb();
  });
}
function getListObjectsV2Transformer() {
  return getConcater(parseListObjectsV2);
}
function getBucketNotificationTransformer() {
  return getConcater(parseBucketNotification);
}
class Client extends TypedClient {
  //
  // __Arguments__
  // * `appName` _string_ - Application name.
  // * `appVersion` _string_ - Application version.
  // listObjectsV2Query - (List Objects V2) - List some or all (up to 1000) of the objects in a bucket.
  //
  // You can use the request parameters as selection criteria to return a subset of the objects in a bucket.
  // request parameters :-
  // * `bucketName` _string_: name of the bucket
  // * `prefix` _string_: Limits the response to keys that begin with the specified prefix.
  // * `continuation-token` _string_: Used to continue iterating over a set of objects.
  // * `delimiter` _string_: A delimiter is a character you use to group keys.
  // * `max-keys` _number_: Sets the maximum number of keys returned in the response body.
  // * `start-after` _string_: Specifies the key to start after when listing objects in a bucket.
  listObjectsV2Query(bucketName, prefix, continuationToken, delimiter, maxKeys, startAfter) {
    if (!isValidBucketName(bucketName)) {
      throw new InvalidBucketNameError("Invalid bucket name: " + bucketName);
    }
    if (!isString(prefix)) {
      throw new TypeError('prefix should be of type "string"');
    }
    if (!isString(continuationToken)) {
      throw new TypeError('continuationToken should be of type "string"');
    }
    if (!isString(delimiter)) {
      throw new TypeError('delimiter should be of type "string"');
    }
    if (!isNumber(maxKeys)) {
      throw new TypeError('maxKeys should be of type "number"');
    }
    if (!isString(startAfter)) {
      throw new TypeError('startAfter should be of type "string"');
    }
    var queries = [];
    queries.push(`list-type=2`);
    queries.push(`encoding-type=url`);
    queries.push(`prefix=${uriEscape(prefix)}`);
    queries.push(`delimiter=${uriEscape(delimiter)}`);
    if (continuationToken) {
      continuationToken = uriEscape(continuationToken);
      queries.push(`continuation-token=${continuationToken}`);
    }
    if (startAfter) {
      startAfter = uriEscape(startAfter);
      queries.push(`start-after=${startAfter}`);
    }
    if (maxKeys) {
      if (maxKeys >= 1e3) {
        maxKeys = 1e3;
      }
      queries.push(`max-keys=${maxKeys}`);
    }
    queries.sort();
    var query = "";
    if (queries.length > 0) {
      query = `${queries.join("&")}`;
    }
    var method = "GET";
    var transformer = getListObjectsV2Transformer();
    this.makeRequest({
      method,
      bucketName,
      query
    }, "", [200], "", true, (e, response) => {
      if (e) {
        return transformer.emit("error", e);
      }
      pipesetup(response, transformer);
    });
    return transformer;
  }
  // List the objects in the bucket using S3 ListObjects V2
  //
  // __Arguments__
  // * `bucketName` _string_: name of the bucket
  // * `prefix` _string_: the prefix of the objects that should be listed (optional, default `''`)
  // * `recursive` _bool_: `true` indicates recursive style listing and `false` indicates directory style listing delimited by '/'. (optional, default `false`)
  // * `startAfter` _string_: Specifies the key to start after when listing objects in a bucket. (optional, default `''`)
  //
  // __Return Value__
  // * `stream` _Stream_: stream emitting the objects in the bucket, the object is of the format:
  //   * `obj.name` _string_: name of the object
  //   * `obj.prefix` _string_: name of the object prefix
  //   * `obj.size` _number_: size of the object
  //   * `obj.etag` _string_: etag of the object
  //   * `obj.lastModified` _Date_: modified time stamp
  listObjectsV2(bucketName, prefix, recursive, startAfter) {
    if (prefix === void 0) {
      prefix = "";
    }
    if (recursive === void 0) {
      recursive = false;
    }
    if (startAfter === void 0) {
      startAfter = "";
    }
    if (!isValidBucketName(bucketName)) {
      throw new InvalidBucketNameError("Invalid bucket name: " + bucketName);
    }
    if (!isValidPrefix(prefix)) {
      throw new InvalidPrefixError(`Invalid prefix : ${prefix}`);
    }
    if (!isString(prefix)) {
      throw new TypeError('prefix should be of type "string"');
    }
    if (!isBoolean(recursive)) {
      throw new TypeError('recursive should be of type "boolean"');
    }
    if (!isString(startAfter)) {
      throw new TypeError('startAfter should be of type "string"');
    }
    var delimiter = recursive ? "" : "/";
    var continuationToken = "";
    var objects = [];
    var ended = false;
    var readStream = stream$1.Readable({
      objectMode: true
    });
    readStream._read = () => {
      if (objects.length) {
        readStream.push(objects.shift());
        return;
      }
      if (ended) {
        return readStream.push(null);
      }
      this.listObjectsV2Query(bucketName, prefix, continuationToken, delimiter, 1e3, startAfter).on("error", (e) => readStream.emit("error", e)).on("data", (result) => {
        if (result.isTruncated) {
          continuationToken = result.nextContinuationToken;
        } else {
          ended = true;
        }
        objects = result.objects;
        readStream._read();
      });
    };
    return readStream;
  }
  // Remove all the notification configurations in the S3 provider
  setBucketNotification(bucketName, config, cb) {
    if (!isValidBucketName(bucketName)) {
      throw new InvalidBucketNameError("Invalid bucket name: " + bucketName);
    }
    if (!isObject(config)) {
      throw new TypeError('notification config should be of type "Object"');
    }
    if (!isFunction(cb)) {
      throw new TypeError('callback should be of type "function"');
    }
    var method = "PUT";
    var query = "notification";
    var builder2 = new xml2js.Builder({
      rootName: "NotificationConfiguration",
      renderOpts: {
        pretty: false
      },
      headless: true
    });
    var payload = builder2.buildObject(config);
    this.makeRequest({
      method,
      bucketName,
      query
    }, payload, [200], "", false, cb);
  }
  removeAllBucketNotification(bucketName, cb) {
    this.setBucketNotification(bucketName, new NotificationConfig(), cb);
  }
  // Return the list of notification configurations stored
  // in the S3 provider
  getBucketNotification(bucketName, cb) {
    if (!isValidBucketName(bucketName)) {
      throw new InvalidBucketNameError("Invalid bucket name: " + bucketName);
    }
    if (!isFunction(cb)) {
      throw new TypeError('callback should be of type "function"');
    }
    var method = "GET";
    var query = "notification";
    this.makeRequest({
      method,
      bucketName,
      query
    }, "", [200], "", true, (e, response) => {
      if (e) {
        return cb(e);
      }
      var transformer = getBucketNotificationTransformer();
      var bucketNotification;
      pipesetup(response, transformer).on("data", (result) => bucketNotification = result).on("error", (e2) => cb(e2)).on("end", () => cb(null, bucketNotification));
    });
  }
  // Listens for bucket notifications. Returns an EventEmitter.
  listenBucketNotification(bucketName, prefix, suffix, events) {
    if (!isValidBucketName(bucketName)) {
      throw new InvalidBucketNameError(`Invalid bucket name: ${bucketName}`);
    }
    if (!isString(prefix)) {
      throw new TypeError("prefix must be of type string");
    }
    if (!isString(suffix)) {
      throw new TypeError("suffix must be of type string");
    }
    if (!Array.isArray(events)) {
      throw new TypeError("events must be of type Array");
    }
    let listener = new NotificationPoller(this, bucketName, prefix, suffix, events);
    listener.start();
    return listener;
  }
}
Client.prototype.getBucketNotification = promisify(Client.prototype.getBucketNotification);
Client.prototype.setBucketNotification = promisify(Client.prototype.setBucketNotification);
Client.prototype.removeAllBucketNotification = promisify(Client.prototype.removeAllBucketNotification);
Client.prototype.makeBucket = callbackify(Client.prototype.makeBucket);
Client.prototype.bucketExists = callbackify(Client.prototype.bucketExists);
Client.prototype.removeBucket = callbackify(Client.prototype.removeBucket);
Client.prototype.listBuckets = callbackify(Client.prototype.listBuckets);
Client.prototype.getObject = callbackify(Client.prototype.getObject);
Client.prototype.fGetObject = callbackify(Client.prototype.fGetObject);
Client.prototype.getPartialObject = callbackify(Client.prototype.getPartialObject);
Client.prototype.statObject = callbackify(Client.prototype.statObject);
Client.prototype.putObjectRetention = callbackify(Client.prototype.putObjectRetention);
Client.prototype.putObject = callbackify(Client.prototype.putObject);
Client.prototype.fPutObject = callbackify(Client.prototype.fPutObject);
Client.prototype.removeObject = callbackify(Client.prototype.removeObject);
Client.prototype.removeBucketReplication = callbackify(Client.prototype.removeBucketReplication);
Client.prototype.setBucketReplication = callbackify(Client.prototype.setBucketReplication);
Client.prototype.getBucketReplication = callbackify(Client.prototype.getBucketReplication);
Client.prototype.getObjectLegalHold = callbackify(Client.prototype.getObjectLegalHold);
Client.prototype.setObjectLegalHold = callbackify(Client.prototype.setObjectLegalHold);
Client.prototype.setObjectLockConfig = callbackify(Client.prototype.setObjectLockConfig);
Client.prototype.getObjectLockConfig = callbackify(Client.prototype.getObjectLockConfig);
Client.prototype.getBucketPolicy = callbackify(Client.prototype.getBucketPolicy);
Client.prototype.setBucketPolicy = callbackify(Client.prototype.setBucketPolicy);
Client.prototype.getBucketTagging = callbackify(Client.prototype.getBucketTagging);
Client.prototype.getObjectTagging = callbackify(Client.prototype.getObjectTagging);
Client.prototype.setBucketTagging = callbackify(Client.prototype.setBucketTagging);
Client.prototype.removeBucketTagging = callbackify(Client.prototype.removeBucketTagging);
Client.prototype.setObjectTagging = callbackify(Client.prototype.setObjectTagging);
Client.prototype.removeObjectTagging = callbackify(Client.prototype.removeObjectTagging);
Client.prototype.getBucketVersioning = callbackify(Client.prototype.getBucketVersioning);
Client.prototype.setBucketVersioning = callbackify(Client.prototype.setBucketVersioning);
Client.prototype.selectObjectContent = callbackify(Client.prototype.selectObjectContent);
Client.prototype.setBucketLifecycle = callbackify(Client.prototype.setBucketLifecycle);
Client.prototype.getBucketLifecycle = callbackify(Client.prototype.getBucketLifecycle);
Client.prototype.removeBucketLifecycle = callbackify(Client.prototype.removeBucketLifecycle);
Client.prototype.setBucketEncryption = callbackify(Client.prototype.setBucketEncryption);
Client.prototype.getBucketEncryption = callbackify(Client.prototype.getBucketEncryption);
Client.prototype.removeBucketEncryption = callbackify(Client.prototype.removeBucketEncryption);
Client.prototype.getObjectRetention = callbackify(Client.prototype.getObjectRetention);
Client.prototype.removeObjects = callbackify(Client.prototype.removeObjects);
Client.prototype.removeIncompleteUpload = callbackify(Client.prototype.removeIncompleteUpload);
Client.prototype.copyObject = callbackify(Client.prototype.copyObject);
Client.prototype.composeObject = callbackify(Client.prototype.composeObject);
Client.prototype.presignedUrl = callbackify(Client.prototype.presignedUrl);
Client.prototype.presignedGetObject = callbackify(Client.prototype.presignedGetObject);
Client.prototype.presignedPutObject = callbackify(Client.prototype.presignedPutObject);
Client.prototype.presignedPostPolicy = callbackify(Client.prototype.presignedPostPolicy);
mainExports.config();
const globalForMinio = globalThis;
const minio = globalForMinio.minio ?? new Client({
  endPoint: process.env.MINIO_ENDPOINT,
  port: Number.parseInt(process.env.MINIO_PORT, 10),
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY
});
if (process.env.NODE_ENV !== "production") {
  globalForMinio.minio = minio;
}
const streamToBuffer = (stream2) => {
  return new Promise((resolve, reject2) => {
    const chunks = [];
    stream2.on("data", (chunk) => chunks.push(chunk));
    stream2.on("end", () => resolve(Buffer.concat(chunks)));
    stream2.on("error", (err) => reject2(err));
  });
};
const Route$2 = createFileRoute("/api/images/$")({
  server: {
    handlers: {
      GET: async ({ request: request2, params }) => {
        const url = new URL(request2.url);
        const imagePath = url.pathname.replace("/api/images/", "");
        const bucketName = "images";
        if (!imagePath) {
          return new Response("Image path is required", { status: 400 });
        }
        try {
          const objectStream = await minio.getObject(bucketName, imagePath);
          const imageBuffer = await streamToBuffer(objectStream);
          const ext = imagePath.split(".").pop()?.toLowerCase() || "";
          const contentType = ext === "jpg" ? "image/jpeg" : ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : ext === "svg" ? "image/svg+xml" : "image/jpeg";
          return new Response(new Uint8Array(imageBuffer), {
            headers: {
              "Content-Type": contentType,
              "Cache-Control": "public, max-age=31536000, immutable"
            }
          });
        } catch (error) {
          try {
            const thirdPartyImageUrl = `https://ddragon.leagueoflegends.com/${imagePath}`;
            const response = await fetch(thirdPartyImageUrl);
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            const arrayBuffer = await response.arrayBuffer();
            const imageBuffer = Buffer.from(arrayBuffer);
            const ext = imagePath.split(".").pop()?.toLowerCase() || "";
            const contentType = ext === "jpg" ? "image/jpeg" : ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : ext === "svg" ? "image/svg+xml" : "image/jpeg";
            await minio.putObject(
              bucketName,
              imagePath,
              imageBuffer,
              imageBuffer.length
            );
            return new Response(new Uint8Array(imageBuffer), {
              headers: {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=31536000, immutable"
              }
            });
          } catch (fetchError) {
            console.error("Error fetching image:", fetchError);
            return new Response("Image not found", { status: 404 });
          }
        }
      }
    }
  }
});
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
const Route$1 = createFileRoute("/$region/$username/mastery")({
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
  } = Route$1.useLoaderData();
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
  const byRole = useOptionsPersistentContext((state2) => state2.byRole);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, { champions: playerChampionInfo }),
    byRole ? /* @__PURE__ */ jsxRuntimeExports.jsx(SortedChampionList, { champions: playerChampionInfo }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChampionList, { champions: playerChampionInfo }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(MatchHistory, { matches })
  ] });
}
const $$splitComponentImporter = () => import("./_region._username.different-DBfyTpYA.js");
const Route = createFileRoute("/$region/$username/different")({
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const IndexRoute = Route$4.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$5
});
const RegionUsernameIndexRoute = Route$3.update({
  id: "/$region/$username/",
  path: "/$region/$username/",
  getParentRoute: () => Route$5
});
const ApiImagesSplatRoute = Route$2.update({
  id: "/api/images/$",
  path: "/api/images/$",
  getParentRoute: () => Route$5
});
const RegionUsernameMasteryRoute = Route$1.update({
  id: "/$region/$username/mastery",
  path: "/$region/$username/mastery",
  getParentRoute: () => Route$5
});
const RegionUsernameDifferentRoute = Route.update({
  id: "/$region/$username/different",
  path: "/$region/$username/different",
  getParentRoute: () => Route$5
});
const rootRouteChildren = {
  IndexRoute,
  RegionUsernameDifferentRoute,
  RegionUsernameMasteryRoute,
  ApiImagesSplatRoute,
  RegionUsernameIndexRoute
};
const routeTree = Route$5._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const rqContext = getContext();
  const router2 = createRouter({
    routeTree,
    context: { ...rqContext },
    defaultPreload: "intent",
    Wrap: (props) => {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Provider, { ...rqContext, children: props.children });
    }
  });
  setupRouterSsrQueryIntegration({
    router: router2,
    queryClient: rqContext.queryClient
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  For as $,
  createSignal as A,
  onMount as B,
  createEffect as C,
  DevtoolsOnCloseContext as D,
  template as E,
  For$1 as F,
  insert as G,
  createRenderEffect as H,
  className as I,
  sortFns as J,
  mutationSortFns as K,
  on as L,
  Match$1 as M,
  Show as N,
  memo as O,
  setAttribute as P,
  clearDelegatedEvents as Q,
  delegateEvents as R,
  Switch$1 as S,
  useContext as T,
  batch as U,
  onCleanup as V,
  getQueryStatusLabel as W,
  getMutationStatusColor as X,
  getQueryStatusColor as Y,
  getQueryStatusColorByLabel as Z,
  displayValue as _,
  createEffect$1 as a,
  spread as a0,
  mergeProps as a1,
  $TRACK as a2,
  untrack as a3,
  createRoot as a4,
  serialize as a5,
  Index as a6,
  updateNestedDataByPath as a7,
  addEventListener as a8,
  stringify as a9,
  Match as aa,
  Switch as ab,
  deleteNestedDataByPath as ac,
  Portal as ad,
  use as ae,
  getSidedProp as af,
  createUniqueId as ag,
  convertRemToPixels as ah,
  useTransition as ai,
  splitProps as aj,
  Dynamic as ak,
  createComputed as al,
  router as am,
  createMemo$1 as b,
  createSignal$1 as c,
  createComponent$1 as d,
  createRenderEffect$1 as e,
  className$1 as f,
  Dynamic$1 as g,
  createUniqueId$1 as h,
  insert$1 as i,
  setAttribute$1 as j,
  addEventListener$1 as k,
  memo$1 as l,
  mergeProps$1 as m,
  useContext$1 as n,
  Show$1 as o,
  onCleanup$1 as p,
  untrack$1 as q,
  ShadowDomTargetContext as r,
  spread$1 as s,
  template$1 as t,
  useDevtoolsOnClose as u,
  delegateEvents$1 as v,
  getPreferredColorScheme as w,
  createMemo as x,
  createComponent as y,
  createContext as z
};
