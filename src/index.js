import { handleSuffixedAction, handleLifecycledAction } from './middlewareHandlers';
import { actionSuffix } from './actionRe';
import stateChangeMap from './stateChangeMap';

const apiActions = ({ dispatch }) => next => action => {
  const { type, meta } = action;

  if (!meta || !meta.apiCall) {
    return next(action);
  }

  if (typeof meta.apiCall !== 'function') {
    throw new Error('Expected meta.apiCall to be a function');
  }

  if (actionSuffix.test(type)) {
    return handleSuffixedAction(action, dispatch);
  }

  return handleLifecycledAction(action, dispatch);
};

export { stateChangeMap, apiActions };
