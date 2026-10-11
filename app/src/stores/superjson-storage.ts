import superjson from "superjson";
import type { PersistStorage, StorageValue } from "zustand/middleware";

/**
 * zustand `persist` storage on `localStorage`, encoded with superjson.
 *
 * Both persisted stores need the identical round trip - superjson is what lets the challenge
 * store keep its `Set`s - and the two hand-written copies had drifted into separate
 * `PersistStorage` types. Call it where `persist` is configured so `S` is inferred from the
 * store; the type parameter is only needed when the call site has no contextual type.
 *
 * Reaching for `localStorage` directly is client-only, matching how these stores are used:
 * they are created inside providers, per profile, not at module scope.
 */
export const superjsonStorage = <S>(): PersistStorage<S> => ({
	getItem: (name) => {
		const str = localStorage.getItem(name);
		if (!str) return null;
		return superjson.parse(str) as StorageValue<S>;
	},
	setItem: (name, value) => {
		localStorage.setItem(name, superjson.stringify(value));
	},
	removeItem: (name) => localStorage.removeItem(name),
});
