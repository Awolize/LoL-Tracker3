import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";

interface Region {
	id: number;
	name: string;
	disabled: boolean;
}

export const regions: Region[] = [
	{ id: 3, name: "EUW", disabled: false },
	{ id: 1, name: "BR", disabled: false },
	{ id: 2, name: "EUNE", disabled: false },
	{ id: 4, name: "KR", disabled: false },
	{ id: 5, name: "LA1", disabled: false },
	{ id: 6, name: "LA2", disabled: false },
	{ id: 7, name: "NA", disabled: false },
	{ id: 8, name: "OC", disabled: false },
	{ id: 9, name: "TR", disabled: false },
	{ id: 10, name: "RU", disabled: false },
	{ id: 11, name: "JP", disabled: false },
	{ id: 12, name: "PBE", disabled: false },
];

export const RegionListSelector = ({
	selectedRegion,
	setSelectedRegion,
}: {
	selectedRegion: Region;
	setSelectedRegion: (region: Region) => void;
}) => {
	return (
		<Listbox as="div" className="relative" value={selectedRegion} onChange={setSelectedRegion}>
			<ListboxButton className="focus-visible:ring-ring/40 flex items-end rounded-sm outline-none focus-visible:ring-2">
				<span className="text-[hsl(280,100%,70%)]">{selectedRegion?.name}</span>
				<p className="text-xs">v</p>
			</ListboxButton>
			<ListboxOptions
				anchor="bottom start"
				className="bg-popover text-popover-foreground ring-foreground/10 z-50 w-[150px] rounded-md p-1 shadow-lg ring-1 [--anchor-gap:4px]"
			>
				{regions
					.filter((region) => selectedRegion.id !== region.id)
					.map((region) => (
						<ListboxOption
							key={region.id}
							value={region}
							disabled={region.disabled}
							className="data-[focus]:bg-accent data-[focus]:text-accent-foreground cursor-pointer rounded-sm px-2 py-1 text-sm outline-none data-[disabled]:opacity-50"
						>
							{region.name}
						</ListboxOption>
					))}
			</ListboxOptions>
		</Listbox>
	);
};
