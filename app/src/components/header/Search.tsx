import { useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { RegionListSelector, regions } from "@/components/region-list-selector";

export default function Search() {
	const navigate = useNavigate();
	const [selectedRegion, setSelectedRegion] = useState(regions[0]);
	const [username, setUsername] = useState("");

	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!username || !selectedRegion) return;
		const cleanUsername = username.replace("#", "-").toLowerCase();
		navigate({
			to: "/$region/$username",
			params: {
				region: selectedRegion.name,
				username: cleanUsername,
			},
		});
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
					className="flex flex-col gap-2 w-full max-w-sm"
				>
					<div className="w-full flex flex-row h-12 gap-1">
						<input
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							placeholder="lol.awot#dev"
							className="h-12 grow flex rounded-l bg-input border border-input text-foreground text-center text-xl placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
						/>
						<button
							type="submit"
							className="h-12 min-w-12 max-w-12 rounded-r bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center transition-colors"
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
