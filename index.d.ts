import { Store, Middleware } from 'redux';

export const apiActions: Middleware<any, {}, any>;

export type Lifecycles = 'request' | 'success' | 'failure';

export type LifecycleFnMap<S, A> = {
  [K in Lifecycles]: (state: S, action: A) => S;
};

export function stateChangeMap<S, A, F>(state: S, action: A, fnMap: LifecycleFnMap<S, A>): S;
