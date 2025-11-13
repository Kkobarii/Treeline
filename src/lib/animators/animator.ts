type AnimFn = (dt: number, elapsed: number) => boolean | void;

let rafId: number | null = null;
type AnimItem = { fn: AnimFn; elapsed: number };
let animItems: AnimItem[] = [];

function ensureRaf() {
	if (rafId == null) {
		let last = performance.now();
		rafId = requestAnimationFrame(function loop(now) {
			const dt = now - last;
			last = now;
			if (animItems.length === 0) {
				rafId = null;
				return;
			}

			// iterate copy because callbacks may remove themselves
			const items = animItems.slice();
			for (const it of items) {
				it.elapsed += dt;
				try {
					const keep = it.fn(dt, it.elapsed);
					if (keep === false) {
						const idx = animItems.indexOf(it);
						if (idx >= 0) animItems.splice(idx, 1);
					}
				} catch (err) {
					console.error('Animation callback error', err);
					const idx = animItems.indexOf(it);
					if (idx >= 0) animItems.splice(idx, 1);
				}
			}

			rafId = requestAnimationFrame(loop);
		});
	}
}

/**
 * Add an animation callback. Callback receives dt (ms since last frame) and elapsed (ms since start).
 * If the callback returns false, it will be removed. Returns a cancel function.
 */
export function addAnimation(fn: AnimFn) {
	const item: AnimItem = { fn, elapsed: 0 };
	animItems.push(item);
	ensureRaf();
	return () => {
		const idx = animItems.indexOf(item);
		if (idx >= 0) animItems.splice(idx, 1);
	};
}

export function clearAnimations() {
	animItems = [];
}
