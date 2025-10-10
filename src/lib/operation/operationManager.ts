import { createEmptyTree, deepCopyTree, OperationType, TreeType } from '$lib/structures/generic';
import { OperationData } from './operationData';

export enum EventType {
	OperationChange = 'operation_change',
	StepChange = 'step_change',
	OperationListChange = 'operation_list_change',
}

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
	canDoNext: boolean = false;
	canDoPrevious: boolean = false;
}

export class OperationManager {
	private operations: OperationData[] = [];
	private currentOperation: number = 0;
	private currentStep: number = -1;

	private listeners: EventListener[] = [];

	private showSteps: boolean = false;

	constructor(treeType: TreeType) {
		let emptySnapshot = createEmptyTree(treeType);
		let data = new OperationData('Empty', emptySnapshot);
		data.end(emptySnapshot);

		this.operations.push(data);
		this.currentOperation = 0;
		this.currentStep = 0;

		this.emit(new ChangeFlags(true, true));
	}

	addEventListener(listener: EventListener) {
		this.listeners.push(listener);
	}

	emit(flags: ChangeFlags = new ChangeFlags()) {
		this.listeners.forEach(listener => listener(new CustomEvent('change', { detail: flags })));
		console.log(`Event emitted:`, flags);
	}

	getListData(): ChangeData {
		return {
			operations: this.operations,
			currentOperation: this.currentOperation,
			currentStep: this.currentStep,
			canDoNext: this.canDoNext(),
			canDoPrevious: this.canDoPrevious(),
		};
	}

	getCurrentTree() {
		return this.operations[this.currentOperation].endSnapshot!;
	}

	doOperation(type: OperationType, value: number) {
		console.log('Op manager performing operation:', type, value);
		let initialState = deepCopyTree(TreeType.Binary, this.operations[this.currentOperation].endSnapshot!);
		let data = initialState?.doOperation(type, value);
		if (data) {
			this.newOperation(data);
			this.emit(new ChangeFlags(true, true));
		}
	}

	private newOperation(operation: OperationData) {
		if (this.currentOperation < this.operations.length - 1) {
			this.operations = this.operations.slice(0, this.currentOperation + 1);
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
