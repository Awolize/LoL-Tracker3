import type React from "react";
import { createContext, useContext } from "react";

interface SelectedChallengeContextValue {
	selectedChallengeId: number | null;
	setSelectedChallengeId: (id: number | null) => void;
}

const SelectedChallengeContext =
	createContext<SelectedChallengeContextValue | null>(null);

interface SelectedChallengeProviderProps {
	children: React.ReactNode;
	selectedChallengeId: number | null;
	setSelectedChallengeId: (id: number | null) => void;
}

export function SelectedChallengeProvider({
	children,
	selectedChallengeId,
	setSelectedChallengeId,
}: SelectedChallengeProviderProps) {
	return (
		<SelectedChallengeContext.Provider
			value={{ selectedChallengeId, setSelectedChallengeId }}
		>
			{children}
		</SelectedChallengeContext.Provider>
	);
}

export function useSelectedChallenge(): SelectedChallengeContextValue {
	const context = useContext(SelectedChallengeContext);
	if (!context) {
		throw new Error(
			"useSelectedChallenge must be used within a SelectedChallengeProvider",
		);
	}
	return context;
}
