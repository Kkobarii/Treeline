import { StructureType, type OperationTypeValue } from '$lib/structures/dataStructure';
import { createEmptyStructure, deepCopyStructure } from '$lib/utils/structures';
import { OperationData } from './operationData';

export class ChangeFlags {
	list: boolean = false;
	tree: boolean = false;

	constructor(list: boolean = false, tree: boolean = false) {
		this.list = list;
		this.tree = tree;
	}
}

export class ChangeData {
	operations: OperationData[] = [];
	currentOperation: number = 0;
	currentStep: number = 0;
	currentValue: number = 0;
	canDoNext: boolean = false;
	canDoPrevious: boolean = false;
}

export class OperationManager {
	private structureType: StructureType;

	private operations: OperationData[] = [];
	private currentOperation: number = 0;
	private currentStep: number = -1;

	private listeners: EventListener[] = [];

	private showSteps: boolean = false;
	private currentValue: number = 0;

	constructor(structureType: StructureType) {
		this.structureType = structureType;
		let emptySnapshot = createEmptyStructure(structureType);
		let data = new OperationData('Empty', emptySnapshot);
		data.end(emptySnapshot);

		this.operations.push(data);
		this.currentOperation = 0;
		this.currentStep = 0;

		this.emit(new ChangeFlags(true, true));
	}

	addEventListener(listener: EventListener) {
		this.listeners.push(listener);
		listener(new CustomEvent('change', { detail: new ChangeFlags(true, true) })); // to make sure the listener is up to date
	}

	emit(flags: ChangeFlags = new ChangeFlags()) {
		this.listeners.forEach(listener => listener(new CustomEvent('change', { detail: flags })));
	}

	getListData(): ChangeData {
		return {
			operations: this.operations,
			currentOperation: this.currentOperation,
			currentStep: this.currentStep,
			canDoNext: this.canDoNext(),
			canDoPrevious: this.canDoPrevious(),
			currentValue: this.currentValue,
		};
	}

	getCurrentTree() {
		return this.operations[this.currentOperation].endSnapshot!;
	}

	operation(type: OperationTypeValue, value: number = this.currentValue) {
		console.log('OM performing:', type, value);

		let initialState = deepCopyStructure(this.structureType, this.operations[this.currentOperation].endSnapshot!);
		let data = initialState.operation(type, value);

		this.newOperation(data);
		this.emit(new ChangeFlags(true, true));
	}

	private newOperation(operation: OperationData) {
		if (this.currentOperation < this.operations.length - 1) {
			this.operations = this.operations.slice(0, this.currentOperation + 1); // remove future operations
		}
		this.operations.push(operation);
		this.currentOperation++;
		this.currentStep = 0;
	}

	reset() {
		console.log('Resetting operation manager');
		let firstOp = this.operations[0];
		this.operations = [firstOp];
		this.currentOperation = 0;
		this.currentStep = 0;
		this.emit(new ChangeFlags(true, true));
	}

	toggleShowSteps() {
		this.showSteps = !this.showSteps;
		this.emit(new ChangeFlags(true, false));
	}

	updateCurrentValue(value: number) {
		this.currentValue = value;
		this.emit(new ChangeFlags(true, false));
		console.log('Updated current value to', this.currentValue);
	}

	canDoNext(): boolean {
		if (this.showSteps) {
			let currentOp = this.operations[this.currentOperation];
			return this.currentStep < currentOp.steps.length - 1 || this.currentOperation < this.operations.length - 1;
		} else {
			return this.currentOperation < this.operations.length - 1;
		}
	}

	canDoPrevious(): boolean {
		if (this.showSteps) {
			return this.currentStep > 0 || this.currentOperation > 0;
		} else {
			return this.currentOperation > 0;
		}
	}

	next() {
		if (!this.canDoNext()) return;
		let currentFlags = new ChangeFlags();

		if (this.showSteps) {
			let currentOp = this.operations[this.currentOperation];
			if (this.currentStep < currentOp.steps.length - 1) {
				this.currentStep++;
				currentFlags.list = true;
			} else if (this.currentOperation < this.operations.length - 1) {
				this.currentOperation++;
				this.currentStep = 0;
				currentFlags.list = true;
				currentFlags.tree = true;
			}
		} else {
			if (this.currentOperation < this.operations.length - 1) {
				this.currentOperation++;
				this.currentStep = 0;
				currentFlags.list = true;
				currentFlags.tree = true;
			}
		}
		this.emit(currentFlags);
	}

	previous() {
		if (!this.canDoPrevious()) return;
		let currentFlags = new ChangeFlags();

		if (this.showSteps) {
			if (this.currentStep > 0) {
				this.currentStep--;
				currentFlags.list = true;
			} else if (this.currentOperation > 0) {
				this.currentOperation--;
				let previousOp = this.operations[this.currentOperation];
				this.currentStep = previousOp.steps.length - 1;
				currentFlags.list = true;
				currentFlags.tree = true;
			}
		} else {
			if (this.currentOperation > 0) {
				this.currentOperation--;
				this.currentStep = 0;
				currentFlags.list = true;
				currentFlags.tree = true;
			}
		}
		this.emit(currentFlags);
	}
}
