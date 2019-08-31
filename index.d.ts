import { Store, Middleware } from 'redux';

export const apiActions: Middleware<any, {}, any>;

export function stateChangeMap<S, A, F>(state: S, action: A = {}, fnMap: any = {}): S;
