/**
 * Shared look for the site header's nav links.
 *
 * The hover lightens the surface with a translucent `foreground` wash instead of filling it
 * with `accent` — a fill turns into a heavy, dark block on hover in the dark theme, while a
 * translucent wash reads the same in both.
 */
export const headerLinkClassName =
	"border-border bg-background text-foreground hover:bg-foreground/10 inline-flex h-8 items-center rounded-md border px-3 text-sm font-medium transition-colors";

/** `headerLinkClassName` without the border, for the wordmark. */
export const headerWordmarkClassName =
	"text-foreground hover:bg-foreground/10 inline-flex items-center rounded-md px-2 transition-colors";
