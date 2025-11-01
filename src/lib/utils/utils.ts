export function deepCopy<T>(obj: T): T {
	return JSON.parse(JSON.stringify(obj));
}

const inputConstraints = {
	min: 0,
	max: 999,
};

export function clampInput(value: number): number {
	return Math.min(Math.max(value, inputConstraints.min), inputConstraints.max);
}

export function enforceMinMax(el: HTMLInputElement) {
	if (el.value === '' || isNaN(parseInt(el.value))) {
		el.value = inputConstraints.min.toString();
	} else {
		el.value = clampInput(parseInt(el.value)).toString();
	}
}

export function relationTextToSymbol(text: string): string {
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
