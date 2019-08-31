import { META, LIFECYCLE } from './constants';
import { actionSuffix } from './actionRe';

function handleSideEffectHook(hook, payload) {
  if (hook && typeof hook === 'function') {
    hook(payload);
  }
}

export function handleSuffixedAction({ type, meta, payload }, dispatch) {
  const successType = type.replace(actionSuffix, 'SUCCESS');
  const failureType = type.replace(actionSuffix, 'FAILURE');

  dispatch({
    type,
    ...(payload && { payload }),
  });

  return meta
    .apiCall()
    .then(res => {
      dispatch({ type: successType, payload: res });
      handleSideEffectHook(meta.onSuccess, res);
    })
    .catch(err => {
      dispatch({ type: failureType, payload: Object.assign(err, meta.errorPayload), error: true });
      handleSideEffectHook(meta.onFailure, err);
    });
}

export function handleLifecycledAction({ type, meta, payload }, dispatch) {
  dispatch({
    type,
    ...(payload && { payload }),
    meta: {
      [META.LIFECYCLE]: LIFECYCLE.REQUEST,
    },
  });

  return meta
    .apiCall()
    .then(res => {
      dispatch({
        type,
        payload: res,
        meta: {
          [META.LIFECYCLE]: LIFECYCLE.SUCCESS,
        },
      });
      handleSideEffectHook(meta.onSuccess, res);
    })
    .catch(err => {
      dispatch({
        type,
        payload: Object.assign(err, meta.errorPayload),
        error: true,
        meta: {
          [META.LIFECYCLE]: LIFECYCLE.FAILURE,
        },
      });
      handleSideEffectHook(meta.onFailure, err);
    });
}
