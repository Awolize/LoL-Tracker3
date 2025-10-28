import type { RateLimitError } from "twisted/dist/errors";

// biome-ignore lint/suspicious/noExplicitAny: this could be a list of anything
type RateLimitedCallback<T> = (...args: any[]) => Promise<T>;

// biome-ignore lint/suspicious/noExplicitAny: this could be a list of anything
export const rateLimitWrapper = async <T>(
	callback: RateLimitedCallback<T>,
	...args: any[]
): Promise<T> => {
	let retryCount = 0;
	const maxRetries = 30;

	while (retryCount < maxRetries) {
		try {
			return await callback(...args);
		} catch (error) {
			const rateLimitError = error as RateLimitError;
			if (rateLimitError.status === 429) {
				const retryAfter = (rateLimitError.rateLimits?.RetryAfter ?? 60) + 1;
				console.log(`Rate limited. Retrying in ${retryAfter} seconds...`);
				await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
				retryCount++;
			} else {
				throw error;
			}
		}
	}

	// If max retries are reached, throw an error or handle it accordingly
	throw new Error(
		`Max retries (${maxRetries}) reached. Unable to complete the request.`,
	);
};
