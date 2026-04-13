import { createClientOnlyFn, createIsomorphicFn } from "@tanstack/react-start";
import { createContext, type ReactNode, use, useEffect, useState } from "react";
import { z } from "zod";

/** Matches THEME_INIT_SCRIPT in __root.tsx: localStorage key `theme`, value `auto` = follow OS. */
const UserThemeSchema = z.enum(["light", "dark", "auto"]).catch("auto");
const AppThemeSchema = z.enum(["light", "dark"]).catch("light");

export type UserTheme = z.infer<typeof UserThemeSchema>;
type AppTheme = z.infer<typeof AppThemeSchema>;

const themeStorageKey = "theme";

const getStoredUserTheme = createIsomorphicFn()
	.server((): UserTheme => "auto")
	.client((): UserTheme => {
		const stored = localStorage.getItem(themeStorageKey);
		return UserThemeSchema.parse(stored);
	});

const setStoredTheme = createClientOnlyFn((theme: UserTheme) => {
	const validatedTheme = UserThemeSchema.parse(theme);
	localStorage.setItem(themeStorageKey, validatedTheme);
});

const getSystemTheme = createIsomorphicFn()
	.server((): AppTheme => "light")
	.client((): AppTheme => {
		return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
	});

const applyThemeToDocument = createClientOnlyFn((mode: UserTheme) => {
	const validatedMode = UserThemeSchema.parse(mode);
	const root = document.documentElement;
	const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
	const resolved = validatedMode === "auto" ? (prefersDark ? "dark" : "light") : validatedMode;

	root.classList.remove("light", "dark");
	root.classList.add(resolved);
	if (validatedMode === "auto") {
		root.removeAttribute("data-theme");
	} else {
		root.setAttribute("data-theme", validatedMode);
	}
	root.style.colorScheme = resolved;
});

const setupPreferredListener = createClientOnlyFn(() => {
	const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
	const handler = () => applyThemeToDocument("auto");
	mediaQuery.addEventListener("change", handler);
	return () => mediaQuery.removeEventListener("change", handler);
});

export const themeScript = (() => {
	function themeFn() {
		try {
			const storedTheme = localStorage.getItem("ui-theme") || "system";
			const validTheme = ["light", "dark", "system"].includes(storedTheme)
				? storedTheme
				: "system";

			if (validTheme === "system") {
				const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
					? "dark"
					: "light";
				document.documentElement.classList.add(systemTheme, "system");
			} else {
				document.documentElement.classList.add(validTheme);
			}
		} catch {
			const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
				? "dark"
				: "light";
			document.documentElement.classList.add(systemTheme, "system");
		}
	}
	return `(${themeFn.toString()})();`;
})();

type ThemeContextProps = {
	userTheme: UserTheme;
	appTheme: AppTheme;
	setTheme: (theme: UserTheme) => void;
};
const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

type ThemeProviderProps = {
	children: ReactNode;
};
export function ThemeProvider({ children }: ThemeProviderProps) {
	const [userTheme, setUserTheme] = useState<UserTheme>(getStoredUserTheme);

	useEffect(() => {
		if (userTheme !== "auto") return;
		return setupPreferredListener();
	}, [userTheme]);

	const appTheme = userTheme === "auto" ? getSystemTheme() : userTheme;

	const setTheme = (newUserTheme: UserTheme) => {
		const validatedTheme = UserThemeSchema.parse(newUserTheme);
		setUserTheme(validatedTheme);
		setStoredTheme(validatedTheme);
		applyThemeToDocument(validatedTheme);
	};

	return <ThemeContext value={{ userTheme, appTheme, setTheme }}>{children}</ThemeContext>;
}

export const useTheme = () => {
	const context = use(ThemeContext);
	if (!context) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
};
