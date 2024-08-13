export type States<State extends string, Action extends string> = Record<State, Record<string, {
  to: State,
  actions?: Action[]
}>>;

type StateMachineSettings<State extends string, Action extends string>  = {
  initState: State;
  actions: Record<Action, Function>;
  states: States<State, Action>;
}

export class StateMachine<State extends string, Action extends string> {
  _current: State;
  actions: StateMachineSettings<State, Action>["actions"] = {} as Record<Action, Function>;
  states: States<State, Action>;

  constructor(settings: StateMachineSettings<State, Action>) {
    this._current = settings.initState
    this.actions = settings.actions
    this.states = settings.states
  }

  emit(eventName: string): void {
    let state = this.states[this._current];

    let transition = state[eventName];

    if (!transition) {
      return;
    }
    let oldState = this._current
    let newState = transition.to
    this._current = newState


    transition.actions?.forEach((fnName) => {
      this.actions[fnName]?.call(this, oldState, newState)
    })
  }

  getState() {
    return this._current
  }
}
