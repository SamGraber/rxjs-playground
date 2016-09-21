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
		Observable.zip(
				Observable.from([10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]),
				Observable.interval(1000).startWith(0).take(11)
			)
			.map(x => x[0])
			.subscribe(
				x => this.val = x,
				null,
				() => this.finished = true
			);
	}
}
