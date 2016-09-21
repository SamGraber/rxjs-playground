import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Component({
	moduleId: module.id,
	selector: 'ts-counter',
	templateUrl: 'counter.component.html',
})
export class CounterComponent {
	val: number;
	finished: boolean;

	trigger(): void {
		Observable.interval(1000)
			.map(x => x + 1)
			.startWith(0)
			.take(11)
			.map(x => 10 - x)
			.subscribe(
				x => this.val = x,
				null,
				() => this.finished = true
			);
	}
}
