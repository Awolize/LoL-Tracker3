import { c as createLocalStorage, T as THEME_PREFERENCE, P as PiPProvider, a as ThemeContext, D as Devtools, Q as QueryDevtoolsContext } from "./ZDWCUMSJ-CIdh8WJ-.js";
import { w as getPreferredColorScheme, x as createMemo, y as createComponent } from "./router-C4WQxjg7.js";
import "../server.js";
import "node:async_hooks";
import "node:stream";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "node:stream/web";
import "./get-summoner-by-username-rate-limit-DUX4FPAh.js";
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
import "timers";
import "buffer";
import "node:util";
import "node:string_decoder";
import "node:fs";
import "./get-user-by-name-and-region-BNrAFR6X.js";
import "./upsertSummoner-ZoG_kNj-.js";
var DevtoolsComponent = (props) => {
  const [localStore, setLocalStore] = createLocalStorage({
    prefix: "TanstackQueryDevtools"
  });
  const colorScheme = getPreferredColorScheme();
  const theme = createMemo(() => {
    const preference = localStore.theme_preference || THEME_PREFERENCE;
    if (preference !== "system") return preference;
    return colorScheme();
  });
  return createComponent(QueryDevtoolsContext.Provider, {
    value: props,
    get children() {
      return createComponent(PiPProvider, {
        localStore,
        setLocalStore,
        get children() {
          return createComponent(ThemeContext.Provider, {
            value: theme,
            get children() {
              return createComponent(Devtools, {
                localStore,
                setLocalStore
              });
            }
          });
        }
      });
    }
  });
};
var DevtoolsComponent_default = DevtoolsComponent;
export {
  DevtoolsComponent_default as default
};
