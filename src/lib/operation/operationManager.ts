import { createEmptyTree, deepCopyTree, OperationType, TreeType } from '$lib/structures/generic';
import { OperationData } from './operationData';

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

		this.emit('change');
	}

	addEventListener(event: 'change', listener: EventListener) {
		if (event === 'change') {
			this.listeners.push(listener);
		}
	}

	private emit(event: 'change') {
		if (event === 'change') {
			for (const listener of this.listeners) {
				listener(new Event('change'));
			}
		}
		console.log('OperationManager state change:', this.getState());
	}

	getState(): {
		operations: OperationData[];
		currentOperation: number;
		currentStep: number;
		showSteps: boolean;
		canDoNext: boolean;
		canDoPrevious: boolean;
	} {
		return {
			operations: this.operations,
			currentOperation: this.currentOperation,
			currentStep: this.currentStep,
			showSteps: this.showSteps,
			canDoNext: this.canDoNext(),
			canDoPrevious: this.canDoPrevious(),
		};
	}

	getCurrentOperation(): OperationData {
		return this.operations[this.currentOperation];
	}

	doOperation(type: OperationType, value: number) {
		console.log('Op manager performing operation:', type, value);
		let initialState = deepCopyTree(TreeType.Binary, this.getCurrentOperation().endSnapshot!);
		let data = initialState?.doOperation(type, value);
		if (data) {
			this.newOperation(data);
			this.emit('change');
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
		console.log('State before reset:', this.getState());
		let firstOp = this.operations[0];
		this.operations = [firstOp];
		this.currentOperation = 0;
		this.currentStep = 0;
		this.emit('change');
	}

	toggleShowSteps() {
		this.showSteps = !this.showSteps;
		this.emit('change');
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

		if (this.showSteps) {
			let currentOp = this.operations[this.currentOperation];
			if (this.currentStep < currentOp.steps.length - 1) {
				this.currentStep++;
			} else if (this.currentOperation < this.operations.length - 1) {
				this.currentOperation++;
				this.currentStep = 0;
			}
		} else {
			if (this.currentOperation < this.operations.length - 1) {
				this.currentOperation++;
				this.currentStep = 0;
			}
		}
		this.emit('change');
	}

	previous() {
		if (!this.canDoPrevious()) return;

		if (this.showSteps) {
			if (this.currentStep > 0) {
				this.currentStep--;
			} else if (this.currentOperation > 0) {
				this.currentOperation--;
				let previousOp = this.operations[this.currentOperation];
				this.currentStep = previousOp.steps.length - 1;
			}
		} else {
			if (this.currentOperation > 0) {
				this.currentOperation--;
				this.currentStep = 0;
			}
		}
		this.emit('change');
	}
}
