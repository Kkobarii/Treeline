const SESSION_KEY = 'treeline:dev-session-enabled';
const EVENT_NAME = 'treeline:dev-session-changed';

const KONAMI_SEQUENCE = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a'];

function isBrowser(): boolean {
	return typeof window !== 'undefined' && typeof sessionStorage !== 'undefined';
}

function normalizeKey(key: string): string {
	return key.toLowerCase();
}

export function getDevSessionDebugEnabled(): boolean {
	if (!isBrowser()) return false;

	try {
		return sessionStorage.getItem(SESSION_KEY) === 'true';
	} catch {
		return false;
	}
}

export function setDevSessionDebugEnabled(value: boolean): void {
	if (!isBrowser()) return;

	try {
		sessionStorage.setItem(SESSION_KEY, String(value));
	} catch {
		// Ignore storage write failures.
	}

	window.dispatchEvent(
		new CustomEvent(EVENT_NAME, {
			detail: { enabled: value },
		}),
	);
}

export function subscribeToDevSessionDebugEnabled(onChange: (enabled: boolean) => void): () => void {
	if (!isBrowser()) return () => {};

	const handler = (event: Event) => {
		const customEvent = event as CustomEvent<{ enabled: boolean }>;
		onChange(Boolean(customEvent.detail?.enabled));
	};

	window.addEventListener(EVENT_NAME, handler);

	return () => {
		window.removeEventListener(EVENT_NAME, handler);
	};
}

export function startKonamiDebugListener(): () => void {
	if (!isBrowser()) return () => {};

	let position = 0;

	const onKeyDown = (event: KeyboardEvent) => {
		const key = normalizeKey(event.key);
		if (key === KONAMI_SEQUENCE[position]) {
			position += 1;

			if (position === KONAMI_SEQUENCE.length) {
				setDevSessionDebugEnabled(true);
				position = 0;
			}

			return;
		}

		position = key === KONAMI_SEQUENCE[0] ? 1 : 0;
	};

	window.addEventListener('keydown', onKeyDown);

	return () => {
		window.removeEventListener('keydown', onKeyDown);
	};
}
