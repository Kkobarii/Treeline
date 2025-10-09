import { createEmptyTree, deepCopyTree, OperationType, TreeType } from '$lib/structures/generic';
import { OperationData } from './operationData';

export enum EventType {
	OperationChange = 'operation_change',
	StepChange = 'step_change',
	OperationListChange = 'operation_list_change',
}

export class OperationManager {
	private operations: OperationData[] = [];
	private currentOperation: number = 0;
	private currentStep: number = -1;

	private listeners: { [key: string]: EventListener[] } = {};

	private showSteps: boolean = false;

	constructor(treeType: TreeType) {
		let emptySnapshot = createEmptyTree(treeType);
		let data = new OperationData('Empty', emptySnapshot);
		data.end(emptySnapshot);

		this.operations.push(data);
		this.currentOperation = 0;
		this.currentStep = 0;

		this.emitOperationListChange();
	}

	addEventListener(event: EventType, listener: EventListener) {
		if (!this.listeners[event]) {
			this.listeners[event] = [];
		}
		this.listeners[event].push(listener);
	}

	private emit(event: EventType, args: any) {
		if (this.listeners[event]) {
			this.listeners[event].forEach((listener) => listener(new CustomEvent(event, { detail: args })));
		}
		console.log(`Event emitted: ${event}`, args);
	}

	private emitOperationChange() {
		// rewrite tree
		// change step and operation
		let data = {
			'currentOperation': this.currentOperation,
			'currentStep': this.currentStep,
			...this.getBools(),
		};
		this.emit(EventType.OperationChange, data);
	}

	private emitStepChange() {
		// change step only
		let data = { 
			'currentStep': this.currentStep,
			...this.getBools(),
		};
		this.emit(EventType.StepChange, data);
	}

	emitOperationListChange() {
		// change everything
		let data = {
			operations: this.operations,
			currentOperation: this.currentOperation,
			currentStep: this.currentStep,
			...this.getBools(),
		};
		this.emit(EventType.OperationListChange, data);
	}
	
	private getBools() {
		return {
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
			this.emitOperationListChange();
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
		this.emitOperationListChange();
	}

	toggleShowSteps() {
		this.showSteps = !this.showSteps;
		this.emitStepChange();
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
				this.emitStepChange();
			} else if (this.currentOperation < this.operations.length - 1) {
				this.currentOperation++;
				this.currentStep = 0;
				this.emitOperationChange();
			}
		} else {
			if (this.currentOperation < this.operations.length - 1) {
				this.currentOperation++;
				this.currentStep = 0;
				this.emitOperationChange();
			}
		}
	}

	previous() {
		if (!this.canDoPrevious()) return;

		if (this.showSteps) {
			if (this.currentStep > 0) {
				this.currentStep--;
				this.emitStepChange();
			} else if (this.currentOperation > 0) {
				this.currentOperation--;
				let previousOp = this.operations[this.currentOperation];
				this.currentStep = previousOp.steps.length - 1;
				this.emitOperationChange();
			}
		} else {
			if (this.currentOperation > 0) {
				this.currentOperation--;
				this.currentStep = 0;
				this.emitOperationChange();
			}
		}
	}
}
