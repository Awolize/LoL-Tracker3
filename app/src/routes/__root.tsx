import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, HeadContent, Scripts } from "@tanstack/react-router";

import { ThemeProvider, themeScript } from "~/hooks/theme-provider";
import { seo } from "~/utils/seo";

import appCss from "../styles.css?url";

export const Route = createRootRouteWithContext<{
	queryClient: QueryClient;
}>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			...seo({
				title: "Awot's Challenge Tracker for League of Legends",
				description:
					"Search by username#tag + region and track champion mastery progress, challenges, leaderboards, and match history. From Riot's API for League of Legends.",
			}),
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
			{
				rel: "manifest",
				href: "/manifest.json",
			},
			{ rel: "icon", href: "/favicon.ico" },
		],
	}),
	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<script dangerouslySetInnerHTML={{ __html: themeScript }} />
				<HeadContent />
			</head>
			{/* wrap-anywhere */}
			<body className="font-sans antialiased selection:bg-[rgba(79,184,178,0.24)]">
				<ThemeProvider>{children}</ThemeProvider>
				<Scripts />
			</body>
		</html>
	);
}
