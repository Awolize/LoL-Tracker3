import type { RateLimitError } from "~/server/external/riot/twisted";

// biome-ignore lint/suspicious/noExplicitAny: this could be a list of anything
type RateLimitedCallback<T> = (...args: any[]) => Promise<T>;

/**
 * How long a single call may spend waiting on 429s before it gives up.
 *
 * The cap is on total time, not on attempts. Riot's `RetryAfter` is routinely over a minute
 * (`Retry-After: 115` was measured on the account endpoint), so a count of 30 attempts let one
 * call block for half an hour - longer than the challenge ladder's whole cache TTL, which made
 * the sync look like it had hung rather than been throttled.
 */
export const RATE_LIMIT_MAX_WAIT_MS = 90_000;

/** Used when Riot sends a 429 without `RetryAfter`. */
export const RATE_LIMIT_DEFAULT_WAIT_MS = 60_000;

// biome-ignore lint/suspicious/noExplicitAny: this could be a list of anything
export const rateLimitWrapper = async <T>(
	callback: RateLimitedCallback<T>,
	...args: any[]
): Promise<T> => {
	let waitedMs = 0;

	for (;;) {
		try {
			return await callback(...args);
		} catch (error) {
			const rateLimitError = error as RateLimitError;
			if (rateLimitError.status !== 429) throw error;

			const retryAfterMs =
				rateLimitError.rateLimits?.RetryAfter !== undefined
					? (rateLimitError.rateLimits.RetryAfter + 1) * 1000
					: RATE_LIMIT_DEFAULT_WAIT_MS;

			if (waitedMs + retryAfterMs > RATE_LIMIT_MAX_WAIT_MS) {
				console.warn(
					`[RateLimit] Giving up after ${(waitedMs / 1000).toFixed(0)}s of waiting; next RetryAfter is ${(retryAfterMs / 1000).toFixed(0)}s`,
				);
				// Rethrow the original: it still carries `status: 429` and `rateLimits`, and callers
				// branch on those. The old code threw a fresh status-less Error here, so a sustained
				// rate limit was reported as `not_found`.
				throw error;
			}

			waitedMs += retryAfterMs;
			console.log(`Rate limited. Retrying in ${(retryAfterMs / 1000).toFixed(0)} seconds...`);
			await new Promise((resolve) => setTimeout(resolve, retryAfterMs));
		}
	}
};
