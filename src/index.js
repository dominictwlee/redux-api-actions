export const apiActions = ({ dispatch, getState }) => next => action => {
  const { type, meta, payload } = action;

  if (!meta || !meta.apiCall) {
    return next(action);
  }

  if (typeof meta.apiCall !== 'function') {
    throw new Error('Expected meta.apiCall to be a function');
  }

  const actionSuffix = /REQUEST$/;

  if (actionSuffix.exec(type) === null) {
    throw new Error("Expected action type to have 'REQUEST' suffix");
  }

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
      dispatch({ type: successType, payload: res });

      if (meta.onSuccess && typeof meta.onSuccess === 'function') {
        meta.onSuccess(res);
      }
    })
    .catch(err => {
      dispatch({ type: failureType, payload: Object.assign(err, meta.errorPayload), error: true });

      if (meta.onFailure && typeof meta.onFailure === 'function') {
        meta.onFailure(err);
      }
    });
};
