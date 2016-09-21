import { Component, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { dropRight } from 'lodash';

import { DebugStateService } from '../../services/debug-state/debug-state.service';

interface Operator {
	(sum: number, value: number): number;
}

interface AppliedOperator {
	name: string;
	operator: Operator;
	value?: number;
	currentValue?: number;
}

let appliedOperators = [];

@Component({
	moduleId: module.id,
	selector: 'ts-calculator',
	templateUrl: 'calculator.component.html',
	providers: [DebugStateService],
})
export class CalculatorComponent {
	value: number;
	operators: BehaviorSubject<AppliedOperator[]>;
	sum: Observable<number>;
	currentOperator: AppliedOperator;

	@ViewChild('input') input: ElementRef;

	constructor() {
		this.operators = new BehaviorSubject([]);
		this.sum = this.operators.map(operators => operators.reduce(<any>operatorReducer, 0));
	}

	add(): void {
		this.apply();
		this.currentOperator = {
			name: 'Add',
			operator: (sum: number, value: number) => sum + value,
		};
	}
	
	subtract(): void {
		this.apply();
		this.currentOperator = {
			name: 'Subtract',
			operator: (sum: number, value: number) => sum - value,
		};
	}
	
	multiply(): void {
		this.apply();
		this.currentOperator = {
			name: 'Multiply',
			operator: (sum: number, value: number) => sum * value,
		};
	}
	
	divide(): void {
		this.apply();
		this.currentOperator = {
			name: 'Divide',
			operator: (sum: number, value: number) => sum / value,
		};
	}

	apply(): void {
		if (this.currentOperator) {
			if (this.value == null) {
				this.currentOperator = null;
				this.input.nativeElement.focus();
				return;
			}

			this.currentOperator.value = +this.value;
			this.value = null;
			this.operators.next([...this.operators.getValue(), this.currentOperator]);
			this.currentOperator = null;
		} else if (!this.operators.getValue().length) {
			const value = +this.value;
			this.clear();
			this.operators.next([{
				name: 'Add',
				operator: (sum: number, value: number) => sum + value,
				value: value,
				currentValue: value,
			}]);
		}
		this.input.nativeElement.focus();
	}

	clear(): void {
		this.operators.next([]);
		this.value = null;
		this.currentOperator = null;
	}
	
	undo(): void {
		this.operators.next(dropRight(this.operators.getValue()));
	}

	private applyOperator(name: string, operator: Operator): void {
		const applied = {
			name: name,
			operator: operator,
			value: +this.value,
			currentValue: null,
		};
		this.operators.next([...this.operators.getValue(), applied]);
		this.value = 0;
	}
}

function operatorReducer(sum: number, appliedOperator: AppliedOperator): number {
	appliedOperator.currentValue = appliedOperator.operator(sum, appliedOperator.value);
	return appliedOperator.currentValue;
}
