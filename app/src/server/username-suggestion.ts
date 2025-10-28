// app/server/userSuggestions.ts
import { createServerFn } from "@tanstack/react-start";

// Example user database (replace with real DB query)
const USERS = [
	"Awot#dev",
	"Awot#prod",
	"Alex#1234",
	"Alice#5678",
	"Bob#0001",
	"Charlie#9999",
];

export const getUsernameSuggestions = createServerFn({
	method: "POST",
})
	.inputValidator((data: { username: string }) => data.username)
	.handler(async ({ data: username }) => {
		const query = username.toLowerCase();

		// simulate server-side processing delay
		await new Promise((resolve) => setTimeout(resolve, 200));

		// return matches containing the query
		const matches = USERS.filter((u) => u.toLowerCase().includes(query)).slice(
			0,
			5,
		); // limit results to 5

		return matches.map((username) => ({ username }));
	});
