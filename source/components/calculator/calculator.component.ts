import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { DebugStateService } from '../../services/debug-state/debug-state.service';

interface Operator {
	(sum: number, value: number): number;
}

interface AppliedOperator {
	name: string;
	operator: Operator;
	value: number;
	currentValue: number;
}

let appliedOperators = [];

@Component({
	moduleId: module.id,
	selector: 'ts-calculator',
	templateUrl: 'calculator.component.html',
	providers: [DebugStateService],
})
export class CalculatorComponent {
	value: number = 0;
	operators: Subject<AppliedOperator>;
	sum: Observable<number>;

	constructor(public debugState: DebugStateService) {
		this.operators = new Subject<AppliedOperator>();
		this.sum = this.operators.scan(<any>operatorReducer, 0);
	}

	add(): void {
		this.applyOperator('Add', (sum: number, value: number) => sum + value);
	}
	
	subtract(): void {
		this.applyOperator('Subtract', (sum: number, value: number) => sum - value);
	}
	
	multiply(): void {
		this.applyOperator('Multiply', (sum: number, value: number) => sum * value);
	}
	
	divide(): void {
		this.applyOperator('Divide', (sum: number, value: number) => sum / value);
	}
	
	undo(): void {
		// const current = this.operators.last();
		// this.operators.complete();
		// this.operators = new Subject<AppliedOperator>();
		// current.subscribe(operator => this.sum = this.operators.scan(operatorReducer, operator.currentValue));
	}

	private applyOperator(name: string, operator: Operator): void {
		const applied = {
			name: name,
			operator: operator,
			value: +this.value,
			currentValue: null,
		};
		this.operators.next(applied);
		this.debugState.log(applied);
		this.value = 0;
	}
}

function operatorReducer(sum: number, appliedOperator: AppliedOperator): number {
	appliedOperator.currentValue = appliedOperator.operator(sum, appliedOperator.value);
	return appliedOperator.currentValue;
}
