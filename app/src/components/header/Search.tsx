import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { RegionListSelector, regions } from "@/components/region-list-selector";
import { useDataDragonPath } from "@/features/shared/hooks/useDataDragonPath";
import { getDataDragonVersion } from "@/server/api/mutations";
import { getUsernameSuggestions } from "@/server/summoner/mutations";

type Suggestion = {
	username: string;
	level: number;
	iconId: number;
	region: string;
};

export default function Search() {
	const navigate = useNavigate();
	const [selectedRegion, setSelectedRegion] = useState(regions[0]);
	const [username, setUsername] = useState("");
	const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	const { data: version } = useQuery({
		queryKey: ["dd-version"],
		queryFn: () => getDataDragonVersion(),
	});

	const { getProfileImage } = useDataDragonPath(version ?? "15.24.1");

	useEffect(() => {
		if (username.trim().length < 2) {
			setSuggestions([]);
			setIsDropdownOpen(false);
			return;
		}

		const timeout = setTimeout(async () => {
			try {
				const result = await getUsernameSuggestions({
					data: { username, region: selectedRegion.name },
				});

				setSuggestions(result);
				setIsDropdownOpen(result.length > 0);
			} catch (error) {
				console.error("Failed to fetch suggestions", error);
				setSuggestions([]);
				setIsDropdownOpen(false);
			}
		}, 300);

		return () => clearTimeout(timeout);
	}, [username, selectedRegion.name]);

	const navigateToSummoner = (user: string) => {
		if (!user || !selectedRegion) return;
		const cleanUsername = user.replace("#", "-").toLowerCase();
		navigate({
			to: "/$region/$username",
			params: {
				region: selectedRegion.name,
				username: cleanUsername,
			},
		});
	};

	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsDropdownOpen(false);
		navigateToSummoner(username);
	};

	const selectSuggestion = (suggestionUsername: string) => {
		setIsDropdownOpen(false);
		navigateToSummoner(suggestionUsername);
	};

	return (
		<div className="flex h-full w-full items-center justify-center md:py-2">
			<div className="flex flex-col gap-1 md:flex-row md:gap-4">
				<div className="flex items-center justify-center">
					<div className="shrink-0 font-extrabold text-2xl text-foreground tracking-tight md:text-[2rem]">
						<RegionListSelector
							selectedRegion={selectedRegion}
							setSelectedRegion={setSelectedRegion}
						/>
					</div>
				</div>
				<form
					onSubmit={onSubmit}
					className="flex flex-col gap-2 w-full max-w-sm relative"
				>
					<div className="w-full flex flex-row h-12 gap-1">
						<div className="relative gap-1 flex w-full">
							<input
								ref={inputRef}
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								placeholder="lol.awot#dev"
								className="h-12 grow flex rounded-l bg-input border border-input text-foreground text-center text-xl placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
							/>

							{isDropdownOpen && suggestions.length > 0 && (
								<div className="absolute top-full left-0 right-0 z-10 mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
									{suggestions.map((suggestion, index) => (
										<div
											key={suggestion.username + index}
											onClick={() => selectSuggestion(suggestion.username)}
											className="px-3 py-2 hover:bg-muted cursor-pointer flex items-center gap-3"
										>
											<img
												src={getProfileImage(String(suggestion.iconId))}
												alt="Profile icon"
												className="w-8 h-8 rounded-full border"
												onError={(e) => {
													e.currentTarget.style.display = "none";
												}}
											/>
											<div className="flex-1">
												<div className="font-medium text-foreground">
													{suggestion.username}
												</div>
												<div className="text-sm text-muted-foreground">
													Level {suggestion.level} • {suggestion.region}
												</div>
											</div>
										</div>
									))}
								</div>
							)}
						</div>
						<button
							type="submit"
							className="h-12 min-w-12 max-w-12 rounded-r bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center transition-colors"
							aria-label="Search summoner"
						>
							<ArrowRight className="w-5 h-5" />
						</button>
					</div>

					<div className="text-muted-foreground text-xs">
						Remember to include the # and tagline like: Awot#dev
					</div>
				</form>
			</div>
		</div>
	);
}
