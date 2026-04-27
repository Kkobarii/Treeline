type GatedMethod = 'log' | 'info' | 'debug';

const GATED_METHODS: GatedMethod[] = ['log', 'info', 'debug'];

type OriginalConsoleMethods = Record<GatedMethod, typeof console.log>;

let activeInstallations = 0;
let originals: OriginalConsoleMethods | null = null;

export function installDevConsoleGate(isEnabled: () => boolean): () => void {
	if (typeof window === 'undefined') return () => {};

	activeInstallations += 1;

	if (!originals) {
		originals = {
			log: console.log.bind(console),
			info: console.info.bind(console),
			debug: console.debug.bind(console),
		};
	}

	for (const method of GATED_METHODS) {
		const original = originals[method];

		console[method] = ((...args: unknown[]) => {
			if (!isEnabled()) return;
			original(...args);
		}) as typeof console.log;
	}

	return () => {
		activeInstallations = Math.max(0, activeInstallations - 1);

		if (activeInstallations > 0 || !originals) return;

		for (const method of GATED_METHODS) {
			console[method] = originals[method];
		}

		originals = null;
	};
}
