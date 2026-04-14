import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, HeadContent, Scripts } from "@tanstack/react-router";

import { ThemeProvider, themeScript } from "~/hooks/theme-provider";

import appCss from "../styles.css?url";
import { seo } from "~/utils/seo";

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
        description: "Awot's League of Legends challenge tracker built with TanStack Start.",
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
