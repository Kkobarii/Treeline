export function getStoredNumber(storageKey: string | undefined, min: number, max: number, fallback: number): number {
	if (typeof window === 'undefined' || !storageKey) return fallback;
	const stored = Number(sessionStorage.getItem(storageKey));
	if (Number.isFinite(stored) && stored >= min && stored <= max) {
		return stored;
	}
	return fallback;
}

export function saveToStorage(storageKey: string | undefined, value: number): void {
	if (typeof window !== 'undefined' && storageKey) {
		sessionStorage.setItem(storageKey, String(value));
	}
}

export function getStoredString(storageKey: string | undefined, fallback: string = ''): string {
	if (typeof window === 'undefined' || !storageKey) return fallback;
	return sessionStorage.getItem(storageKey) ?? fallback;
}

export function getStoredStringOption<T extends string>(storageKey: string | undefined, validOptions: readonly T[], fallback: T): T {
	if (typeof window === 'undefined' || !storageKey) return fallback;
	const stored = sessionStorage.getItem(storageKey);
	if (stored && validOptions.includes(stored as T)) {
		return stored as T;
	}
	return fallback;
}

export function saveStringToStorage(storageKey: string | undefined, value: string): void {
	if (typeof window !== 'undefined' && storageKey) {
		sessionStorage.setItem(storageKey, value);
	}
}
