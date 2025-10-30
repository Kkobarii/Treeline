import { StructureType, type OperationTypeValue } from '$lib/structures/dataStructure';
import { createEmptyStructure, deepCopyStructure } from '$lib/utils/structures';
import { OperationData, StepData } from './operationData';

export enum EventType {
	CurrentOperationChanged = 'currentOperationChanged',
	CurrentStepChanged = 'currentStepChanged',
	ShowStepsToggled = 'showStepsToggled',
	InputValueChanged = 'inputValueChanged',
	OperationListChanged = 'operationListChanged',
}

export class CurrentOperationChangedEvent {
	public currentOperationId: number;
	public currentOperation: OperationData;

	constructor(currentOperationId: number, currentOperation: OperationData) {
		this.currentOperationId = currentOperationId;
		this.currentOperation = currentOperation;
	}
}

export class CurrentStepChangedEvent {
	public currentStepId: number;
	public currentStep: StepData;

	constructor(currentStepId: number, currentStep: StepData) {
		this.currentStepId = currentStepId;
		this.currentStep = currentStep;
	}
}

export class InputValueChangedEvent {
	public inputValue: number;

	constructor(inputValue: number) {
		this.inputValue = inputValue;
	}
}

export class OperationListChangedEvent {
	public operations: OperationData[];

	constructor(operations: OperationData[]) {
		this.operations = operations;
	}
}

export class OperationManager {
	private structureType: StructureType;

	private operations: OperationData[] = [];
	private currentOperation: number = 0;
	private currentStep: number = -1;

	private listeners: { [key in EventType]?: EventListener[] } = {};

	private showSteps: boolean = false;

	constructor(structureType: StructureType) {
		this.structureType = structureType;
		let emptySnapshot = createEmptyStructure(structureType);
		let data = new OperationData('Empty', emptySnapshot);
		data.end(emptySnapshot);

		this.operations.push(data);
		this.currentOperation = 0;
		this.currentStep = 0;
	}

	addEventListener(eventType: EventType, listener: EventListener) {
		if (!this.listeners[eventType]) {
			this.listeners[eventType] = [];
		}
		console.log('Adding listener for', eventType);
		this.listeners[eventType]!.push(listener);
		this.emit(eventType); // to make sure the listener is up to date
	}

	emit(eventType: EventType, data?: any) {
		if (!data) {
			switch (eventType) {
				case EventType.CurrentOperationChanged:
					data = new CurrentOperationChangedEvent(this.currentOperation, this.operations[this.currentOperation]);
					break;
				case EventType.CurrentStepChanged:
					data = new CurrentStepChangedEvent(this.currentStep, this.operations[this.currentOperation].steps[this.currentStep]);
					break;
				case EventType.ShowStepsToggled:
					data = this.showSteps;
					break;
				case EventType.OperationListChanged:
					data = new OperationListChangedEvent(this.operations);
					break;
				case EventType.InputValueChanged:
					data = new InputValueChangedEvent(0);
					break;
			}
		}

		if (this.listeners[eventType]) {
			this.listeners[eventType]!.forEach(listener => {
				listener(new CustomEvent(eventType, { detail: data }));
			});
		}
	}

	operation(type: OperationTypeValue, value: number) {
		console.log('Performing:', type, value);

		let initialState = deepCopyStructure(this.structureType, this.operations[this.currentOperation].endSnapshot!);
		let data = initialState.operation(type, value);

		this.newOperation(data);
	}

	private newOperation(operation: OperationData) {
		if (this.currentOperation < this.operations.length - 1) {
			this.operations = this.operations.slice(0, this.currentOperation + 1); // remove future operations
		}

		this.operations.push(operation);
		this.emit(EventType.OperationListChanged);

		this.incrementCurrentOperation();
	}

	private setCurrentStep(step: number) {
		this.currentStep = step;
		this.emit(EventType.CurrentStepChanged);
	}

	private incrementCurrentStep() {
		this.setCurrentStep(this.currentStep + 1);
	}

	private decrementCurrentStep() {
		this.setCurrentStep(this.currentStep - 1);
	}

	private setCurrentOperation(op: number) {
		this.currentOperation = op;

		this.emit(EventType.CurrentOperationChanged);

		this.setCurrentStep(0);
	}

	private incrementCurrentOperation() {
		this.setCurrentOperation(this.currentOperation + 1);
	}

	private decrementCurrentOperation() {
		if (!this.showSteps) {
			this.setCurrentOperation(this.currentOperation - 1);
		} else {
			this.currentOperation--;
			this.emit(EventType.CurrentOperationChanged);

			let previousOp = this.operations[this.currentOperation];
			this.setCurrentStep(previousOp.steps.length - 1);
		}
	}

	reset() {
		console.log('Resetting operation manager');
		let firstOp = this.operations[0];
		this.operations = [firstOp];

		this.setCurrentOperation(0);

		this.emit(EventType.OperationListChanged);
	}

	toggleShowSteps() {
		this.showSteps = !this.showSteps;
		this.emit(EventType.ShowStepsToggled);
	}

	updateCurrentValue(value: number) {
		this.emit(EventType.InputValueChanged, new InputValueChangedEvent(value));
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
				this.incrementCurrentStep();
			} else if (this.currentOperation < this.operations.length - 1) {
				this.incrementCurrentOperation();
			}
		} else {
			if (this.currentOperation < this.operations.length - 1) {
				this.incrementCurrentOperation();
			}
		}
	}

	previous() {
		if (!this.canDoPrevious()) return;

		if (this.showSteps) {
			if (this.currentStep > 0) {
				this.decrementCurrentStep();
			} else if (this.currentOperation > 0) {
				this.decrementCurrentOperation();
			}
		} else {
			if (this.currentOperation > 0) {
				this.decrementCurrentOperation();
			}
		}
	}
}
