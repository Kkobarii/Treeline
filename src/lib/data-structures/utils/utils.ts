export function deepCopy<T>(obj: T): T {
	return JSON.parse(JSON.stringify(obj));
}

export function deepEqual(a: any, b: any): boolean {
	if (a === b) return true;
	if (a == null || b == null) return a === b;
	if (Array.isArray(a) || Array.isArray(b)) {
		if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
		for (let i = 0; i < a.length; i++) {
			if (!deepEqual(a[i], b[i])) return false;
		}
		return true;
	}
	if (typeof a === 'object' && typeof b === 'object') {
		const aKeys = Object.keys(a).sort();
		const bKeys = Object.keys(b).sort();
		if (aKeys.length !== bKeys.length) return false;
		for (let i = 0; i < aKeys.length; i++) {
			const key = aKeys[i];
			if (key !== bKeys[i]) return false;
			if (!deepEqual(a[key], b[key])) return false;
		}
		return true;
	}
	return false;
}

const inputConstraints = {
	min: 0,
	max: 999,
};

export function clampInput(value: number): number {
	return clamp(value, inputConstraints.min, inputConstraints.max);
}

export function enforceMinMax(el: HTMLInputElement): number {
	// remove non-numeric characters
	el.value = el.value.replace(/[^0-9]/g, '');

	// clamp to min/max
	if (el.value === '' || isNaN(parseInt(el.value))) {
		el.value = inputConstraints.min.toString();
	} else {
		el.value = clampInput(parseInt(el.value)).toString();
	}

	return parseInt(el.value);
}

export function relationTextToSymbol(text: string): string {
	console.log('relationTextToSymbol', text);
	switch (text) {
		case 'less':
			return '<';
		case 'greater':
			return '>';
		case 'equal':
			return '=';
		default:
			return '?';
	}
}

export function comparisonValuesToSymbol(a: number, b: number): string {
	if (a < b) return '<';
	if (a > b) return '>';
	return '=';
}

export function lerp(a: number, b: number, t: number) {
	return a + (b - a) * t;
}

export function clamp(n: number, min: number, max: number) {
	return Math.max(min, Math.min(max, n));
}
