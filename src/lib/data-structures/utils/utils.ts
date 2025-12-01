export function deepCopy<T>(obj: T): T {
	return JSON.parse(JSON.stringify(obj));
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
