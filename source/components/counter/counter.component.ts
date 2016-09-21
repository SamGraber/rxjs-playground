import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Component({
	moduleId: module.id,
	selector: 'ts-counter',
	templateUrl: 'counter.component.html',
})
export class CounterComponent {
	countdown: Observable<number>;
	finished: Observable<boolean>;

	trigger(): void {
		this.countdown = Observable.zip(
				Observable.from([10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]),
				Observable.interval(1000).startWith(0).take(11)
			)
			.map(x => x[0]);
		this.finished = <Observable<boolean>>Observable.concat(this.countdown.ignoreElements(), Observable.of(true));
	}
}
