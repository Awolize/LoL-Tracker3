import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import * as React from "react";
import { MainText } from "@/components/header/MainText";
import { SubText } from "@/components/header/SubText";
import { RegionListSelector, regions } from "@/components/region-list-selector";

export const Route = createFileRoute("/")({ component: Home });

export function Home() {
	const navigate = useNavigate();
	const [username, setUsername] = React.useState("");
	const [selectedRegion, setSelectedRegion] = React.useState(regions[0]);

	// Autocomplete query
	// const { data: suggestions = [] } = useQuery({
	// 	queryKey: ["usernameSuggestions", debouncedInput],
	// 	queryFn: () =>
	// 		getUsernameSuggestions({ data: { username: debouncedInput } }),
	// 	enabled: !!debouncedInput,
	// });

	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!username || !selectedRegion) return;
		const cleanUsername = username.replace("#", "-").toLowerCase();

		console.log({
			region: selectedRegion.name,
			username: cleanUsername,
		});

		navigate({
			to: "/$region/$username",
			params: {
				region: selectedRegion.name,
				username: cleanUsername,
			},
		});
	};

	return (
		<main className="flex min-h-screen flex-col items-center justify-center bg-[url('/background-1.webp')] bg-center bg-cover">
			<div className="flex w-full animate-pulse2 flex-col items-center justify-center gap-4 bg-black py-16">
				<div>
					<MainText />
					<SubText />
				</div>

				<div className="flex h-full w-full flex-col items-center justify-center gap-4 px-4 py-2">
					<div className="font-extrabold text-2xl text-foreground tracking-tight sm:text-[2rem]">
						<RegionListSelector
							selectedRegion={selectedRegion}
							setSelectedRegion={setSelectedRegion}
						/>
					</div>

					<form
						onSubmit={onSubmit}
						className="flex flex-col gap-2 w-full max-w-sm"
					>
						<div className="w-full flex flex-row h-12 gap-1">
							<input
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								placeholder="lol.awot#dev"
								className="h-12 grow flex rounded-l bg-primary text-center text-xl placeholder:text-primary-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary"
							/>
							<button
								type="submit"
								className="h-12 min-w-12 max-w-12 rounded-r bg-primary hover:bg-primary-foreground/20 flex items-center justify-center"
							>
								<ArrowRight className="w-5 h-5 text-primary-foreground" />
							</button>
						</div>

						<div className="text-primary-foreground/50 text-xs">
							Remember to include the # and tagline like: Awot#dev
						</div>
					</form>
				</div>
			</div>
		</main>
	);
}
