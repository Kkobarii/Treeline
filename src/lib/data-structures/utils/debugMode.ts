const STORAGE_KEY = 'treeline:debugMode';
const EVENT_NAME = 'treeline:debug-mode-changed';

function isBrowser(): boolean {
	return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

export function setStoredDebugMode(value: boolean): void {
	if (!isBrowser()) return;

	window.dispatchEvent(
		new CustomEvent(EVENT_NAME, {
			detail: { debugMode: value },
		}),
	);
}

export function subscribeToDebugMode(onChange: (value: boolean) => void): () => void {
	if (!isBrowser()) return () => {};

	const handler = (event: Event) => {
		const customEvent = event as CustomEvent<{ debugMode: boolean }>;
		onChange(Boolean(customEvent.detail?.debugMode));
	};

	window.addEventListener(EVENT_NAME, handler);
	return () => {
		window.removeEventListener(EVENT_NAME, handler);
	};
}
