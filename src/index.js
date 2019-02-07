import { normalize } from 'normalizr';

export const apiActions = ({ dispatch, getState }) => next => action => {
  const { type, meta, payload } = action;

  if (!meta || !meta.apiCall) {
    return next(action);
  }

  if (typeof meta.apiCall !== 'function') {
    throw new Error('Expected meta.apiCall to be a function');
  }

  const actionSuffix = /REQUEST$/;
  const successType = type.replace(actionSuffix, 'SUCCESS');
  const failureType = type.replace(actionSuffix, 'FAILURE');

  if (payload) {
    dispatch({ type, payload });
  } else {
    dispatch({ type });
  }

  return meta
    .apiCall()
    .then(res => {
      if (meta.schema) {
        const normalizedData = normalize(res, meta.schema);
        dispatch({ type: successType, payload: normalizedData });
      } else {
        dispatch({ type: successType, payload: res });
      }
    })
    .catch(err => dispatch({ type: failureType, payload: err, error: true }));
};

export function createAsyncActionTypes(reducerKey, type) {
  const requestActionType = `${reducerKey}/${type}_REQUEST`;
  const successActionType = `${reducerKey}/${type}_SUCCESS`;
  const failureActionType = `${reducerKey}/${type}_FAILURE`;

  return [requestActionType, successActionType, failureActionType];
}
