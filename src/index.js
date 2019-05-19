import { normalize } from 'normalizr';

const lifecycle = {
  REQUEST: 'request',
  SUCCESS: 'success',
  FAILURE: 'failure',
};

export const apiActions = ({ dispatch }) => next => action => {
  const { type, meta, payload } = action;

  if (!meta || !meta.apiCall) {
    return next(action);
  }

  if (typeof meta.apiCall !== 'function') {
    throw new Error('Expected meta.apiCall to be a function');
  }

  dispatch({ type, payload, meta: { lifecycle: lifecycle.REQUEST } });

  return meta
    .apiCall()
    .then(res => {
      if (meta.schema) {
        const normalizedData = normalize(res, meta.schema);
        dispatch({ type, payload: normalizedData, meta: { lifecycle: lifecycle.SUCCESS } });
      } else {
        dispatch({ type, payload: res, meta: { lifecycle: lifecycle.SUCCESS } });
      }

      if (meta.onSuccess && typeof meta.onSuccess === 'function') {
        meta.onSuccess(res);
      }
    })
    .catch(err => {
      dispatch({ type, payload: err, error: true, meta: { lifecycle: lifecycle.FAILURE } });

      if (meta.onFailure && typeof meta.onFailure === 'function') {
        meta.onFailure(err);
      }
    });
};

export function createAsyncActionTypes(reducerKey, type) {
  const requestActionType = `${reducerKey}/${type}_REQUEST`;
  const successActionType = `${reducerKey}/${type}_SUCCESS`;
  const failureActionType = `${reducerKey}/${type}_FAILURE`;

  return [requestActionType, successActionType, failureActionType];
}
