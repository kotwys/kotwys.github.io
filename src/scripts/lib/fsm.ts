type States<
  S extends string,
  T extends string
> = Record<S, Partial<Record<T, S>>>;

/**
 * Create a finite state machine.
 * 
 * @param states - object with transitions for each state
 * @returns transition function taking current state and transition as inputs
 * and returning a new state as output
 */
export default function<
  S extends string,
  T extends string
>(states: States<S, T>) {
  return (state: S, transition: T) => {
    return (transition in states[state])
      ? states[state][transition]
      : state;
  };
}