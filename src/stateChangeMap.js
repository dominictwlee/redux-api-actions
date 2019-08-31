import { META } from './constants';

export default function stateChangeMap(state, action, fnMap) {
  if (!action.meta || !action.meta[META.LIFECYCLE]) {
    throw new Error(
      `${action.type}: Meta key is either missing, or not valid for use with redux-api-actions handler`
    );
  }
  const { meta } = action;
  const lifecycle = meta[META.LIFECYCLE];
  const handler = fnMap[lifecycle];
  return handler ? handler(state, action) : state;
}
