export class DebugStateService {
	actions = [];

	log(action: any): void {
		this.actions.push(action);
	}
}
