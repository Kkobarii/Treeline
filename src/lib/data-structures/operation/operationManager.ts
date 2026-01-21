import { getInitOperation, StructureType, type OperationTypeValue } from '$lib/data-structures/structures/dataStructure';
import { createEmptyStructure, deepCopyStructure } from '$lib/data-structures/structures/dataStructureUtils';

import { OperationData, StepData } from './operationData';

export enum EventType {
	CurrentOperationChanged = 'currentOperationChanged',
	CurrentStepChanged = 'currentStepChanged',
	ShowStepsToggled = 'showStepsToggled',
	AnimationLockChanged = 'animationLockChanged',
	InputValueChanged = 'inputValueChanged',
	OperationListChanged = 'operationListChanged',
}

export enum ChangeDirection {
	Forward = 'forward',
	Backward = 'backward',
	Unknown = 'unknown',
}

export class CurrentOperationChangedEvent {
	public direction: ChangeDirection;

	public currentOperationId: number;
	public currentOperation: OperationData;

	public previousOperationId?: number;
	public previousOperation?: OperationData;

	constructor(
		direction: ChangeDirection,
		currentOperationId: number,
		currentOperation: OperationData,
		previousOperationId?: number,
		previousOperation?: OperationData,
	) {
		this.direction = direction;
		this.currentOperationId = currentOperationId;
		this.currentOperation = currentOperation;
		this.previousOperationId = previousOperationId;
		this.previousOperation = previousOperation;
	}
}

export class CurrentStepChangedEvent {
	public direction: ChangeDirection;

	public currentStepId: number;
	public currentStep: StepData;

