import type React from "react";
import { createContext, useContext, useRef } from "react";
import superjson from "superjson";
import { create, useStore } from "zustand";
import { type PersistStorage, persist } from "zustand/middleware";

interface Store {
	selectedChallengeId: number | null;
	manuallyMarked: Record<string, Record<number, Set<number>>>; // Record<profileId, Record<challengeId, Set<championId>>>
}

interface StoreState extends Store {
	setSelectedChallengeId: (id: number | null) => void;
	markChampion: (
		profileId: string,
		challengeId: number,
		championId: number,
	) => void;
	unmarkChampion: (
		profileId: string,
		challengeId: number,
		championId: number,
	) => void;
}

const initialState = {
	selectedChallengeId: null,
	manuallyMarked: {},
};

const useChallengeStore = (persistName: string) => {
	return create<StoreState>()(
		persist(
			(set) => ({
				...initialState,
				setSelectedChallengeId: (id) =>
					set((state) => ({ ...state, selectedChallengeId: id })),
				markChampion: (profileId, challengeId, championId) => {
					set((state) => {
						const profileData = state.manuallyMarked[profileId] || {};
						const currentSet = profileData[challengeId] || new Set<number>();
						currentSet.add(championId);

						return {
							manuallyMarked: {
								...state.manuallyMarked,
								[profileId]: {
									...profileData,
									[challengeId]: currentSet,
								},
							},
						};
					});
				},
				unmarkChampion: (profileId, challengeId, championId) => {
					set((state) => {
						const profileData = state.manuallyMarked[profileId];
						if (profileData) {
							const currentSet = profileData[challengeId];
							if (currentSet) {
								currentSet.delete(championId);
								return {
									manuallyMarked: {
										...state.manuallyMarked,
										[profileId]: {
											...profileData,
											[challengeId]: currentSet,
										},
									},
								};
							}
						}
						return state;
					});
				},
			}),
			{ name: `${persistName}-challenges`, storage },
		),
	);
};

const storage: PersistStorage<Store> = {
	getItem: (name) => {
		const str = localStorage.getItem(name);
		if (!str) return null;
		return superjson.parse(str);
	},
	setItem: (name, value) => {
		localStorage.setItem(name, superjson.stringify(value));
	},
	removeItem: (name) => localStorage.removeItem(name),
};

type ChallengeStore = ReturnType<typeof useChallengeStore>;
const ChallengeContext = createContext<ChallengeStore | null>(null);

type ChallengeProviderProps = React.PropsWithChildren<{ persistName: string }>;

export function ChallengeProvider({
	children,
	persistName,
}: ChallengeProviderProps) {
	const storeRef = useRef(useChallengeStore(persistName));

	return (
		<ChallengeContext.Provider value={storeRef.current}>
			{children}
		</ChallengeContext.Provider>
	);
}

export function useChallengeContext<T>(selector: (state: StoreState) => T): T {
	const store = useContext(ChallengeContext);
	if (!store) throw new Error("Missing ChallengeContext.Provider in the tree");
	return useStore(store, selector);
}
