export function createAsyncActionTypes(reducerKey: string, type: string): string[];
export interface middleWareInput {
  dispatch(action: object): any;
  getState(): any;
}
export function apiActions(middleWareInput): any;