	public previousStepId?: number;
	public previousStep?: StepData;
	constructor(
		direction: ChangeDirection,
		currentStepId: number,
		currentStep: StepData,
		previousStepId?: number,
		previousStep?: StepData,
	) {
		this.direction = direction;
		this.currentStepId = currentStepId;
		this.currentStep = currentStep;
		this.previousStepId = previousStepId;
		this.previousStep = previousStep;
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
	private initialNodeCount: number = 10;

	private operations: OperationData[] = [];
	private currentOperation: number = 0;
	private currentStep: number = -1;

	private listeners: { [key in EventType]?: EventListener[] } = {};

	private showSteps: boolean = false;

	private lockCount: number = 0;

	constructor(structureType: StructureType, initialNodeCount: number = 10) {
		console.log(`%cMounting ${structureType} OperationManager`, 'color: orange; font-weight: bold;');

		this.structureType = structureType;
		this.initialNodeCount = initialNodeCount;

		const data = this.prepareStartData(structureType);

		this.operations = [data];
		this.currentOperation = 0;
		this.currentStep = 0;
	}

	private prepareStartData(structureType: StructureType): OperationData {
		const structure = createEmptyStructure(structureType);
		const values = this.generateInitialValues(Math.max(0, this.initialNodeCount));

		if (values.length > 0) console.log('Initial values:', values.join(', '));

		const insertOp = getInitOperation(structureType);
		for (const v of values) {
			structure.operation(insertOp, v);
		}

		const snapshot = deepCopyStructure(structureType, structure);
		const data = new OperationData('Empty', snapshot);
		data.end(snapshot);
		return data;
	}

	private generateInitialValues(count: number): number[] {
		const maxUnique = 1000;
		const target = Math.min(Math.max(count, 0), maxUnique);

		const chosen = new Set<number>();
		while (chosen.size < target) {
			const value = Math.floor(Math.random() * 1000);
			chosen.add(value);
		}

		return Array.from(chosen);
	}

	addEventListener(eventType: EventType, listener: EventListener, updateNow: boolean = true) {
		if (!this.listeners[eventType]) {
			this.listeners[eventType] = [];
		}
		this.listeners[eventType]!.push(listener);

		if (updateNow) {
			const data = this.createDefaultEventData(undefined, eventType);
			listener(new CustomEvent(eventType, { detail: data }));
		}
	}

	emit(eventType: EventType, data?: any) {
		if (!data) {
			data = this.createDefaultEventData(data, eventType);
		}

		if (this.listeners[eventType]) {
			this.listeners[eventType]!.forEach(listener => {
				listener(new CustomEvent(eventType, { detail: data }));
			});
		}
	}

	private createDefaultEventData(data: any, eventType: EventType) {
		switch (eventType) {
			case EventType.CurrentOperationChanged:
				data = new CurrentOperationChangedEvent(
					ChangeDirection.Unknown,
					this.currentOperation,
					this.operations[this.currentOperation],
				);
				break;
			case EventType.CurrentStepChanged:
				data = new CurrentStepChangedEvent(
					ChangeDirection.Unknown,
					this.currentStep,
					this.operations[this.currentOperation].steps[this.currentStep],
				);
				break;
			case EventType.ShowStepsToggled:
				data = this.showSteps;
				break;
			case EventType.AnimationLockChanged:
				data = this.isLocked();
				break;
			case EventType.OperationListChanged:
				data = new OperationListChangedEvent(this.operations);
				break;
			case EventType.InputValueChanged:
				data = new InputValueChangedEvent(0);
				break;
		}
		return data;
	}

	isLocked(): boolean {
		return this.lockCount > 0;
	}

	beginAnimation() {
		this.lockCount++;
		if (this.lockCount === 1) {
			this.emit(EventType.AnimationLockChanged, true);
		}
	}

	endAnimation() {
		if (this.lockCount <= 0) return;
		this.lockCount--;
		if (this.lockCount === 0) {
			this.emit(EventType.AnimationLockChanged, false);
		}
	}

	operation(type: OperationTypeValue, value: number | null = null) {
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
		this.currentStep++;

		this.emit(
			EventType.CurrentStepChanged,
			new CurrentStepChangedEvent(
				ChangeDirection.Forward,
				this.currentStep,
				this.operations[this.currentOperation].steps[this.currentStep],
				this.currentStep - 1,
				this.operations[this.currentOperation].steps[this.currentStep - 1],
			),
		);
	}

	private decrementCurrentStep() {
		this.currentStep--;

		this.emit(
			EventType.CurrentStepChanged,
			new CurrentStepChangedEvent(
				ChangeDirection.Backward,
				this.currentStep,
				this.operations[this.currentOperation].steps[this.currentStep],
				this.currentStep + 1,
				this.operations[this.currentOperation].steps[this.currentStep + 1],
			),
		);
	}

	private setCurrentOperation(op: number) {
		this.currentOperation = op;

		this.emit(EventType.CurrentOperationChanged);

		this.setCurrentStep(0);
	}

	private incrementCurrentOperation() {
		this.currentOperation++;

		this.emit(
			EventType.CurrentOperationChanged,
			new CurrentOperationChangedEvent(
				ChangeDirection.Forward,
				this.currentOperation,
				this.operations[this.currentOperation],
				this.currentOperation - 1,
				this.operations[this.currentOperation - 1],
			),
		);

		this.setCurrentStep(0);
	}

	private decrementCurrentOperation() {
		this.currentOperation--;
		this.emit(
			EventType.CurrentOperationChanged,
			new CurrentOperationChangedEvent(
				ChangeDirection.Backward,
				this.currentOperation,
				this.operations[this.currentOperation],
				this.currentOperation + 1,
				this.operations[this.currentOperation + 1],
			),
		);

		if (this.showSteps) {
			this.setCurrentStep(this.operations[this.currentOperation].steps.length - 1);
		} else {
			this.setCurrentStep(0);
		}

		this.emit(
			EventType.CurrentStepChanged,
			new CurrentStepChangedEvent(
				ChangeDirection.Backward,
				this.currentStep,
				this.operations[this.currentOperation].steps[this.currentStep],
				0,
				this.operations[this.currentOperation + 1].steps[0],
			),
		);
	}

	reset() {
		console.log('Resetting operation manager');

		const data = this.prepareStartData(this.structureType);
		this.operations = [data];

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

	getShowSteps(): boolean {
		return this.showSteps;
	}

	getCurrentOperationIndex(): number {
		return this.currentOperation;
	}

	getCurrentOperation(): OperationData {
		return this.operations[this.getCurrentOperationIndex()];
	}

	getCurrentStepIndex(): number {
		return this.currentStep;
	}

	getCurrentStep(): StepData {
		return this.getCurrentOperation().steps[this.getCurrentStepIndex()];
	}
}
